import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  value: PropTypes.number,
};

const MoneyText = ({ value }) => {
  return (
    <>
      {value != null ? `$${value.toLocaleString()}` : ''}
    </>
  );
};

MoneyText.propTypes = propTypes;

export default MoneyText;
