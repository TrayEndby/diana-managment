import React, { useEffect } from "react";
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
} from "@coreui/react";
import PropTypes from "prop-types";
import emailService from "service/Admin/EmailService";

const propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  templateName: PropTypes.string,
  getTemplateList: PropTypes.func,
};

const TemplateDeleteModal = ({ isVisible, setVisible, templateName, getTemplateList }) => {
  useEffect(() => {}, [templateName]);

  const deleteTemplate = async () => {
    if (templateName == null || templateName === "") return;
    await emailService.deleteEmailTemplate(templateName);
    getTemplateList();
  };

  return (
    <CModal show={isVisible} onClose={() => setVisible(false)}>
      <CModalHeader
        closeButton
        style={{ backgroundColor: "#152332", color: "white" }}
      >
        <CModalTitle>Delete Template - {templateName}</CModalTitle>
      </CModalHeader>
      <CModalBody>Do you want to delete {templateName} template?</CModalBody>
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
            deleteTemplate();
            setVisible(false);
          }}
        >
          OK
        </CButton>{" "}
      </CModalFooter>
    </CModal>
  );
};

TemplateDeleteModal.prototype = propTypes;

export default TemplateDeleteModal;
