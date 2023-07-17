import React from 'react';
import PropTypes from 'prop-types';

import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from "@coreui/react";

const propTypes = {
  action: PropTypes.any,
};

const ConfirmDialog = ({action}) => {
  return (
    <CModal
      show={action.show}
      onClose={action.onClose}
      size="lg"
      centered
    >
      <CModalHeader>
        {action.title}
      </CModalHeader>
      <CModalBody>
        {action.message}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={action.onClose}>
          Cancel
        </CButton>
        <CButton color="success" onClick={() => {
          action.onSubmit();
          action.onClose();
        }}>Confirm</CButton>
      </CModalFooter>
    </CModal>
  );
}

ConfirmDialog.propTypes = propTypes;

export default ConfirmDialog;
