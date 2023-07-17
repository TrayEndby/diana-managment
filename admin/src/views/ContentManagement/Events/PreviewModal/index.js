import React, { useCallback, useState, useEffect } from "react";
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CLabel,
  CRow,
  CCol,
  CForm,
  CSelect,
} from "@coreui/react";

import cn from "classnames";
import "react-quill-2/dist/quill.snow.css";
import moment from "moment-timezone";
import PropTypes from "prop-types";
import styles from "./style.module.scss";
import userService from "service/Admin/UserService";
import MarketService from "service/CSA/MarketService";
import ReactMarkdown from "react-markdown"

const propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  type: PropTypes.bool,
  resource: PropTypes.object,
};

const PreviewModal = ({ isVisible, setVisible, type, resource }) => {
  const [speakerList, setSpeakerList] = useState([]);
  const [thisEvent, setThisEvent] = useState(null);

  const getEvent = useCallback(async () => {
    if (resource == null) return;
    const event = await MarketService.getWebinarById(resource.id);
    let metaDataString = event.meta;
    let metaData;
    if (metaDataString != null && metaDataString !== "{}")
      metaData = JSON.parse(metaDataString);
    resource.meta = metaData;
    resource.shortDesc = event.description.substr(
      0,
      event.description.indexOf("\n")
    );
    if (event.description.indexOf("**Speakers**") !== -1) {
      resource.detailDesc = event.description.substr(
        event.description.indexOf("\n"),
        event.description.indexOf("**Speakers**") -
          event.description.indexOf("\n")
      );
    } else {
      resource.detailDesc = event.description.substr(
        event.description.indexOf("\n")
      );
    }
    const startTimePST = moment(resource.calendarEvent.start)
      .tz("America/Los_Angeles")
      .format("YYYY-MM-DD hh:mm");
    const startTimeEST = moment(resource.calendarEvent.start)
      .tz("America/New_York")
      .format("YYYY-MM-DD hh:mm");
    resource.startPST = startTimePST;
    resource.startEST = startTimeEST;
    setThisEvent(resource);
  }, [resource]);

  useEffect(() => {
    getSpeakersList();
    getEvent();
  }, [getEvent]);

  const getSpeakersList = async () => {
    const speakers = await userService.getListByTag("speaker");
    let speakerArray = [];
    speakerArray = speakers.map((spk) => {
      const value = JSON.parse(spk.value);
      let speakerPicture = "";
      if (value.image != null)
        speakerPicture = `https://storage.googleapis.com/kyros-public-data/speakers/${value.image}`;
      return {
        name: value.name,
        desc: value.desc,
        image: speakerPicture,
        image_shortname: value.image,
      };
    });
    setSpeakerList(speakerArray);
  };

  return (
    <CModal show={isVisible} onClose={() => setVisible(false)} size="xl">
      <CModalHeader
        closeButton
        style={{ backgroundColor: "#152332", color: "white" }}
      >
        <CModalTitle>Preview webinar</CModalTitle>
      </CModalHeader>
      <CModalBody className="px-4">
        {thisEvent != null && speakerList != null && (
          <CForm id="detail_form">
            <CRow>
              <CCol>
                <CLabel>Title</CLabel>
                <div>{thisEvent.title}</div>
              </CCol>
              <CCol>
                <CLabel>Start date & time</CLabel>
                <div className="d-flex">
                  <div className="w-50">{thisEvent.startPST} (PST)</div>
                  <div className="w-50">{thisEvent.startEST} (EST)</div>
                </div>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CLabel>Short one-sentence description</CLabel>
                <div>{thisEvent.shortDesc}</div>
              </CCol>
              <CCol>
                <CLabel>Duration</CLabel>
                <div>60 minutes</div>
                {type === "sprint" && (
                  <CSelect className="w-50 mt-2">
                    <option>Does not repeat</option>
                    <option>Repeat</option>
                  </CSelect>
                )}
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CLabel>Detailed Description</CLabel>
                <ReactMarkdown>
                  {thisEvent.detailDesc}
                </ReactMarkdown>
              </CCol>
            </CRow>
            {thisEvent.meta != null && thisEvent.meta !== "{}" && (
              <div>
                <CRow className="mt-3">
                  <CCol>
                    <CLabel>Speakers</CLabel>
                  </CCol>
                </CRow>
                <CRow className="mt-2">
                  <CCol className="d-flex">
                    <div className="w-25">Name</div>
                    <div className="w-50">Description</div>
                    <div className="w-25">Picture</div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol className={styles.splitter}></CCol>
                </CRow>
              </div>
            )}
            {thisEvent.meta != null &&
              thisEvent.meta !== "{}" &&
              thisEvent.meta.speakers.map((speaker, index) => (
                <div key={index}>
                  <CRow className="mt-4">
                    <CCol className="d-flex">
                      <div className="w-25">{speaker.name}</div>
                      <div className="w-50">
                        {speakerList.filter((sp) => sp.name === speaker.name)[0]
                          .desc || ""}
                      </div>
                      <div className="w-25">
                        <img
                          src={`https://storage.googleapis.com/kyros-public-data/speakers/${speaker.image}`}
                          alt=""
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "100%",
                            marginLeft: "20px",
                          }}
                        />
                      </div>
                    </CCol>
                  </CRow>
                  {index !== thisEvent.meta.speakers.length - 1 && (
                    <CRow>
                      <CCol className={cn(styles.splitter, "mt-4")}> </CCol>
                    </CRow>
                  )}
                </div>
              ))}
          </CForm>
        )}
      </CModalBody>
    </CModal>
  );
};

PreviewModal.prototype = propTypes;

export default PreviewModal;
