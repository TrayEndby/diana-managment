import React, { useCallback, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTabs,
  CNav,
  CNavLink,
  CNavItem,
  CTabContent,
  CSelect,
  CTabPane,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";

import moment from "moment";
import TheLayout from "containers/TheLayout";
import DetailModal from "./DetailModal";
import DeleteModal from "./DeleteModal";
import PreviewModal from "./PreviewModal";
import AddReplayModal from './AddReplayModal';
import marketService from "service/CSA/MarketService";
import EventCard from "./Card";
import styles from "./style.module.scss";

const ContentEventPage = () => {
  const [webinarList, setWebinarList] = useState([]);
  const [sprintList, setSprintList] = useState([]);
  const [counselingList, setCounselingList] = useState([]);

  const [filterWebinarList, setFilterWebinarList] = useState([]);
  const [filterSprintList, setFilterSprintList] = useState([]);
  const [filterCounselingList, setFilterCounselingList] = useState([]);

  const [detailModal, showDetailModal] = useState(false);
  const [previewModal, showPreviewModal] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [replayModal, showReplayModal] = useState(false);

  const [webinarType, setWebinarType] = useState("webinar");
  const [currentEvent, setCurrentEvent] = useState(null);

  const loadData = useCallback(async () => {
    await fetchWebinarList();
    await fetchSprintList();
    await fetchCounselingList();
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const fetchWebinarList = async () => {
    try {
      let resourceList = await marketService.listWebinars("csa event");
      resourceList = resourceList.map((res) => {
        const startDate = new Date(res.startDateTime);
        const startDateCvt = moment.utc(startDate).local().toDate();
        res.startDateCvt = startDateCvt;
        return res;
      });
      setWebinarList(resourceList);
      setFilterWebinarList(resourceList);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSprintList = async () => {
    try {
      let resourceList = await marketService.listWebinars("sprint program");
      resourceList = resourceList.map((res) => {
        const startDate = new Date(res.startDateTime);
        const startDateCvt = moment.utc(startDate).local().toDate();
        res.startDateCvt = startDateCvt;
        return res;
      });
      setSprintList(resourceList);
      setFilterSprintList(resourceList);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchCounselingList = async () => {
    try {
      let resourceList = await marketService.listWebinars(
        "monthly counselling"
      );
      resourceList = resourceList.map((res) => {
        const startDate = new Date(res.startDateTime);
        const startDateCvt = moment.utc(startDate).local().toDate();
        res.startDateCvt = startDateCvt;
        return res;
      });
      setCounselingList(resourceList);
      setFilterCounselingList(resourceList);
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpcomingSelect = (type, listType) => {
    const now = new Date();
    let resourceList = [];
    if (listType === "1") resourceList = webinarList;
    else if (listType === "2") resourceList = sprintList;
    else if (listType === "3") resourceList = counselingList;
    let filterList = [];
    resourceList.sort(
      (a, b) => new Date(b.startDateTime) - new Date(a.startDateTime)
    );
    resourceList.forEach((res) => {
      const startDate = new Date(res.startDateTime);
      const startDateCvt = moment.utc(startDate).local().toDate();
      if (parseInt(type) === 0) filterList.push(res);
      if (parseInt(type) === 1 && startDateCvt >= now) filterList.push(res);
      if (parseInt(type) === 2 && startDateCvt < now) filterList.push(res);
    });
    if (listType === "1") setFilterWebinarList(filterList);
    else if (listType === "2") setFilterSprintList(filterList);
    else if (listType === "3") setFilterCounselingList(filterList);
  };

  const handlePreview = (eventRes) => {
    setCurrentEvent(eventRes);
    showPreviewModal(true);
  };

  const handleEdit = (eventRes) => {
    setCurrentEvent(eventRes);
    const now = new Date();
    const startDate = new Date(eventRes.startDateTime);
    const startDateCvt = moment.utc(startDate).local().toDate();
    if (startDateCvt >= now) {
      showDetailModal(true);
    }
    if (startDateCvt < now) {
      showReplayModal(true);
    }
  };

  const handleDelete = (eventRes) => {
    setCurrentEvent(eventRes);
    showDeleteModal(true);
  };

  return (
    <TheLayout title="Event">
      <CCard className="">
        <CCardHeader className={styles.mainCardHeader}>
          <CDropdown className="float-right">
            <CDropdownToggle caret color="success">
              Create New
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                onClick={() => {
                  showDetailModal(true);
                  setWebinarType("webinar");
                  setCurrentEvent(null);
                }}
              >
                Webinar
              </CDropdownItem>
              <CDropdownItem
                onClick={() => {
                  showDetailModal(true);
                  setWebinarType("counselling");
                  setCurrentEvent(null);
                }}
              >
                Counseling Session
              </CDropdownItem>
              <CDropdownItem
                onClick={() => {
                  showDetailModal(true);
                  setWebinarType("sprint");
                  setCurrentEvent(null);
                }}
              >
                Sprint Program
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CCardHeader>
        <CCardBody className={styles.mainCardBody}>
          <CTabs activeTab="webinar">
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink data-tab="webinar">Webinars</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="counseling">Counseling Sessions</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="sprint">Sprint Programs</CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane data-tab="webinar">
                <CSelect
                  className="mx-3 mt-3"
                  style={{ width: "150px", color: "black" }}
                  onChange={(e) => handleUpcomingSelect(e.target.value, "1")}
                >
                  <option value="0">All Webinars</option>
                  <option value="1">Upcoming</option>
                  <option value="2">Past</option>
                </CSelect>
                <div className={styles.gridList}>
                  {filterWebinarList.map((res, idx) => (
                    <EventCard
                      res={res}
                      key={idx}
                      handlePreview={(e) => handlePreview(e)}
                      handleEdit={(e) => handleEdit(e)}
                      handleDelete={(e) => handleDelete(e)}
                    />
                  ))}
                </div>
              </CTabPane>
              <CTabPane data-tab="counseling">
                <CSelect
                  className="mx-3 mt-3"
                  style={{ width: "150px", color: "black" }}
                  onChange={(e) => handleUpcomingSelect(e.target.value, "3")}
                >
                  <option value="0">All Sessions</option>
                  <option value="1">Upcoming</option>
                  <option value="2">Past</option>
                </CSelect>
                <div className={styles.gridList}>
                  {filterCounselingList.map((res, idx) => (
                    <EventCard
                      res={res}
                      key={idx}
                      handlePreview={(e) => handlePreview(e)}
                      handleEdit={(e) => handleEdit(e)}
                      handleDelete={(e) => handleDelete(e)}
                    />
                  ))}
                </div>
              </CTabPane>
              <CTabPane data-tab="sprint">
                <CSelect
                  className="mx-3 mt-3"
                  style={{ width: "150px", color: "black" }}
                  onChange={(e) => handleUpcomingSelect(e.target.value, "2")}
                >
                  <option value="0">All Programs</option>
                  <option value="1">Upcoming</option>
                  <option value="2">Past</option>
                </CSelect>
                <div className={styles.gridList}>
                  {filterSprintList.map((res, idx) => (
                    <EventCard
                      res={res}
                      key={idx}
                      handlePreview={(e) => handlePreview(e)}
                      handleEdit={(e) => handleEdit(e)}
                      handleDelete={(e) => handleDelete(e)}
                    />
                  ))}
                </div>
              </CTabPane>
            </CTabContent>
          </CTabs>
        </CCardBody>
      </CCard>
      <DetailModal
        isVisible={detailModal}
        setVisible={showDetailModal}
        type={webinarType}
        resource={currentEvent}
        loadData={loadData}
      />
      <DeleteModal
        isVisible={deleteModal}
        setVisible={showDeleteModal}
        type={webinarType}
        resource={currentEvent}
        loadData={loadData}
      />
      <PreviewModal
        isVisible={previewModal}
        setVisible={showPreviewModal}
        type={webinarType}
        resource={currentEvent}
        loadData={loadData}
      />
      <AddReplayModal
        isVisible={replayModal}
        setVisible={showReplayModal}
        resource={currentEvent}
      />
    </TheLayout>
  );
};

export default ContentEventPage;
