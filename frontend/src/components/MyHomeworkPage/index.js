import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import classNames from 'classnames';

import * as ROUTES from 'constants/routes';

import WorkshopMaterial from './SprintProgram/WorkshopMaterial';
import Homework from 'components/Homework';
import style from './style.module.scss';

const propTypes = {};

const MyHomeworkPage = () => {
  return (
    <div className={classNames('App-body', style.container)}>
      <Switch>
        <Route path={ROUTES.SPRINT_WORKSHOP}>
          <WorkshopMaterial />
        </Route>
        <Route path={ROUTES.HOMEWORK}>
          <Homework />
        </Route>
        <Redirect to={ROUTES.SPRINT_WORKSHOP} />
      </Switch>
    </div>
  );
};

MyHomeworkPage.propTypes = propTypes;

export default MyHomeworkPage;
