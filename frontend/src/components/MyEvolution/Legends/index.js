import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { getGoalColorByType } from '../helper';
import Legend from './Legend';
import styles from './style.module.scss';

const propTypes = {
  goals: PropTypes.array,
  stats: PropTypes.array,
  className: PropTypes.string,
};

const Legends = ({ goals, stats, className }) => {
  if (!goals || goals.length === 0) {
    return null;
  }
  return (
    <div className={cn(styles.legends, className)}>
      {goals.map((goal, index) => (
        <div key={index}>
          <div className={styles.row}>
            <Legend color={getGoalColorByType(index + 1)} />
            <span>{goal}</span>
          </div>
          <div
            className={styles.stats}
          >{`${stats[index].finish}/${stats[index].total}`}</div>
        </div>
      ))}
    </div>
  );
};

Legends.propTypes = propTypes;

export default Legends;
