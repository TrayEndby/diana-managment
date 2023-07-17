import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { utcToLocal } from '../../../../util/helpers';
import CloseButton from '../../../../util/CloseButton';
import styles from './style.module.scss';

const propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string,
    user_id: PropTypes.string,
    user_name: PropTypes.string,
    text: PropTypes.string,
    time: PropTypes.string,
  }),
  editable: PropTypes.string,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

const CommentCard = ({ comment, editable, selected, onClick, onDelete, onSubmit, onCancel }) => {
  // const { id, user_id, user_name, text, time } = comment;
  const { id, user_name, text, time } = comment;
  const [val, setVal] = useState('');

  useEffect(() => {
    setVal(text);
  }, [text]);

  return (
    <Card
      className={cn(styles.card, {
        [styles.selected]: selected,
      })}
      onClick={onClick ? () => onClick(comment) : null}
    >
      <div className={styles.top}>
        {/* <div className={styles.picture}>
          <Picture id={user_id} />
        </div> */}
        <div className={styles.title}>
          <div className={styles.name}>{user_name}</div>
          <div className={styles.time}>{utcToLocal(time)}</div>
        </div>
        {!editable && (
          <CloseButton
            className={styles.close}
            dark
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
          />
        )}
      </div>
      <div className={styles.content}>
        {editable ? (
          <Form.Control value={val} placeholder="Add comment" onChange={(e) => setVal(e.target.value)} />
        ) : (
          text
        )}
      </div>
      {editable && (
        <div className={styles.bottom}>
          <Button disabled={val === ''} onClick={() => onSubmit(val)}>
            Comment
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}
    </Card>
  );
};

CommentCard.propTypes = propTypes;

export default CommentCard;
