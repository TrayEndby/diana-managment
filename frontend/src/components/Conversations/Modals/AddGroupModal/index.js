import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import useErrorHandler from 'util/hooks/useErrorHandler';
import ErrorDialog from 'util/ErrorDialog';
import groupService from 'service/GroupService';

const propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

const AddGroupModal = ({ show, onClose, onSubmit, isPublic, onCreateGroup }) => {
  const [data, setData] = useState({});
  const [error, setError] = useErrorHandler();
  const [saving, setSaving] = useState(false);
  const { name, description } = data;

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await groupService.create(
        {
          name,
          description,
          status: isPublic ? 1 : 0,
        },
        true,
      );
      setSaving(false);
      onCreateGroup(name, isPublic);
      onSubmit(name, isPublic);
      onClose(true);
    } catch (e) {
      setSaving(false);
      setError(e);
    }
  };

  return (
    <Modal className="App-modal" show={show} onHide={onClose} size="lg" aria-labelledby="calendar-modal" centered>
      <Modal.Header closeButton>
        <Modal.Title id="add-group-modal">Add group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ErrorDialog error={error} />
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Name:</Form.Label>
            <Form.Control required placeholder="Add name" name="name" value={name || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description:</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Add description"
              name="description"
              value={description || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit" className="float-right" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

AddGroupModal.propTypes = propTypes;

export default AddGroupModal;
