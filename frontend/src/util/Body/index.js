import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Loading from '../Loading';
import ErrorDialog from '../ErrorDialog';

const propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const Body = ({ className, loading, error, children }) => {
  return (
    <>
      <Loading show={loading} className={cn(className, 'loading')} />
      <ErrorDialog error={error} className={cn(className, 'error')} />
      {!loading && children}
    </>
  );
};

Body.propTypes = propTypes;

export default Body;
