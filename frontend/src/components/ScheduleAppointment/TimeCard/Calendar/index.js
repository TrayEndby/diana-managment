import React, { Children } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';

import { getDate } from '../../util';
import styles from './style.module.scss';

const localizer = momentLocalizer(moment);

const propTypes = {
  selectedDate: PropTypes.string,
  freeSlots: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const getDateCellWrapper = (freeSlots, selectedDate) => ({children, value}) => {
  const date = getDate(value);
  return React.cloneElement(Children.only(children), {
      // style: {
      //   ...children.style,
      //   backgroundColor: dateMap.has(date) ? 'lightgreen' : null,
      // },
      className: cn(children.props.className, {
        [styles.free]: freeSlots.has(date),
        [styles.selected]: selectedDate && date === selectedDate
      }),
    });
}

const CalendarBoard = ({ selectedDate, freeSlots, onSelect }) => {
  return (
    <div className={styles.calendar}>
      <Calendar
        selectable={true}
        // toolbar={false}
        view="month"
        events={[]}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
			  components={{
				dateCellWrapper: getDateCellWrapper(freeSlots, selectedDate),
			}}
        onView={() => {}}
        onSelectSlot={({ start }) => onSelect(getDate(start))}
      />
    </div>
  );
};

CalendarBoard.propTypes = propTypes;

export default CalendarBoard;
