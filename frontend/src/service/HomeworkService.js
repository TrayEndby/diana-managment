import AbstractService from './AbstractService';
import resourceService, { Resource_Type } from './ResourceService';
import calendarService from './CalendarService';
import writingService from './WritingService';

const Flag = {
    Public: 2,
    Published: 6,
};

const Type = 1; // for homework

class HomeworkService extends AbstractService {
    constructor() {
        super();
        this.sprintsCache = null;
    }

    getSprints() {
        const idToProgramMap = new Map();
        const map = new Map();
        const keys = [];
        this.sprintsCache.forEach(({ name, object_id, instructor }) => {
            const [sprintName, programName] = name.split(' - ');
            const program = {
                id: object_id,
                name: programName,
                instructor,
                homeworks: []
            };
            idToProgramMap.set(object_id, program);
            if (map.has(sprintName)) {
                map.get(sprintName).push(program);
            } else {
                keys.push(sprintName);
                map.set(sprintName, [program]);
            }
        });

        keys.sort();
        const sprints = keys.map((key) => {
            return {
                name: key,
                children: map.get(key),
            };
        });
        return [sprints, idToProgramMap];
    }

    async listHomeworks() {
        const promise1 = writingService.listPublic();
        const promise2 = writingService.list();

        const [publicArticles, articles] = await Promise.all([promise1, promise2]);
        const allArticles = articles.filter((article) => article.event_id != null);
        return {
            publicArticles,
            allArticles
        }
    }

    async listShared(homeworks) {
        homeworks = homeworks.filter(({ share_type }) => share_type == null);
        const map = new Map();
        const promises = homeworks.map(({ id }) => {
            return writingService.listSharedUsers(id)
            .then((res) => {
                const users = new Set();
                res.forEach(({ user_id }) => users.add(user_id));
                map.set(id, users);
            });
        });
        await Promise.all(promises);
        return map;
    }

    async fetchSprintList() {
        const [list] = await resourceService.list(Resource_Type.Sprint);
        const programs = list.filter(({ tags }) => tags === 'sprint program');
        const res = [];
        const promises = programs.map(({ id, title, object_id }, index) => {
            return calendarService.getEventById(programs[0].object_id).then((event) => {
                res[index] = {
                    id,
                    name: title,
                    object_id,
                    instructor: event?.instructor || [],
                };
            });
        });
        await Promise.all(promises);
        this.sprintsCache = res;
        return this.sprintsCache;
    }

    async create(title, programId) {
        return writingService.create(title, {
            flag: Flag.Public,
            type: Type,
            event_id: programId
        });
    }

    async publish(id) {
        const data = {
            article: {
                id,
                flag: Flag.Published
            },
        };
        return this.post('/compose/insert_or_update', data);
    }

    async unpublish(id) {
        const data = {
            article: {
                id,
                flag: Flag.Public
            },
        };
        return this.post('/compose/insert_or_update', data);
    }

    async copy(id) {
        return writingService.copy(id);
    }
}

export default new HomeworkService();

export { Flag };