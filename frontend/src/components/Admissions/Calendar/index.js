import React, { Component } from 'react';

// import { Calendar, momentLocalizer } from 'react-big-calendar'
// import moment from 'moment-timezone';

// import style from './style.module.scss';
// const localizer = momentLocalizer(moment);

class CalendarBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // temporary empty    
    }
  }

  render() {
    return (
      <main
        className="px-5 py-3 bg-secondary"
        style={{ flex: "1 1 auto" }}
      >
        {/* <AdmCalendar /> */}
      </main>
    );
  }
}

// const AdmCalendar = () => {
//   return (
//     <>
//       <div className={style.calendarHead}>
//         May 2020
//       </div>
//       <div className={style.calendarContent}>
//         Content
//       </div>
//     </>
//   )
// }

export default CalendarBoard;