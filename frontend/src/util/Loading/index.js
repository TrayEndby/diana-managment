import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './style.module.scss';

const propTypes = {
  show: PropTypes.bool.isRequired,
  className: PropTypes.string,
  variant: PropTypes.string, // white: color be white
};

const Loading = ({ show, className, variant }) =>
  show ? (
    <div
      className={classNames(style.text, className, {
        [style.white]: variant === 'white',
      })}
    >
      Loading...
    </div>
  ) : null;

Loading.propTypes = propTypes;

export default Loading;
