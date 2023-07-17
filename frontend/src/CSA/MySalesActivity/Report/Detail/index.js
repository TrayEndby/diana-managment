import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import Container from 'CSA/Container';
import Back from '../../Prospect/Back';
import CustomerDetailForm from '../Form';
import SupportCard from '../SupportCard';

import useErrorHandler from 'util/hooks/useErrorHandler';
import Body from 'util/Body';
import * as CSA_ROUTES from 'constants/CSA/routes';

import styles from './style.module.scss';

const propTypes = {};

const CustomerDetailSection = ({ history }) => {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useErrorHandler();
  const { location } = history;

  useEffect(() => {
    setLoading(true);
    if (location.state && location.state.customer) {
      setCustomer(location.state.customer);
      setLoading(false);
    } else {
      setCustomer(null);
      setLoading(false);
    }
  }, [location, setError]);

  return (
    <Container title="Customer Report" className="App-body">
      <Back text="My customer list" path={CSA_ROUTES.SALES_REPORT} />
      <Body loading={loading} error={error}>
        <div className={styles.content}>
          {customer == null && <>Oops, no customer info to display</>}
          {customer != null && (
            <>
              <div className={styles.left}>
                <CustomerDetailForm customer={customer} />
              </div>
              <div className={styles.right}>
                <SupportCard customer_id={customer.user_id} />
              </div>
            </>
          )}
        </div>
      </Body>
    </Container>
  );
};

CustomerDetailSection.propTypes = propTypes;

export default withRouter(CustomerDetailSection);
