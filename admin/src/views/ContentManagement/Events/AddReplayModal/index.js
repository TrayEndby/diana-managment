import React, { useEffect, useState } from "react";
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
  CLabel,
  CInput,
} from "@coreui/react";
import PropTypes from "prop-types";
import userService from "service/Admin/UserService";

const propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  resource: PropTypes.object,
};

const AddReplayModal = ({ isVisible, setVisible, resource }) => {
  const [videos, setVideos] = useState([]);
  const [videoURL, setVideoURL] = useState("");
  useEffect(() => {
    setVideos([]);
    if (resource != null) {
      if (resource.videoURL != null && resource.videoURL !== "") {
        setVideos(resource.videoURL.split("\t"));
      }
    }
  }, [resource]);

  const addReplay = () => {
    setVideos(videos.concat([videoURL]));
    setVideoURL("");
  };

  const removeVideo = (video) => {
    setVideos(videos.filter((v) => v !== video));
  };

  const publishReplays = async () => {
    const videosString = videos.join("\t");
    const updateResource = {};
    if (resource != null) {
      updateResource.id = resource.id;
      updateResource.url = videosString;
    }
    userService.insertOrUpdateResource(updateResource);
  };

  return (
    <CModal show={isVisible} onClose={() => setVisible(false)} size={"lg"}>
      <CModalHeader
        closeButton
        style={{ backgroundColor: "#152332", color: "white" }}
      >
        <CModalTitle>Add video replays to past webinar</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CLabel>Youtube link</CLabel>
        <div className="d-flex">
          <CInput
            className="w-75"
            placeholder="Ex: https://www.youtube.com/embed/9cyQa4Oh5To"
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
          />
          <CButton
            style={{ width: "18%", marginLeft: "5%" }}
            color="success"
            onClick={addReplay}
          >
            Add
          </CButton>
        </div>
        <div className="d-flex" style={{ flexWrap: "wrap" }}>
          {videos.map((video, index) => (
            <div className="w-50" key={index}>
              <iframe
                src={video}
                title="replay youtube"
                style={{
                  width: "96%",
                  marginTop: "2%",
                  marginLeft: "2%",
                  height: "200px",
                }}
              />
              <CButton
                color="danger"
                style={{ marginLeft: "77%" }}
                onClick={() => removeVideo(video)}
              >
                Remove
              </CButton>
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
            publishReplays();
            setVisible(false);
          }}
        >
          Save & Publish
        </CButton>{" "}
      </CModalFooter>
    </CModal>
  );
};

AddReplayModal.prototype = propTypes;

export default AddReplayModal;
