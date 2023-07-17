import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.any,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func
};

const ConfirmDialog = ({ show, title, children, onSubmit, onClose }) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      aria-labelledby="confirm-dialog"
      centered
    >
      <Modal.Header>
        <Modal.Title id="confirm-dialog">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onSubmit}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}

ConfirmDialog.propTypes = propTypes;

export default ConfirmDialog;