import React, { useState, useEffect } from "react";
import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle
} from "@coreui/react";

import PropTypes from "prop-types";
import emailService from "service/Admin/EmailService";
import authService from "service/AuthService";
import * as ADMIN_ROUTES from "routes";
import { useHistory } from "react-router-dom";

const propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  templateName: PropTypes.string,
  showDelete: PropTypes.func,
};

const TemplatePreviewModal = ({ isVisible, setVisible, templateName, showDelete }) => {
  const [detailTemplate, setDetailTemplate] = useState(null);
  const [isTemplateCreator, setIsTemplateCreator] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const getTemplateDetail = async () => {
      if (templateName == null || templateName === "") return;
      const template = await emailService.getEmailTemplate(templateName);
      setDetailTemplate(template);
      setIsTemplateCreator(template && template[0].creator_id === authService.uid);
    };
    getTemplateDetail();
  }, [templateName]);

  return (
    <CModal show={isVisible} onClose={() => setVisible(false)} size={"xl"}>
      <CModalHeader
        closeButton
        style={{ backgroundColor: "#152332", color: "white" }}
      >
        <CModalTitle
          className="w-100"
          style={{ textAlign: "center !important" }}
        >
          Template Preview
        </CModalTitle>
        {isTemplateCreator && (
            <CButton
              color="success"
              className="float-right mr-3"
              onClick={() => {
                setVisible(false);
                showDelete(true);
              }}
            >
              Delete
            </CButton>
        )}
        <CButton
          color="success"
          className="float-right mr-3"
          onClick={() => history.push(
            ADMIN_ROUTES.EMAIL_UPDATE_TEMPLATE + "/" + templateName
          )}
        >
          Edit
        </CButton>
        <CButton
          color="success"
          className="float-right"
          onClick={() => history.push(
            ADMIN_ROUTES.EMAIL_CREATE + "/" + templateName
          )}
        >
          Email
        </CButton>
      </CModalHeader>
      <CModalBody>
        {detailTemplate != null && (
          <div>
            <div>
              <b>Subject:</b> {detailTemplate[0].subject}
            </div>
            <hr/>
            <div
              dangerouslySetInnerHTML={{ __html: detailTemplate[0].template }}
            ></div>
            <div
              className="text-center pt-3"
              style={{ fontSize: "20px", color: "#0b0b0b" }}
            >
              {templateName}
            </div>
            <div className="text-center pt-1 pb-3" style={{ fontSize: "18px" }}>
              {detailTemplate[0].description}
            </div>
          </div>
        )}
      </CModalBody>
    </CModal>
  );
};

TemplatePreviewModal.prototype = propTypes;

export default TemplatePreviewModal;
