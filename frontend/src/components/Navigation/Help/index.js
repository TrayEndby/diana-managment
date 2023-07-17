import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import NavDropdown from 'react-bootstrap/NavDropdown';

import HelpCenterContent from 'components/HelpCenter/Content';

import astronaut from 'assets/svg/Astronaut.svg';
import styles from './style.module.scss';

const propTypes = {
  hidden: PropTypes.bool,
};

const HelpDropdown = ({ hidden }) => {
  return (
    <NavDropdown
      className={cn(styles.dropdown, {
        [styles.hidden]: hidden,
      })}
      alignRight
      title={<img style={{ width: '43px' }} src={astronaut} alt="Help" />}
    >
      <div className={styles.container}>
        <HelpCenterContent />
      </div>
    </NavDropdown>
  );
};

HelpDropdown.propTypes = propTypes;

export default HelpDropdown;
