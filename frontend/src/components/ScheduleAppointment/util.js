import moment from 'moment';
import { RRule } from 'rrule';
import calendarService, {
  DateFormat,
  HourFormat12,
  HourFormat24,
} from 'service/CalendarService';
import authService from 'service/AuthService';

export const fetchSignUpCalendar = async (ownerId) => {
  ownerId = ownerId || authService.getUID();
  const calendars = await calendarService.listPublicCalendars(ownerId);
  const signupCalendar = calendars.find(
    (calendar) => calendar.name === '[Signup]',
  );
  if (!signupCalendar) {
    throw new Error(
      'The owner has not created a public calendar for scheduling yet',
    );
  }
  return signupCalendar.id;
};

export const fetchSlots = async (ownerId) => {
  const calendar_id = await fetchSignUpCalendar(ownerId);
  const res = await calendarService.getPublicCalendars(calendar_id);
  const EventFlag = calendarService.getEventFlag();
  const EventType = calendarService.getEventType();
  const freeEvents = [];
  const busyEvents = [];
  (res.event || []).forEach((event) => {
    const { flag, type } = event;
    if (flag === EventFlag.ShowFree && type === EventType.FreeBlock) {
      if (event.rrule) {
        // recurring events
        const events = _getRecurringEvents(event);
        freeEvents.push(...events);
      } else {
        freeEvents.push(event);
      }
    } else {
      busyEvents.push(event);
    }
  });
  const freeSlots = calendarService.convertToBigCalendarEvents(
    calendar_id,
    freeEvents,
  );
  const busySlots = calendarService.convertToBigCalendarEvents(
    calendar_id,
    busyEvents,
  );
  return {
    calendar_id,
    freeSlots: _getDateToSlotsMap(freeSlots),
    busySlots: _getDateToSlotsMap(busySlots),
  };
};

const _getRecurringEvents = (event) => {
  try {
    const startTime = moment(event.start).format(HourFormat24);
    const endTime = moment(event.end).format(HourFormat24);
    const startDate = moment(event.start).format(DateFormat);
    const endDate = moment(event.end).format(DateFormat);
    // expand it with 52 weeks of data
    const rule = RRule.fromString(`${event.rrule}`);
    const currentDate = new Date();
    const nextYearDate = new Date();
    nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
    return rule.between(currentDate, nextYearDate).map((date) => {
      let end_date = moment(date);
      if (endDate > startDate) {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        end_date = moment(nextDate);
      }
      return {
        ...event,
        start: `${moment(date).format(DateFormat)} ${startTime}`,
        end: `${end_date.format(DateFormat)} ${endTime}`,
      };
    });
  } catch (e) {
    console.error('error', e);
    return [];
  }
};

const _getDateToSlotsMap = (slots) => {
  const map = new Map();
  slots.forEach((slot) => {
    const { start, end } = slot;
    const date = moment(start).format(DateFormat);
    const list = map.get(date) || [];
    list.push([moment(start), moment(end)]); // a start-end range
    map.set(date, list);
  });
  return map;
};

export const getDate = (date) => moment(date).format(DateFormat);

export const getTimeSlots = (freeTimes, busyTimes, duration) => {
  if (!freeTimes) {
    return null;
  }
  let times = freeTimes.reduce((list, timeRange) => {
    const [start, end] = timeRange;
    const endTime = moment(end).subtract(duration, 'minutes');
    return list.concat(calendarService.getTimeSlots(start, endTime, 15));
  }, []);

  times = times.filter((time) => _hasNotBooked(time, busyTimes));
  return times.map((time) => time.format(HourFormat12));
};

const _hasNotBooked = (time, busyTimes) => {
  if (!busyTimes) {
    return true;
  }
  for (let [start, end] of busyTimes) {
    if (time >= start && time <= end) {
      return false;
    }
  }
  return true;
};

export const getStartAndEndTimeBySlot = (date, time, duration) => {
  const start = `${date} ${time}`;
  const format = `${DateFormat} ${HourFormat12}`;
  const end = moment(start, format).add(duration, 'minutes').format(format);

  return {
    start,
    end,
  };
};

export const getDateAndTimeStr = ({ start, end }) => {
  const start_moment = moment(start);
  const end_moment = moment(end);
  return `${start_moment.format(HourFormat12)} - ${end_moment.format(
    HourFormat12,
  )} | ${start_moment.format('ddd, MMMM DD, YYYY')}`;
};

export const fetchRecurringFreeBlocks = async (calendar_id) => {
  const res = await calendarService.getCalendarById(calendar_id);
  const EventFlag = calendarService.getEventFlag();
  const EventType = calendarService.getEventType();
  const CalendarFlag = calendarService.getCalendarFlag();
  const flag = CalendarFlag.Signup + CalendarFlag.Public;
  if (res.flag !== flag) {
    // make the signup calendar has public + signup flag if not
    await calendarService.updateCalendar({
      ...res,
      flag,
      via: undefined,
    });
  }
  let freeEvents = res.event
    ? res.event.filter(({ flag, type, rrule }) => {
        return (
          rrule && flag === EventFlag.ShowFree && type === EventType.FreeBlock
        );
      })
    : [];
  freeEvents = calendarService.convertToBigCalendarEvents(
    calendar_id,
    freeEvents,
  );

  const recurringEvents = [[], [], [], [], [], [], []];
  freeEvents.forEach(({ id, start, end }) => {
    const moment_start = moment(start);
    recurringEvents[moment_start.day()].push({
      id,
      start: moment_start,
      end: moment(end),
    });
  });

  recurringEvents.forEach((dayEvents) => {
    dayEvents.sort((a, b) => {
      return a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
    });
  });
  return recurringEvents;
};

export const bookRecurringFreeBlock = async (calendarId, start, end, day) => {
  const rule = new RRule({
    freq: RRule.WEEKLY,
    dtstart: moment().day(day).toDate(),
    interval: 1,
  });
  await calendarService.addFreeBlock(calendarId, {
    name: 'Free Slots',
    summary: 'Free Slots',
    start: moment(start).day(day),
    end: moment(end).day(day),
    rrule: rule.toString(),
  });
};
