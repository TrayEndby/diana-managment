import React from 'react';
import PropTypes from 'prop-types';

import styles from './style.module.scss';

const propTypes = {
  owner: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
};

const Header = ({ owner, duration }) => {
  return (
    <>
      <header>{duration} Minutes Appointment</header>
      {owner && <div className={styles.name}>with {owner}</div>}
    </>
  );
};

Header.propTypes = propTypes;

export default Header;
