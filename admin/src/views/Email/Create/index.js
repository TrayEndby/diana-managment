import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CInput,
  CButton,
  CSelect,
} from "@coreui/react";

import { useHistory } from "react-router-dom";
import TheLayout from "containers/TheLayout";
import MailingListService from "service/Admin/MailingListService";
import EmailService from "service/Admin/EmailService";
import HtmlEditor from "views/ContentManagement/Events/HtmlEditor";
import styles from "../style.module.scss";
import * as ADMIN_ROUTES from "routes";

const EmailCreatePage = () => {
  const [mailList, setMailList] = useState([]);
  const [contactTags, setContactTags] = useState([]);
  const [scheduleMode, setScheduleMode] = useState("1");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const subjectRef = useRef(null);
  const emailAddr = useRef(null);
  const [templateList, setTemplateList] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState("0");
  const [sendLabel, setSendLabel] = useState("Send");
  const [scheduleLabel, setScheduleLabel] = useState("Schedule");
  const history = useHistory();

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

  const getTemplateList = useCallback(async () => {
    const templates = await EmailService.getEmailTemplateList();
    setTemplateList(templates);

    const templateName = history.location.pathname.substr(
      ADMIN_ROUTES.EMAIL_CREATE.length+1);
    if (templateName.length > 0) {
      await handleTemplateChange(templateName);
    }
  }, [history.location.pathname]);

  useEffect(() => {
    getMailingList();
    getTemplateList();
  }, [getTemplateList]);

  const handleEditorChange = (content, editor) => {
    setEditorContent(content);
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
    setSendLabel("Send");
    setScheduleLabel("Schedule");
  };

  const handleRemoveTags = (contact) => {
    setContactTags(contactTags.filter((tag) => tag[0] !== contact));
  };

  const handleTemplateChange = async (template) => {
    setCurrentTemplate(template);
    setSendLabel("Send");
    setScheduleLabel("Schedule");
    const templateEmail = await EmailService.getEmailTemplate(template);
    if (templateEmail.length === 0) return;
    setEditorContent(templateEmail[0].template);
  };

  const handleSendEmail = () => {
    const subject = subjectRef.current.value;

    let emails = emailAddr.current.value;
    emails = emails.split(";");
    let contactList = contactTags;
    const addingEmails = [];
    emails.forEach((email) => {
      if (
        contactTags.filter((tags) => tags[0] === email && tags[1] === "email")
          .length === 0 &&
        email !== ""
      ) {
        const oneTag = [];
        oneTag[0] = email;
        oneTag[1] = "email";
        contactList = contactTags.concat([oneTag]);
        addingEmails.push(oneTag);
      }
    });
    setContactTags(addingEmails);
    if (contactList.length === 0) {
      alert("Select mailing list or email address");
      return;
    }
    contactList.forEach((contact) => {
      let thisMail = mailList.filter((mail) => mail.name === contact[0]);
      const sendEmail = {
        name: currentTemplate,
        from_name: "Kyros",
        subject: subject || " ",
        json: editorContent,
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
      try {
        EmailService.sendEmail(sendEmail);
      } catch (e) {
        console.log(e);
      }
    });

    setSendLabel("Sent");
  };

  const handleScheduleEmail = () => {
    const subject = subjectRef.current.value;

    let emails = emailAddr.current.value;
    emails = emails.split(";");
    let contactList = contactTags;
    const addingEmails = [];
    emails.forEach((email) => {
      if (
        contactTags.filter((tags) => tags[0] === email && tags[1] === "email")
          .length === 0 &&
        email !== ""
      ) {
        const oneTag = [];
        oneTag[0] = email;
        oneTag[1] = "email";
        addingEmails.push(oneTag);
        contactList = contactTags.concat([oneTag]);
        addingEmails.push(oneTag);
      }
    });
    setContactTags(addingEmails);
    if (contactList.length === 0) {
      alert("Select mailing list or email address");
      return;
    }
    contactList.forEach((contact) => {
      let thisMail = mailList.filter((mail) => mail.name === contact[0]);
      const sendEmail = {
        name: currentTemplate,
        from_name: "Kyros",
        subject: subject || " ",
        json: editorContent,
        schedule: [{ send_time: `${scheduleDate} ${scheduleTime}` }],
      };

      if (contact[1] === "contact") {
        if (thisMail.length !== 0) {
          sendEmail.contacts = { id: thisMail[0].id };
        }
      }
      // else {
      //   sendEmail.contacts = {
      //     member: [{ email: contact[0], first_name: "", last_name: "" }],
      //   };
      // }
      try {
        EmailService.addSchedule(sendEmail);
      } catch (e) {
        console.log(e);
      }
    });

    setScheduleLabel("Scheduled");
  };

  const handleEmailAddressKeyUp = async (e) => {
    if (e.keyCode === 13) {
      let emails = emailAddr.current.value;
      emails = emails.split(/[;,\s]+/);
      const addingEmails = [];
      emails.forEach((email) => {
        if (
          contactTags.filter((tags) => tags[0] === email && tags[1] === "email")
            .length !== 0
        )
          return;
        let oneTag = [];
        oneTag[0] = email;
        oneTag[1] = "email";
        console.log(oneTag);
        addingEmails.push(oneTag);
      });
      setContactTags(contactTags.concat(addingEmails));
      emailAddr.current.value = "";
    }
    setScheduleLabel("Schedule");
  };

  return (
    <TheLayout title="Create Email">
      <CCard className="">
        <CCardHeader className={styles.mainCardHeader}>
        </CCardHeader>
        <CCardBody>
          <div className="d-flex">
            <div className={styles.circleNumber}>1</div>
            <div className="ml-3 w-100 pr-5">
              <div className={styles.headingTitle}>Send to</div>
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
                    <div key={tag[0]} className="d-flex">
                      <div>{tag[0]}</div>
                      <div
                        key={tag[0]} 
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
          <div>
            <div className="d-flex">
              <div className={styles.circleNumber}>2</div>
              <div className="ml-3 w-100">
                <div className="d-flex">
                  <div className="w-50">
                    <div className={styles.headingTitle}>Choose template</div>
                    <div className="my-2">
                      If a template is not selected, will be displayed a generic
                      one
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
          <div className="mb-3">
            <div className="d-flex">
              <div className={styles.circleNumber}>3</div>
              <div className="ml-3 w-100 pr-5">
                <div className={styles.headingTitle}>Subject</div>
                <CInput className="mt-3" innerRef={subjectRef} />
                <div style={{ height: "400px", marginTop: "20px" }}>
                  <HtmlEditor value={editorContent} editorChange={handleEditorChange} />
                </div>
                <div className="float-right" style={{ marginTop: "80px" }}>
                  <CButton color="primary">Save as draft</CButton>
                  {scheduleMode === "2" && (
                    <CButton
                      color="success"
                      className="ml-3"
                      onClick={handleScheduleEmail}
                    >
                      {scheduleLabel}
                    </CButton>
                  )}
                  {scheduleMode === "1" && (
                    <CButton
                      color="success"
                      className="ml-3"
                      onClick={handleSendEmail}
                    >
                      {sendLabel}
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

export default EmailCreatePage;
