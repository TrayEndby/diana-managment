import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CCardText,
  CInputCheckbox,
} from "@coreui/react";

import TheLayout from "containers/TheLayout";
import MailingListService from "service/Admin/MailingListService";
import UserProfileService from "service/UserProfileListService";
import NewContactModal from "../NewContactModal";
import CopyContactsModal from "../CopyContactsModal";
import DeleteContactsModal from "../DeleteContactsModal";
import FileUpload from "../FileUpload";
import * as ADMIN_ROUTES from "routes";
import styles from "./style.module.scss";
import { useLocation, useHistory } from "react-router-dom";
import { getState } from "../../EventRegistration/util";

const propTypes = {};

const MailingListDetail = () => {
  const [isloading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  const [showList, setShowList] = useState([]);
  const [selectType, setSelectType] = useState(1);
  const [checkList, setCheckList] = useState(Array(10).fill(false));
  const [topCheck, setTopCheck] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDropdown, setShowDropDown] = useState(false);
  const [copyModal, showCopyModal] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [addContactModal, showAddContactModal] = useState(false);
  const [currentId, setCurrentMailId] = useState(0);
  const [selectedContactList, setSelectedContactList] = useState([]);
  const [mailListName, setMailListName] = useState(null);

  const location = useLocation();
  const history = useHistory();
  const itemsPerPage = 20;

  const keyList = useMemo(() => [
    "no",
    "first_name",
    "last_name",
    "country",
    "state",
    "zip_code",
    "email",
  ], []);

  const refreshContactsList = useCallback(async (id) => {
    let cnt = 0;
    if (id === 0) {
      id = currentId;
    }
    try {
      setLoading(true);
      let roleList = await UserProfileService.listName(6);
      roleList = roleList.nameIds;
      let mailingList = await MailingListService.getMailingUsers(id);
      
      const mailId = mailingList[0].id;
      mailingList = mailingList[0].member;
      if (mailingList == null) {
        setUserList([]);
        setShowList([]);
        setLoading(false);
        return;
      }
      const signedList = mailingList.map((user) => {
        let userRole = user.role || "";
        if (userRole != null) {
          const thisRole = roleList.filter((role) => role.id === userRole);
          if (thisRole.length > 0) userRole = thisRole[0].name;
          else userRole = "";
        }
        cnt++;
        let state = getState(user.zip_code);
        state = state.state;
        keyList.forEach((key) => {
          if (user[key] == null) user[key] = "";
        });
        return {
          ...user,
          id: mailId,
          no: cnt,
          state,
          roleId: user.role,
          role: userRole,
        };
      });
      setCheckList(Array(signedList.length).fill(false));
      setUserList(signedList);
      setShowList(signedList);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }, [keyList, currentId])

  const getContactsList = useCallback(() => {
    const mlIdName = location.pathname.substr(
      location.pathname.indexOf("list/") + 5
    );
    const [id, name] = mlIdName.split(":", 2);
    setMailListName(name);
    setCurrentMailId(id);
    refreshContactsList(id);
  }, [location.pathname, refreshContactsList])

  useEffect(() => {
    getContactsList();
  }, [getContactsList]);

  const fields = [
    { label: "Select", key: "selectKey", _style: { width: "1%" } },
    { label: "No", key: "no", _style: { width: "3%" } },
    { label: "First Name", key: "first_name", _style: { width: "10%" } },
    { label: "Last Name", key: "last_name", _style: { width: "10%" } },
    { label: "Role", key: "role", _style: { width: "10%" } },
    { label: "Country", key: "country", _style: { width: "10%" } },
    { label: "State", key: "state", _style: { width: "10%" } },
    { label: "Zip Code", key: "zip_code", _style: { width: "8%" } },
    { label: "Contact", key: "email", _style: { width: "20%" } },
  ];

  const handleCheck = (item) => {
    const index = item.no - 1;
    if (checkList[index] === true) {
      setTopCheck(false);
    }
    const newCheckList = checkList.map((x, i) => (i === index ? !x : x));
    setCheckList(newCheckList);
  };

  const handleTopCheckbox = (e) => {
    if (selectType === 1) {
      const newCheckList = checkList.map((x, ind) =>
        ind >= currentPage * itemsPerPage && ind < (currentPage + 1) * itemsPerPage
          ? e.target.checked
          : x
      );
      setCheckList(newCheckList);
    }
    if (selectType === 2) {
      setCheckList(Array(checkList.length).fill(e.target.checked));
    }
    setTopCheck(e.target.checked);
  };

  const handleCheckType = (type) => {
    setSelectType(type);
    setShowDropDown(false);
  };

  const handleSort = (field) => {
    if (field.asc) userList.sort((a, b) => a[field.column] - b[field.column]);
    else userList.sort((a, b) => b[field.column] - a[field.column]);
  };

  const getSelectedList = () => {
    const selectedList = [];
    checkList.forEach((x, i) => {
      if (x) {
        selectedList.push(showList[i]);
      }
    });
    setSelectedContactList(selectedList);
  };

  return (
    <TheLayout title={"Members - " + mailListName}>
      <CCard>
        <CCardHeader>
          <CCardText
            className={styles.backText}
            onClick={() => history.push(ADMIN_ROUTES.MAILING_LIST)}
          >
            &lt; Back
          </CCardText>
          <CButtonGroup className="float-right">
            <CButton
              color="success"
              onClick={() => {
                showDeleteModal(true);
                getSelectedList();
              }}
            >
              Delete
            </CButton>
            <CButton
              className="float-right"
              color="success"
              onClick={() => {
                showCopyModal(true);
                getSelectedList();
              }}
            >
              Copy to
            </CButton>
            <CButton
              color="success"
              onClick={() => {
                showAddContactModal(true);
              }}
            >
              Add 
            </CButton>
            <FileUpload
              mailId={currentId}
              getContactsList={getContactsList}
            />
          </CButtonGroup>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            items={showList}
            fields={fields}
            itemsPerPage={itemsPerPage}
            tableFilter
            pagination
            loading={isloading ? true : false}
            border
            sorter
            onSorterValueChange={(field) => handleSort(field)}
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
              selectKey: (item) => (
                <td>
                  <CInputCheckbox
                    style={{ marginLeft: "10px" }}
                    onChange={() => handleCheck(item)}
                    checked={checkList[item.no - 1]}
                  ></CInputCheckbox>
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
        <div className={styles.dropdownItem} onClick={() => handleCheckType(1)}
          style={{ backgroundColor: selectType === 1 ? "lightgreen" : "white" }}>
          This page
        </div>
        <div className={styles.dropdownItem} onClick={() => handleCheckType(2)}
          style={{ backgroundColor: selectType === 2 ? "lightgreen" : "white" }}>
          All pages
        </div>
      </div>
      <CopyContactsModal
        isVisible={copyModal}
        setVisible={showCopyModal}
        contactList={selectedContactList}
      />
      <DeleteContactsModal
        isVisible={deleteModal}
        setVisible={showDeleteModal}
        contactList={selectedContactList}
        getContactsList={getContactsList}
      />
      <NewContactModal
        isVisible={addContactModal}
        setVisible={showAddContactModal}
        listId={currentId}
        getContactsList={getContactsList}
      />
    </TheLayout>
  );
};

MailingListDetail.prototype = propTypes;

export default MailingListDetail;
