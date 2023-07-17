import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const RequestJoinMoal = ({ onSubmit, onClose }) => {
  const [messsage, setMessage] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(messsage);
    onClose();
  };

  return (
    <Modal show={true} onHide={onClose} size="lg" aria-labelledby="confirm-dialog" centered>
      <Modal.Header>
        <Modal.Title id="request-join-project-dialog">Request to join project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="request-join-project-description">
            <Form.Control
              required
              as="textarea"
              placeholder="Add messages"
              value={messsage}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="float-right">
            Send request
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

RequestJoinMoal.propTypes = propTypes;

export default RequestJoinMoal;
