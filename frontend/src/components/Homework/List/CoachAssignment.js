import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Trash } from 'react-bootstrap-icons';

import NoItem from './NoItem';
import Tooltip from 'util/Tooltip';

import { Actions, Status } from '../enums';
import { utcToLocal } from 'util/helpers';
import authService from 'service/AuthService';

import { hasSelected } from '../util';

import styles from './style.module.scss';

const propTypes = {
  items: PropTypes.array.isRequired,
  onAction: PropTypes.func.isRequired,
};

const CoachAssignment = ({ items, onAction }) => {
  const authId = authService.getUID();

  return (
    <>
      <div className={styles.header}>
        <Button onClick={() => onAction(Actions.new)}>Create new homework</Button>
        <Button onClick={() => onAction(Actions.publish)} disabled={!hasSelected(items)}>
          Publish
        </Button>
      </div>
      <Card className={cn(styles.list, styles.coach_assignment)}>
        <div className={styles.tHead}>
          <div className={styles.tr}>
            <div className={cn(styles.td, styles.name)}>Name</div>
            <div className={cn(styles.td, styles.owner)}>Owner</div>
            <div className={cn(styles.td, styles.date)}>Last modified</div>
            <div className={cn(styles.td, styles.status)}>Status</div>
            <div className={cn(styles.td, styles.action)}></div>
          </div>
        </div>
        <div className={styles.tbody}>
          {!items.length && <NoItem />}
          {items.map((item, index) => {
            const { id, title, updated_ts, user_name, user_id, selected, front_end_status } = item;
            const isPublished = front_end_status === Status.COACH_PUBLISHED;
            const isOwner = authId === user_id;
            return (
              <div
                key={index}
                className={cn(styles.tr, {
                  [styles.selected]: selected,
                })}
              >
                <div className={cn(styles.td, styles.name, 'App-textOverflow')}>
                  {isOwner ? (
                    <Form.Check
                      type="checkbox"
                      checked={selected}
                      className={cn({ 'App-invisible': isPublished })}
                      onChange={() => {
                        onAction(Actions.toggleCheck, id);
                      }}
                    />
                  ) : (
                    <Tooltip title="Cannot select other instructors' homework">
                      <Form.Check
                        type="checkbox"
                        checked={false}
                        readOnly={true}
                        className={cn({ 'App-invisible': isPublished }, styles.disabled)}
                      />
                    </Tooltip>
                  )}
                  <span className="App-clickable" onClick={() => onAction(Actions.select, id)}>
                    {title}
                  </span>
                </div>
                <div className={cn(styles.td, styles.owner)}>{isOwner ? 'me' : user_name}</div>
                <div className={cn(styles.td, styles.date)}>{utcToLocal(updated_ts)}</div>
                <div className={cn(styles.td, styles.status, {
                  [styles.highlight]: isPublished
                })}>{front_end_status}</div>
                <div className={cn(styles.td, styles.action)}>
                  {isPublished && isOwner && (
                    <span
                      className={cn('App-clickable', styles.underline)}
                      onClick={() => onAction(Actions.unpublish, id)}
                    >
                      Unpublish
                    </span>
                  )}
                  {isOwner && (
                    <Trash
                      className="App-clickable"
                      onClick={(e) => {
                        onAction(Actions.delete, id);
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
};

CoachAssignment.propTypes = propTypes;

export default CoachAssignment;
