import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';

import MoneyText from 'util/MoneyText';
import style from './style.module.scss';

const propTypes = {
  customer: PropTypes.object,
};

const CustomerDetailForm = ({ customer }) => {
  const {
    name,
    email,
    phone,
    num_of_children,
    subscription_start_date,
    subscription_renew_date,
    subscription_amount,
  } = customer;
  const [firstName, lastName] = name.split(' ');
  return (
    <div className={style.form}>
      {/* basic info */}
      <section>
        <header>
          <h6>Customer basic information</h6>
        </header>
        <div>
          {/* first name, last name */}
          <Form.Row>
            <Cell label="First name">{firstName}</Cell>
            <Cell label="Last name">{lastName}</Cell>
          </Form.Row>
          {/* email, contact number */}
          <Form.Row>
            <Cell label="Email address">{email}</Cell>
            <Cell label="Contact number">{phone}</Cell>
          </Form.Row>
          {/* address */}
          <Cell label="Home address" />
          {/* city zip code */}
          <Form.Row>
            <Cell label="City" />
            <Cell label="ZIP code" />
          </Form.Row>
          {/* state country */}
          <Form.Row>
            <Cell label="State/Province" />
            <Cell label="Country" />
          </Form.Row>
          {/* income level, number of children */}
          <Form.Row>
            <Cell label="Income level" />
            <Cell label="Number of children">{num_of_children}</Cell>
          </Form.Row>
        </div>
      </section>
      {/* detail */}
      <section>
        <header>
          <h6>Details</h6>
        </header>
        <div>
          {/* Start Date, closing date */}
          <Form.Row>
            <Cell label="Starting date">{subscription_start_date}</Cell>
            <Cell label="Renew date">{subscription_renew_date}</Cell>
          </Form.Row>
          {/* Subscription fee */}
          <Form.Row>
            <Cell label="Subscription fee">
              <MoneyText value={subscription_amount} />
            </Cell>
          </Form.Row>
        </div>
      </section>
    </div>
  );
};

const Cell = ({ label, children }) => (
  <Form.Group>
    <Form.Label>{label}</Form.Label>
    <div className="form-control">{children}</div>
  </Form.Group>
);

CustomerDetailForm.propTypes = propTypes;

export default CustomerDetailForm;
