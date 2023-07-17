import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import EarningsPage from './Earnings';
import CommissionWorksPage from './CommissionWorks';
import * as ROUTES from 'constants/CSA/routes';

const MyEarningPage = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={ROUTES.MY_EARNINGS_COMMISSIONS}>
        <CommissionWorksPage />
      </Route>
      <Route path={path}>
        <EarningsPage />
      </Route>
    </Switch>
  );
};

export default MyEarningPage;
