import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Nav from './Nav';
import LongTermSection from './LongTerm';
import MidTermSection from './MidTerm';

import Recommend from './Recommend';

import SidebarPageLayout from '../../layout/SidebarPageLayout';
import * as ROUTES from '../../constants/routes';

const GoalSettingPage = () => {
  const [cnt, setCnt] = useState(0);
  return (
    <SidebarPageLayout
      sideBar={() => <Recommend cnt={cnt} />}
      rightSidebar
      wideSidebar
      noHeader
      sidebarStyle={{ width: '400px' }}
    >
      <div className="App-body d-flex flex-column flex-lg-row">
        <section className="d-flex h-100 flex-column col p-0">
          <Nav />
          <Switch>
            <Route path={ROUTES.GOAL_LONG_TERM}>
              <LongTermSection onChange={() => setCnt(cnt + 1)} />
            </Route>
            <Route path={ROUTES.GOAL_MID_TERM}>
              <MidTermSection />
            </Route>
            <Redirect to={ROUTES.GOAL_LONG_TERM} />
          </Switch>
        </section>
      </div>
    </SidebarPageLayout>
  );
};

export default GoalSettingPage;
