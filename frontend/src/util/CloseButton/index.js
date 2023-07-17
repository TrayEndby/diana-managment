import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const CloseButton = ({ dark, onClick, className }) => (
  <button type="button" className={cn("close", className)} aria-label="Close" onClick={onClick}>
    <span aria-hidden="true" className={dark ? '' : 'text-white'} >&times;</span>
  </button>
);

CloseButton.propTypes = {
  dark: PropTypes.bool,
  onClick: PropTypes.func
};

export default CloseButton;