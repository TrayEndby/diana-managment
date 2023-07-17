import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

import userProfileListService from 'service/UserProfileListService';

const propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onChange: PropTypes.func,
};

const CountryListInput = ({ label, required, disabled, name, value, className, style, onChange }) => {
  const [loading, setLoading] = useState(true);
  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    setLoading(true);
    userProfileListService
      .getListCountryAbbvName()
      .then(setCountryList)
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
          <option value="">Please select a country</option>
          {countryList.map(({ abbv, name }) => (
            <option key={abbv} value={abbv}>
              {name}
            </option>
          ))}
        </Form.Control>
      )}
    </Form.Group>
  );
};

CountryListInput.propTypes = propTypes;

export default CountryListInput;

export const DEFAULT_COUNTRY = 'US';
