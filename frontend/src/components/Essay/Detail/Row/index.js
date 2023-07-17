import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  inline: PropTypes.bool,
};

const DetailRow = ({ title, text, inline }) => {
  if (!text) {
    return null;
  }

  if (inline) {
    return (
      <div>
        <label>{title}:</label>&nbsp;
        <span>{text}</span>
      </div>
    );
  } else {
    return (
      <div>
        <label>{title}:</label>
        <div>{text}</div>
      </div>
    );
  }
};

DetailRow.propTypes = propTypes;

export default DetailRow;
