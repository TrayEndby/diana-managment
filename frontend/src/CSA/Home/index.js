import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import * as CSA_ROUTES from 'constants/CSA/routes';

const propTypes = {};

const HomePage = () => {
  return (
    <Route>
      <Redirect to={CSA_ROUTES.PROFILE} />
    </Route>
  )
};

HomePage.propTypes = propTypes;

export default HomePage;
