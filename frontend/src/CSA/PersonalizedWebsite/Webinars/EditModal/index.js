import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import WebinarCard from 'util/Webinar/Card';

import { getOneItemById } from '../../Videos/util';
import ModalTitle from '../../ModalTitle';

import styles from './style.module.scss';

const propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  id: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const ID = 'edit-flyer-modal';

const EditModal = ({ items, id, onUpdate, onClose }) => {
  const [selectedId, setSelectedId] = useState(id);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelect = (e) => {
    const id_num = Number(e.target.value);
    setSelectedId(id_num);
    setSelectedItem(getOneItemById(id_num, items));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(selectedId);
  };

  useEffect(() => {
    setSelectedId(id);
    setSelectedItem(getOneItemById(id, items));
  }, [id, items]);

  return (
    <Modal show={true} onHide={onClose} size="lg" aria-labelledby={ID} centered className="App-modal">
      <Modal.Header closeButton>
        <ModalTitle
          title="Customize Webinar"
          hint="Choose a webinar you want the customers to see on your personal website"
        />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Label>Webinar</Form.Label>
          <Form.Control required as="select" value={selectedId} onChange={handleSelect}>
            <option value="">Select a webinar</option>
            {items.map(({ id, title }) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </Form.Control>
          {selectedItem != null && <WebinarCard className={styles.webinar} item={selectedItem} noShare />}
          <div className="d-flex flex-row mt-2">
            <Button variant="danger" className="ml-auto" onClick={() => onUpdate(null)} disabled={id == null}>
              Remove
            </Button>
            <Button type="submit" className="ml-3">
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
