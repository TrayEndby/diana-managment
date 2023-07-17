import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';

import Modal from 'react-bootstrap/Modal';
import { Pencil, Trash } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Guests from './Guests';
import { Clock, ListUl, Bag } from 'react-bootstrap-icons';

import ConfirmDialog from 'util/ConfirmDialog';
import ErrorDialog from 'util/ErrorDialog';
import Tooltip from 'util/Tooltip';
import useErrorHandler from 'util/hooks/useErrorHandler';
import { getMyInviteeInfo, isMy } from '../util';
import calendarService from 'service/CalendarService';

import style from './style.module.scss';

const propTypes = {
  show: PropTypes.bool,
  event: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

const CalendarDetail = React.memo(
  ({ show, event, onEdit, onClose, onRefresh }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState();
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useErrorHandler();
    const {
      id,
      calendar_id,
      creator_id,
      title,
      start,
      end,
      summary,
      flag,
      invitee,
      via,
    } = event || {};
    const isMyEvent = isMy(creator_id, via);
    const myInvitee = getMyInviteeInfo(invitee);

    const handleDeletion = async () => {
      try {
        setError(null);
        setShowDeleteConfirm(false);
        setDeleting(true);
        await calendarService.deleteEvent(calendar_id, id);
        setDeleting(false);
        onRefresh();
        onClose();
      } catch (e) {
        setDeleting(false);
        setError(e);
      }
    };

    const handleUpdateInviteeStatus = async (status) => {
      try {
        setError(null);
        await calendarService.updateInvitee(calendar_id, id, status);
        onRefresh();
        onClose();
      } catch (e) {
        setError(e);
      }
    };

    return (
      <Modal
        className="App-modal"
        show={show}
        onHide={onClose}
        size="lg"
        aria-labelledby="calendar-modal"
        centered
      >
        <Modal.Header className={style.header} closeButton>
          <Modal.Title id="calendar-modal">
            Event
            {deleting && '(Deleting...)'}
          </Modal.Title>
          {isMyEvent && (
            <Tooltip title="Edit event" placement="bottom">
              <Pencil className="App-clickable" onClick={onEdit} />
            </Tooltip>
          )}
          {isMyEvent && !deleting && (
            <Tooltip title="Delete event" placement="bottom">
              <Trash
                className="App-clickable ml-2"
                onClick={() => setShowDeleteConfirm(true)}
              />
            </Tooltip>
          )}
        </Modal.Header>
        <Modal.Body
          className={style.form}
          style={{ maxHeight: '80vh', overflow: 'auto' }}
        >
          <ErrorDialog error={error} />
          <Form.Group
            className={classNames(
              style.title,
              'border-bottom',
              'font-weight-bold',
            )}
          >
            {title}
          </Form.Group>
          {(start || end) && (
            <Form.Group>
              <Clock />
              {start && (
                <span className="App-text-green">
                  {moment(start).calendar()}
                </span>
              )}
              {start && end && <span className="App-text-green">-</span>}
              {end && (
                <span className="App-text-green">{moment(end).calendar()}</span>
              )}
            </Form.Group>
          )}
          <Guests guests={invitee} />
          {summary && (
            <Form.Group>
              <ListUl />
              <div>{summary}</div>
            </Form.Group>
          )}
          <Form.Group>
            <Bag />
            <div>
              {flag === calendarService.getEventFlag().ShowFree
                ? 'Free'
                : 'Busy'}
            </div>
          </Form.Group>
        </Modal.Body>
        {myInvitee != null && (
          <Modal.Footer className={style.inviteeAction}>
            {calendarService
              .getInviteeStatusList()
              .map(({ key, text, status, variant }) => (
                <Button
                  key={key}
                  variant={variant}
                  disabled={myInvitee.status === status}
                  onClick={
                    myInvitee.status === status
                      ? null
                      : () => {
                          handleUpdateInviteeStatus(status);
                        }
                  }
                >
                  {text}
                </Button>
              ))}
          </Modal.Footer>
        )}
        {showDeleteConfirm && (
          <ConfirmDialog
            show={true}
            title="Delete event"
            onSubmit={handleDeletion}
            onClose={() => setShowDeleteConfirm(false)}
          >
            Are you sure you want to delete the event?
          </ConfirmDialog>
        )}
      </Modal>
    );
  },
);

CalendarDetail.propTypes = propTypes;

export default CalendarDetail;
