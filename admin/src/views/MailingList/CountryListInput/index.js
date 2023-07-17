import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CSelect, CForm, CLabel } from "@coreui/react";

import userProfileListService from "service/UserProfileListService";

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

const CountryListInput = ({
  label,
  required,
  disabled,
  name,
  value,
  className,
  style,
  onChange,
}) => {
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
    <CForm className={className} style={{ ...style }}>
      {label && <CLabel>{label}</CLabel>}
      {loading && (
        <CSelect required={required}>
          <option>Loading...</option>
        </CSelect>
      )}
      {!loading && (
        <CSelect
          required={required}
          disabled={disabled}
          name={name}
          value={value || 0}
          onChange={onChange}
          style={{ color: "black" }}
        >
          <option value="">Please select a country</option>
          {countryList.map(({ abbv, name }) => (
            <option key={abbv} value={abbv}>
              {name}
            </option>
          ))}
        </CSelect>
      )}
    </CForm>
  );
};

CountryListInput.propTypes = propTypes;

export default CountryListInput;

export const DEFAULT_COUNTRY = "US";
