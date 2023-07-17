import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import * as ADMIN_ROUTES from 'routes';

const propTypes = {};

const HomePage = () => {
  return (
    <Route>
      <Redirect to={ADMIN_ROUTES.USER_SIGN_UP} />
    </Route>
  )
};

HomePage.propTypes = propTypes;

export default HomePage;
