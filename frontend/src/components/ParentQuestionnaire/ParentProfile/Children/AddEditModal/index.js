import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import style from './style.module.scss';
const MODAL_ID = 'add-child-modal';

const AddEditModal = ({ selectedChild, list, show, onClose, onSubmit, onDelete }) => {
  const [itemToAdd, setItemToAdd] = useState({ name: '', email: '' });

  React.useEffect(() => {
    if (selectedChild !== null) {
      setItemToAdd(list[selectedChild])
    }
  }, [selectedChild, list])

  const handleChange = (event) => {
    let { name, value } = event.target;
    const updateField = { [name]: value }
    setItemToAdd({ ...itemToAdd, ...updateField })
  }

  const handleAddChild = () => {
    onSubmit([itemToAdd]);
    onClose();
    setItemToAdd({});
  }

  const handleDeleteChild = () => {
    onDelete([itemToAdd]);
    onClose();
    setItemToAdd({});
  }

  return (
    <Modal show={show} onHide={onClose} size="lg" aria-labelledby={MODAL_ID} centered>
      <Modal.Header closeButton>
        <Modal.Title id={MODAL_ID}>Add or Edit information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={style.container}>
          <Form.Group>
            <Form.Label>Child name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter child name"
              value={itemToAdd.name || ''}
              required
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              name="email"
              placeholder="Enter child email"
              value={itemToAdd.email || ''}
              required
              onChange={handleChange}
            />
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {!isNaN(selectedChild) && (
          <Button className="btn-tertiary-dark mr-auto" onClick={handleDeleteChild}>
            Delete
          </Button>
        )}
        <Button variant="primary" onClick={handleAddChild}>
          Add child
        </Button>
      </Modal.Footer>
    </Modal>
  )
}


export default AddEditModal;