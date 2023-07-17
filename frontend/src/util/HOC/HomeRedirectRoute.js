import React from 'react';
import {Route, Redirect } from 'react-router-dom';
import * as ROUTES from 'constants/routes';

export default function HomeRedirectRoute({ component: Component, authenticated, ...rest }) {
  const HOComponent = (props) => {
    if (authenticated) {
      return <Redirect to={{ pathname: ROUTES.HOME }} />;
    } else {
      return <Component {...props} />;
    }
  };
  return <Route {...rest} render={HOComponent} />;
}
