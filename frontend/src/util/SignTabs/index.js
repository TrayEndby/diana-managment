import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Tab, Nav } from 'react-bootstrap';

import styles from './style.module.scss';
import { STORAGE_SIGN_IN_TYPE } from 'constants/storageKeys';
import * as ROUTES from 'constants/routes';
import { PROFILE_TYPE } from 'constants/profileTypes';

const propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
};

const SignTabs = ({ title, type }) => {

  const handleSignInType = (type) => {
    localStorage.setItem(STORAGE_SIGN_IN_TYPE, type);
  };

  return (
    <Tab.Container>
      <Nav className={styles.container}>
        <Nav.Item className={title === 'educator' ? styles.selectedItem : styles.item}>
          <Link to={type === 0 ? ROUTES.SIGN_IN_EDUCATOR : ROUTES.SIGN_UP_EDUCATOR} onClick={() => handleSignInType(PROFILE_TYPE.Educator)} className={styles.itemColor}>
            Educator
          </Link>
        </Nav.Item>
        <Nav.Item className={title === 'student' ? styles.selectedItem : styles.item}>
          <Link to={type === 0 ? ROUTES.SIGN_IN : ROUTES.SIGN_UP} onClick={() => handleSignInType(PROFILE_TYPE.RegularHSStudent)} className={styles.itemColor}>
            Student
          </Link>
        </Nav.Item>
        <Nav.Item className={title === 'parent' ? styles.selectedParentItem : styles.parentitem}>
          <Link to={type === 0 ? ROUTES.SIGN_IN_PARENT : ROUTES.SIGN_UP_PARENT} onClick={() => handleSignInType(PROFILE_TYPE.Parent)} className={styles.itemColor}>
            Parent
          </Link>
        </Nav.Item>
        <div className={styles.emptySpace} />
      </Nav>
    </Tab.Container>
  );
};

SignTabs.propTypes = propTypes;

export default SignTabs;
