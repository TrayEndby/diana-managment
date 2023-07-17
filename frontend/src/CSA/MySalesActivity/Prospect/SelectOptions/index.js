import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  placeholder: PropTypes.string.isRequired,
};

const SelectOptions = ({ list, placeholder }) => {
  return (
    <>
      <option value={null}>{placeholder}</option>
      {list.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </>
  );
};

SelectOptions.propTypes = propTypes;

export default SelectOptions;
