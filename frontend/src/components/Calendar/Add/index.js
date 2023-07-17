import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Clock, ListUl, Bag } from 'react-bootstrap-icons';

import TimeSelection from '../TimeSelection';
import GuestsSelection from '../GuestsSelection';
import CalendarSelection from '../CalendarSelection';

import {
  getMomentTimeFromStr,
  initializeEventData,
  normalizeEventData,
  getAvailableGuestsFromCalendar,
} from '../util';
import ErrorDialog from '../../../util/ErrorDialog';
import useErrorHandler from '../../../util/hooks/useErrorHandler';
import calendarService from '../../../service/CalendarService';

import style from '../Detail/style.module.scss';

const propTypes = {
  show: PropTypes.bool.isRequired,
  event: PropTypes.object,
  calendars: PropTypes.array.isRequired,
  edit: PropTypes.bool,
  noGuestsSelection: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

const AddEventModal = React.memo(
  ({
    show,
    calendars,
    event,
    edit,
    noGuestsSelection,
    noFlagSelection,
    onClose,
  }) => {
    const [data, setData] = useState({});
    const [error, setError] = useErrorHandler();
    const [saving, setSaving] = useState(false);
    // {user_id: string, name: string}[]
    const [availableGuests, setAvailableGuests] = useState(null);
    const {
      calendar_id,
      name,
      summary,
      guests,
      startDate,
      endDate,
      startTime,
      endTime,
      flag,
    } = data;

    const handleChange = (e) => {
      const key = e.target.name;
      let value = e.target.value;
      if (key === 'startTime' || key === 'endTime') {
        value = getMomentTimeFromStr(value);
      }
      setData({
        ...data,
        [key]: value,
      });
      setError(null);
    };

    const handleChangeGuest = (guests) => {
      setData({
        ...data,
        guests,
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      setSaving(true);
      try {
        const normalizedEvent = normalizeEventData(data, event?.id);
        const invitees = guests.map(({ user_id }) => user_id);
        if (edit) {
          await calendarService.updateEvent(
            calendar_id,
            normalizedEvent,
            invitees,
          );
        } else {
          await calendarService.addEvent(
            calendar_id,
            normalizedEvent,
            invitees,
          );
        }
        setSaving(false);
        onClose(true);
      } catch (e) {
        setSaving(false);
        setError(e);
      }
    };

    useEffect(() => {
      const res = initializeEventData(event, calendars);
      setData(res);
    }, [event, calendars]);

    useEffect(() => {
      (async () => {
        try {
          const calendar = calendars.filter(({ id }) => id === calendar_id)[0];
          const res = await getAvailableGuestsFromCalendar(calendar);
          setAvailableGuests(res);
        } catch (e) {
          console.error(e);
          setAvailableGuests([]);
        }
      })();
    }, [calendar_id, calendars]);

    return (
      <Modal
        className="App-modal"
        show={show}
        onHide={onClose}
        size="lg"
        aria-labelledby="calendar-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="calendar-event-modal">
            {edit ? 'Edit event' : 'Add event'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '80vh', overflow: 'auto' }}>
          <ErrorDialog error={error} />
          <Form className={style.form} onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                required
                className={style.title}
                placeholder="Add title"
                name="name"
                value={name || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="d-flex flex-column flex-md-row">
              <Clock />
              <TimeSelection
                name="start"
                className="mt-3 mt-md-0"
                date={startDate}
                time={startTime}
                onChange={handleChange}
              />
              -
              <TimeSelection
                name="end"
                date={endDate}
                time={endTime}
                startTime={startDate === endDate ? startTime : null}
                onChange={handleChange}
              />
            </Form.Group>
            <GuestsSelection
              availableGuests={availableGuests || []}
              guests={guests || []}
              noGuestsSelection={noGuestsSelection}
              onChange={handleChangeGuest}
            />
            <Form.Group>
              <ListUl />
              <Form.Control
                as="textarea"
                placeholder="Add description"
                name="summary"
                value={summary || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Bag />
              {noFlagSelection ? (
                <div
                  className={cn(style.flag, 'form-control')}
                  name="flag"
                  value={flag}
                >
                  {flag === calendarService.getEventFlag().ShowFree
                    ? 'Free'
                    : 'Busy'}
                </div>
              ) : (
                <Form.Control
                  as="select"
                  disabled={noFlagSelection}
                  className={style.flag}
                  name="flag"
                  value={flag}
                  onChange={handleChange}
                >
                  <option value={calendarService.getEventFlag().ShowBusy}>
                    Busy
                  </option>
                  <option value={calendarService.getEventFlag().ShowFree}>
                    Free
                  </option>
                </Form.Control>
              )}
            </Form.Group>
            {calendars != null && (
              <CalendarSelection
                calendar_id={calendar_id}
                calendars={calendars}
                onChange={handleChange}
              />
            )}
            <Button type="submit" className="float-right" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  },
);

AddEventModal.propTypes = propTypes;

export default AddEventModal;
