import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import paymentService from 'service/PaymentService';
import cn from 'classnames';
import { CheckCircle } from 'react-bootstrap-icons';
import style from './style.module.scss';
const MODAL_ID = 'add-child-modal';

const AddEditModal = ({ code, name, show, onClose, onSubmit }) => {
  const [itemToAdd, setItemToAdd] = useState({ code, name });
  const [promoCodeStatus, setPromoCodeStatus] = useState();

  useEffect(() => {
    setItemToAdd({ code, name })
  }, [code, name])

  const handleChange = (event) => {
    let { name, value } = event.target;
    const updateField = { [name]: value }
    setItemToAdd({ ...itemToAdd, ...updateField })
  }

  const handleCheckPromo = async () => {
    try {
      const { code } = itemToAdd;
      const response = await paymentService.checkPromoCode(code);
      const hasData = !!response && !!Object.entries(response).length;
      if (hasData && response?.is_csa) {
        setItemToAdd({ code, name: response?.csa_name });
        setPromoCodeStatus({ status: true, msg: 'Valid CSA ID' });
      } else {
        setPromoCodeStatus({ status: false, msg: 'Invalid CSA ID' });
      }
    } catch (error) {
      setPromoCodeStatus({ status: false, msg: 'Invalid CSA ID' });
    }
  }

  const handleClose = () => {
    onClose();
  }

  const handleAdd = () => {
    onSubmit(itemToAdd);
    onClose();
    setItemToAdd({});
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" aria-labelledby={MODAL_ID} centered>
      <Modal.Header closeButton>
        <Modal.Title id={MODAL_ID}>Add or Edit information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={style.container}>
          <Form.Group>
            <Form.Label>CSA ID</Form.Label>
            <div className={style.promoContainer}>
              <div className={style.formGroup}>
                <Form.Control
                  type="text"
                  name="code"
                  placeholder="Enter promo code"
                  value={itemToAdd.code || ''}
                  required
                  onChange={handleChange}
                  className={style.csaIdInput}
                />
                <Button onClick={handleCheckPromo} className={cn(style.verifyBtn, { 'disabled': !itemToAdd?.code })}>Verify</Button>
              </div>
              <p className={cn(style.promoCodeStatus, promoCodeStatus?.status ? style.success : style.error)}>
                {promoCodeStatus?.status && <CheckCircle />}{promoCodeStatus?.msg}
              </p>
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>CSA name</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={itemToAdd.name || ''}
              disabled
            />
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleAdd}
          className={cn({ 'disabled': !promoCodeStatus?.status })}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  )
}


export default AddEditModal;