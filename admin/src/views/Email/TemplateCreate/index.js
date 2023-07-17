import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CInput,
  CButton,
  CTextarea,
} from "@coreui/react";

import TheLayout from "containers/TheLayout";
import emailService from "service/Admin/EmailService";
import * as ADMIN_ROUTES from "routes";
import TestEmailModal from "./TestEmailModal";
import { useHistory } from "react-router-dom";
import "react-quill-2/dist/quill.snow.css";
import styles from "../style.module.scss";
import HtmlEditor from "views/ContentManagement/Events/HtmlEditor";

const TemplateCreatePage = () => {
  const [testModal, showTestModal] = useState(false);
  const [templateName, setTemplateName] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const descRef = useRef(null);
  const subjectRef = useRef(null);
  const nameRef = useRef(null);
  const history = useHistory();

  const getTemplateDetail = useCallback(async () => {
    const pathName = history.location.pathname.substr(17);
    if (pathName == null || pathName === "") return;
    setTemplateName(pathName);
    const template = await emailService.getEmailTemplate(pathName);
    nameRef.current.value = pathName;
    descRef.current.value = template[0].description || "";
    subjectRef.current.value = template[0].subject || "";
    setEditorContent(template[0].template);
  }, [history.location.pathname])

  useEffect(() => {
    getTemplateDetail();
  }, [getTemplateDetail]);

  const getCleanTemplateHTML = () => {
    return editorContent;
  };

  const handleEditorChange = (content, editor) => {
    setEditorContent(content);
  };

  const handleSaveTemplate = async () => {
    const templateContent = getCleanTemplateHTML();
    const templateDesc = descRef.current.value;
    const templateSubject = subjectRef.current.value;
    const templateTitle = nameRef.current.value;
    const template = {
      name: templateTitle,
      desc: templateDesc,
      subject: templateSubject,
      template: templateContent,
    };
    if (templateName == null || templateName === "") {
      await emailService.addEmailTemplate(template);
    } else {
      await emailService.updateEmailTemplate(template);
    }
    history.push(ADMIN_ROUTES.EMAIL_TEMPLATE);
  };

  const sendTestEmail = async (members) => {
    const templateSubject = subjectRef.current.value;
    const sendingEmail = {
      member: members.map((x) => ({
        first_name: "FirstName",
        last_name: "LastName",
        email: x,
      })),
      template_params: {
        json: JSON.stringify({
          subject: templateSubject,
          template: '<html><body>' + editorContent + '</body></html>'
        }),
        from_name: "Kyros",
      },
    };
    await emailService.sendOneEmail(sendingEmail);
  };

  return (
    <TheLayout title={templateName == null ? "Create Template" : "Edit Template"}>
      <CCard>
        <CCardHeader className={styles.mainCardHeader}>
          <CButton
            color="success"
            className="float-right"
            onClick={handleSaveTemplate}
          >
            Save
          </CButton>
          <CButton
            color="success"
            className="float-right mr-3"
            onClick={() => showTestModal(true)}
          >
            Send test email
          </CButton>
        </CCardHeader>
        <CCardBody>
          <div
            className={styles.allTemplate}
            onClick={() => history.push(ADMIN_ROUTES.EMAIL_TEMPLATE)}
          >
            &lt; All templates
          </div>
          <div
            className="mt-5 w-100 px-5"
            style={{ height: "calc(100vh - 250px)" }}
          >
            <div className="d-flex">
              <div className="text-right pr-3" style={{ width: "10%" }}>
                Name
              </div>
              <CInput innerRef={nameRef} />
            </div>
            <div className="d-flex mt-3">
              <div className="text-right pr-3" style={{ width: "10%" }}>
                Description
              </div>
              <CTextarea innerRef={descRef} />
            </div>
            <div className="d-flex mt-3">
              <div className="text-right pr-3" style={{ width: "10%" }}>
                Subject
              </div>
              <CTextarea innerRef={subjectRef} />
            </div>
            <div className="d-flex mt-3 h-100">
              <div className="text-right pr-3" style={{ width: "10%" }}>
                Body Content
              </div>
              <div style={{ width: "100%", height: "calc(100% - 170px)" }}>
                <HtmlEditor value={editorContent} editorChange={handleEditorChange} />
              </div>
            </div>
          </div>
        </CCardBody>
      </CCard>
      <TestEmailModal
        isVisible={testModal}
        setVisible={showTestModal}
        sendTestEmail={sendTestEmail}
      />
    </TheLayout>
  );
};

export default TemplateCreatePage;
