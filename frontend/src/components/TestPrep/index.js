import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import TestPrepSearch from './Search';
import TestPrepChannel from './Channel';

import * as ROUTES from '../../constants/routes';

const TestPrepPage = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={ROUTES.TEST_PREP_CHANNEL}>
        <TestPrepChannel />
      </Route>
      <Route path={path}>
        <TestPrepSearch />
      </Route>
    </Switch>
  );
};

export default TestPrepPage;
