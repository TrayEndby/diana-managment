import React, { useState, useEffect } from "react";
import {
  CInput,
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
  mailList: PropTypes.object,
};

const RenameMailingListModal = ({ isVisible, setVisible, mailList }) => {
  const [mailingListName, setMailingListName] = useState(mailList.name);

  useEffect(() => {
    setMailingListName(mailList.name);
  }, [mailList]);

  const renameMailingList = async () => {
    const updateList = mailList;
    updateList.name = mailingListName;
    await MailingListService.updateMailingList(updateList);
  };

  return (
    <CModal show={isVisible} onClose={() => setVisible(false)} size="sm">
      <CModalHeader
        closeButton
        style={{ backgroundColor: "#152332", color: "white" }}
      >
        <CModalTitle>Rename Mailing List</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="m-3">
          <CInput
            required={false}
            type="text"
            value={mailingListName}
            onChange={(e) => setMailingListName(e.target.value)}
          />
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
            renameMailingList();
            setVisible(false);
          }}
        >
          Rename
        </CButton>{" "}
      </CModalFooter>
    </CModal>
  );
};

RenameMailingListModal.prototype = propTypes;

export default RenameMailingListModal;
