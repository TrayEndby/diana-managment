import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

const propTypes = {
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

const AddButton = ({ children, onClick, disabled }) => {
  return (
    <Button variant="primary" onClick={onClick} style={{ width: 'fit-content', alignSelf: 'center' }} disabled={disabled}>
      {children}
    </Button>
  );
};

AddButton.propTypes = propTypes;

export default AddButton;
