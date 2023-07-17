import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '../Tooltip';

const propTypes = {
  children: PropTypes.any,
};

/**
 * Hide the child component on prod
 * but show on dev env
 */
const DevOnly = ({ children }) => {
  if (process.env.NODE_ENV === 'production') {
    return <div className="App-hidden">{children}</div>;
  } else {
    return <Tooltip title="WARNING: this element is hidden in production build">{children}</Tooltip>;
  }
};

DevOnly.propTypes = propTypes;

export default DevOnly;
