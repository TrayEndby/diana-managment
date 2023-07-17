import AbstractService from './AbstractService';
import moment from 'moment';

const DateFormat = 'YYYY-MM-DD';
const HourFormat24 = 'HH:mm:ss';
const HourFormat12 = 'hh:mm a';
const TimeFormat = `${DateFormat} HH:mm:ss`;

const CalendarType = {
    Owner: 1,
    Project: 2,
    Group: 3,
    Invited: 4,
};

class CalendarService extends AbstractService {
    constructor() {
        super();
        this.enums = {};
        this.listCache = null;
        this.publicListCache = {};
    }

    async fetchEnums() {
        if (Object.keys(this.enums).length === 0) {
            const res = await this.get('/cal/const');
            this.enums = res.const_values;
        }
        return this.enums;
    }

    /**
     * "CalendarFlag": {
     * "Deactivated": 8,
     * "Default": 0,
     * "DefaultBusy": 16,
     * "Primary": 1,
     * "Signup": 32,
     * "Public": 2,
     * "System": 4
     * }
     */
    getCalendarFlag() {
        return this.enums.CalendarFlag;
    }

    /**
     * "EventType": {
     * "FreeBlock": 3,
     * "Meeting": 1,
     * "Notification": 2
     * },
     */
    getEventType() {
        return (
            this.enums.EventType || {
                FreeBlock: 3,
                Meeting: 1,
                Notification: 2,
            }
        );
    }

    /**
     * "EventFlag": {
     * "AllowEdit": 4,
     * "AllowInvite": 8,
     * "Deactivated": 16,
     * "ShowBusy": 1,
     * "ShowFree": 2,
     * "WithGroup": 32
     * },
     */
    getEventFlag() {
        return (
            this.enums.EventFlag || {
                AllowEdit: 4,
                AllowInvite: 8,
                Deactivated: 16,
                ShowBusy: 1,
                ShowFree: 2,
                WithGroup: 32,
            }
        );
    }

    /**
     * "InviteeStatus": {
     * "Accepted": 2,
     * "Declined": 3,
     * "Undecided": 1
     * }
     */
    getInviteeStatus() {
        return this.enums.InviteeStatus;
    }

    /**
     * "CalendarColor": {
     * "Blue": 1,
     * "BoldBlue": 9,
     * "BoldGreen": 10,
     * "BoldRed": 11,
     * "Gray": 8,
     * "Green": 2,
     * "Orange": 6,
     * "Purple": 3,
     * "Red": 4,
     * "Turquoise": 7,
     * "Yellow": 5
     * }
     */
    getCalendarColor() {
        return this.enums.CalendarColor;
    }

    getInviteeStatusList() {
        const Status = this.getInviteeStatus();
        return [
            {
                key: 'accept',
                text: 'Accept',
                status: Status.Accepted,
                variant: 'success',
            },
            {
                key: 'decline',
                text: 'Decline',
                status: Status.Declined,
                variant: 'dark',
            },
            {
                key: 'maybe',
                text: 'Maybe',
                status: Status.Undecided,
                variant: 'light',
            },
        ];
    }

    /**
     * CalendarInfo calendar
     * string creator_id
     * string name
     * uint64 group_id
     * uint64 project_id
     * string description
     * string zipcode
     * uint32 color
     * string timezone - e.g. America/Los_Angeles
     * uint32 flag
     * uint32 status
     * Example:
     * calendar = {
     *  "name": "Course Calendar",
     *  "description": "My Calendar",
     *  "zipcode": "94043",
     *  "color": 2
     * }
     * @param {CalendarInfo} calendar
     * @return calendar with id
     */
    async addCalendar(calendar) {
        const data = {
            calendar: {
                ...calendar,
                minutes_per_signup_slot: 0,
                signup_within_days: 0,
            },
        };
        const payload = await this.post('/cal/add', data);
        this.listCache = null; // clear cache
        return payload.calendar ? payload.calendar[0] : null;
    }

    /**
     * CalendarInfo calendar
     * uint64 id
     * string creator_id
     * string name
     * uint64 group_id
     * uint64 project_id
     * string description
     * string zipcode
     * uint32 color
     * string timezone
     * uint32 flag
     * uint32 status
     * Example:
     * calendar = {
     *  "id": 2,
     *  "name": "Updated Course Calendar",
     *  "description": "Updated My Calendar"
     * }
     * @param {CalendarInfo} calendar
     */
    async updateCalendar(calendar) {
        const data = {
            calendar,
        };
        return this.post('/cal/update', data);
    }

    /**
     * @return a list of calendars
     */
    async listCalendars() {
        if (!this.listCache) {
            const payload = await this.get('/cal/list_all');
            this.listCache = payload.calendar || [];
        }
        return this.listCache;
    }

    async listPublicCalendars(creatorId) {
        if (!this.publicListCache[creatorId]) {
            const data = {
                'calendar': {
                    creatorId
                }
            }
            const payload = await this.post('/p/cal/list_signups', data);
            this.publicListCache[creatorId] = payload.calendar || [];
        }
        return this.publicListCache[creatorId];
    }

    async listSubscribedCalendars() {
        const payload = await this.get('/cal/list');
        return payload.calendar || [];
    }

    /**
     *
     * @param {number} id
     */
    async getCalendarById(id) {
        const data = {
            calendar: {
                id,
            },
        };
        const payload = await this.post('/cal/get', data);
        return payload.calendar ? payload.calendar[0] : null;
    }

    async getPublicCalendars(id) {
        const data = {
            calendar: {
                id,
            },
        };
        const payload = await this.post('/p/cal/get', data);
        return payload.calendar ? payload.calendar[0] : null;
    }

    convertToBigCalendarEvents(calendar_id, events = [], via) {
        return events.map((event) => {
            const { name, start, end, timeZone } = event;
            return {
                ...event,
                calendar_id,
                title: name || 'Untitled',
                start: this.getCalendarTime(start, timeZone),
                end: this.getCalendarTime(end, timeZone),
                via: event.via || via,
            };
        });
    }

    /**
     *
     * @param {number} id
     */
    async getEventById(id) {
        const data = {
            calendar: { event: [{ id }] },
        };
        const payload = await this.post('/cal/get_event', data);
        return payload.calendar ? payload.calendar[0]?.event[0] : null;
    }

    async getCalendarByProjectId(projectId) {
        const calendars = await this.listCalendars();
        const projectCalendar = calendars.filter(
            ({ project_id }) => project_id === projectId,
        )[0];
        return projectCalendar;
    }

    /**
     *
     * @param {number} id
     */
    async deleteCalendar(id) {
        const data = {
            calendar: {
                id,
            },
        };
        this.listCache = null; // clear cache
        return this.post('/cal/delete', data);
    }

    /**
     * CalendarInfo calendar
     * uint64 id
     * repeated CalendarEvent event
     *  uint32 calendar_id
     *  string name
     *  string summary
     *  string rrule - icalendar spec
     *  string media
     *  string resource
     *  string timezone
     *  uint32 notify_minutes_ahead
     *  string start
     *  string end
     *  uint32 type
     *  uint32 flag
     *  uint32 status
     *  repeated CalendarEventInvitee invitee
     *    string invitee_id
     *    uint32 status
     *    uint32 notify_minutes_ahead
     * Example:
     * id: 2,
     * event: [{
     *  "summary": "Test event1",
     *  "start": "2020-09-15 00:00:00",
     *  "end": "2020-09-15 01:00:00"
     * }]
     * @param {number} calendarId
     * @param {CalendarEvent} event
     */
    async addEvent(calendarId, event, invitees) {
        const data = {
            calendar: {
                id: calendarId,
                event: this._normalizeEvent(event, invitees),
            },
        };
        return this.post('/cal/add_event', data);
    }

    /**
     * Add free block
     * @param {number} calendarId
     * @param {CalendarEvent} event
     */
    async addFreeBlock(calendarId, event) {
        return this.addEvent(calendarId, {
            ...event,
            type: this.getEventType().FreeBlock,
            flag: this.getEventFlag().ShowFree,
        });
    }

    async bookFreeBlock(
        calendar_id,
        start,
        end,
        title,
        email,
        first_name,
        last_name,
        summary,
    ) {
        const data = {
            calendar: {
                id: calendar_id,
                event: [
                    {
                        name: title,
                        summary,
                        start: this._localToUtc(start),
                        end: this._localToUtc(end),
                        registrant: [
                            {
                                email,
                                first_name,
                                last_name,
                            },
                        ],
                    },
                ],
            },
        };
        return this.post('/p/cal/add_signup', data);
    }

    /**
     * CalendarInfo calendar
     * uint64 id
     * repeated CalendarEvent event
     *  uint64 id
     * Example:
     * id: 2,
     * event: [{
     *  "id": 1,
     *  "start": "2020-09-15 01:00:00",
     *  "end": "2020-09-15 02:00:00"
     * }]
     * @param {number} calendarId
     * @param {CalendarEvent} event
     */
    async updateEvent(calendarId, event, invitees) {
        const data = {
            calendar: {
                id: calendarId,
                event: this._normalizeEvent(event, invitees),
            },
        };
        return this.post('/cal/update_event', data);
    }

    /**
     *
     * @param {number} calendarId
     * @param {number} eventId
     */
    async deleteEvent(calendarId, eventId) {
        const data = {
            calendar: {
                id: calendarId,
                event: [
                    {
                        id: eventId,
                    },
                ],
            },
        };
        return this.post('/cal/delete_event', data);
    }

    /**
     * CalendarInfo calendar
     *  uint64 id
     *  repeated CalendarEvent event
     *    uint64 id
     *    repeated CalendarEventInvitee invitee
     *    string invitee_id
     * @param {number} calendarId
     * @param {number} eventId
     * @param {string} inviteeId
     */
    async addInvitee(calendarId, eventId, inviteeId) {
        const data = {
            calendar: {
                id: calendarId,
                event: [
                    {
                        id: eventId,
                        invitee: [
                            {
                                invitee_id: inviteeId,
                            },
                        ],
                    },
                ],
            },
        };
        return this.post('/cal/add_invitee', data);
    }

    /**
     * CalendarInfo calendar
     *  uint64 id
     *  repeated CalendarEvent event
     *    uint64 id
     *    repeated CalendarEventInvitee invitee
     *      uint32 status
     *      uint32 notify_minutes_ahead     *
     * @param {number} calendarId
     * @param {number} eventId
     * @param {number} status
     * @param {number} notify_minutes_ahead
     */
    async updateInvitee(calendarId, eventId, status, notify_minutes_ahead) {
        // XXX TODO: check if it needs invitee id or not
        const data = {
            calendar: {
                id: calendarId,
                event: [
                    {
                        id: eventId,
                        invitee: [
                            {
                                status,
                                notify_minutes_ahead,
                            },
                        ],
                    },
                ],
            },
        };
        return this.post('/cal/update_invitee', data);
    }

    /**
     * @param {number} calendarId
     * @param {number} eventId
     * @param {string} inviteeId
     */
    async deleteInvitee(calendarId, eventId, inviteeId) {
        const data = {
            calendar: {
                id: calendarId,
                event: [
                    {
                        id: eventId,
                        invitee: [
                            {
                                invitee_id: inviteeId,
                            },
                        ],
                    },
                ],
            },
        };
        return this.post('/cal/delete_invitee', data);
    }

    getCalendarTime(time, timeZone) {
        try {
            if (timeZone) {
                return moment(time).tz(timeZone).toDate();
            } else {
                return this._utcToLocal(time);
            }
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    getTimeSlots(startTime, endTime, steps) {
        const times = [];
        let time = moment(startTime);
        let count = 0; // prevent infinite

        steps = steps + '';
        do {
            times.push(time);
            time = moment(time); // make a deep copy
            time.add(steps, 'minutes');
            count++;
        } while (time <= endTime && count < 100);

        return times;
    }

    _normalizeEvent(event, invitees) {
        return [
            {
                ...event,
                start: this._localToUtc(event.start),
                end: this._localToUtc(event.end),
                invitee:
                    invitees && invitees.length
                        ? invitees.map((invitee_id) => {
                              return {
                                  invitee_id,
                              };
                          })
                        : null,
            },
        ];
    }

    _localToUtc(time) {
        if (!time) {
            return time;
        } else {
            return moment(time).utc().format(TimeFormat);
        }
    }

    _utcToLocal(time) {
        if (!time) {
            return time;
        } else {
            return moment.utc(time, [TimeFormat]).local().toDate();
        }
    }
}

export default new CalendarService();
export { CalendarType, DateFormat, HourFormat12, HourFormat24 };
