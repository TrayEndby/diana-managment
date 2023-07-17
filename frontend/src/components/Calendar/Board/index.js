import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';

import CalendarNavBar from '../NavBar';
import CalendarDetail from '../Detail';
import AddEventModal from '../Add';

import { parseSearchParams } from 'util/helpers';
import ErrorDialog from 'util/ErrorDialog';
import calendarService from 'service/CalendarService';
import * as ROUTES from 'constants/routes';

import styles from './style.module.scss';

const localizer = momentLocalizer(moment);

const propTypes = {
  title: PropTypes.string,
  style: PropTypes.object,
  containerStyle: PropTypes.object,
  editable: PropTypes.bool,
  selectable: PropTypes.bool,
  owner: PropTypes.string,
  customNav: PropTypes.node,
  noGuestsSelection: PropTypes.bool,
  onFetchCalendars: PropTypes.func, // called when calendars is fetched, can return a filtered calendar
  onAddEvent: PropTypes.func, // called when add event, can return a event format
};
/**
 * type of Event:
 * Event {
    title: string,
    start: Date,
    end: Date,
    allDay?: boolean
    resource?: any,
  }
 */
class CalendarBoard extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      error: null,
      loading: true,
      calendars: null,
      events: null,
      selectedEvent: null,
      eventToEdit: null,
      eventToAdd: null,
    };
  }

  componentDidMount() {
    this.initialize();
  }

  handleError(error) {
    console.error(error);
    this.setState({
      error: error.message,
      loading: false,
    });
  }

  initialize = async () => {
    try {
      this.setState({
        loading: true,
      });
      await this.fetchEvents();
      this.checkParamsInURL();
    } catch (e) {
      this.handleError(e);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  checkParamsInURL = () => {
    try {
      const { location } = this.props.history;
      const { pathname, search } = location;
      if (pathname !== ROUTES.CALENDAR || !search) {
        return;
      }
      const params = parseSearchParams(search);

      if (params.type === 'add') {
        this.addEventFromURL(params);
      } else {
        this.selectEventFromURL(params);
      }
    } catch (e) {
      console.error(e);
    }
  };

  addEventFromURL = (params) => {
    const { id, name, start, end } = params;
    this.setState({
      eventToAdd: {
        calendar_id: id,
        name,
        start: this.parseTimeFromURL(start),
        end: this.parseTimeFromURL(end),
      },
    });
  };

  selectEventFromURL = (params) => {
    const { id, event } = params;
    const selectedEvent = this.state.events.find((e) => e.calendar_id === id && e.id === event);
    if (selectedEvent != null) {
      this.setState({
        selectedEvent,
      });
    }
  };

  parseTimeFromURL = (time) => {
    if (time.includes('+')) {
      // format 1, split use +
      return moment.utc(time, 'YYYY-MM-DD+hh:mm:ss').local();
    } else {
      // format 2, YYYY-MM-DD hh:mm:ss
      return moment.utc(time).local();
    }
  };

  fetchCalendars = async () => {
    const list = await calendarService.listCalendars();
    list.sort((cA, cB) => cA.name.localeCompare(cB.name));
    let calendars = list.map((calendar) => {
      return {
        ...calendar,
        checked: true,
      };
    });
    if (typeof this.props.onFetchCalendars === 'function') {
      calendars = this.props.onFetchCalendars(calendars);
    }
    this.setState({
      calendars,
    });

    return calendars;
  };

  fetchEvents = async () => {
    try {
      const calendars = await this.fetchCalendars();
      const events = [];
      const promises = calendars.map(async ({ id, via }) => {
        try {
          const calendar = await calendarService.getCalendarById(id);
          const calendarEvents = calendarService.convertToBigCalendarEvents(id, calendar.event, via);
          events.push(...calendarEvents);
        } catch (e) {
          console.error(e);
        }
      });
      await Promise.all(promises);
      this.setState({
        events,
      });
    } catch (e) {
      this.handleError(e);
    }
  };

  // add event
  handleAddEvent = ({ start, end }) => {
    let eventToAdd = {
      start,
      end,
    };
    if (typeof this.props.onAddEvent === 'function') {
      eventToAdd = this.props.onAddEvent(eventToAdd);
    }
    this.setState({ eventToAdd });
  };

  // show event detail
  handleSelectEvent = (selectedEvent) => {
    this.setState({ selectedEvent });
  };

  // update event
  handleEditEvent = () => {
    const { selectedEvent } = this.state;
    this.setState({
      selectedEvent: null,
      eventToEdit: selectedEvent,
    });
  };

  handleDeleteEvent = () => {
    this.handleSelectEvent(null);
    this.fetchEvents(); // refresh
  };

  handleToggleCalendar = (index) => {
    const calendars = this.state.calendars.map((calendar, i) => {
      if (index === i) {
        return {
          ...calendar,
          checked: !calendar.checked,
        };
      } else {
        return {
          ...calendar,
        };
      }
    });
    this.setState({
      calendars,
    });
  };

  getSelectedCalendarEvents = () => {
    const { calendars, events } = this.state;
    const { owner } = this.props;
    if (!events) {
      return [];
    } else {
      const selectedCalendars = new Set();
      calendars.forEach(({ creator_id, id, checked }) => {
        if (checked && (!owner || creator_id === owner)) {
          selectedCalendars.add(id);
        }
      });
      return events.filter(({ calendar_id }) => selectedCalendars.has(calendar_id));
    }
  };

  render() {
    const { error, loading, calendars, selectedEvent, eventToEdit, eventToAdd } = this.state;
    const {
      title,
      style,
      containerStyle,
      editable,
      selectable,
      customNav,
      noGuestsSelection,
      noFlagSelection,
    } = this.props;
    const EventFlag = calendarService.getEventFlag();
    return (
      <div className={styles.container} style={{ ...containerStyle }}>
        {error && <ErrorDialog error={error}></ErrorDialog>}
        {loading && <div className="text-center py-2">Loading...</div>}
        {!error && !loading && (
          <div className={styles.board}>
            <div className={styles.navBar}>
              <CalendarNavBar
                title={title}
                calendars={calendars}
                editable={editable}
                onAdd={this.handleAddEvent}
                onToggle={this.handleToggleCalendar}
              >
                {customNav}
              </CalendarNavBar>
            </div>
            <div className={styles.calendar}>
              <Calendar
                selectable={selectable}
                defaultView="week"
                localizer={localizer}
                events={this.getSelectedCalendarEvents()}
                startAccessor="start"
                endAccessor="end"
                style={{ ...style }}
                eventPropGetter={(event) => {
                  if (event && event.flag === EventFlag.ShowFree) {
                    const style = {
                      backgroundColor: '#53a548',
                    };

                    return {
                      className: 'free',
                      style,
                    };
                  }
                }}
                onSelectEvent={this.handleSelectEvent}
                onSelectSlot={this.handleAddEvent}
              />
            </div>
          </div>
        )}
        {selectedEvent != null && (
          <CalendarDetail
            show={true}
            event={selectedEvent}
            onRefresh={() => this.fetchEvents()}
            onClose={() => this.setState({ selectedEvent: null })}
            onEdit={this.handleEditEvent}
          />
        )}
        {eventToEdit != null && (
          <AddEventModal
            show={true}
            event={eventToEdit}
            calendars={calendars}
            edit
            onClose={(update) => {
              this.setState({ eventToEdit: null });
              if (update) {
                this.fetchEvents();
              }
            }}
          />
        )}
        {eventToAdd != null && (
          <AddEventModal
            show={true}
            calendars={calendars}
            event={eventToAdd}
            noGuestsSelection={noGuestsSelection}
            noFlagSelection={noFlagSelection}
            onClose={(update) => {
              this.setState({ eventToAdd: null });
              if (update) {
                this.fetchEvents();
              }
            }}
          />
        )}
      </div>
    );
  }
}

CalendarBoard.propTypes = propTypes;

export default withRouter(CalendarBoard);
