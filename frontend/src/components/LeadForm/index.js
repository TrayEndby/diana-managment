import React, { useState } from 'react';
import cn from 'classnames';
import Col from 'react-bootstrap/Col';

import ConfirmationTemplate from 'CSA/ConfirmationPage/Template';

import LeadForm from './Form';

import styles from './style.module.scss';

const propTypes = {};

const LeadFormPage = () => {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className={cn('App-body', styles.container)}>
        <ConfirmationTemplate title="Thank you for your connection">
          <p>
            Keep an eye out for our email. You will receive a confirmation with
            more details.
          </p>
        </ConfirmationTemplate>
      </div>
    );
  }

  return (
    <div className={cn('App-body', styles.container)}>
      <Col className={styles.left}>
        <div>
          <h1 className="App-text-orange">Get Started</h1>
          <h1 className="App-text-white">with Kyros.ai</h1>
          <p>
            Your path to dream colleges is just a page away. Fill out the form
            below and a College Success Advisor will get in touch with you and
            show you how Kyros can support you in your journey to the dream
            school.
          </p>
        </div>
      </Col>
      <Col className={styles.right}>
        <LeadForm onSave={() => setSubmitted(true)} />
      </Col>
    </div>
  );
};

LeadFormPage.propTypes = propTypes;

export default LeadFormPage;
