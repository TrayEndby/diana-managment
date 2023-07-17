import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Card from 'react-bootstrap/Card';

import NoItem from './NoItem';

import { Actions } from '../enums';
import { utcToLocal } from 'util/helpers';

import styles from './style.module.scss';

const propTypes = {
  items: PropTypes.array.isRequired,
  onAction: PropTypes.func.isRequired,
};

const ListItem = ({ items,  onAction }) => {
  return (
    <Card className={cn(styles.list, styles.coach_submitted)}>
      <div className={styles.tHead}>
        <div className={styles.tr}>
          <div className={cn(styles.td, styles.name)}>Homework</div>
          <div className={cn(styles.td, styles.owner)}>Student</div>
          <div className={cn(styles.td, styles.date)}>Date</div>
        </div>
      </div>
      <div className={styles.tbody}>
        {!items.length && <NoItem />}
        {items.map((item, index) => {
          const { id, title, updated_ts, user_name } = item;
          return (
            <div
              key={index}
              className={cn(styles.tr, 'App-clickable')}
              onClick={() => onAction(Actions.select, id)}
            >
              <div className={cn(styles.td, styles.name, 'App-textOverflow')}>
                {title}
              </div>
              <div className={cn(styles.td, styles.owner)}>{user_name}</div>
              <div className={cn(styles.td, styles.date)}>{utcToLocal(updated_ts)}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

ListItem.propTypes = propTypes;

export default ListItem;
