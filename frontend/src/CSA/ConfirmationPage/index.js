import React from 'react';

import Confirmation from './Template';

const propTypes = {};

const ConfirmationPage = () => (
  <div className="App-body">
    <Confirmation title="THANK YOU FOR REGISTERING!">
      <p>We have received your form.</p>
      <p>We’ll reach out to you as soon as possible!</p>
      <p className="mt-4">Keep an eye out for our email :)</p>
    </Confirmation>
  </div>
);

ConfirmationPage.propTypes = propTypes;

export default ConfirmationPage;
