import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';

import { getTimeSlots, getTimeStr } from '../util';
import DateInput from '../../../util/DateInput';

const propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string,
  time: PropTypes.any,
  startTime: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

const TimeSelection = ({ name, date, time, startTime, onChange, className }) => {
  const times = getTimeSlots(startTime);
  return (
    <div className={className}>
      <DateInput required name={`${name}Date`} value={date} style={{ margin: 0 }} onChange={onChange} />
      <Form.Control required as="select" name={`${name}Time`} value={getTimeStr(time)} onChange={onChange}>
        {times.map((time_str) => {
          return <option key={time_str}>{time_str}</option>;
        })}
      </Form.Control>
    </div>
  );
};

TimeSelection.propTypes = propTypes;

export default TimeSelection;
