import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import ModalTitle from '../../ModalTitle';
import PhoneInput from 'util/PhoneInput/old';

const propTypes = {
  phone: PropTypes.string,
  email: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const ID = 'edit-contact-modal';

const EditModal = ({ phone, email, onUpdate, onClose }) => {
  const [data, setData] = useState({
    phone,
    email,
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(data.phone, data.email);
  };

  return (
    <Modal show={true} onHide={onClose} size="lg" aria-labelledby={ID} centered className="App-modal">
      <Modal.Header closeButton>
        <ModalTitle
          title="Customize Contact Me"
          hint="Add email/phone number where you want customers to contact you"
        />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <PhoneInput required name="phone"  value={data.phone || ''} onChange={handleChange} />
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control required name="email" type="email" value={data.email || ''} onChange={handleChange} />
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
