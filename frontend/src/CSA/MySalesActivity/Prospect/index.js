import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import EditSection from './Edit';
import ListSection from './List';

import * as CSA_ROUTES from 'constants/CSA/routes';

const propTypes = {};

const ProspectSection = () => {
  return (
    <Switch>
      <Route path={`${CSA_ROUTES.SALES_PROSPECT_EDIT}/:id`}>
        <EditSection />
      </Route>
      <Route exact path={CSA_ROUTES.SALES_PROSPECT}>
        <ListSection />
      </Route>
      <Redirect to={CSA_ROUTES.HOME} />
    </Switch>
  )
}

ProspectSection.propTypes = propTypes;

export default ProspectSection;
