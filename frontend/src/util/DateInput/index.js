import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

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
  onChange: PropTypes.func,
};

const DateInput = ({
  required,
  disabled,
  controlId,
  label,
  name,
  value,
  placeholder,
  className,
  style,
  onChange,
}) => {
  const [date, setDate] = useState('');
  const [error, setError] = useState();

  const validateDate = (val) => {
    const year = val.substr(0, val.indexOf('-'));
    if (year.length > 4) {
      return false;
    }
    setDate(val);

    if (!moment(val).isValid()) {
      setError(val ? 'Invalid date format' : null);
      return false;
    } else {
      setError(null);
      return true;
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    const valid = validateDate(val);
    const uniformedVal = valid ? moment(val).format('YYYY-MM-DD') : val;
    onChange && onChange({
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: uniformedVal,
      },
    });
  };

  return (
    <Form.Group
      controlId={controlId}
      className={className}
      style={{ ...style }}
    >
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        required={required}
        disabled={disabled}
        type="date"
        name={name}
        value={date || value || ''}
        isInvalid={!!error}
        placeholder={placeholder || moment.localeData().longDateFormat('L')}
        onChange={handleChange}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
};

DateInput.propTypes = propTypes;

export default DateInput;
