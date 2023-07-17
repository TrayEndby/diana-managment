import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import MyCustomerSection from './MyCustomer';
import MyTeamSection from './MyTeam';

import * as CSA_ROUTES from 'constants/CSA/routes';

const propTypes = {};

const MyContactsPage = () => {
  return (
    <Switch>
      <Route path={CSA_ROUTES.MY_CONTACTS_CUSTOMERS}>
        <MyCustomerSection />
      </Route>
      <Route path={CSA_ROUTES.MY_CONTACTS_TEAM}>
        <MyTeamSection />
      </Route>
      <Redirect to={CSA_ROUTES.HOME} />
    </Switch>
  );
};

MyContactsPage.propTypes = propTypes;

export default MyContactsPage;
