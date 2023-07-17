import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CInputCheckbox,
  CButton,
} from "@coreui/react";

import TheLayout from "containers/TheLayout";
import styles from "./style.module.scss";
import MailingListService from "service/Admin/MailingListService";
import MarketService from "service/CSA/MarketService";
import { getState } from "./util";
import authService from "service/AuthService";
import CreateMailingListModal from "views/MailingList/CreateMailingListModal";
import ExportToMailChimpModal from "views/MailChimp/ExportToMailChimpModal";
import moment from 'moment-timezone';
import formatPhone from "views/utils"
import csv from "csv";

const EventRegistration = () => {
  const itemsPerPage = 20;
  const keyList = [
    "username",
    "role",
    "country",
    "state",
    "zip_code",
    "email",
    "phone",
    "csa_code",
    "count",
  ];

  const [error, setError] = useState(null);
  const [selectedWebinar, setSelectedWebinar] = useState({
    title: "Select a webinar",
    eventId: 0,
  });
  const allWebinarName = useMemo(() => [{
    title: "[All Webinars]",
    eventId: 0,
  }], []);
  const commonFields = [
    { label: "Select", key: "selectKey", _style: { width: "1%" } },
    { label: "#", key: "rowNo", _style: {width: "1%"} },
    { label: "Name", key: "username"},
    { label: "Email", key: "email"},
    { label: "Role", key: "role"},
    { label: "Country", key: "country"},
    { label: "State", key: "state"},
    { label: "Zip Code", key: "zip_code"},
    { label: "Phone", key: "phone"},
    { label: "CSA Code", key: "csa_code"},
  ];

  const [webinarList, setWebinarList] = useState(allWebinarName);
  const [registrationList, setRegistrationList] = useState([]);
  const [selectType, setSelectType] = useState(1);
  const [mailList, setMailList] = useState([]);
  const [createModal, showCreateModal] = useState(false);
  const [showDropdown, setShowDropDown] = useState(false);
  const [checkList, setCheckList] = useState([]);
  const [topCheck, setTopCheck] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [fields, setFields] = useState(commonFields);
  const [showExportToMailChimp, setShowExportToMailChimp] = useState(false);
  const [selectedWebinarName, setSelectedWebinarName] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const extraFields = [
    { label: "Count", key: "count"},
  ];

  const getRegistrationList = useCallback(async () => {
    try {
      const resourceList = await MarketService.listWebinarResources();
      let webinars = [];
      resourceList.forEach((res) => {
        if ("object_id" in res && res.object_id > 0) {
          const date = moment.utc(
            res.source_ts,
            'YYYY-MM-DD hh:mm::ss',
          );
          webinars.push({
            title: res.title + date.format(' (YYYY-MM-DD)'),
            eventId: res.object_id
          });
        }
      });
      webinars.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
      setWebinarList(allWebinarName.concat(webinars));
    } catch (e) {
      setError(e);
    }
  }, [setWebinarList, allWebinarName]);

  useEffect(() => {
    getRegistrationList();
    getMailingList();
  }, [getRegistrationList]);

  const handleCheck = (item) => {
    const index = item.no - 1;
    if (checkList[index] === true) {
      setTopCheck(false);
    }
    const newCheckList = checkList.map((x, i) => (i === index ? !x : x));
    setCheckList(newCheckList);
  };

  const handleTopCheckbox = (e) => {
    let newCheckList = Array(checkList.length).fill(false);
    if (selectType === 1) {
      filteredItems.forEach((x, ind) => {
        let i = filteredItems[ind].no - 1;
        if (ind >= currentPage * itemsPerPage && ind < (currentPage + 1) * itemsPerPage) {
          newCheckList[i] = e.target.checked;
        } else {
          newCheckList[i] = checkList[i];
        }
      });
    } else {
      filteredItems.forEach((x, ind) => {
        let i = filteredItems[ind].no - 1;
        newCheckList[i] = e.target.checked;
      });
    }
    setCheckList(newCheckList);
    setTopCheck(e.target.checked);
  };

  const handleCheckType = (type) => {
    setSelectType(type);
    setShowDropDown(false);
  };

  const getWebinarRegistrants = async (webinar) => {
    setSelectedWebinar(webinar);
    setSelectedWebinarName(webinar.title);
    let regList = [];
    try {
      let res = null;
      // This is for all webinar events.
      if (webinar.eventId === 0) {
        res = await MarketService.getAllRegistrants();
        setFields(commonFields.concat(extraFields));
      } else {
        res = await MarketService.fillWebinarEventInfo(
          {
            title: webinar.title,
            object_id: webinar.eventId
          },
          authService.getUID());
        setFields(commonFields);
      }
      const regs = res.calendarEvent.registrant;
      if (regs) {
        let no = 1;
        regs.forEach((reg) => {
          let { first_name, last_name, role } = reg;
          if (role == null) role = "";
          if (first_name == null) first_name = " ";
          if (last_name == null) last_name = " ";

          role = role.charAt(0).toUpperCase() + role.slice(1);
          const states = getState(reg.zip_code);
          const thisReg = {
            ...reg,
            no,
            username: `${first_name} ${last_name}`,
            role,
            state: states.state,
          };
          if (thisReg.phone) {
            thisReg.phone = formatPhone(thisReg.phone);
          }
          keyList.forEach((key) => {
            if (thisReg[key] == null) {
              thisReg[key] = "";
            }
          });
          regList.push(thisReg);
          no++;
        });
      }
    } catch (e) {
      setError(e);
    } finally {
      setRegistrationList(regList);
      let emptyCheckList = Array(regList.length).fill(false);
      setCheckList(emptyCheckList);
    }
  };

  const downloadAsCSV = async() => {
    csv.stringify(
      [keyList].concat(
        registrationList.filter((value, index) => {
          return true;
          // return checkList[index];
        }).map((value, index) => {
          let row = [];
          keyList.forEach((key) => {
            row.push(value[key]);
          });
          return row;
        })
      ), (err, output) => {
        if (err) {
          console.log(err);
        } else {
          const element = document.createElement("a");
          const file = new Blob([output], {type: 'text/plain'});
          element.href = URL.createObjectURL(file);
          element.download = selectedWebinar.title + '.csv';
          document.body.appendChild(element); // Required for this to work in FireFox
          element.click();
        }
      });
  };

  const getMailingList = async () => {
    try {
      const mailingList = await MailingListService.getMailingList();
      const tagsList = [];
      mailingList.forEach((mail) => {
        tagsList.push([
          {
            tags: mail.tags,
            name: mail.name,
            id: mail.id,
            creator_id: mail.creator_id,
            creator_name: mail.creator_name,
          },
        ]);
      });
      setMailList(tagsList);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TheLayout title="Event Registration Report">
      <CCard>
        <CCardHeader style={{ alighSelf: "stretch" }}>
          <CDropdown className="float-left">
            <CDropdownToggle caret color="success">
              {selectedWebinar.title}
            </CDropdownToggle>
            <CDropdownMenu>
              {
                webinarList.map((value, index) => {
                  return (
                    <CDropdownItem
                      key={index}
                      onClick={() => {
                        getWebinarRegistrants(value);
                      }}
                    >
                      {value.title}
                    </CDropdownItem>
                  )
                })
              }
            </CDropdownMenu>
          </CDropdown>
        </CCardHeader>
        <CCardBody>
          <CButton
            color="success"
            style={{ marginRight: "24px", float: "right" }}
            onClick={() => setShowExportToMailChimp(true)}
          >
            Export to MailChimp
          </CButton>
          <CButton
            color="success"
            style={{ marginRight: "24px", float: "right" }}
            onClick={() => downloadAsCSV(true)}
          >
            Download as csv
          </CButton>
          <CButton
            color="success"
            style={{ marginRight: "24px", float: "right" }}
            onClick={() => showCreateModal(true)}
          >
            Create a mailing list
          </CButton>
          <CDataTable
            items={registrationList}
            fields={fields}
            itemsPerPage={itemsPerPage}
            tableFilter
            sorter
            pagination
            responsive
            border
            onFilteredItemsChange={(items) => {setFilteredItems(items)}}
            onPageChange={(page) => setCurrentPage(page - 1)}
            columnHeaderSlot={{
              selectKey: (
                <div>
                  <CInputCheckbox
                    style={{ marginLeft: "10px", marginTop: "10px" }}
                    onChange={(e) => handleTopCheckbox(e)}
                    checked={topCheck}
                  />
                  <button
                    className="dropdown-toggle btn btn-black ml-3"
                    type="button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    aria-label="Dropdown toggle"
                    onClick={() => setShowDropDown(!showDropdown)}
                  ></button>
                </div>
              ),
            }}
            scopedSlots={{
              rowNo: (item, index) => (
                <td>{index+1}</td>
              ),
              selectKey: (item) => (
                <td>
                  <CInputCheckbox
                    style={{ marginLeft: "10px" }}
                    onChange={() => handleCheck(item)}
                    checked={checkList[item.no - 1] || false}
                  >
                  </CInputCheckbox>
                </td>
              ),
            }}
          />
        </CCardBody>
      </CCard>
      <div
        className={styles.dropdown}
        style={showDropdown ? { display: "initial" } : { display: "none" }}
      >
        <div className={styles.dropdownItem}
          style={{ backgroundColor: selectType === 1 ? "lightgreen" : "white" }}
          onClick={() => handleCheckType(1)}>
          This page
        </div>
        <div className={styles.dropdownItem}
          style={{ backgroundColor: selectType === 2 ? "lightgreen" : "white" }}
          onClick={() => handleCheckType(2)}>
          All pages
        </div>
      </div>
      <CreateMailingListModal
        isVisible={createModal}
        setVisible={showCreateModal}
        mailList={mailList}
        //members={checkList}
      />
      {showExportToMailChimp && (
        <ExportToMailChimpModal
          isVisible={showExportToMailChimp}
          setVisible={setShowExportToMailChimp}
          tagName={selectedWebinarName}
          inputList={registrationList}
          checkList={checkList}
        />
      )}
      <CAlert>{error}</CAlert>
    </TheLayout>
  );
};

export default EventRegistration;
