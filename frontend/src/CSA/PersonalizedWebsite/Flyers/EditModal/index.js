import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import FlyerCard from 'CSA/Marketing/Flyer/Card';

import { getOneItemById } from '../../Videos/util';
import ModalTitle from '../../ModalTitle';

import styles from './style.module.scss';

const propTypes = {
  flyers: PropTypes.arrayOf(
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

const EditModal = ({ flyers, id, onUpdate, onClose }) => {
  const [selectedId, setSelectedId] = useState(id);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelect = (e) => {
    const id_num = Number(e.target.value);
    setSelectedId(id_num);
    setSelectedItem(null);
    // a hack way to force update video
    setTimeout(() => {
      setSelectedItem(getOneItemById(id_num, flyers));
    }, 10);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(selectedId);
  };

  useEffect(() => {
    setSelectedId(id);
    setSelectedItem(getOneItemById(id, flyers));
  }, [id, flyers]);

  return (
    <Modal show={true} onHide={onClose} size="lg" aria-labelledby={ID} centered className="App-modal">
      <Modal.Header closeButton>
        <ModalTitle
          title="Customize Flyer"
          hint="Choose a flyer you want the customers to see on your personal website"
        />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Label>Flyer</Form.Label>
          <Form.Control required as="select" value={selectedId} onChange={handleSelect}>
            <option value="">Select a flyer</option>
            {flyers.map(({ id, title }) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </Form.Control>
          {selectedItem != null && <FlyerCard className={styles.flyer} flyer={selectedItem} noShare />}
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
