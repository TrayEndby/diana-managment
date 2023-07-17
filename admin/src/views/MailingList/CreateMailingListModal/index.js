import React, { useState } from "react";
import {
  CInput,
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
  mailList: PropTypes.array,
  getMailingList: PropTypes.func,
};

const CreateMailingListModal = ({
  isVisible,
  setVisible,
  mailList,
  getMailingList,
}) => {
  const [mailingTitle, setMailingTitle] = useState("");
  const [createFolder, setCreateFolder] = useState(true);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderName, setFolderName] = useState("");

  const saveMailingList = async () => {
    if (mailingTitle === "" || mailingTitle === " ") return;
    if (createFolder && folderName === "0") return;
    if (!createFolder && newFolderName === "") return;
    let createMail;
    if (createFolder) {
      createMail = { name: mailingTitle, tags: folderName, member: [] };
    } else {
      createMail = { name: mailingTitle, tags: newFolderName, member: [] };
    }
    try {
      await MailingListService.createMailingList(createMail);
      await getMailingList();
    } catch (e) {
      console.log(e);
    }
    setMailingTitle("");
    setNewFolderName("");
  };

  return (
    <CModal show={isVisible} onClose={() => setVisible(false)}>
      <CModalHeader
        closeButton
        style={{ backgroundColor: "#152332", color: "white" }}
      >
        <CModalTitle>Create mailing list</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>Mailing list title</div>
        <div>
          <CInput
            required={false}
            type="text"
            value={mailingTitle}
            onChange={(e) => setMailingTitle(e.target.value)}
          />
        </div>
        {createFolder && (
          <div>
            <div className="mt-3">Save to folder</div>
            <div>
              <CSelect
                custom
                style={{ color: "#0b0b0b" }}
                value={folderName}
                placeholder="Choose..."
                onChange={(e) => setFolderName(e.target.value)}
              >
                <option value="0">Choose Mailing Folder...</option>
                {mailList.map((mail, index) => (
                  <option key={mail[0].tags + index.toString()} value={mail[0].tags}>
                    {mail[0].tags}
                  </option>
                ))}
              </CSelect>
            </div>
            <div
              className="mt-3 w-50"
              style={{ color: "#53a548", cursor: "pointer" }}
              onClick={() => setCreateFolder(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="c-icon c-icon-lg"
                role="img"
              >
                <polygon
                  fill="var(--ci-primary-color, currentColor)"
                  points="440 240 272 240 272 72 240 72 240 240 72 240 72 272 240 272 240 440 272 440 272 272 440 272 440 240"
                  className="ci-primary"
                ></polygon>
              </svg>{" "}
              Create new folder
            </div>
          </div>
        )}
        {!createFolder && (
          <div>
            <div className="mt-3">Creating folder name</div>
            <div>
              <CInput
                required={false}
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
            <div
              className="mt-3 w-50"
              style={{ color: "#53a548", cursor: "pointer" }}
              onClick={() => setCreateFolder(true)}
            >
              Select from mailing list
            </div>
          </div>
        )}
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
            saveMailingList();
            setVisible(false);
          }}
        >
          Save
        </CButton>{" "}
      </CModalFooter>
    </CModal>
  );
};

CreateMailingListModal.prototype = propTypes;

export default CreateMailingListModal;
