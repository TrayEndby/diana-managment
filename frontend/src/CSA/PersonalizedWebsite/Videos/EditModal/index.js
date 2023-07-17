import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import ModalTitle from '../../ModalTitle';

const propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  id: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const ID = 'edit-video-modal';

const EditVideoModal = ({ videos, id, onUpdate, onClose }) => {
  const [selectedId, setSelectedId] = useState(id);

  const handleSelect = (e) => {
    const id_num = Number(e.target.value);
    setSelectedId(id_num);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(selectedId);
  };

  useEffect(() => {
    setSelectedId(id);
  }, [id]);

  return (
    <Modal show={true} onHide={onClose} size="lg" aria-labelledby={ID} centered className="App-modal">
      <Modal.Header closeButton>
        <ModalTitle
          title="Customize Video"
          hint="Choose a video you want the customers to see on your personal website"
        />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Label>Video</Form.Label>
          <Form.Control required as="select" value={selectedId} onChange={handleSelect}>
            <option value="">Select a video</option>
            {videos.map(({ id, title }) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </Form.Control>
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

EditVideoModal.propTypes = propTypes;

export default EditVideoModal;
