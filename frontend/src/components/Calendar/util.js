import moment from 'moment';
import authService from '../../service/AuthService';
import calendarService, { CalendarType } from '../../service/CalendarService';
import groupService from '../../service/GroupService';
import collaborationService from '../../service/CollaborationService';

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'hh:mm a';

const roundToNextHour = (time) => moment(time).add(60, 'minutes').startOf('hour');
const getDateStr = (moment_time) => (moment_time ? moment_time.format(dateFormat) : '');
const getCalendarTimeStr = (date, moment_time) => `${date} ${moment_time.format('HH:mm:ss')}`;

// get every 15 time lots (simulate google calendar)
export const getTimeSlots = (startTime) => {
  startTime = startTime || moment().hour(0).minute(0).seconds(0); // start from 12:00 am by default
  const endTime = moment(startTime).hour(23).minute(45).seconds(0); // end with 11:45 pm
  const times = calendarService.getTimeSlots(startTime, endTime, 15);
  return times.map(getTimeStr);
};

export const getMomentTimeFromStr = (time_str) => moment(time_str, [timeFormat]);

export const getTimeStr = (moment_time) => (moment_time ? moment_time.format(timeFormat) : '');

export const getCandidateGuests = (availableGuests, selectedGuests, searchKey) => {
  const set = new Set();
  set.add(authService.getUID()); // exclude the creator
  selectedGuests.forEach(({ user_id }) => set.add(user_id));
  const list = availableGuests.filter(({ user_id }) => !set.has(user_id));
  if (!searchKey) {
    return list;
  } else {
    searchKey = searchKey.toLowerCase();
    return list.filter(({ name }) => name.toLowerCase().includes(searchKey));
  }
};

export const getMyInviteeInfo = (invitee) => {
  if (invitee == null) {
    return null;
  }
  const myInvitee = invitee.filter(({ invitee_id }) => invitee_id === authService.getUID());
  return myInvitee[0] || null;
};

/**
 *
 * @param {*} event
 * start: string,
 * end: string,
 * name: string,
 * summary: string,
 * invitee: array,
 */
export const initializeEventData = (event, calendars) => {
  event = event || {};
  const { calendar_id, start, end, invitee, name, summary, flag } = event;
  const startTime = start ? moment(start) : roundToNextHour();
  const endTime = end ? moment(end) : roundToNextHour(startTime);
  const guests = invitee
    ? invitee.map(({ invitee_id, name }) => {
        return {
          user_id: invitee_id,
          name,
        };
      })
    : [];
  return {
    calendar_id: calendar_id || (calendars?.length === 1 ? calendars[0].id : null),
    startDate: getDateStr(startTime),
    endDate: getDateStr(endTime),
    startTime,
    endTime,
    summary,
    name,
    guests,
    flag: flag || calendarService.getEventFlag().ShowBusy,
  };
};

export const normalizeEventData = (data, eventId) => {
  const { name, summary, startDate, endDate, startTime, endTime, flag } = data;
  const start = getCalendarTimeStr(startDate, startTime);
  const end = getCalendarTimeStr(endDate, endTime);
  if (moment(start) < moment()) {
    throw new Error('Start time has already passed, please select a different time');
  } else if (end <= start) {
    throw new Error('End time must be bigger than star time');
  } else {
    return {
      id: eventId,
      name,
      summary,
      start,
      end,
      flag,
    };
  }
};

export const isMy = (creator_id, via) => {
  if (via === CalendarType.Owner && creator_id === authService.getUID()) {
    return true;
  } else {
    return via === CalendarType.Project || via === CalendarType.Group;
  }
};

export const getAvailableGuestsFromCalendar = async (calendar) => {
  try {
    if (!calendar) {
      return null;
    }
    const { group_id, project_id } = calendar;
    if (group_id != null) {
      const members = await groupService.listMembers(group_id);
      return members.map(({ user_id, user_name }) => {
        return {
          user_id,
          name: user_name
        }
      });
    } else if (project_id != null) {
      // if user have project access, it should have access to project
      const project = await collaborationService.getMyProjectDetails(project_id);
      const owner = { user_id: project.owner_id, name: project.owner_name };
      const members = project.member || [];
      return [owner, ...members];
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
    return [];
  }
}
