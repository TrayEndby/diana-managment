import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import { ChevronRight } from 'react-bootstrap-icons';

import styles from './style.module.scss';

const propTypes = {
  owner: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const DurationCard = ({ owner, onSelect }) => {
  return (
    <section className={styles.container}>
      <header>Schedule Appointment</header>
      {owner && <div className={styles.name}>{owner}</div>}
      <div className={styles.msg}>
        Welcome to my scheduling page. Please follow the steps to schedule an
        appointment on my calendar
      </div>
      {[30, 60].map((minute) => (
        <Card
          key={minute}
          className={cn(
            styles.card,
            styles[`minute-${minute}`],
            'App-clickable',
          )}
          onClick={() => onSelect(minute)}
        >
          <div>{minute} Minutes Appointment</div>
          <ChevronRight size="32" />
        </Card>
      ))}
    </section>
  );
};

DurationCard.propTypes = propTypes;

export default DurationCard;
