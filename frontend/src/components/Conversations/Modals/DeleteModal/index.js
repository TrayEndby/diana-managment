import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const DeleteModal = ({ title, text, show, onClose, onSubmit }) => (
  <Modal className="App-modal" show={show} onHide={onClose} size="lg" aria-labelledby="calendar-modal" centered>
    <Modal.Header closeButton>
      <Modal.Title id="add-group-modal">{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <span>{text}</span>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>Close</Button>
      <Button variant="primary" onClick={onSubmit}>Submit</Button>
    </Modal.Footer>
  </Modal>
)

export default DeleteModal;