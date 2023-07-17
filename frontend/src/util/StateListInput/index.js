import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

import userProfileListService from 'service/UserProfileListService';

const propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  countryCode: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onChange: PropTypes.func,
};

const StateListInput = ({
  label,
  required,
  disabled,
  countryCode,
  name,
  value,
  className,
  style,
  onChange,
}) => {
  const [loading, setLoading] = useState(true);
  const [stateList, setStateList] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (!countryCode) {
      // old code
      userProfileListService
        .listName(13)
        .then((states) => {
          console.log('states', states);
          setStateList(states.names);
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false);
        });
    } else {
      userProfileListService
        .getListStateByCountry(countryCode)
        .then((states) => {
          console.log('states', states);
          setStateList(states);
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [countryCode]);

  return (
    <Form.Group className={className} style={{ ...style }}>
      {label && <Form.Label>{label}</Form.Label>}
      {loading && (
        <Form.Control required={required} as="select">
          <option>Loading...</option>
        </Form.Control>
      )}
      {!loading && (
        <Form.Control
          required={required}
          disabled={disabled}
          as="select"
          name={name}
          value={value}
          onChange={onChange}
        >
          <option value="">Please select a state</option>
          {stateList.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </Form.Control>
      )}
    </Form.Group>
  );
};

StateListInput.propTypes = propTypes;

export default StateListInput;

export const DEFAULT_STATE = 'Alabama';
