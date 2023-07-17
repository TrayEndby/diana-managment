import React, { useEffect, useState, useCallback } from 'react';
import cn from 'classnames';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Plus, Trash } from 'react-bootstrap-icons';

import TimeSelection from './TimeSelection';

import {
  fetchSignUpCalendar,
  fetchRecurringFreeBlocks,
  bookRecurringFreeBlock,
} from '../util';
import Body from 'util/Body';
import SaveButton from 'util/SaveButton';
import useErrorHandler from 'util/hooks/useErrorHandler';
import calendarService from 'service/CalendarService';

import styles from './style.module.scss';

const propTypes = {};

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const initializeErrors = () => [[], [], [], [], [], [], []];

const AvailabilityBoard = () => {
  const [calendarId, setCalendarId] = useState();
  const [recurringEvents, setRecurringEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useErrorHandler();
  const [hasChange, setHasChange] = useState(false);
  const [saving, setSaving] = useState(false);
  const [eventErrors, setEventErrors] = useState(initializeErrors());

  const fetchRecurringEvents = useCallback(
    async (calendarId) => {
      try {
        setLoading(true);
        const existingEvents = await fetchRecurringFreeBlocks(calendarId);
        setRecurringEvents(existingEvents);
        setHasChange(false);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    },
    [setError],
  );

  useEffect(() => {
    setLoading(true);
    fetchSignUpCalendar()
      .then((id) => {
        setCalendarId(id);
        return fetchRecurringEvents(id);
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, [fetchRecurringEvents, setError]);

  const updateRecurringEvents = (dayIndex, newEvents) => {
    const clonedEvents = recurringEvents.map((events, i) => {
      return dayIndex === i ? newEvents : events;
    });
    setRecurringEvents(clonedEvents);
  };

  const handleAddEvent = (dayIndex) => {
    const updatedEvents = [
      ...recurringEvents[dayIndex],
      { start: null, end: null },
    ];
    updateRecurringEvents(dayIndex, updatedEvents);
  };

  const handleChange = (dayIndex, eventIndex, key, value) => {
    const updatedEvents = recurringEvents[dayIndex].map((event, i) => {
      return eventIndex === i
        ? {
            ...event,
            [key]: value,
          }
        : event;
    });
    updateRecurringEvents(dayIndex, updatedEvents);
    setHasChange(true);
  };

  const handleDelete = async (dayIndex, eventIndex) => {
    try {
      const event = recurringEvents[dayIndex][eventIndex];
      if (event.id) {
        setSaving(true);
        await calendarService.deleteEvent(calendarId, event.id);
      }
      const updatedEvents = recurringEvents[dayIndex].filter(
        (_e, i) => i !== eventIndex,
      );
      updateRecurringEvents(dayIndex, updatedEvents);
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  const validateDayEvent = ({ start, end }, prevRanges) => {
    if (!start || !end) {
      return 'Please select a start and end time';
    }

    const hasOverlap = prevRanges.some(
      ([prevStart, prevEnd]) => !(end <= prevStart || start >= prevEnd),
    );
    if (hasOverlap) {
      return 'The time has overlap with previous time';
    }

    return null;
  };

  const validateEvents = () => {
    const errors = initializeErrors();
    for (let i = 0; i < recurringEvents.length; i++) {
      const dayEvents = recurringEvents[i];
      const ranges = [];
      for (let j = 0; j < dayEvents.length; j++) {
        const event = dayEvents[j];
        if (event.id) {
          // read only
          continue;
        }
        const error = validateDayEvent(event, ranges);
        if (error) {
          errors[i][j] = error;
          setEventErrors(errors);
          return false;
        } else {
          ranges.push([event.start, event.end]);
        }
      }
    }
    setEventErrors(errors);
    return true;
  };

  const handleSubmit = async () => {
    let valid = true;
    try {
      setSaving(true);
      setError(null);
      valid = validateEvents();
      for (let i = 0; i < recurringEvents.length; i++) {
        const dayEvents = recurringEvents[i];
        for (const { id, start, end } of dayEvents) {
          if (!id) {
            await bookRecurringFreeBlock(calendarId, start, end, i);
          }
        }
      }
      fetchRecurringEvents(calendarId);
    } catch (e) {
      setError(e);
      valid = false;
    } finally {
      setSaving(false);
    }

    return valid;
  };

  return (
    <div className={styles.body}>
      <Body loading={loading} error={error}>
        <Card className={styles.container}>
          <Card.Header>
            <h5>Set my weekly hours</h5>
          </Card.Header>
          <Card.Body className={styles.content}>
            {recurringEvents.map((eventsOfDay, dayIndex) => {
              return (
                <Row key={dayIndex} className={styles.section}>
                  <Col className={styles.label}>{days[dayIndex]}</Col>
                  <Col sm="7" className={styles.rows}>
                    {eventsOfDay.map(({ id, start, end }, eventIndex) => (
                      <React.Fragment key={eventIndex}>
                        <div className={styles.row}>
                          <TimeSelection
                            className={styles.time}
                            disabled={id != null}
                            time={start}
                            onChange={(val) =>
                              handleChange(dayIndex, eventIndex, 'start', val)
                            }
                          />
                          -
                          <TimeSelection
                            className={styles.time}
                            disabled={id != null}
                            time={end}
                            startTime={start}
                            onChange={(val) =>
                              handleChange(dayIndex, eventIndex, 'end', val)
                            }
                          />
                          <Trash
                            title="Remove"
                            size="24"
                            className={cn(styles.delete, 'App-clickable', {
                              'App-disabled': saving,
                            })}
                            onClick={() => handleDelete(dayIndex, eventIndex)}
                          />
                        </div>
                        {eventErrors[dayIndex][eventIndex] != null && (
                          <div className="text-danger">
                            {eventErrors[dayIndex][eventIndex]}
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </Col>
                  <Col>
                    <Plus
                      title="Add New Availability"
                      className={cn('App-clickable', styles.add)}
                      size="24"
                      onClick={() => handleAddEvent(dayIndex)}
                    />
                  </Col>
                </Row>
              );
            })}
            <SaveButton
              className={styles.save}
              disabled={!hasChange || saving}
              onClick={handleSubmit}
            >
              Save
            </SaveButton>
          </Card.Body>
        </Card>
      </Body>
    </div>
  );
};

AvailabilityBoard.propTypes = propTypes;

export default AvailabilityBoard;
