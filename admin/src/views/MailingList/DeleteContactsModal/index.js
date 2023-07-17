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
  contactList: PropTypes.array,
  getContactsList: PropTypes.func,
};

const DeleteContactsModal = ({
  isVisible,
  setVisible,
  contactList,
  getContactsList,
}) => {
  const deleteContacts = async () => {
    if (contactList.length === 0) return;
    const deleteList = contactList.map((contact) => ({
      email:contact.email, first_name:contact.first_name, last_name:contact.last_name
    }));
    try {
      const mailList = {
        id: contactList[0].id,
        member: deleteList,
      };
      console.log(mailList);
      await MailingListService.deleteMailingUsers(mailList);
      await getContactsList();
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
        <CModalTitle>Delete contacts</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="m-3 text-center">
          Are you sure you want to delete the selected contacts?
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
            deleteContacts();
            setVisible(false);
          }}
        >
          Submit
        </CButton>{" "}
      </CModalFooter>
    </CModal>
  );
};

DeleteContactsModal.prototype = propTypes;

export default DeleteContactsModal;
