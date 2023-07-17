import React from 'react';
import { Container } from 'react-bootstrap';
import { Switch, Redirect, Route } from 'react-router-dom';

import * as ROUTES from '../../../constants/routes';
import Header from '../../../layout/SidebarPageLayout/Header';
import Explore from './Explore';
import Current from './Current';
import Saved from './Saved';
import Create from './Create';
import style from './style.module.scss';
import { useHistory } from 'react-router-dom';
import Tabs from '../../../util/Tabs';

export const organizationTabs = [
  {
    name: 'Explore',
    path: ROUTES.ORGANIZATIONS_EXPLORE,
  },
  {
    name: 'Saved',
    path: ROUTES.ORGANIZATIONS_SAVED,
  },
];

const Organizations = () => {
  const history = useHistory();
  return (
    <Container className={style.container}>
      <Header
        searchPlaceholder="Search projects, activities, and achievements"
        searchURL={ROUTES.SEARCH_ORGANIZATIONS}
        btnText="Add new organization"
        btnOnClick={() => history.push(ROUTES.ORGANIZATIONS_CREATE)}
      />
      <Tabs tabs={organizationTabs} />
      <Switch>
        <Route path={ROUTES.ORGANIZATIONS_EXPLORE} component={Explore} />
        <Route path={ROUTES.ORGANIZATIONS_CURRENT} component={Current} />
        <Route path={ROUTES.ORGANIZATIONS_SAVED} component={Saved} />
        <Route path={ROUTES.ORGANIZATIONS_CREATE} component={Create} />
        <Redirect to={ROUTES.ORGANIZATIONS_EXPLORE} />
      </Switch>
    </Container>
  );
};

export default React.memo(Organizations);
