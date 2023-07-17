import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';

const propTypes = {
  title: PropTypes.string.isRequired,
  hint: PropTypes.string.isRequired,
};

const ModalTitle = ({ title, hint }) => {
  return (
    <Modal.Title className="mx-0">
      <div>{title}</div>
      <div style={{ fontSize: '18px', opacity: 0.8 }}>{hint}</div>
    </Modal.Title>
  );
};

ModalTitle.propTypes = propTypes;

export default ModalTitle;
