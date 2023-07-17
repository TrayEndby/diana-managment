import React from 'react';

import CalendarBoard from './Board';
import AddEventModal from './Add';

const Calendar = () => {
  return (
    <div className="App-body">
      <CalendarBoard />
    </div>
  );
};

export default Calendar;

export { CalendarBoard, AddEventModal };
