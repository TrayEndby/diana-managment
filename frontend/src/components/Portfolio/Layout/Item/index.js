import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ListGroup from 'react-bootstrap/ListGroup';
import { Trash } from 'react-bootstrap-icons';

import ConfirmModal from '../../../../util/ConfirmDialog';

const propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const Item = ({ children, className, style, onClick, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete();
  };

  return (
    <>
      <ListGroup.Item
        action
        className={classNames('border-top d-flex App-clickable', className)}
        style={{ ...style, margin: '1rem', flexShrink: '0' }}
        onClick={onClick}
      >
        <div style={{ flex: '1 1 auto' }}>{children}</div>
        <Trash
          className="App-clickable"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDeleteConfirm(true);
          }}
        />
      </ListGroup.Item>
      {showDeleteConfirm && (
        <ConfirmModal
          show={true}
          title="Confirm delete"
          onSubmit={handleDelete}
          onClose={() => setShowDeleteConfirm(false)}
        >
          Are you sure you want to delete the item?
        </ConfirmModal>
      )}
    </>
  );
};

Item.propTypes = propTypes;

export default Item;
