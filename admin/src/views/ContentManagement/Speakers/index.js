import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
} from "@coreui/react";

import userService from "service/Admin/UserService";
import TheLayout from "containers/TheLayout";
import AddSpeakerModal from "./AddSpeakerModal";
import DeleteSpeakerModal from "./DeleteModal";
import styles from "./style.module.scss";
import CIcon from "@coreui/icons-react";
import { icons } from "assets/icons";

const ContentEventPage = () => {
  const [speakerList, setSpeakerList] = useState([]);
  const [speakerModal, setSpeakerModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);

  useEffect(() => {
    getSpeakerList();
  }, []);

  const getSpeakerList = async () => {
    const speakers = await userService.getListByTag("speaker");
    let speakerArray = [];
    speakerArray = speakers.map((spk) => {
      const value = JSON.parse(spk.value);
      let speakerPicture = "";
      if (value.image != null) speakerPicture = value.image;
      return { name: value.name, desc: value.desc, image: speakerPicture };
    });
    setSpeakerList(speakerArray);
  };

  return (
    <TheLayout title="Speakers">
      <CCard className="">
        <CCardHeader className={styles.mainCardHeader}>
          <CButton
            className="float-right"
            color="success"
            onClick={() => {
              setCurrentSpeaker(null);
              setSpeakerModal(true);
            }}
          >
            Add New
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CRow className={styles.orangeText}>
            <CCol xs={2}>Name</CCol>
            <CCol xs={6}>Description</CCol>
            <CCol xs={2} className="ml-3">
              Picture
            </CCol>
            <CCol xs={2}></CCol>
          </CRow>
          <CRow className={styles.splitter}></CRow>
          {speakerList.map((spk, index) => (
            <div key={index}>
              <CRow className="my-3">
                <CCol xs={2}>{spk.name}</CCol>
                <CCol xs={6}>{spk.desc}</CCol>
                <CCol xs={2} className="ml-3">
                  <img
                    src={`https://storage.googleapis.com/kyros-public-data/speakers/${spk.image}`}
                    className={styles.speakerPicture}
                    alt=""
                  />
                </CCol>
                <CCol className="text-right mr-5">
                  <CIcon
                    content={icons.cilPencil}
                    size={"lg"}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setCurrentSpeaker(spk);
                      setSpeakerModal(true);
                    }}
                  />
                  <CIcon
                    className="ml-5"
                    size={"lg"}
                    content={icons.cilTrash}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setCurrentSpeaker(spk);
                      setDeleteModal(true);
                    }}
                  />
                </CCol>
              </CRow>
              {index !== speakerList.length - 1 && (
                <CRow className={styles.splitter}></CRow>
              )}
            </div>
          ))}
        </CCardBody>
      </CCard>
      <AddSpeakerModal
        isVisible={speakerModal}
        setVisible={setSpeakerModal}
        speaker={currentSpeaker}
        getSpeakerList={getSpeakerList}
      />
      <DeleteSpeakerModal
        isVisible={deleteModal}
        setVisible={setDeleteModal}
        speaker={currentSpeaker}
        getSpeakerList={getSpeakerList}
      />
    </TheLayout>
  );
};

export default ContentEventPage;
