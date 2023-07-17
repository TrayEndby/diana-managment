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
  CInput,
  CSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";

import ExportToMailChimpModal from "views/MailChimp/ExportToMailChimpModal";
import TheLayout from "containers/TheLayout";
import AuthService from "service/AuthService";
import UserService from "service/Admin/UserService";
import MailingListService from "service/Admin/MailingListService";
import UserProfileService from "service/UserProfileListService";
import styles from "./style.module.scss";
import formatPhone from "views/utils"
import ConfirmDialog from "../../util/ConfirmDialog"

const UserSignUp = () => {
  const itemsPerPage = 20;
  const [isloading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  const [selectType, setSelectType] = useState(1);
  const [checkList, setCheckList] = useState([]);
  const [topCheck, setTopCheck] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDropdown, setShowDropDown] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [modal, setModal] = useState(false);
  const [mailingTitle, setMailingTitle] = useState("");
  const [createFolder, setCreateFolder] = useState(true);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [showExportToMailChimp, setShowExportToMailChimp] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const keyList = useMemo(() => [
    "username",
    "role",
    "verified_role",
    "country",
    "state",
    "zip",
    "signedUpDate",
    "amount",
    "paymentStatus",
    "email",
    "phone",
    "csa_code",
    "csa_referral_code",
  ], []);

  const getSignupUserList = useCallback(async (searchParam) => {
    try {
      setLoading(true);
      let roleList = await UserProfileService.listName(6);
      roleList = roleList.nameIds;
      const signedUserList = await UserService.getSignedUpUsers(searchParam);

      let no = 0;
      const paymentStatus = ["Paid", "Unpaid"];

      const getRoleArray = (roleIds) => {
        let roleArray = [];
        if (roleIds != null) {
          roleArray = roleIds.map((x) => {
            const thisRole = roleList.filter((role) => role.id === x);
            if (thisRole.length > 0) return thisRole[0].name;
            else return "";
          });
        }
        return roleArray;
      }

      const userTypesToArray = (types) => {
        var i;
        let bit = 1;
        let roleArray = [];
        for (i = 0; i < 32; i++) {
          if ((types & bit) === bit) {
            roleArray.push(i + 1);
          }
          bit = bit * 2;
        }
        return roleArray;
      }

      const signedList = signedUserList.map((user) => {
        let roleArray = getRoleArray(user.role);
        let verifiedRoleArray = getRoleArray(userTypesToArray(user.userTypes))

        let phone = "";
        if (user.phone) {
          phone = formatPhone(user.phone);
        }
        if (user.mobile_phone) {
          if (phone) {
            phone = phone + ", ";
          }
          phone = phone + formatPhone(user.mobile_phone) + "(M)";
        }
        no += 1;
        let entry = {
          ...user,
          username: `${user.firstName} ${user.lastName}`,
          signedUpDate: user.signedUpDate.substr(0, 10),
          paymentStatus: paymentStatus[parseInt(user.paymentStatus) - 1],
          role: roleArray.join(", "),
          roleArray: roleArray,
          verified_role: verifiedRoleArray.join(", "),
          phone: phone,
          no: no,
        };
        keyList.forEach((key) => {
          if (entry[key] == null) {
            entry[key] = "";
          }
        });
        return entry;
      });
      setCheckList(Array(signedList.length).fill(false));
      setUserList(signedList);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }, [keyList])

  useEffect(() => {
    getMailingFolderList();
    getSignupUserList();
  }, [getSignupUserList]);

  const fields = [
    { label: "Select", key: "selectKey", _style: { width: "1%" } },
    { label: "#", key: "rowNo", _style: {width: "1%"} },
    { label: "Username", key: "username" },
    { label: "Role", key: "role" },
    { label: "Verified Role", key: "verified_role" },
    { label: "Country", key: "country" },
    { label: "State", key: "state" },
    { label: "Zip Code", key: "zip" },
    { label: "Signed Up", key: "signedUpDate" },
    { label: "Amount", key: "amount" },
    { label: "Payment Status", key: "paymentStatus" },
    { label: "Contact", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "CSA Code", key: "csa_code" },
    { label: "CSA Referral", key: "csa_referral_code" },
  ];

  const approveRole = (roleName, approve) => {
    if (roleName !== "CSA" && roleName !== "Educator") {
      setError("Only CSA or Educator Role is supported.");
      setShowError(true);
      return;
    }
    let hasNonRole = false;
    const checked = userList.filter((value, index) => {
      if (checkList[index] && !value.roleArray.includes(roleName)) {
        hasNonRole = true;
      }
      return checkList[index];
    });
    if (hasNonRole) {
      setError("Caution: some accounts do not have " + roleName + " roles.");
      setShowError(true);
    }
    let msg = approve ? "You are about to approve " : "You are about to revoke ";
    setConfirmAction({
      show: true,
      title: "Please confirm:",
      onClose: () => {setConfirmAction(null)},
      onSubmit: () => {actualApprove(roleName, approve, checked)},
      message: msg + checked.length.toString() + " " + roleName + ".",
    });
  };

  const actualApprove = async (roleName, approve, checked) => {
    let mailList = {
      members: [],
      fromName: "Kyros",
      ccEmail: AuthService.getEmail(),
      ccName: AuthService.getDisplayName(),
    }
    let roleId = 0;
    if (roleName === "CSA") {
      mailList.template = "CSA Approved Welcome Email";
      roleId = 2;
    } else if (roleName === "Educator") {
      mailList.template = "Educator Approved Welcome Email";
      roleId = 10;
    }
    let userRoles = checked.map((value, index) => {
      mailList.members.push({
        email: value.email,
        first_name: value.firstName,
        last_name: value.lastName,
      })
      return {
        email: value.email,
        roles: [roleId],
      };
    });
    if (approve) {
      await UserService.approveRoles(userRoles, mailList);
    } else {
      await UserService.revokeRoles(userRoles);
    }
    await getSignupUserList();
  };

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

  const handleSort = (field) => {
    if (field.asc) userList.sort((a, b) => a[field.column] - b[field.column]);
    else userList.sort((a, b) => b[field.column] - a[field.column]);
  };

  const getMailingFolderList = async () => {
    const mailingList = await MailingListService.getMailingList();
    const tags = [];
    mailingList.forEach((mail) => {
      if (tags.indexOf(mail.tags) === -1) tags.push(mail.tags);
    });
    setTagList(tags);
  };

  const saveMailingList = () => {
    if (mailingTitle === "" || mailingTitle === " ") return;
    if (createFolder && folderName === "0") return;
    if (!createFolder && newFolderName === "") return;

    const checkedMembers = [];
    checkList.forEach((check, ind) => {
      if (check) {
        const thisUser = userList[ind];
        checkedMembers.push({
          first_name: thisUser.firstName,
          last_name: thisUser.lastName,
          email: thisUser.email,
          // role: thisUser.role,
          role: 1,
        });
      }
    });
    const mailingList = {
      name: mailingTitle,
      member: checkedMembers,
    };
    if (createFolder) {
      mailingList.tags = folderName;
    } else {
      mailingList.tags = newFolderName;
    }
    try {
      MailingListService.createMailingList(mailingList);
    } catch (e) {
      console.log(e);
    }
    setMailingTitle("");
    setNewFolderName("");
  };

  return (
    <TheLayout title="User Sign Up Report">
      <CAlert color="primary" show={showError} closeButton onShowChange={(v) => setShowError(v)}>
        {error}
      </CAlert>
      <CCard>
        <CCardHeader>
          <CButton
            color="success"
            shape="pill"
            style={{ marginRight: "24px", float: "left" }}
            onClick={() => getSignupUserList()}
          >
            Refresh
          </CButton>

          <CButton
            color="success"
            style={{ width: "200px", marginRight: "24px", float: "right" }}
            onClick={() => {
              setMailingTitle("");
              setNewFolderName("");
              setCreateFolder(true);
              setModal(true);
            }}
          >
            Generate mailing list
          </CButton>
          <CButton
            color="success"
            style={{ marginRight: "24px", float: "right" }}
            onClick={() => setShowExportToMailChimp(true)}
          >
            Export to MailChimp
          </CButton>

          <CDropdown
            style={{ marginRight: "24px", float: "right" }}
          >
            <CDropdownToggle caret color="success">
              Approve
            </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => approveRole("CSA", true)}>
                  CSA
                </CDropdownItem>
                <CDropdownItem onClick={() => approveRole("Educator", true)}>
                  Educator
                </CDropdownItem>
              </CDropdownMenu>
          </CDropdown>

          <CDropdown
            style={{ marginRight: "24px", float: "right" }}
          >
            <CDropdownToggle caret color="success">
              Revoke
            </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => approveRole("CSA", false)}>
                  CSA
                </CDropdownItem>
                <CDropdownItem onClick={() => approveRole("Educator", false)}>
                  Educator
                </CDropdownItem>
              </CDropdownMenu>
          </CDropdown>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            items={userList}
            fields={fields}
            itemsPerPage={itemsPerPage}
            pagination
            tableFilter
            columnFilter
            onFilteredItemsChange={(items) => {setFilteredItems(items)}}
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
                  <CButton
                    className="dropdown-toggle btn btn-black ml-3"
                    aria-expanded="false"
                    aria-haspopup="true"
                    aria-label="Dropdown toggle"
                    onClick={() => setShowDropDown(!showDropdown)}
                  ></CButton>
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
        <div className={styles.dropdownItem}
          style={{ backgroundColor: selectType === 1 ? "lightgreen" : "white" }}
          onClick={() => handleCheckType(1)}>
          All on this page
        </div>
        <div className={styles.dropdownItem}
          style={{ backgroundColor: selectType === 2 ? "lightgreen" : "white" }}
          onClick={() => handleCheckType(2)}>
          All pages
        </div>
      </div>
      <CModal show={modal} onClose={setModal}>
        <CModalHeader
          closeButton
          style={{ backgroundColor: "#152332", color: "white" }}
        >
          <CModalTitle>Generate mailing list</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>Mailing list title</div>
          <div>
            <CInput
              required={false}
              type="text"
              value={mailingTitle}
              onChange={(e) => setMailingTitle(e.target.value)}
            />
          </div>
          {createFolder && (
            <div>
              <div className="mt-3">Save to folder</div>
              <div>
                <CSelect
                  custom
                  style={{ color: "#0b0b0b" }}
                  value={folderName}
                  placeholder="Choose..."
                  onChange={(e) => setFolderName(e.target.value)}
                >
                  <option value="0">Choose Mailing Folder...</option>
                  {tagList.map((tag, index) => (
                    <option key={index} value={tag}>
                      {tag}
                    </option>
                  ))}
                </CSelect>
              </div>
              <div
                className="mt-3 w-50"
                style={{ color: "#53a548", cursor: "pointer" }}
                onClick={() => setCreateFolder(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="c-icon c-icon-lg"
                  role="img"
                >
                  <polygon
                    fill="var(--ci-primary-color, currentColor)"
                    points="440 240 272 240 272 72 240 72 240 240 72 240 72 272 240 272 240 440 272 440 272 272 440 272 440 240"
                    className="ci-primary"
                  ></polygon>
                </svg>{" "}
                Create new folder
              </div>
            </div>
          )}
          {!createFolder && (
            <div>
              <div className="mt-3">Creating folder name</div>
              <div>
                <CInput
                  required={false}
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>
              <div
                className="mt-3 w-50"
                style={{ color: "#53a548", cursor: "pointer" }}
                onClick={() => setCreateFolder(true)}
              >
                Select from mailing list
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="success"
            onClick={() => {
              saveMailingList();
              setModal(false);
            }}
          >
            Save
          </CButton>{" "}
        </CModalFooter>
      </CModal>
      {showExportToMailChimp && (
        <ExportToMailChimpModal
          isVisible={showExportToMailChimp}
          setVisible={setShowExportToMailChimp}
          tagName={"Signed In Users"}
          inputList={userList}
          checkList={checkList}
        />
      )}
      {confirmAction !== null && (<ConfirmDialog action={confirmAction}/>)}
    </TheLayout>
  );
}

export default UserSignUp;
