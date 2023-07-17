import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Navbar from './Nav';
import Course from './Course';
import Test from './Test';
import ECA from './ECA';
import Achievement from './Achievement';
import Supplementary from './Supplementary';

import Resume from 'components/Resume';

import * as ROUTES from 'constants/routes';

import styles from './style.module.scss';
import ChildLabel from 'components/MyProgress/utils/ChildLabel';
import BackButton from 'components/MyProgress/utils/BackButton';

const Portfolio = () => {
  return (
    <div className="App-body d-flex flex-row">
      <div className={styles.left}>
        <div className={styles.header}>
          <BackButton />
          <div className={styles.header__right}>
            <div className={styles.title}>Portfolio</div>
            <ChildLabel />
          </div>
        </div>
        <Navbar />
        <Switch>
          <Route path={ROUTES.PORTFOLIO_COURSE} component={Course}></Route>
          <Route path={ROUTES.PORTFOLIO_TEST} component={Test}></Route>
          <Route path={ROUTES.PORTFOLIO_ECA} component={ECA}></Route>
          <Route
            path={ROUTES.PORTFOLIO_ACHIEVEMENT}
            component={Achievement}
          ></Route>
          <Route
            path={ROUTES.PORTFOLIO_SUPPLEMENTARY}
            component={Supplementary}
          ></Route>
          <Redirect to={ROUTES.PORTFOLIO_COURSE} />
        </Switch>
      </div>
      <div className={styles.right}>
        <Resume />
      </div>
    </div>
  );
};

export default Portfolio;
