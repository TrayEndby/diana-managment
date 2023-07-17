import AbstractService from './AbstractService';
import calendarService from './CalendarService';
import authService from './AuthService';

import { CALENDARS } from '../constants/calendars';

const TASK_STATUS = {
    TODO: undefined, // if status is undefined, then it's todo
    IN_PROGRESS: 1,
    COMPLETE: 2,
};

class TaskService extends AbstractService {
    constructor() {
        super();
        this.taskCalendarId = null;
    }
    /**
     * List an array of task
     * Attribute of each task:
     * {
     *  created_ts: string
     *  due_time: string
     *  id: number
     *  notes: string (max 1024 characters)
     *  title: string
     *  uid: string
     *  updated_ts: string
     *  resource: max 1024 chars, can be a url for a course
     *  status: int (0-255 to use as a status)
     * +isToDo: boolean if the status is todo
     * +isInProgress: boolean if the status is in progress
     * +isComplete: boolean if the status is complete
     * +isOverDue: boolean if the task is overdue
     * +isDueThisWeek: boolean (added by frontend to cache the due status)
     * }
     */
    async list() {
        let payload = await this.get('/todo/list_tasks');
        let tasks = payload.tasks || [];
        tasks = tasks.map(this._normalizeTask);
        return tasks;
    }

    /**
     * Add a task by passing in a object of task info,
     * which should be
     * {
     *  title: string,
     *  notes: string,
     *  due_time: string
     *  resource: string
     * }
     */
    async add({ title, notes, due_time, resource }) {
        let data = {
            task: {
                title,
                notes,
                due_time,
                resource,
                status: TASK_STATUS.TODO,
            },
        };
        const payload = await this.post('/todo/add_task', data);
        const task = payload.tasks ? payload.tasks[0] : null;
        await this._addTaskToCalendar(task);
        return task;
    }

    /**
     * update task attribute
     */
    async update({ id, title, notes, due_time, status }) {
        let data = {
            task: {
                id,
                title,
                notes,
                due_time,
                status,
            },
        };
        return this.post('/todo/update_task', data);
    }

    /**
     * update task status
     */
    async updateStatus(task, status) {
        let updatedTask = {
            ...task,
            status,
        };
        await this.update(updatedTask);
        return this._normalizeTask(updatedTask);
    }

    async completeTask(task) {
        return this.updateStatus(task, TASK_STATUS.COMPLETE);
    }

    async startTask(task) {
        return this.updateStatus(task, TASK_STATUS.IN_PROGRESS);
    }

    /**
     * Delete task by passing in the id of a task
     */
    async delete(id) {
        let data = {
            task: {
                id,
            },
        };
        await this.post('/todo/delete_task', data);
        await this._deleteTaskInCalendar(id);
    }

    _normalizeTask = (task) => {
        let dueDate = new Date(task.due_time);
        let status = task.status;
        return {
            ...task,
            isOverDue: this._isOverDue(dueDate),
            isDueThisWeek: this._isDateInThisWeek(dueDate),
            isToDo: status === TASK_STATUS.TODO,
            isInProgress: status === TASK_STATUS.IN_PROGRESS,
            isComplete: status === TASK_STATUS.COMPLETE,
        };
    };

    _isOverDue = (date) => {
        return date < new Date();
    };

    _isDateInThisWeek = (date) => {
        let now = new Date();
        let weekDay = (now.getDay() + 6) % 7; // Make sure Sunday is 6, not 0
        let monthDay = now.getDate();
        let mondayThisWeek = monthDay - weekDay;
        let startOfThisWeek = new Date(+now);
        startOfThisWeek.setDate(mondayThisWeek);
        startOfThisWeek.setHours(0, 0, 0, 0);
        let startOfNextWeek = new Date(+startOfThisWeek);
        startOfNextWeek.setDate(mondayThisWeek + 7);
        return date >= startOfThisWeek && date < startOfNextWeek;
    };

    async _getTaskCalendarId() {
        if (this.taskCalendarId != null) {
            return this.taskCalendarId;
        }
        const calendars = await calendarService.listCalendars();
        const authId = authService.getUID();
        for (let { id, name, creator_id } of calendars) {
            if (name === CALENDARS.Tasks && creator_id === authId) {
                this.taskCalendarId = id;
                break;
            }
        }

        if (this.taskCalendarId == null) {
            // when no task calendar, add one
            const calendar = await calendarService.addCalendar({
                name: CALENDARS.Tasks,
                description: 'Tasks Calendar',
            });
            this.taskCalendarId = calendar.id;
        }
        return this.taskCalendarId;
    }

    async _getEventByTaskId(taskId) {
        if (!taskId) {
            return null;
        }
        const calendarId = await this._getTaskCalendarId();
        const calendar = await calendarService.getCalendarById(calendarId);
        const events = calendar.event || [];
        for (let event of events) {
            const id = event.resource ? Number(event.resource) : null;
            if (id === taskId) {
                return event;
            }
        }
        return null;
    }

    async _addTaskToCalendar(task) {
        try {
            const { id, due_time, title } = task;
            const calendarId = await this._getTaskCalendarId();
            const name = `Due for task: ${title}`;
            await calendarService.addEvent(calendarId, {
                name,
                start: due_time,
                end: due_time,
                resource: id + '', // note task id in resource
                type: calendarService.getEventType().Notification,
            });
        } catch (e) {
            console.error(e);
        }
    }

    async _deleteTaskInCalendar(taskId) {
        try {
            const event = await this._getEventByTaskId(taskId);
            if (event) {
                const { calendar_id, id } = event;
                await calendarService.deleteEvent(calendar_id, id);
            }
        } catch (e) {
            console.error(e);
        }
    }
}

export default new TaskService();
