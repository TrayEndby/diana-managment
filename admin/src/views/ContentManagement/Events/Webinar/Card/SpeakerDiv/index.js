import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import AstronautImage from 'assets/svg/Astronaut.svg';

import styles from './style.module.scss';

const propTypes = {
  speakers: PropTypes.array,
};

const SpeakerDiv = ({ speakers }) => {
  if (speakers === null) {
    return (
      <div className={cn(styles.speakerDiv, styles.noSpeaker)}>
        <img
          alt="No Speaker"
          src={AstronautImage}
        />
      </div>
    );
  } else if (speakers.length === 1) {
    return (
      <div className={cn(styles.speakerDiv, styles.oneSpeaker)}>
        <img
          alt="One Speaker"
          src={`https://storage.googleapis.com/kyros-public-data/speakers/${speakers[0].image}`}
        />
        <p className={styles.speakerName} style={{ fontSize: '15px' }}>
          {speakers[0].name}
        </p>
      </div>
    );
  } else if (speakers.length >= 2) {
    return (
      <div className={cn(styles.speakerDiv, styles.twoSpeakers)}>
        <div className={styles.individualImg}>
          <img
            alt="Two Speakers"
            src={`https://storage.googleapis.com/kyros-public-data/speakers/${speakers[0].image}`}
          />
          <p className={styles.speakerName}>{speakers[0].name}</p>
        </div>
        <div className={styles.individualImg}>
          <img
            alt="Individual Speaker"
            src={`https://storage.googleapis.com/kyros-public-data/speakers/${speakers[1].image}`}
            className={styles.twoSpeakerImg}
          />
          <p className={styles.speakerName}>{speakers[1].name}</p>
        </div>
      </div>
    );
  }
};

SpeakerDiv.propTypes = propTypes;

export default SpeakerDiv;
