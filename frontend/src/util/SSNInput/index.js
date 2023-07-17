import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import styles from './style.module.scss';

const propTypes = {
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  controlId: PropTypes.string,
  isSSN: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  displayOnly: PropTypes.bool,
  onChange: PropTypes.func,
};

const SSNInput = ({
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
  isSSN,
  onChange,
}) => {
  const [show, setShow] = React.useState(false);
  const normalizeInput = (value) => {
    if (!isSSN) {
      return value;
    }
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

    // returns: "xxx", "xxx-x", "xxx-xx",
    if (cvLength < 6) {
      return `${currentValue.slice(0, 3)}-${currentValue.slice(3)}`;
    }

    // returns: "xxx-xx-", xxx-xx-x", "xxx-xx-xx", "xxx-xx-xxx"
    return `${currentValue.slice(0, 3)}-${currentValue.slice(
      3,
      5,
    )}-${currentValue.slice(5, 9)}`;
  };

  const handleChange = (e) => {
    const value = isSSN ? e.target.value.replace(/[^\d]/g, '') : e.target.value;
    onChange({
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value,
      },
    });
  };

  if (displayOnly) {
    return <>{normalizeInput(value)}</>;
  }

  return (
    <Form.Group
      controlId={controlId}
      className={className}
      style={{ ...style }}
    >
      {label && <Form.Label>{label}</Form.Label>}
      <InputGroup>
        <Form.Control
          required={required}
          disabled={disabled}
          type={show ? 'text' : 'password'}
          name={name}
          value={normalizeInput(value || '')}
          title={isSSN ? undefined : 'Expected pattern is XXX-XX-XXXX'}
          pattern={isSSN ? 'd{3}-?d{2}-?d{4}' : undefined}
          placeholder={placeholder || (isSSN && 'XXX-XX-XXXX') || undefined}
          onChange={handleChange}
          className={styles.inputField}
        />
        <InputGroup.Append>
          {show && (
            <EyeSlash
              onClick={() => setShow(!show)}
              className={styles.eyeButton}
            />
          )}
          {!show && (
            <Eye onClick={() => setShow(!show)} className={styles.eyeButton} />
          )}
        </InputGroup.Append>
      </InputGroup>
    </Form.Group>
  );
};

SSNInput.propTypes = propTypes;

export default SSNInput;
