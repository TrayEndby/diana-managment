import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';

const propTypes = {
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  controlId: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  displayOnly: PropTypes.bool,
  onChange: PropTypes.func,
};

const PhoneInput = ({
  required,
  disabled,
  controlId,
  label,
  name,
  value,
  placeholder,
  className,
  style,
  displayOnly,
  onChange,
}) => {
  const normalizeInput = (value) => {
    // return nothing if no value
    if (!value) {
      return value;
    }

    // only allows 0-9 inputs
    const currentValue = value.replace(/[^\d]/g, '');
    const cvLength = currentValue.length;

    // returns: "x", "xx", "xxx"
    if (cvLength < 4) {
      return currentValue;
    }

    // returns: "(xxx)", "(xxx) x", "(xxx) xx", "(xxx) xxx",
    if (cvLength < 7) {
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
    }

    // returns: "(xxx) xxx-", (xxx) xxx-x", "(xxx) xxx-xx", "(xxx) xxx-xxx", "(xxx) xxx-xxxx"
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
  };

  const handleChange = (e) => {
    onChange({
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: e.target.value.replace(/[^\d]/g, ''),
      },
    });
  };

  if (displayOnly) {
    return <>{normalizeInput(value)}</>;
  }

  return (
    <Form.Group controlId={controlId} className={className} style={{ ...style }}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        required={required}
        disabled={disabled}
        type="tel"
        name={name}
        value={normalizeInput(value || '')}
        placeholder={placeholder || '(XXX)-XXX-XXXX'}
        onChange={handleChange}
      />
    </Form.Group>
  );
};

PhoneInput.propTypes = propTypes;

export default PhoneInput;
