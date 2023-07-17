import React, { useEffect, useRef, useState } from "react";
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
  CInput,
  CLabel,
  CTextarea,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import * as icons from "@coreui/icons";

import PropTypes from "prop-types";
import userService from "service/Admin/UserService";
import fileUploadService from "service/FileUploadService";
import style from "../style.module.scss";

const propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  speaker: PropTypes.object,
  getSpeakerList: PropTypes.func,
};

const AddSpeakerModal = ({
  isVisible,
  setVisible,
  speaker,
  getSpeakerList,
}) => {
  const inputFileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [mouseHover, setMouseHover] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (speaker != null) {
      if (speaker.image != null && speaker.image !== "")
        setImage(
          `https://storage.googleapis.com/kyros-public-data/speakers/${speaker.image}`
        );
      setName(speaker.name);
      setDescription(speaker.desc);
    } else {
      setImage(null);
      setName("");
      setDescription("");
    }
  }, [speaker, isVisible]);

  const handleSubmitSpeaker = async () => {
    const valueObject = {
      desc: description,
      name: name,
    };
    if (imageFile == null) {
      valueObject.image = speaker.image;
    } else {
      console.log(imageFile);
      valueObject.image = imageFile.name;
      await fileUploadService.upload(
        imageFile,
        imageFile.name,
        "system-speaker",
        true
      );
    }
    if (speaker != null) {
      await userService.deleteList(`speaker:${speaker.name}`);
    }
    await userService.updateList(
      "speaker",
      `speaker:${name}`,
      JSON.stringify(valueObject)
    );
    getSpeakerList();
  };

  const handleTriggerUpload = () => {
    inputFileRef.current.click();
  };

  const handleUpload = async (event) => {
    try {
      const pic = event.target.files[0];
      setImageFile(pic);
      setImage(URL.createObjectURL(pic));
    } catch (e) {
      console.error(e);
      alert("Upload profile image failed");
    }
  };

  const handleImageMouseMove = () => {
    setMouseHover(true);
  };

  const handleImageMouseLeave = () => {
    setMouseHover(false);
  };

  return (
    <CModal show={isVisible} onClose={() => setVisible(false)}>
      <CModalHeader
        closeButton
        style={{ backgroundColor: "#152332", color: "white" }}
      >
        {speaker == null && <CModalTitle>Add New Speaker</CModalTitle>}
        {speaker != null && <CModalTitle>Edit Speaker</CModalTitle>}
      </CModalHeader>
      <CModalBody>
        <div
          className={style.photoView}
          onClick={handleTriggerUpload}
          onMouseMove={handleImageMouseMove}
          onMouseLeave={handleImageMouseLeave}
          style={{ backgroundImage: image }}
        >
          {image == null ? (
            <CIcon content={icons.cilCamera} size={"4xl"} />
          ) : mouseHover ? (
            <div>
              <img src={image} className={style.image} alt="" />
              <div className={style.mask}> </div>
              <CIcon
                content={icons.cilCamera}
                size={"4xl"}
                style={{ marginTop: "-140px", marginLeft: "30px" }}
              />
            </div>
          ) : (
            <img src={image} className={style.image} alt="" />
          )}
          <input
            ref={inputFileRef}
            type="file"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
        </div>
        <div>
          <CLabel>Name</CLabel>
          <CInput value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mt-3">
          <CLabel>Description</CLabel>
          <CTextarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            handleSubmitSpeaker();
            setVisible(false);
          }}
        >
          Save
        </CButton>{" "}
      </CModalFooter>
    </CModal>
  );
};

AddSpeakerModal.prototype = propTypes;

export default AddSpeakerModal;
