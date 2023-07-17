import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import MyProgressNav from 'components/MyProgress/Nav';
import Planets from 'components/MyProgress/Planets';
import ProgressReport from 'components/MyProgress/ProgressReport';
import BenchmarkAndChancing from 'components/MyProgress/BenchmarkAndChancing';
import Portfolio from 'components/Portfolio';

import * as ROUTES from 'constants/routes';
import { ChildContextProvider } from 'components/MyProgress/utils/ChildContext';

const propTypes = {};

const MyProgressPage = () => {
  return (
    <ChildContextProvider>
      <Switch>
        <Route exact path={ROUTES.MY_PROGRESS}>
          <MyProgressNav />
        </Route>
        <Route path={ROUTES.MISSION_TRACKING}>
          <Planets />
        </Route>
        <Route path={ROUTES.PROGRESS_REPORT}>
          <ProgressReport />
        </Route>
        <Route path={ROUTES.BENCHMARK_AND_CHANCING}>
          <BenchmarkAndChancing />
        </Route>
        <Route path={ROUTES.PORTFOLIO}>
          <Portfolio />
        </Route>
        <Redirect to={ROUTES.MY_PROGRESS} />
      </Switch>
    </ChildContextProvider>
  )
};

MyProgressPage.propTypes = propTypes;

export default MyProgressPage