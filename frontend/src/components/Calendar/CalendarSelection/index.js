import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import { Calendar as CalendarIcon } from 'react-bootstrap-icons';

import { isMy } from '../util';

const propTypes = {
  calendar_id: PropTypes.number,
  calendars: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    creator_id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
}; 

const CalendarSelection = ({ calendar_id, calendars, onChange }) => {
  return (
    <Form.Group>
      <CalendarIcon />
      <Form.Control required as="select" name="calendar_id" value={calendar_id} onChange={onChange}>
        <option value="">Select a calendar</option>
        {calendars.map(({ id, name, creator_id, via }) => (
          isMy(creator_id, via) && <option key={id} value={id}>{name}</option>
        ))}
      </Form.Control>
    </Form.Group>
  )
};

CalendarSelection.propTypes = propTypes;

export default CalendarSelection;