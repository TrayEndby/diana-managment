import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Calendar from './Calendar';
import Conversations from 'components/Conversations';
import MyStudents from './MyStudents';

import ArrowTabs from 'util/ArrowTabs';
import * as ROUTES from 'constants/routes';
import styles from './style.module.scss';

const tabs = [
  {
    path: ROUTES.EDUCATOR_DETAILS_CALENDAR,
    name: 'My availability',
  },
  {
    path: ROUTES.EDUCATOR_DETAILS_SERVICE_REQUESTS,
    name: 'My conversations',
  },
  {
    path: ROUTES.EDUCATOR_DETAILS_MY_STUDENTS,
    name: 'My students',
    disabled: true
  },
];

const ServiceRequests = ({ isEducator, educatorId }) => {
  return (
    <div className={styles.container}>
      <ArrowTabs tabs={tabs} className="nav-menu" keepSearchParam strongPathCheck />
      <div className={styles.contentContainer}>
        <Switch>
          <Route path={ROUTES.EDUCATOR_DETAILS_CALENDAR}>
            <Calendar isEducator={isEducator} educatorId={educatorId} />
          </Route>
          <Route path={ROUTES.EDUCATOR_DETAILS_MY_STUDENTS}>
            <MyStudents />
          </Route>
          <Route path={ROUTES.EDUCATOR_DETAILS_SERVICE_REQUESTS}>
            <Conversations />
          </Route>

        </Switch>
      </div>
    </div>
  );
};

export default React.memo(ServiceRequests);
