import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import PaymentSuccess from './PaymentSuccess';
import PaymentDeclined from './PaymentDeclined';
import Subscription from './Subscription';
import Receipt from './Receipt';
import PaymentOrder from './PaymentOrder';

import * as ROUTES from '../../constants/routes';

const Payment = ({ authedAs }) => {
  return (
    <div className="App-body d-flex flex-column">
      <Switch>
        <Route path={ROUTES.PAYMENT_ORDER}>
          <PaymentOrder authedAs={ authedAs } />
        </Route>
        <Route path={ROUTES.SUBSCRIPTION}>
          <Subscription authedAs={ authedAs } />
        </Route>
        <Route path={ROUTES.RECEIPT} component={Receipt} />
        <Route path={ROUTES.PAYMENT_SUCCESS} component={PaymentSuccess} />
        <Route path={ROUTES.PAYMENT_DECLINED} component={PaymentDeclined} />
        <Redirect to={ROUTES.PAYMENT_ORDER} />
      </Switch>
    </div>
  );
};

export default Payment;
