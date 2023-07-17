import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';

import SharedUserItem from './Item';
import AddUser from './Add';

import Loading from '../Loading';
import ErrorDialog from '../ErrorDialog';
import ConfirmDialog from '../ConfirmDialog';
import useErrorHandler from '../hooks/useErrorHandler';

const propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onFetch: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const MODAL_ID = 'sharing-modal';

const ShareItemModal = ({ show, title, placeholder, onFetch, onAdd, onDelete, onClose }) => {
  const [error, setError] = useErrorHandler();
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [list, setList] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleAddUser = async (val, userId) => {
    try {
      setError(null);
      setAdding(true);
      await onAdd(val, userId);
      fetchList();
    } catch (e) {
      console.error(e);
      setError(`Cannot add user "${val}"`);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const user = userToDelete;
      setUserToDelete(null);
      setError(null);
      await onDelete(user);
      fetchList();
    } catch (e) {
      setError(e);
    }
  };

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await onFetch();
      setList(res);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [onFetch, setError]);

  useEffect(() => {
    fetchList();
  }, [setError, fetchList]);

  return (
    <Modal show={show} onHide={onClose} size="lg" aria-labelledby={MODAL_ID} centered>
      <Modal.Header closeButton>
        <Modal.Title id={MODAL_ID}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pb-2">
        <ErrorDialog error={error} />
        <Loading show={loading} />
        {list.map((userInfo) => (
          <SharedUserItem key={userInfo.user_id} userInfo={userInfo} onDelete={setUserToDelete} />
        ))}
        <AddUser placeholder={placeholder} onAdd={handleAddUser} adding={adding} />
        <br />
      </Modal.Body>
      <ConfirmDialog
        show={userToDelete != null}
        title="Confirm"
        onSubmit={handleDeleteUser}
        onClose={() => setUserToDelete(null)}
      >
        Are you sure you want to delete the user from the sharing list?
      </ConfirmDialog>
    </Modal>
  );
};

ShareItemModal.propTypes = propTypes;

export default ShareItemModal;
