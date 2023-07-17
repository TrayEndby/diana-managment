import React from 'react';
import PropTypes from 'prop-types';

import Alert from 'react-bootstrap/Alert';

const propTypes = {
  error: PropTypes.string,
  className: PropTypes.string,
};

const ErrorDialog = ({ error, className }) =>
  error ? (
    <Alert variant="danger" className={className}>
      {error}
    </Alert>
  ) : null;

ErrorDialog.propTypes = propTypes;

export default ErrorDialog;
