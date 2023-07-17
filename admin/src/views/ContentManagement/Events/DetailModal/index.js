import React, { useState, useEffect, useRef } from "react";
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CInput,
  CLabel,
  CRow,
  CCol,
  CForm,
  CTextarea,
  CSelect,
} from "@coreui/react";

import cn from "classnames";
import moment from "moment-timezone";
import PropTypes from "prop-types";
import styles from "./style.module.scss";
import MdEditor from "../MarkdownEditor";
import userService from "service/Admin/UserService";
import calendarService from "service/CalendarService";
import MarketService from "service/CSA/MarketService";

const propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  type: PropTypes.bool,
  resource: PropTypes.object,
  loadData: PropTypes.func,
};

const DetailModal = ({ isVisible, setVisible, type, resource, loadData }) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [durationTime, setDurationTime] = useState(60);
  const [durationMode, setDurationMode] = useState(0);
  const [timeZone, setTimeZone] = useState("PST");
  const [endTimeZone, setEndTimeZone] = useState("PST");

  const [speakerNameList, setSpeakerNameList] = useState([]);
  const [speakerDescriptionList, setSpeakerDescriptionList] = useState([]);
  const [speakerPictureList, setSpeakerPictureList] = useState([]);
  const [speakerList, setSpeakerList] = useState([]);
  const [editorContent, setEditorContent] = useState("");

  const detailRef = useRef(null);

  useEffect(() => {
    const initWebinar = async () => {
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
      if (resource == null) {
        setTitle("");
        setShortDescription("");
        setStartDate("");
        setStartTime("");
        setSpeakerNameList([]);
        return;
      }
      let res = resource;
      const event = await MarketService.getWebinarById(resource.id);
      let metaDataString = event.meta;
      let metaData = null;
      if (metaDataString != null && metaDataString !== "{}") metaData = JSON.parse(metaDataString);
      res.meta = metaData;
      res.shortDesc = event.description.substr(
        0,
        event.description.indexOf("\n")
      );
      if (event.description.indexOf("**Speakers**") !== -1) {
        res.detailDesc = event.description.substr(
          event.description.indexOf("\n"),
          event.description.indexOf("**Speakers**") -
            event.description.indexOf("\n")
        );
      } else {
        res.detailDesc = event.description.substr(
          event.description.indexOf("\n")
        );
      }
      if (metaData != null) {
        setSpeakerNameList(
          metaData.speakers.map((spk) =>
            speakerList.indexOf(
              speakerList.filter((sp) => sp.name === spk.name)[0]
            )
          )
        );
      } else {
        setSpeakerNameList([]);
      }
      setTitle(resource.title);
      setShortDescription(res.shortDesc);
      setEditorContent(res.detailDesc);
      setStartDate(resource.startDateTime._i.substr(0, 10));
      setStartTime(resource.startDateTime._i.substr(11));
    };
    initWebinar();
  }, [resource, speakerList]);

  const handleEditorChange = content => {
    setEditorContent(content);
  };

  const handlePublish = async () => {
    const detail = detailRef.current.editor.container.outerText;
    if (
      title === "" ||
      startDate === "" ||
      startTime === "" ||
      shortDescription === "" ||
      detail === ""
    ) {
      return;
    }

    // --- get start and end date time with PST or EST timezone
    let rrule = "";
    let timeZoneString = "America/Los_Angeles";
    if (timeZone === "EST") {
      timeZoneString = "America/New_York";
    }
    const startMoment = moment.tz(`${startDate} ${startTime}`, timeZoneString);
    const startMomentUTC = startMoment.format("YYYY-MM-DD hh:mm");
    let endMomentUTC;
    if (type !== "sprint") {
      endMomentUTC = startMoment.add(1, "hours").format("YYYY-MM-DD hh:mm");
    } else {
      let endTimeZoneString = "America/Los_Angeles";
      if (endTimeZone === "EST") {
        endTimeZoneString = "America/New_York";
      }
      const endMoment = moment.tz(`${endDate} ${endTime}`, endTimeZoneString);
      endMomentUTC = endMoment.format("YYYY-MM-DD hh:mm");
      rrule = `DTSTART;TZID=America/Los_Angeles:${startMoment.toString()}\nFREQ=WEEKLY;INTERVAL=1;BYDAY=SA;UNTIL=${endMoment.toString()}`;
    }

    // --- create meta data
    let metaData = {
      speakers: speakerNameList.map((idx) => ({
        name: speakerList[idx].name,
        image: speakerList[idx].image_shortname,
      })),
    };
    metaData = JSON.stringify(metaData);

    let speakerMarkdown = "\n\n[Honored Guest Speaker]\n";
    speakerNameList.forEach((idx) => {
      speakerMarkdown += `- ${speakerList[idx].name}\n- ${speakerList[idx].desc}\n\n![${speakerList[idx].name}](${speakerList[idx].image})\n`;
    });

    // --- create description
    const description = `${shortDescription}\n${detail}\n**Speakers**${speakerMarkdown}`;

    // --- add or update event
    let eventId;
    let calendarList = await calendarService.listCalendars();
    let calendar;
    if (type === "sprint") {
      calendar = calendarList.filter(
        (cal) => cal.name === "Kyros Webinar" && cal.creator_id === "_calendar_"
      );
    } else {
      calendar = calendarList.filter(
        (cal) =>
          cal.name === "Kyros Sprint Program" && cal.creator_id === "_calendar_"
      );
    }
    if (calendar.length > 0) calendar = calendar[0];
    if (resource == null) {
      // add event
      const addingEvent = {
        name: title,
        start: startMomentUTC,
        end: endMomentUTC,
        rrule: rrule,
        type: 4,
      };
      const addedEvent = await calendarService.addEvent(
        calendar.id,
        addingEvent
      );
      eventId = addedEvent.calendar[0].event[0].id;
    } else {
      // update event
      eventId = resource.object_id;
      const addingEvent = {
        id: eventId,
        name: title,
        start: startMomentUTC,
        end: endMomentUTC,
        type: 4,
        rrule: rrule,
      };
      await calendarService.updateEvent(calendar.id, addingEvent);
    }

    // --- add or update resource
    const addingResource = {
      title: title,
      object_id: eventId,
      author: "Kyros AI",
      type: 5,
      flag: 3,
      description: description,
    };
    if (speakerNameList.length > 0) {
      addingResource.meta = metaData;
    } else {
      addingResource.meta = "{}";
    }

    if (resource != null) {
      addingResource.tags = resource.tags;
      addingResource.id = resource.id;
    }
    if (resource == null && type === "sprint")
      addingResource.tags = "sprint program";
    if (resource == null && type === "webinar")
      addingResource.tags = "csa event";
    if (resource == null && type === "counselling")
      addingResource.tags = "monthly counselling";

    userService.insertOrUpdateResource(addingResource);

    loadData();
    setVisible(false);
  };

  const addNewSpeaker = () => {
    setSpeakerNameList(speakerNameList.concat(0));
    setSpeakerDescriptionList(
      speakerDescriptionList.concat([speakerList[0].desc])
    );
    setSpeakerPictureList(speakerPictureList.concat([speakerList[0].image]));
  };

  const removeSpeaker = (index) => {
    const newSpeakerNameList = [];
    speakerNameList.forEach((x, i) =>
      i !== index ? newSpeakerNameList.push(x) : true
    );
    setSpeakerNameList(newSpeakerNameList);
  };

  const handleSpeakerNameChange = (val, index) => {
    setSpeakerNameList(
      speakerNameList.map((x, i) => (i === index ? parseInt(val) : x))
    );
  };

  return (
    <CModal show={isVisible} onClose={() => setVisible(false)} size="xl">
      <CModalHeader
        closeButton
        style={{ backgroundColor: "#152332", color: "white" }}
      >
        {resource == null && <CModalTitle>Create new webinar</CModalTitle>}
        {resource != null && <CModalTitle>Edit webinar</CModalTitle>}
      </CModalHeader>
      <CModalBody className="px-4">
        <CForm id="detail_form">
          <CRow>
            <CCol>
              <CLabel>Title *</CLabel>
              <CInput
                className="w-75"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </CCol>
            <CCol>
              <CLabel>Start date & time *</CLabel>
              <div className="d-flex">
                <CInput
                  className="w-50"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <CInput
                  className="w-25 mx-3"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                <CSelect
                  className="w-25 mr-3"
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                >
                  <option value="PST">PST</option>
                  <option value="EST">EST</option>
                </CSelect>
              </div>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CLabel>Short one-sentence description *</CLabel>
              <CTextarea
                style={{ minHeight: "120px" }}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              ></CTextarea>
            </CCol>
            <CCol>
              {type === "sprint" && (
                <div>
                  <CLabel>End date & time *</CLabel>
                  <div className="d-flex">
                    <CInput
                      className="w-50"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <CInput
                      className="w-25 mx-3"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                    <CSelect
                      className="w-25 mr-3"
                      value={endTimeZone}
                      onChange={(e) => setEndTimeZone(e.target.value)}
                    >
                      <option value="PST">PST</option>
                      <option value="EST">EST</option>
                    </CSelect>
                  </div>
                </div>
              )}
              <CLabel className="mt-3">Duration *</CLabel>
              <div className="d-flex">
                <CSelect
                  className="w-25"
                  value={durationTime}
                  onChange={(e) => setDurationTime(e.target.value)}
                >
                  <option>60 minutes</option>
                </CSelect>
                {type === "sprint" && (
                  <CSelect
                    className="w-25 ml-3"
                    value={durationMode}
                    onChange={(e) => setDurationMode(e.target.value)}
                  >
                    <option>Does not repeat</option>
                    <option>Repeat</option>
                  </CSelect>
                )}
              </div>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CLabel>Detailed Description *</CLabel>
              <div style={{ height: "300px" }}>
                <MdEditor value={editorContent} editorChange={handleEditorChange} />
              </div>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CLabel>Speakers</CLabel>
              <CButton
                color="success"
                className="ml-3"
                size="sm"
                onClick={addNewSpeaker}
              >
                + Add
              </CButton>
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
          {speakerNameList.map((idx, index) => (
            <div key={index}>
              <CRow className="mt-4">
                <CCol className="d-flex">
                  <div className="w-25">
                    <CSelect
                      className="w-75 pr-3"
                      value={idx}
                      onChange={(e) =>
                        handleSpeakerNameChange(e.target.value, index)
                      }
                    >
                      {speakerList.map((spk, idx) => (
                        <option value={idx} key={idx}>
                          {spk.name}
                        </option>
                      ))}
                    </CSelect>
                  </div>
                  <div className="w-50">{speakerList[idx].desc}</div>
                  <div className="w-25">
                    <img
                      src={speakerList[idx].image}
                      alt=""
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "100%",
                        marginLeft: "20px",
                      }}
                    />
                  </div>
                  <div
                    className="mt-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => removeSpeaker(index)}
                  >
                    X
                  </div>
                </CCol>
              </CRow>
              {index !== speakerNameList.length - 1 && (
                <CRow>
                  <CCol className={cn(styles.splitter, "mt-4")}> </CCol>
                </CRow>
              )}
            </div>
          ))}
        </CForm>
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
        <CButton color="success" onClick={handlePublish}>
          Save & Publish
        </CButton>{" "}
      </CModalFooter>
    </CModal>
  );
};

DetailModal.prototype = propTypes;

export default DetailModal;
