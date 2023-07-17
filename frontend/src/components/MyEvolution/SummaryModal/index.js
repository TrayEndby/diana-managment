import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Legends from '../Legends';
import { MONTHS } from 'util/helpers';

import styles from './style.module.scss';

const propTypes = {
  grade: PropTypes.string.isRequired,
  month: PropTypes.number.isRequired,
  stats: PropTypes.array.isRequired,
  goals: PropTypes.array.isRequired,
};

const SummaryModal = ({ grade, month, stats, goals, onClose }) => {
  return (
    <Modal show={true} size="lg" centered>
      <Modal.Body>
        <div className={styles.title}>GREAT MONTH!</div>
        <div className={styles.text}>
          You finished all of tasks for <b>{MONTHS[month]}</b>!
        </div>
        <div className={styles.text}>
          Now, you are one step closer to achieve your <b>{grade}</b> goals
        </div>
        <div className={styles.progress}>
          <div className={cn(styles.text, styles.bold)}>MY GOAL PROGRESS</div>
          <Legends goals={goals} stats={stats} className={styles.legends} />
        </div>
        <Button className="d-flex mx-auto" onClick={onClose}>
          Continue
        </Button>
      </Modal.Body>
    </Modal>
  );
};

SummaryModal.propTypes = propTypes;

export default SummaryModal;
