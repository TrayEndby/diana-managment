import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import ReactPhoneInput from 'react-phone-number-input';

const propTypes = {
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onChange: PropTypes.func,
};

const PhoneInput = ({
  required,
  disabled,
  label,
  name,
  value,
  className,
  style,
  onChange,
}) => {
  const handleChange = (value) => {
    onChange({
      target: {
        name,
        value: value,
      },
    });
  };

  return (
    <div className={className} style={{ ...style }}>
      {label && <Form.Label>{label}</Form.Label>}
      <ReactPhoneInput
        defaultCountry="US"
        countries={['US', 'CN', 'TW', 'HK']}
        disabled={disabled}
        required={required}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

PhoneInput.propTypes = propTypes;

export default PhoneInput;
