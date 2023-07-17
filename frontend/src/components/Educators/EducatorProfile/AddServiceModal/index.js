import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import style from './style.module.scss';
const MODAL_ID = 'add-educator-service-modal';

const AddServiceModal = ({ servicesList, show, serviceCategoryList, onClose, onSubmit }) => {
  const [invalid, setInvalid] = useState(false);
  const [serviceToAdd, setServiceToAdd] = useState({ name: '', type: null, years_experience: '', hourly_rate: '' });
  const [validated, setValidated] = useState(false);

  const handleChange = (event) => {
    let { name, value } = event.target;
    if (name !== 'name') {
      value = +value;
    }
    const updateField = { [name]: value }
    setServiceToAdd({ ...serviceToAdd, ...updateField })
  }

  const handleAddService = (event) => {
    if (!serviceToAdd.type) {
      serviceToAdd.type = serviceCategoryList[0]?.id
    }

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      if (!checkForDuplicates(servicesList)) {
        onSubmit(serviceToAdd);
        onClose();
        setServiceToAdd({});
        setInvalid(false);
      } else {
        setInvalid(true);
      }
    }
  }

  const checkForDuplicates = (list) => {
    let hasDuplicates = false;
    if (!list) return hasDuplicates;
    const sameTypeList = list.filter((item) => item.type === serviceToAdd.type);
    const res = sameTypeList.find((x) => x.name === serviceToAdd.name);
    if (res) {
      hasDuplicates = true
    }
    return hasDuplicates;
  }

  return (
    <Modal show={show} onHide={onClose} size="lg" aria-labelledby={MODAL_ID} centered>
      <Modal.Header closeButton>
        <Modal.Title id={MODAL_ID}>Add service</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleAddService}>
        <Modal.Body>
          <div className={style.container}>
            <Form.Group>
              <Form.Label>Service category</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={serviceToAdd.serviceCategory || undefined}
                onChange={handleChange}
              >
                {serviceCategoryList?.map(({ id, name }, i) => (
                  <option key={i} value={id}>{name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Service name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter service name"
                value={serviceToAdd.name || ''}
                required
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Hourly rate ($)</Form.Label>
              <Form.Control
                type="text"
                name="hourly_rate"
                placeholder="Enter hourly rate"
                value={serviceToAdd.hourly_rate || ''}
                required
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Years of experience</Form.Label>
              <Form.Control
                type="text"
                name="years_experience"
                placeholder="Enter years of experience"
                value={serviceToAdd.years_experience || ''}
                required
                onChange={handleChange}
              />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {invalid && <p className="text-danger">Service with such category and name already exists, try another one</p>}
          <Button variant="primary" type="submit">
            Add service
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}


export default AddServiceModal;