import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import moment from 'moment';

import Dropdown from 'react-bootstrap/Dropdown';

import {
  getTimeSlots,
  getTimeStr,
  getMomentTimeFromStr,
} from 'components/Calendar/util';

import styles from './style.module.scss';

const propTypes = {
  className: PropTypes.string,
  time: PropTypes.any,
  startTime: PropTypes.any,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

const TimeSelection = ({ time, startTime, className, disabled, onChange }) => {
  const times = getTimeSlots(
    startTime || moment().hour(7).minute(0).seconds(0),
  );
  return (
    <div className={cn(styles.dropdown, className)}>
      {disabled ? (
        <div className={styles.text}>{getTimeStr(time)}</div>
      ) : (
        <Dropdown
          onSelect={(time_str) => onChange(getMomentTimeFromStr(time_str))}
        >
          <Dropdown.Toggle variant="success">
            {time ? getTimeStr(time) : 'Select a time'}
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ maxHeight: '500px' }}>
            {times.map((time_str) => {
              return (
                <Dropdown.Item key={time_str} eventKey={time_str}>
                  {time_str}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
};

TimeSelection.propTypes = propTypes;

export default TimeSelection;
