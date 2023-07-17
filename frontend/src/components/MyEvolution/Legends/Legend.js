import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './style.module.scss';

const propTypes = {
  color: PropTypes.string.isRequired
};

const Legend = ({ color }) => {
  return <div className={cn(styles.legend, color)}></div>
}

Legend.propTypes = propTypes;

export default Legend;