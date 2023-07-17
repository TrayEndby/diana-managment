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
  resource: PropTypes.object,
  loadData: PropTypes.func,
};

const DeleteEventModal = ({ isVisible, setVisible, resource, loadData }) => {
  useEffect(() => {}, [resource]);

  const deleteWebinar = async () => {
    if (resource == null || resource === "") return;
    await userService.deleteResource(resource.id);
    loadData();
  };

  return (
    <CModal show={isVisible} onClose={() => setVisible(false)}>
      <CModalHeader
        closeButton
        style={{ backgroundColor: "#152332", color: "white" }}
      >
        <CModalTitle>Permanently delete this webinar?</CModalTitle>
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
            deleteWebinar();
            setVisible(false);
          }}
        >
          Submit
        </CButton>{" "}
      </CModalFooter>
    </CModal>
  );
};

DeleteEventModal.prototype = propTypes;

export default DeleteEventModal;
