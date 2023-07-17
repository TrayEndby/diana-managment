import React from 'react';
import PropTypes from 'prop-types';
import { PeopleFill, CheckCircle, XCircle, QuestionCircle } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';

import calendarService from '../../../../service/CalendarService';

const propTypes = {
  invitee: PropTypes.arrayOf({
    invitee_id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

const getIconFromInviteeStatus = (status) => {
  const Status = calendarService.getInviteeStatus();
  switch (status) {
    case Status.Accepted:
      return <CheckCircle style={{ color: '#53a548' }} />;
    case Status.Declined:
      return <XCircle style={{ color: '#cd1a01' }} />;
    case Status.Undecided:
      return <QuestionCircle style={{ color: '#8b8b8d' }} />;
    default:
      throw new Error('Unsupported');
  }
};

const Guests = ({ guests }) => {
  if (guests == null || guests.length === 0) {
    return null;
  }

  return (
    <Form.Group>
      <PeopleFill />
      <div>
        {guests.map(({ invitee_id, name, status }) => (
          <div key={invitee_id} className="mx-2 d-flex flex-row">
            <div className="font-weight-bold">{name}</div>
            {status && <div className="ml-1">{getIconFromInviteeStatus(status)}</div>}
          </div>
        ))}
      </div>
    </Form.Group>
  );
};

Guests.propTypes = propTypes;

export default Guests;
