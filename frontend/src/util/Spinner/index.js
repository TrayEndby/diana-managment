import React from 'react';
import PropTypes from 'prop-types';
import BootsSpinner from 'react-bootstrap/Spinner';
import styles from './style.module.scss';

const propTypes = {
  style: PropTypes.object,
};

const Spinner = ({ style }) => (
  <BootsSpinner animation="border" variant="success" role="status" className={styles.spinner} style={{ ...style }}>
    <span className="sr-only">Loading...</span>
  </BootsSpinner>
);

Spinner.propTypes = propTypes;

export default Spinner;
