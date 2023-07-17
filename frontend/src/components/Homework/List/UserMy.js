import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Card from 'react-bootstrap/Card';

import NoItem from './NoItem';

import { Actions, Status } from '../enums';
import { utcToLocal } from 'util/helpers';

import styles from './style.module.scss';

const propTypes = {
  items: PropTypes.array.isRequired,
  onAction: PropTypes.func.isRequired,
};

const UserMy = ({ items, onAction }) => {
  return (
    <Card className={cn(styles.list, styles.user_all)}>
      <div className={styles.tHead}>
        <div className={styles.tr}>
          <div className={cn(styles.td, styles.name)}>Name</div>
          <div className={cn(styles.td, styles.owner)}>Owner</div>
          <div className={cn(styles.td, styles.date)}>Last modified</div>
          <div className={cn(styles.td, styles.status)}>Status</div>
        </div>
      </div>
      <div className={styles.tbody}>
        {!items.length && <NoItem />}
        {items.map((item, index) => {
          const { id, title, updated_ts, user_name, front_end_status } = item;
          const isShared = front_end_status === Status.USER_SHARED;
          return (
            <div key={index} className={cn(styles.tr, 'App-clickable')} onClick={() => onAction(Actions.select, id)}>
              <div className={cn(styles.td, styles.name, 'App-textOverflow')}>{title}</div>
              <div className={cn(styles.td, styles.owner)}>{user_name}</div>
              <div className={cn(styles.td, styles.date)}>{utcToLocal(updated_ts)}</div>
              <div
                className={cn(styles.td, styles.status, {
                  [styles.highlight]: isShared,
                })}
              >
                {front_end_status}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

UserMy.propTypes = propTypes;

export default UserMy;
