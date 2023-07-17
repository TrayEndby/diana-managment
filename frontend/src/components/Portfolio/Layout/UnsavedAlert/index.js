import React from 'react';
import PropTypes from 'prop-types';

import Alert from 'react-bootstrap/Alert';
import SaveChange from '../SaveChange';

const propTypes = {
  onSave: PropTypes.func.isRequired,
};

const UnsavedAlert = ({ onSave }) => {
  return (
    <Alert variant="danger">
      <p>You have unsaved changes to your portfolio information.</p>
      <SaveChange onClick={onSave} />
    </Alert>
  );
};

UnsavedAlert.propTypes = propTypes;

export default UnsavedAlert;
