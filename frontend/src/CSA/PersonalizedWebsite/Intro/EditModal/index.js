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

const ID = 'edit-intro-modal';

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
          title="Customize Text Overlay"
          hint="Add heading and content you want the customers to see on your personal website"
        />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Heading</Form.Label>
            <Form.Control required name="title" value={data.title || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Content</Form.Label>
            <Form.Control required name="content" value={data.content || ''} onChange={handleChange} />
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
