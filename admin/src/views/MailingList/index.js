import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CInput,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CLabel,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import TheLayout from "containers/TheLayout";
import * as icons from "@coreui/icons";
import cn from "classnames";
import CreateMailingListModal from "./CreateMailingListModal";
import NewContactModal from "./NewContactModal";
import RenameMailingListModal from "./RenameMailingListModal";
import MailingListService from "service/Admin/MailingListService";
import DeleteMailingListModal from "./DeleteMailingListModal";
import * as ADMIN_ROUTES from "routes";
import styles from "./style.module.scss";
import { useHistory } from "react-router-dom";

const MailingListPage = () => {
  const [mailList, setMailList] = useState([]);
  const [tableOpen, setTableOpen] = useState([]);
  const [tableEdit, setTableEdit] = useState([]);
  const [showEdit, setShowEdit] = useState(-1);
  const [createModal, showCreateModal] = useState(false);
  const [addContactModal, showAddContactModal] = useState(false);
  const [renameModal, showRenameModal] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [tagNames, setTagNames] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const history = useHistory();

  useEffect(() => {
    getMailingList();
  }, []);

  const getMailingList = async () => {
    try {
      const mailingList = await MailingListService.getMailingList();
      const tagsList = [];
      const tagNameList = [];
      mailingList.forEach((mail) => {
        const filterTag = tagsList.filter((tags) => tags[0].tags === mail.tags);
        if (filterTag.length === 0) {
          tagsList.push([
            {
              tags: mail.tags,
              name: mail.name,
              id: mail.id,
              creator_id: mail.creator_id,
              creator_name: mail.creator_name,
            },
          ]);
          tagNameList.push(mail.tags);
        } else {
          filterTag[0].push({
            tags: mail.tags,
            name: mail.name,
            id: mail.id,
            creator_id: mail.creator_id,
            creator_name: mail.creator_name,
          });
        }
      });
      setMailList(tagsList);
      setTableOpen(Array(tagsList.length).fill(true));
      setTableEdit(Array(tagsList.length).fill(false));
      setTagNames(tagNameList);
    } catch (e) {
      console.log(e);
    }
  };

  const handleExpandTable = (index) => {
    setTableOpen(tableOpen.map((x, i) => (i === index ? !x : x)));
  };

  const handleEditTable = async (index, mail) => {
    if (tableEdit[index] === true) {
      mail.forEach(async (item) => {
        const updateList = item;
        try {
          if (tagNames[index] !== item.tags) {
            updateList.tags = tagNames[index];
            await MailingListService.updateMailingList(updateList);
          }
        } catch (e) {
          console.log(e);
        }
      });
    }
    setTableEdit(tableEdit.map((x, i) => (i === index ? !x : x)));
  };

  const handleShowEdit = (index) => {
    setShowEdit(index);
  };

  const handleChangeTagName = (value, index) => {
    setTagNames(tagNames.map((x, i) => (i === index ? value : x)));
  };

  return (
    <TheLayout title="Mailing Lists">
      <CCard className="">
        <CCardHeader className={styles.mainCardHeader}>
          <CButton
            color="success"
            style={{ width: "160px", float: "right" }}
            onClick={() => showCreateModal(true)}
          >
            Create Mailing List
          </CButton>
        </CCardHeader>
        <CCardBody>
          <div className="text-center mx-auto mb-3 w-25">
            <CInput
              required={false}
              type="text"
              placeholder="Search mailing list"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
          {mailList.map((mail, ind) => (
            <div className={cn(styles.mailTable, "mb-5")} key={ind}>
              <CCardText
                key={"cc"+ind}
                className={cn("h5")}
                style={{ color: "#f78154", cursor: "pointer", display: "flex" }}
                onMouseEnter={() => handleShowEdit(ind)}
                onMouseLeave={() => setShowEdit(-1)}
              >
                {tableOpen[ind] && (
                  <CIcon
                    key={"ci"+ind}
                    content={icons.cilCaretBottom}
                    className="mr-2 mt-1"
                    onClick={() => handleExpandTable(ind)}
                  />
                )}
                {!tableOpen[ind] && (
                  <CIcon
                    key={"ci"+ind}
                    content={icons.cilCaretRight}
                    className="mr-2 mt-1"
                    onClick={() => handleExpandTable(ind)}
                  />
                )}
                {!tableEdit[ind] && <CLabel>{mail[0].tags}</CLabel>}
                {tableEdit[ind] && (
                  <div className="d-flex" key={"div"+ind}>
                    <CInput
                      key={"cn"+ind}
                      type="text"
                      style={{ width: "auto", marginTop: "-5px" }}
                      value={tagNames[ind]}
                      onChange={(e) => handleChangeTagName(e.target.value, ind)}
                    />
                    <CButton
                      key={"cb"+ind}
                      color="success"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleEditTable(ind, mail)}
                    >
                      OK
                    </CButton>
                  </div>
                )}
                {!tableEdit[ind] && showEdit === ind && (
                  <CIcon
                     key={"ci"+ind}
                    content={icons.cilPencil}
                    className="ml-3 mt-1"
                    style={{ color: "grey" }}
                    onClick={() => handleEditTable(ind, mail)}
                  />
                )}
              </CCardText>
              {tableOpen[ind] && (
                <CCard>
                  {mail.map(
                    (item, index) =>
                      item.name.indexOf(searchKey) !== -1 && (
                        <div
                          key={index}
                          className="d-flex"
                          style={
                            index % 2 === 1
                              ? { backgroundColor: "#d3d3d3" }
                              : {}
                          }
                        >
                          <div
                            style={{
                              float: "left",
                              width: "calc(100% - 45px)",
                              cursor: "pointer",
                            }}
                            className="m-3"
                            onClick={() =>
                              history.push(
                                ADMIN_ROUTES.MAILING_LIST + "/" + item.id + ":" + item.name
                              )
                            }
                          >
                            {item.name}&nbsp;&nbsp;&nbsp;({item.creator_name})
                          </div>
                          <div className="mt-2" style={{ width: "45px" }}>
                            <CDropdown>
                              <CDropdownToggle></CDropdownToggle>
                              <CDropdownMenu>
                                <CDropdownItem
                                  onClick={() => {
                                    showAddContactModal(true);
                                    setCurrentItem(item);
                                  }}
                                >
                                  Add Contact
                                </CDropdownItem>
                                <CDropdownItem
                                  onClick={() => {
                                    showRenameModal(true);
                                    setCurrentItem(item);
                                  }}
                                >
                                  Rename
                                </CDropdownItem>
                                <CDropdownItem divider></CDropdownItem>
                                <CDropdownItem
                                  style={{ color: "#cd1a01" }}
                                  onClick={() => {
                                    showDeleteModal(true);
                                    setCurrentItem(item);
                                  }}
                                >
                                  Delete
                                </CDropdownItem>
                              </CDropdownMenu>
                            </CDropdown>
                          </div>
                        </div>
                      )
                  )}
                </CCard>
              )}
            </div>
          ))}
        </CCardBody>
      </CCard>
      <CreateMailingListModal
        isVisible={createModal}
        setVisible={showCreateModal}
        mailList={mailList}
        getMailingList={getMailingList}
      />
      <NewContactModal
        isVisible={addContactModal}
        setVisible={showAddContactModal}
        listId={currentItem !== null ? currentItem.id : null}
      />
      <RenameMailingListModal
        isVisible={renameModal}
        setVisible={showRenameModal}
        mailList={currentItem !== null ? currentItem : {}}
      />
      <DeleteMailingListModal
        isVisible={deleteModal}
        setVisible={showDeleteModal}
        listId={currentItem !== null ? currentItem.id : -1}
        getMailingList={getMailingList}
      />
    </TheLayout>
  );
};

export default MailingListPage;
