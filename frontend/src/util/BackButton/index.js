import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { ChevronLeft } from 'react-bootstrap-icons';

const propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func.isRequired,
};

const Back = ({ children, className, onClick }) => {
  return (
    <div
      className={cn("App-clickable App-text-orange d-flex flex-row align-items-center", className)}
      style={{ fontWeight: 'bold', width: 'fit-content' }}
      onClick={onClick}
    >
      <ChevronLeft className="mr-1" />
      {children || 'Back'}
    </div>
  );
};

Back.propTypes = propTypes;

export default Back;
