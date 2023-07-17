import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import style from './style.module.scss';

const propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const CSABodyContainer = ({ title, className, children }) => { 
  return (
    <div className={cn('App-body', style.body, className)}>
      <div className={style.title}>{title}</div>
      {children}
    </div>
  );
};

CSABodyContainer.propTypes = propTypes;

export default CSABodyContainer;
