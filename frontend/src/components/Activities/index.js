import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Details from './Details';
import ActivitySearch from './ActivitySearch';
import Organizations, { organizationTabs } from './Organizations';
import SummerPrograms, { programsTabs } from './SummerPrograms';
import Collaborations, {
  tabs as collaborationsTabs,
} from 'components/Collaborations';

import * as ROUTES from 'constants/routes';
import SidebarPageLayout from 'layout/SidebarPageLayout';
import SideBar from 'util/SideBar';

import style from './style.module.scss';

const navBars = [
  {
    title: 'Summer Programs',
    tabs: programsTabs,
  },
  {
    title: 'Student Organizations',
    tabs: organizationTabs,
  },
  {
    title: 'Project Collaborations',
    tabs: collaborationsTabs,
  },
];

const Activities = React.memo(() => {
  return (
    <div className={style.container}>
      <SidebarPageLayout
        sideBar={(closeSidebar) => (
          <SideBar navBars={navBars} onCloseSidebar={closeSidebar} />
        )}
        noHeader
      >
        <Switch>
          <Route path={ROUTES.PROGRAMS} component={SummerPrograms} />
          <Route path={ROUTES.ORGANIZATIONS} component={Organizations} />
          <Route path={ROUTES.PROGRAM_DETAILS} component={Details} />
          <Route path={ROUTES.SEARCH} component={ActivitySearch} />
          <Route path={ROUTES.COLLABORATIONS} component={Collaborations} />
          <Redirect to={ROUTES.PROGRAMS_EXPLORE} />
        </Switch>
      </SidebarPageLayout>
    </div>
  );
});

export default Activities;
