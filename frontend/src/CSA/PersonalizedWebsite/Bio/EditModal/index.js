import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import ModalTitle from '../../ModalTitle';

const propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const ID = 'edit-about-modal';

const EditModal = ({ title, content, onUpdate, onClose }) => {
  const [data, setData] = useState({
    title,
    content,
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(data.title, data.content);
  };

  return (
    <Modal show={true} onHide={onClose} size="lg" aria-labelledby={ID} centered className="App-modal">
      <Modal.Header closeButton>
        <ModalTitle
          title="Customize About Me"
          hint="Add a description about yourself you want the customers to read on your personal website"
        />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control required name="title" value={data.title || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control required as="textarea" name="content" value={data.content || ''} onChange={handleChange} />
          </Form.Group>
          <div className="d-flex flex-row mt-2">
            <Button type="submit" className="ml-auto">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

EditModal.propTypes = propTypes;

export default EditModal;
