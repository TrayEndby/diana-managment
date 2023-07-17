import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './style.module.scss';

const propTypes = {
  slots: PropTypes.array,
  selectedTime: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

const TimesBoard = ({ slots, selectedTime, onSelect }) => {
  return (
    <div className={styles.section}>
      {slots == null && <div>Please select date on the calendar first</div>}
      {slots != null && slots.length === 0 && <div>No free slots available</div>}
      {slots != null && slots.length > 0 && slots.map((time, index) => (
        <div
          key={index}
          className={cn('App-clickable', styles.slot, {
            [styles.active]: selectedTime === time,
          })}
          onClick={() => onSelect(time)}
        >
          {time}
        </div>
      ))}
    </div>
  );
};

TimesBoard.propTypes = propTypes;

export default TimesBoard;
