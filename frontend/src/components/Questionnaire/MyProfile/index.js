import React from 'react';
import classNames from 'classnames';

import Col from 'react-bootstrap/Col';

import HelpPopUp from 'components/HelpPopUp';
import ReviewBasic from './ReviewBasic';
import ReviewProfile from './ReviewProfile';

import authService from 'service/AuthService';
import styles from './style.module.scss';

const propTypes = {};

const MyProfile = ({ authedAs, handleUploadAvatar }) => {
  const unverified = !authedAs.userVerified;
  return (
    <div className={classNames('App-body', styles.body)}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <Col xl={8} className={styles.rightContainer}>
            <ReviewProfile
              authedAs={authedAs}
              handleUploadAvatar={handleUploadAvatar}
            />
            <ReviewBasic />
          </Col>
        </div>
      </div>
      {unverified && <HelpPopUp message={authService.getUnverifiedMessage()} />}
    </div>
  );
};

MyProfile.propTypes = propTypes;

export default MyProfile;
