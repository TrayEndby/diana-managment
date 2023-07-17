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
import userService from "service/Admin/UserService";

const propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  speakerName: PropTypes.string,
  getSpeakerList: PropTypes.func,
};

const SpeakerDeleteModal = ({
  isVisible,
  setVisible,
  speaker,
  getSpeakerList,
}) => {
  useEffect(() => {}, [speaker]);

  const deleteSpeaker = async () => {
    if (speaker == null || speaker === "") return;
    await userService.deleteList(`speaker:${speaker.name}`);
    getSpeakerList();
  };

  return (
    <CModal show={isVisible} onClose={() => setVisible(false)}>
      <CModalHeader
        closeButton
        style={{ backgroundColor: "#152332", color: "white" }}
      >
        <CModalTitle>Permanently delete this speaker?</CModalTitle>
      </CModalHeader>
      <CModalBody className="text-center">
        The webinar will be permanently deleted and can't be undone.
        <br />
        Are you sure you want to delete it?
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
            deleteSpeaker();
            setVisible(false);
          }}
        >
          Submit
        </CButton>{" "}
      </CModalFooter>
    </CModal>
  );
};

SpeakerDeleteModal.prototype = propTypes;

export default SpeakerDeleteModal;
