import React, { useState, useEffect } from "react";
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CInput,
} from "@coreui/react";

import PropTypes from "prop-types";
import styles from "../../style.module.scss";
import authService from "service/AuthService";

const propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  sendTestEmail: PropTypes.func,
};

const NewContactModal = ({ isVisible, setVisible, sendTestEmail }) => {
  const [emailList, setEmailList] = useState(
    [authService.getEmail()]);

  useEffect(() => {}, []);

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      setEmailList(emailList.concat([e.target.value]));
      e.target.value = "";
    }
  };

  const handleRemoveTags = (email) => {
    setEmailList(emailList.filter((x) => x !== email));
  };

  return (
    <CModal show={isVisible} onClose={() => setVisible(false)}>
      <CModalHeader
        closeButton
        style={{ backgroundColor: "#152332", color: "white" }}
      >
        <CModalTitle>Send test email</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>Send a test email version to yourself or a coworker</div>
        <div className="font-weight-bold mt-2">
          Type one or more email addresses in the text field below
        </div>
        <CInput className="mt-1" onKeyUp={handleKeyUp} />
        <div className={styles.contactTagList}>
          {emailList.map((email) => (
            <div key={email} className={styles.contactTag}>
              <div className="d-flex">
                <div>{email}</div>
                <div
                  className="ml-4"
                  style={{ marginTop: "-3px", cursor: "pointer" }}
                  onClick={() => handleRemoveTags(email)}
                >
                  x
                </div>
              </div>
            </div>
          ))}
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
            sendTestEmail(emailList);
            setVisible(false);
          }}
        >
          Send
        </CButton>{" "}
      </CModalFooter>
    </CModal>
  );
};

NewContactModal.prototype = propTypes;

export default NewContactModal;
