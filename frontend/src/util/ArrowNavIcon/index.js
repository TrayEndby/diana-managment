import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { ReactComponent as ArrowIcon } from 'assets/menus/arrows.svg';
import styles from './style.module.scss';

const propTypes = {
  className: PropTypes.string,
  direction: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

const ArrowNavIcon = ({ className, direction, text, path }) => {
  const history = useHistory();
  const Icon =
    direction === 'left' ? (
      <ArrowIcon />
    ) : (
      <ArrowIcon className={styles.right} />
    );

  return (
    <div
      className={cn('App-clickable', styles.arrow, className)}
      onClick={() => history.push(path)}
    >
      {Icon}
      <span className="mt-2">{text}</span>
    </div>
  );
};

ArrowNavIcon.propTypes = propTypes;

export default ArrowNavIcon;
