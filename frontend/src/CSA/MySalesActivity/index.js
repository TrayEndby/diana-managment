import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import ProspectSection from './Prospect';
import ReportSection from './Report';

import * as CSA_ROUTES from 'constants/CSA/routes';

const propTypes = {};

const MySalesActivityPage = () => {
  return (
    <Switch>
      <Route path={CSA_ROUTES.SALES_PROSPECT}>
        <ProspectSection />
      </Route>
      <Route path={CSA_ROUTES.SALES_REPORT}>
        <ReportSection />
      </Route>
      <Redirect to={CSA_ROUTES.HOME} />
    </Switch>
  );
};

MySalesActivityPage.propTypes = propTypes;

export default MySalesActivityPage;
