import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import DetailSection from './Detail';
import ListSection from './List';

import * as CSA_ROUTES from 'constants/CSA/routes';

const propTypes = {};

const ReportSection = () => {
  return (
    <Switch>
      <Route path={CSA_ROUTES.SALES_REPORT_DETAIL}>
        <DetailSection />
      </Route>
      <Route exact path={CSA_ROUTES.SALES_REPORT}>
        <ListSection />
      </Route>
      <Redirect to={CSA_ROUTES.HOME} />
    </Switch>
  )
}

ReportSection.propTypes = propTypes;

export default ReportSection;
