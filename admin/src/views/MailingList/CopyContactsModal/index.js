import React, { useState, useEffect } from "react";
import {
  CButton,
  CSelect,
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
};

const CopyContactsModal = ({ isVisible, setVisible, contactList }) => {
  const [mailingList, setMailingList] = useState([]);
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    getMailingList();
  }, []);

  const getMailingList = async () => {
    try {
      const mailList = await MailingListService.getMailingList();
      setMailingList(mailList);
    } catch (e) {
      console.log(e);
    }
  };

  const copyMailingList = async () => {
    const copyList = contactList.map((contact) => {
      let role = 0;
      if (contact.role != null) role = contact.roleId;
      return {
        email: contact.email,
        first_name: contact.first_name,
        last_name: contact.last_name,
        role: role,
        zip_code: contact.zip_code,
        country: contact.country,
      };
    });
    try {
      const mailList = {
        id: folderName,
        member: copyList,
      };
      await MailingListService.addMailingUsers(mailList);
      console.log(mailList);
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
        <CModalTitle>Copy contacts</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>
          <div className="mt-3">Copy contacts to:</div>
          <div>
            <CSelect
              custom
              style={{ color: "#0b0b0b" }}
              value={folderName}
              placeholder="Choose..."
              onChange={(e) => setFolderName(e.target.value)}
            >
              <option value="0"> Select Mailing List...</option>
              {mailingList.map((mail) => (
                <option key={mail.name} value={mail.id}>
                  {mail.name}
                </option>
              ))}
            </CSelect>
          </div>
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
            copyMailingList();
            setVisible(false);
          }}
        >
          Save
        </CButton>{" "}
      </CModalFooter>
    </CModal>
  );
};

CopyContactsModal.prototype = propTypes;

export default CopyContactsModal;
