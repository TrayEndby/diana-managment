import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Pencil } from 'react-bootstrap-icons';

import styles from './style.module.scss';

const propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

const EditButton = ({ className, onClick }) => {
  return (
    <div className={cn('App-clickable', styles.button, className)} onClick={onClick}>
      <Pencil />
    </div>
  );
};

EditButton.propTypes = propTypes;

export default EditButton;
