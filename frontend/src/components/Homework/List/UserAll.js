import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import NoItem from './NoItem';

import { Actions, Status } from '../enums';
import { utcToLocal } from 'util/helpers';

import { hasSelected } from '../util';

import styles from './style.module.scss';

const propTypes = {
  items: PropTypes.array.isRequired,
  onAction: PropTypes.func.isRequired,
};

const UserAll = ({ items, onAction }) => {
  return (
    <>
      <div className={styles.header}>
        <Button onClick={() => onAction(Actions.copy)} disabled={!hasSelected(items)}>
          Copy to my homework
        </Button>
      </div>
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
            const { id, title, updated_ts, user_name, selected, front_end_status } = item;
            const isCopied = front_end_status === Status.USER_COPIED;
            return (
              <div
                key={index}
                className={cn(styles.tr, {
                  [styles.selected]: selected,
                })}
              >
                <div className={cn(styles.td, styles.name, 'App-textOverflow')}>
                  <Form.Check
                    type="checkbox"
                    checked={selected}
                    className={cn({ 'App-invisible': isCopied })}
                    onChange={() => {
                      onAction(Actions.toggleCheck, id);
                    }}
                  />
                  <span className="App-clickable" onClick={() => onAction(Actions.select, id)}>
                    {title}
                  </span>
                </div>
                <div className={cn(styles.td, styles.owner)}>{user_name}</div>
                <div className={cn(styles.td, styles.date)}>{utcToLocal(updated_ts)}</div>
                <div
                  className={cn(styles.td, styles.status, {
                    [styles.highlight]: isCopied,
                  })}
                >
                  {front_end_status}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
};

UserAll.propTypes = propTypes;

export default UserAll;
