import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import MyConversationSection from './MyConversation';
import CSAWebsitePage from '../PersonalizedWebsite/page';

import * as CSA_ROUTES from 'constants/CSA/routes';

const propTypes = {};

const MyCustomersPage = () => {
  return (
    <Switch>
      <Route path={CSA_ROUTES.MY_BUSINESS_CONVERSATIONS}>
        <MyConversationSection />
      </Route>
      <Route path={CSA_ROUTES.MY_BUSINESS_WEBSITE}>
        <CSAWebsitePage editable />
      </Route>
      <Redirect to={CSA_ROUTES.HOME} />
    </Switch>
  );
};

MyCustomersPage.propTypes = propTypes;

export default MyCustomersPage;
