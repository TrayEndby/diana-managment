import React from 'react';
import PropTypes from 'prop-types';

import Markdown from 'components/Markdown';

import styles from './style.module.scss';

const propTypes = {
  headerText: PropTypes.string.isRequired,
  markdownText: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

const ResumeDialog = React.memo(({ headerText, markdownText, onClose }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.closeButton} onClick={onClose}>
        X
      </div>
      <h5 className={styles.sampleResumeText}>{headerText}</h5>
      <div className={styles.splitter}></div>
      <div className={styles.resumeContent}>
        <Markdown source={markdownText} />
      </div>
    </div>
  );
});

ResumeDialog.propTypes = propTypes;

export default ResumeDialog;
