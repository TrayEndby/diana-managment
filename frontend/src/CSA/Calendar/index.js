import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Container from 'CSA/Container';
import { CalendarBoard } from 'components/Calendar';
import AvailabilityBoard from 'components/ScheduleAppointment/Availability';

import * as CSA_ROUTES from 'constants/CSA/routes';

const propTypes = {};

const CalendarPage = () => {
  return (
    <Container title="My calendar" className="App-body">
      <Switch>
        <Route path={CSA_ROUTES.CALENDAR_AVAILABILITY}>
          <AvailabilityBoard />
        </Route>
        <Route exact path={CSA_ROUTES.CALENDAR}>
          <CalendarBoard containerStyle={{ paddingTop: 0 }} />
        </Route>
        <Redirect to={CSA_ROUTES.CALENDAR} />
      </Switch>
    </Container>
  );
};

CalendarPage.propTypes = propTypes;

export default CalendarPage;
