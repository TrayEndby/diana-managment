import React from "react";
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import PropTypes from "prop-types";

import MailingListService from "service/Admin/MailingListService";

const propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  listId: PropTypes.number,
  getMailingList: PropTypes.func,
};

const DeleteMailingListModal = ({ isVisible, setVisible, listId, getMailingList }) => {
  const deleteMailingList = async () => {
    try {
      await MailingListService.deleteMailingList(listId);
      await getMailingList();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <CModal show={isVisible} onClose={() => setVisible(false)}>
      <CModalHeader
        closeButton
        style={{ backgroundColor: "#152332", color: "white" }}
      >
        <CModalTitle>Delete mailing list</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="m-3 text-center">
          Are you sure you want to delete the mailing list?
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton
          color="dark"
          onClick={() => {
            setVisible(false);
          }}
        >
          Cancel
        </CButton>{" "}
        <CButton
          color="success"
          onClick={() => {
            deleteMailingList();
            setVisible(false);
          }}
        >
          Submit
        </CButton>{" "}
      </CModalFooter>
    </CModal>
  );
};

DeleteMailingListModal.prototype = propTypes;

export default DeleteMailingListModal;
