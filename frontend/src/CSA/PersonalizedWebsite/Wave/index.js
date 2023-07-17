import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './style.module.scss';

const propTypes = {
  reverse: PropTypes.bool,
  grey: PropTypes.bool,
  style: PropTypes.object,
};

const Wave = ({ style, reverse, grey }) => (
  <div
    className={cn(styles.wave, {
      [styles.reverse]: reverse,
      [styles.grey]: grey,
    })}
    style={{ ...style }}
  ></div>
);

Wave.propTypes = propTypes;

export default Wave;
