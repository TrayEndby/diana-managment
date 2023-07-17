import React from 'react';

import ConfirmationTemplate from 'CSA/ConfirmationPage/Template';

const propTypes = {};

const Confirmation = () => {
  return (
    <ConfirmationTemplate title="Appointment Confirmed!">
      <p>
        Keep an eye out for our email. You will receive a confirmation with all
        the appointment details.
      </p>
    </ConfirmationTemplate>
  );
};

Confirmation.propTypes = propTypes;

export default Confirmation;
