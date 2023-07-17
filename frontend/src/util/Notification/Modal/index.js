import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Content from '../Content';

const propTypes = {
  messages: PropTypes.object,
  onClose: PropTypes.func,
};

const ID = 'notification-modal';

const NotificationModal = ({ messages, onClose }) => {
  return (
    <Modal show={true} onHide={onClose} size="lg" aria-labelledby={ID} centered>
      <Modal.Header closeButton>
        <Modal.Title id={ID}>Notifications</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Content messages={messages} />
      </Modal.Body>
    </Modal>
  );
};

NotificationModal.propTypes = propTypes;

export default NotificationModal;
