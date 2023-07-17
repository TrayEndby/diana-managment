import AbstractService from './AbstractService';

class MissionService extends AbstractService {
    constructor() {
        super();
        this._missionCache = {};
        this._gradeCache = {};
        this._constsCache = null;
    }

    async getConstants() {
        if (this._constsCache) {
            return this._constsCache;
        }
        const response = await this.post('/mission/const');
        this._constsCache = response.const_values;
        return this._constsCache;
    }

    async getMission({ grade, week, month }) {
        const cacheKey = `${grade}-${week}-${month}`;
        const cachedMission = this._missionCache[cacheKey];
        if (cachedMission) {
            return cachedMission;
        }

        const response = await this.post('/mission/get', {
            frame: { grade, week, month },
        });
        const mission = response.frame || [];
        this._missionCache[cacheKey] = mission;
        return mission;
    }

    async getAllMissions(grade) {
        if (!this._gradeCache[grade]) {
            const response = await this.post('/mission/get', {
                frame: { grade },
            });
            this._gradeCache[grade] = response.frame || [];
        }

        const missions = this._gradeCache[grade];
        const map = {};
        const stats = Array(3).fill(null).map(_ => {
            return { total: 0, finish: 0 };
        });
        const monthsStats = Array(13).fill(null).map(_ => {
            // return a deep copy of stat
            return stats.map(stat => {
                return {...stat};
            });
        });
        let number = 1;
        missions.sort((a, b) => {
            if (a.month < b.month) return -1;
            if (a.month > b.month) return 1;
            if (a.week < b.week) return -1;
            if (a.week > b.week) return 1;
            return 0;
        });
        missions.forEach((mission) => {
            // stats aggregation
            const index = mission.goal - 1;
            if (stats[index]) {
                const month = mission.month;
                const key = `${month}-${mission.week}`;
                map[key] = map[key] || [];
                map[key].push({
                    ...mission,
                    title: `Mission ${number}`
                });
                number++;

                const whatToDos = mission.item.filter(
                    (mission) => mission.name !== 'HOW_TO_DO_IT',
                );
                const total = whatToDos.length;
                const finish = whatToDos.reduce(
                    (sum, whatToDo) => (whatToDo.status === 1 ? sum + 1 : sum),
                    0,
                );;
                stats[index].total += total;
                stats[index].finish += finish;
                monthsStats[month][index].total += total;
                monthsStats[month][index].finish += finish;
            }
        });
        return [map, stats, monthsStats];
    }

    /**
     *
     * @param {number} frameId
     * @param {number} taskId
     * @param {boolean} newValue
     */
    async updateStatus(frameId, taskId, newValue) {
        const status = newValue ? 1 : 0;
        const response = await this.post('/mission/update_user_status', {
            frame: {
                id: frameId,
                item: [
                    {
                        id: taskId,
                        status,
                        status_description: 'working hard',
                    },
                ],
            },
        });
        // update cache
        for (const grade in this._gradeCache) {
            const missions = this._gradeCache[grade];
            for (const mission of missions) {
                if (mission.id === frameId) {
                    mission.item = mission.item.map(task => {
                        if (task.id === taskId) {
                            return {
                                ...task,
                                status,
                            }
                        } else {
                            return task;
                        }
                    })
                    break;
                }
            }
        }
        return response;
    }

    /**
     *
     * @param {number} frameId
     * @param {number} taskId
     */
    async removeTask(frameId, taskId) {
        await this.post('/mission/delete_item', {
            frame: {
                id: frameId,
                item: [{ id: taskId }],
            },
        });
    }

    /**
     *
     * @param {number} frameId
     * @param {number} taskId
     */
    async createTask(frameId, newTask) {
        const { frame } = await this.post('/mission/add_item', {
            frame: {
                id: frameId,
                item: [newTask],
            },
        });
        return frame[0].item;
    }

    async saveMission(
        index,
        {
            grade,
            week,
            month,
            workload,
            puzzle,
            duration,
            description,
            whatToDo,
            howToDoIt,
        },
    ) {
        const cacheKey = `${grade}-${week}-${month}`;
        delete this._missionCache[cacheKey];
        delete this._gradeCache[grade];

        const missions = await this.getMission({ grade, week, month });
        const existMission = missions[index];

        const config = {
            grade,
            week,
            month,
            workload,
            puzzle,
            duration,
            description,
            id: existMission ? existMission.id : -1,
            item: [
                ...whatToDo,
                {
                    id: existMission
                        ? existMission.item.find(
                              (item) => item.name === 'HOW_TO_DO_IT',
                          ).id
                        : -1,
                    name: 'HOW_TO_DO_IT',
                    action: howToDoIt,
                },
            ],
        };

        if (index == null && missions.length === 0) {
            delete config.id;
            delete config.item[config.item.length - 1].id;
            const response = await this.post('/mission/add', { frame: config });
            return response.frame;
        }

        if (!existMission) {
            throw new Error('Invalid mission to update');
        }

        ['workload', 'puzzle', 'duration', 'description'].forEach((key) => {
            if (existMission[key] === config[key]) {
                delete config[key];
            }
        });

        delete config.grade;
        delete config.week;
        delete config.month;
        const response = await this.post('/mission/update', { frame: config });
        return response.frame;
    }

    async getProgress(grade) {
        const { progress } = await this.post('/mission/get_mission_progress', {
            mode: 'grade',
            progress: { grade: grade },
        });

        return (progress || [])
            .filter((mission) => mission.week >= 1 && mission.week <= 4) // remove deprecated 5th week
            .map((mission) => ({
                ...mission,
                total: mission.total - 1,
                done: mission.done || 0,
            })); // ignore task which contains description of the
    }

    async getProgressGroupedByPuzzle(grade) {
        const progress = await this.getProgress(grade);

        return progress.reduce((acc, b) => {
            const puzzle = b.puzzle;
            if (!(puzzle in acc)) {
                acc[puzzle] = { total: 0, done: 0 };
            }

            acc[puzzle].total += b.total || 0;
            acc[puzzle].done += b.done || 0;
            return acc;
        }, {});
    }

    async getProgressGroupedByWeekInRange(grade, startWeek, endWeek) {
        let isNewYear = false;
        if (endWeek.month < startWeek.month) {
            isNewYear = true;
        }
        const progress = await this.getProgress(grade);
        const filteredProgress = progress.filter(({ week, month }) => {
            if (!isNewYear) {
                if (month < startWeek.month || month > endWeek.month) {
                    return false;
                }

                if (month > startWeek.month && month < endWeek.month) {
                    return true;
                }

                if (month >= startWeek.month && week >= startWeek.week) {
                    return true;
                }

                if (month <= endWeek.month && week <= startWeek.week) {
                    return true;
                }
            } else {
                if (month < startWeek.month && month > endWeek.month) {
                    return false;
                }

                if (month > startWeek.month || month < endWeek.month) {
                    return true;
                }

                if (month >= startWeek.month && week >= startWeek.week) {
                    return true;
                }

                if (month <= endWeek.month && week <= endWeek.week) {
                    return true;
                }
            }
            return false;
        });

        // one week can have 2 frame at most, so need an aggregation
        const aggProgress = [];
        const map = {};
        filteredProgress.forEach(progress => {
            const key = `${progress.month}-${progress.week}`;
            if (!map[key]) {
                const newRes = {
                    ...progress,
                    done: 0,
                    total: 0
                };
                aggProgress.push(newRes);
                map[key] = newRes;
            }
            map[key].done += progress.done;
            map[key].total += progress.total;
        });

        const indexOfStart = aggProgress.findIndex(
            ({ week, month }) =>
                startWeek.month === month && startWeek.week === week,
        );

        return [
            ...aggProgress.slice(indexOfStart),
            ...aggProgress.slice(0, indexOfStart),
        ];
    }
}

export default new MissionService();
