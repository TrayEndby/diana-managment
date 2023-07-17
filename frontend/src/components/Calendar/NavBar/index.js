import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { CalendarType } from '../../../service/CalendarService';

const propTypes = {
  title: PropTypes.string,
  editable: PropTypes.bool,
  calendars: PropTypes.array.isRequired,
  children: PropTypes.node,
  onToggle: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

const CalendarNavBar = ({ title, calendars, editable, children, onAdd, onToggle }) => {
  return (
    <>
      {editable && (
        <Button className="mb-2" variant="outline-success" size="sm" onClick={onAdd}>
          + Create
        </Button>
      )}
      <h5 className="App-text-orange">{ title || 'My calendars' }</h5>
      <div style={{ overflowY: 'auto' }}>
        {calendars.map(({ id, name, via, checked }, index) => {
          if (via === CalendarType.Invited) {
            return null; // this is other person's calendar
          } else {
            return (
              <Form.Check
                key={id}
                className="mb-1"
                type={'checkbox'}
                label={name}
                checked={checked}
                onChange={() => onToggle(index)}
              />
            );
          }
        })}
      </div>
      {children}
    </>
  );
};

CalendarNavBar.propTypes = propTypes;

export default CalendarNavBar;
