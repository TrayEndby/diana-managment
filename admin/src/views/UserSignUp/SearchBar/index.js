import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import userProfileListService from "service/UserProfileListService";
import InputRange from "react-input-range";
import {
  CButton,
  CRow,
  CCol,
  CInput,
  CInputCheckbox,
  CFormGroup,
  CLabel,
  CSelect,
} from "@coreui/react";

import moment from 'moment-timezone';
import UserProfileService from "service/UserProfileListService";
import "react-input-range/lib/css/index.css";
import styles from "./style.module.scss";

const propTypes = {
  getSignupUserList: PropTypes.func,
  searchAnyThing: PropTypes.func,
};

const SearchBar = ({ getSignupUserList, searchAnyThing }) => {
  const rolesList = ["Parent", "Student", "CSA", "Educator"];

  const [selRoles, setSelRoles] = useState(Array(4).fill(false));
  const [selPayments, setPayments] = useState(Array(2).fill(false));
  const [searchKey, setSearchKey] = useState("");
  const [stateList, setStateList] = useState([]);
  const [isSearchDialog, showSearchDialog] = useState(false);
  const [cost, changeCost] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentState, setCurrentState] = useState("0");
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    getRoleList();
    const now = new Date();
    setFromDate(moment(now).format('MM/DD/YYYY'));
    console.log(moment(now).format('MM/DD/YYYY'))
  }, []);

  const getRoleList = async () => {
    let roleList = await UserProfileService.listName(6);
    roleList = roleList.nameIds;
    setUserRoles(roleList);
  };

  const handleRoles = (id, val) => {
    const newStatus = selRoles.map((x, ind) =>
      ind === id ? val.target.checked : x
    );
    setSelRoles(newStatus);
  };

  const handlePayments = (id, val) => {
    const newStatus = selPayments.map((x, ind) =>
      ind === id ? val.target.checked : x
    );
    setPayments(newStatus);
  };

  const handleSearch = async () => {
    let rolesArray = [];
    const paymentsArray = [];
    selRoles.forEach((x, ind) => (x ? rolesArray.push(rolesList[ind]) : true));
    selPayments.forEach((x) =>
      x ? paymentsArray.push(1) : paymentsArray.push(0)
    );
    const searchParam = {};
    if (rolesArray.length !== 0) {
      rolesArray = rolesArray.map((role) => {
        const roles = userRoles.filter((user) => user.name === role);
        if (roles.length > 0) return roles[0].id;
        return 0;
      });
      searchParam.roles = rolesArray;
    }
    if (paymentsArray.length !== 0) {
      searchParam.paymentStatus = paymentsArray;
    }
    if (currentState !== "0") {
      searchParam.state = currentState;
    }
    searchParam.paymentAmount = cost;
    const todayDate = new Date();
    let month = "0";
    if (todayDate.getMonth() >= 9) month = todayDate.getMonth() + 1;
    else month += todayDate.getMonth() + 1;
    const todayString = `${todayDate.getFullYear()}-${month}-${todayDate.getDate()}`;
    if (fromDate === "") {
      searchParam.fromDate = todayString;
    } else {
      searchParam.fromDate = fromDate;
    }
    if (toDate === "") {
      searchParam.toDate = todayString;
    } else {
      searchParam.toDate = toDate;
    }

    getSignupUserList(searchParam);
    showSearchDialog(false);
  };

  const handleEnterSearch = (value) => {
    if (value.keyCode === 13) {
      searchAnyThing(searchKey);
    }
  };

  useEffect(() => {
    userProfileListService
      .getListStateAbbvName()
      .then((states) => {
        setStateList(states);
      })
      .catch(console.error);
  }, []);

  return (
    <div className={styles.topBar}>
      <div className={styles.searchBar}>
        <CInput
          required={false}
          type="text"
          placeholder="Search for anything"
          value={searchKey}
          className={styles.searchText}
          onKeyUp={(e) => handleEnterSearch(e)}
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <div
          className={styles.searchDiv}
          style={isSearchDialog ? { display: "initial" } : { display: "none" }}
        >
          <CRow className="pl-3 pt-2 mb-3">
            <CCol xs={6}>
              <div>
                <p className={styles.contentCaption}>Role</p>
                <CRow>
                  <CCol>
                    <CFormGroup variant="checkbox" className="checkbox">
                      <CInputCheckbox
                        id="checkbox1"
                        name="checkbox1"
                        value="Parent"
                        onChange={(val) => handleRoles(0, val)}
                      />
                      <CLabel
                        variant="checkbox"
                        className="form-check-label"
                        htmlFor="checkbox1"
                      >
                        Parent
                      </CLabel>
                    </CFormGroup>
                    <CFormGroup variant="checkbox" className="checkbox">
                      <CInputCheckbox
                        id="checkbox2"
                        name="checkbox2"
                        value="Student"
                        onChange={(val) => handleRoles(1, val)}
                      />
                      <CLabel
                        variant="checkbox"
                        className="form-check-label"
                        htmlFor="checkbox2"
                      >
                        Student
                      </CLabel>
                    </CFormGroup>
                  </CCol>
                  <CCol>
                    <CFormGroup variant="checkbox" className="checkbox">
                      <CInputCheckbox
                        id="checkbox5"
                        name="checkbox5"
                        value="Parent"
                        onChange={(val) => handleRoles(2, val)}
                      />
                      <CLabel
                        variant="checkbox"
                        className="form-check-label"
                        htmlFor="checkbox5"
                      >
                        CSA
                      </CLabel>
                    </CFormGroup>
                    <CFormGroup variant="checkbox" className="checkbox">
                      <CInputCheckbox
                        id="checkbox6"
                        name="checkbox6"
                        value="Student"
                        onChange={(val) => handleRoles(3, val)}
                      />
                      <CLabel
                        variant="checkbox"
                        className="form-check-label"
                        htmlFor="checkbox6"
                      >
                        Educator
                      </CLabel>
                    </CFormGroup>
                  </CCol>
                </CRow>
              </div>
            </CCol>
            <CCol xs={6}>
              <div className="pl-3">
                <p className={styles.contentCaption}>Payment Status</p>
                <CFormGroup variant="checkbox" className="checkbox">
                  <CInputCheckbox
                    id="checkbox3"
                    name="checkbox3"
                    value="Paid Customer"
                    onChange={(val) => handlePayments(0, val)}
                  />
                  <CLabel
                    variant="checkbox"
                    className="form-check-label"
                    htmlFor="checkbox3"
                  >
                    Paid Customer
                  </CLabel>
                </CFormGroup>
                <CFormGroup variant="checkbox" className="checkbox">
                  <CInputCheckbox
                    id="checkbox4"
                    name="checkbox4"
                    value="Unpaid Customer"
                    onChange={(val) => handlePayments(1, val)}
                  />
                  <CLabel
                    variant="checkbox"
                    className="form-check-label"
                    htmlFor="checkbox3"
                  >
                    Unpaid Customer
                  </CLabel>
                </CFormGroup>
              </div>
            </CCol>
          </CRow>
          <div className={styles.divider}></div>
          <div className="p-3">
            <CRow>
              <CCol xs={6}>
                <p
                  className={styles.contentCaption}
                  style={{
                    display: "inline",
                  }}
                >
                  Amount:{" "}
                </p>
                <p style={{ display: "inline", color: "#0b0b0b" }}>
                  &lt;= ${cost.toLocaleString()}
                </p>
                <div className="mt-3 mb-3 ml-1">
                  <InputRange
                    minValue={0}
                    maxValue={10000}
                    value={cost}
                    onChange={(value) => changeCost(value)}
                  />
                </div>
              </CCol>
              <CCol xs={6}>
                <div className="pl-3">
                  <p className={styles.contentCaption}>State</p>
                  <CSelect
                    custom
                    size="sm"
                    style={{ marginTop: "-10px", color: "#0b0b0b" }}
                    value={currentState}
                    onChange={(e) => setCurrentState(e.target.value)}
                  >
                    <option value="0">Select state</option>
                    {stateList.map((state) => (
                      <option key={state.abbv} value={state.abbv}>
                        {state.name}
                      </option>
                    ))}
                  </CSelect>
                </div>
              </CCol>
            </CRow>
          </div>
          <div className={styles.divider}></div>
          <div className="p-3">
            <p className={styles.contentCaption}>Sign up date</p>
            <div className="d-flex">
              <p className="mt-1">From:</p>
              <CInput
                type="date"
                id="date-input"
                name="date-input"
                placeholder="date"
                size="sm"
                className="ml-3 mr-4"
                style={{ width: "35%", color: "#0b0b0b" }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <p className="mt-1">To:</p>
              <CInput
                type="date"
                id="date-input"
                name="date-input"
                placeholder="date"
                size="sm"
                className="ml-3 mr-3"
                style={{ width: "35%", color: "#0b0b0b" }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <CButton
              color="success"
              style={{ width: "150px", marginRight: "24px" }}
              onClick={handleSearch}
            >
              Search
            </CButton>
          </div>
        </div>
      </div>
      <div
        className={styles.expandDiv}
        onClick={() => showSearchDialog(!isSearchDialog)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="c-icon c-icon-xl mt-2"
          role="img"
          fill="white"
        >
          <path
            fill="white"
            d="M256.286,408.357,16.333,138.548V104H496v36.45ZM56.892,136,256.358,360.287,457.042,136Z"
            className="ci-primary"
          ></path>
        </svg>
      </div>
    </div>
  );
};

SearchBar.propTypes = propTypes;

export default SearchBar;
