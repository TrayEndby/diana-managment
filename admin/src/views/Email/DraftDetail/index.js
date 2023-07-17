import React, { useEffect, useState, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CInput,
  CSelect,
} from "@coreui/react";

import TheLayout from "containers/TheLayout";
import EmailService from "service/Admin/EmailService";
import MailingListService from "service/Admin/MailingListService";
import AuthService from "service/AuthService";
import ReactQuill, { Quill } from "react-quill-2";
import * as ADMIN_ROUTES from "routes";
import "react-quill-2/dist/quill.snow.css";
import styles from "../style.module.scss";
import { useHistory } from "react-router-dom";

const EmailDraftDetailPage = () => {
  const history = useHistory();

  const [mailList, setMailList] = useState([]);
  const [contactTags, setContactTags] = useState([]);
  const [scheduleMode, setScheduleMode] = useState("1");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const quillRef = useRef(null);
  const subjectRef = useRef(null);
  const editor = useRef(null);
  const emailAddr = useRef(null);
  const [templateList, setTemplateList] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState("0");

  useEffect(() => {
    getTemplateList();
    getMailingList();
  }, []);

  const getTemplateList = async () => {
    const templates = await EmailService.getEmailTemplateList();
    setTemplateList(templates);
  };

  const getMailingList = async () => {
    try {
      const mailingList = await MailingListService.getMailingList();
      const tagsList = [];
      const tagNameList = [];
      mailingList.forEach((mail) => {
        const filterTag = tagsList.filter((tags) => tags[0].tags === mail.tags);
        if (filterTag.length === 0) {
          tagsList.push([
            {
              tags: mail.tags,
              name: mail.name,
              id: mail.id,
              creator_id: mail.creator_id,
              creator_name: mail.creator_name,
            },
          ]);
          tagNameList.push(mail.tags);
        } else {
          filterTag[0].push({
            tags: mail.tags,
            name: mail.name,
            id: mail.id,
            creator_id: mail.creator_id,
            creator_name: mail.creator_name,
          });
        }
      });
      setMailList(mailingList);
    } catch (e) {
      console.log(e);
    }
  };

  const modules = {
    toolbar: {
      container: [
        [
          { size: ["small", false, "large", "huge"] },
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
          { align: [] },
          { color: [] },
          { background: [] },
          "link",
          "image",
        ],
      ],
    },
    keyboard: {
      bindings: {
        custom: {
          shiftKey: false,
          handler: () => {
            return false;
          },
        },
      },
    },
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
  ];

  Quill.register(Quill.import("attributors/style/direction"), true);
  Quill.register(Quill.import("attributors/style/align"), true);

  useEffect(() => {}, []);

  const handleRemoveTags = (contact) => {
    setContactTags(contactTags.filter((tag) => tag[0] !== contact));
  };

  const handleTemplateChange = async (template) => {
    setCurrentTemplate(template);
    const templateEmail = await EmailService.getEmailTemplate(template);
    if (templateEmail.length === 0) return;
    const quillEditor = quillRef.current.getEditor();
    quillRef.current.setEditorContents(quillEditor, templateEmail[0].template);
  };

  const handleSendEmail = () => {
    if (contactTags.length === 0) {
      alert("Select mailing list");
      return;
    }
    const userName = AuthService.getDisplayName();
    const content = quillRef.current.getEditorContents();
    const subject = subjectRef.current.value;
    contactTags.forEach((contact) => {
      let thisMail = mailList.filter((mail) => mail.name === contact[0]);
      const sendEmail = {
        name: currentTemplate,
        from_name: userName,
        subject: subject,
        json: content,
      };

      if (contact[1] === "contact") {
        if (thisMail.length !== 0) {
          sendEmail.contacts = { id: thisMail[0].id };
        }
      } else {
        sendEmail.contacts = {
          member: [{ email: contact[0], first_name: "", last_name: "" }],
        };
      }
      EmailService.sendEmail(sendEmail);
    });
  };

  const handleEmailAddressKeyUp = async (e) => {
    if (e.keyCode === 13) {
      const email = emailAddr.current.value;
      if (
        contactTags.filter((tags) => tags[0] === email && tags[1] === "email")
          .length !== 0
      )
        return;
      const oneTag = [];
      oneTag[0] = email;
      oneTag[1] = "email";
      setContactTags(contactTags.concat([oneTag]));
      emailAddr.current.value = "";
    }
  };

  const handleContactTags = (contact) => {
    if (
      contactTags.filter((tag) => tag.name === contact).length !== 0 ||
      contact === "0"
    )
      return;
    let contactName = mailList.filter((mail) => mail.id === parseInt(contact));
    if (contactName.length === 0) contactName = "";
    else contactName = contactName[0].name;
    const oneTag = [];
    oneTag[0] = contactName;
    oneTag[1] = "contact";
    setContactTags(contactTags.concat([oneTag]));
  };

  return (
    <TheLayout title="Draft">
      <CCard className="">
        <CCardHeader className={styles.mainCardHeader}>
        </CCardHeader>
        <CCardBody>
          <div
            className="h5 mb-4"
            style={{ cursor: "pointer" }}
            onClick={() => history.push(ADMIN_ROUTES.EMAIL_DRAFT)}
          >
            &lt; Back to all
          </div>
          <div className="d-flex ml-3">
            <div className={styles.circleNumber}>1</div>
            <div className="ml-3 w-100 pr-5">
              <div className={styles.headingTitle}>Send to</div>
              <div className="my-2">
                Type specific email address b elow or select from your mailing
                lists
              </div>
              <CInput
                placeholder="To:"
                innerRef={emailAddr}
                onKeyUp={handleEmailAddressKeyUp}
              />
              <CSelect
                className="mt-2"
                onChange={(e) => handleContactTags(e.target.value)}
              >
                <option value="0">
                  Enter email address, mailing list or choose from the dropdown
                  list...
                </option>
                {mailList.map((mail) => (
                  <option key={mail.name} value={mail.id}>
                    {mail.name}
                  </option>
                ))}
              </CSelect>
              <div className={styles.contactTagList}>
                {contactTags.map((tag) => (
                  <div
                    key={tag[0]}
                    className={styles.contactTag}
                    style={
                      tag[1] === "email" ? { backgroundColor: "#e3e5e8" } : {}
                    }
                  >
                    <div className="d-flex">
                      <div>{tag[0]}</div>
                      <div
                        className="ml-4"
                        style={{ marginTop: "-3px", cursor: "pointer" }}
                        onClick={() => handleRemoveTags(tag[0])}
                      >
                        x
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.divider}></div>
          <div className="ml-3">
            <div className="d-flex">
              <div className={styles.circleNumber}>2</div>
              <div className="ml-3 w-100">
                <div className="d-flex">
                  <div className="w-50">
                    <div className={styles.headingTitle}>Choose template</div>
                    <div className="my-2">
                      Selected template will be rendered below
                    </div>
                    <CSelect
                      className="w-50"
                      value={currentTemplate}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                    >
                      <option value="0">Select a template</option>
                      {templateList.map((template, index) => (
                        <option key={index} value={template.name}>
                          {template.name}
                        </option>
                      ))}
                    </CSelect>
                  </div>
                  <div className="w-50">
                    <div className={styles.headingTitle}>When to send</div>
                    <div className="my-2">
                      Select date and time when you want the email to be send
                    </div>
                    <div className="d-flex w-100">
                      <CSelect
                        className="w-50"
                        onChange={(e) => setScheduleMode(e.target.value)}
                        value={scheduleMode}
                      >
                        <option value="1">Send now</option>
                        <option value="2">Schedule</option>
                      </CSelect>
                      {scheduleMode === "2" && (
                        <div className="d-flex">
                          <CInput
                            className="w-50 ml-3"
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                          />
                          <CInput
                            className="w-50 mx-3"
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.divider}></div>
          <div className="mb-3 ml-3">
            <div className="d-flex">
              <div className={styles.circleNumber}>3</div>
              <div className="ml-3 w-100 pr-5">
                <div className={styles.headingTitle}>Subject</div>
                <CInput className="mt-3" innerRef={subjectRef} />
                <div style={{ height: "300px" }}>
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    className="mt-3 h-100"
                  >
                    <div key="editor" ref={editor} className="quill-contents" />
                  </ReactQuill>
                </div>
                <div className="float-right" style={{ marginTop: "80px" }}>
                  <CButton color="primary">Save as draft</CButton>
                  {scheduleMode === "2" && (
                    <CButton color="success" className="ml-3">
                      Schedule
                    </CButton>
                  )}
                  {scheduleMode === "1" && (
                    <CButton
                      color="success"
                      className="ml-3"
                      onClick={() => handleSendEmail()}
                    >
                      Send
                    </CButton>
                  )}
                </div>
              </div>
            </div>
            {scheduleMode === "2" && (
              <div className={styles.scheduleText}>
                Email will be send {scheduleDate}, {scheduleTime}
              </div>
            )}
          </div>
        </CCardBody>
      </CCard>
    </TheLayout>
  );
};

export default EmailDraftDetailPage;
