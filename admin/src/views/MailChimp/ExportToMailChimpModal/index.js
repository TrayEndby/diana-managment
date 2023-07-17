import React, { useCallback, useState, useEffect } from "react";
import {
  CAlert,
  CButton,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CInput,
  CInputGroup,
  CInputGroupAppend,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from "@coreui/react";

import PropTypes from "prop-types";
import MailChimpService from "service/Admin/MailChimpService";

const propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  tagName: PropTypes.string,
  inputList: PropTypes.array,
  checkList: PropTypes.array,
};

const ExportToMailChimpModal = ({
  isVisible,
  setVisible,
  tagName,
  inputList,
  checkList,
}) => {
  const [mailingList, setMailingList] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [selectedListName, setSelectedListName] = useState('');
  const [tagList, setTagList] = useState([]);
  const [addedTagString, setAddedTagString] = useState('');
  const [addedTagList, setAddedTagList] = useState([]);
  const [errorText, setErrorText] = useState('');
  const [checkedInput, setCheckedInput] = useState([]);
  const [checkedInputSize, setCheckedInputSize] = useState(0);
  const [exported, setExported] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const exportMailingList = async () => {
    if (!selectedListName && !selectedList) {
      setErrorText('Please select a list to export to.');
      return;
    }
    setLoading(true);
    let ml = {
      chimp_id: '',
      name: selectedListName,
      member: [],
      segment: [],
    };
    if (selectedList) {
     if (selectedList.name === selectedListName) {
       ml.chimp_id = selectedList.chimp_id;
       ml.name = selectedList.name;
     }
    }
    addedTagList.forEach((value, index) => {
      ml.segment.push({
        id: value.id,
        name: value.name,
      });
    });
    checkedInput.forEach((value, index) => {
      ml.member.push({
        email: value.email,
        first_name: value.first_name,
        last_name: value.last_name,
        role_name: value.role,
        country: value.country,
        state: value.state,
        phone: value.phone,
        zip_code: value.zip_code,
        csa_code: value.csa_code,
      });
    });
    console.log(ml);
    try {
      let counts = await MailChimpService.createList(ml);
      setErrorText(JSON.stringify(counts));
      setExported(true);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const getTagsByListId = async (id) => {
    if (id) {
      const tags = await MailChimpService.getListSegment(id);
      setTagList(tags);
    }
  };

  const setAddedTagStringFromList = (list) => {
    let tags = [];
    let added = new Set();
    list.forEach((value, index) => {
      if (!added.has(value.name)) {
        tags.push(value.name);
        added.add(value.name);
      }
    });
    setAddedTagString(tags.join('; '));
  };

  const setAddedTagListFromString = useCallback(async (tagString) => {
    const re = /\s*(?:;|$)\s*/;
    const tags = tagString.split(re);
    let addedTags = [];
    let added = new Set();
    tags.forEach((value, index) => {
      if (value && !added.has(value)) {
        added.add(value);
        let found = false;
        tagList.forEach((v, i) => {
          if (v.name === value) {
            addedTags.push(v);
            found = true;
          }
        })
        if (!found) {
          addedTags.push({
            name: value,
            id: 0,
          });
        }
      }
    });
    setAddedTagList(addedTags);
  }, [tagList]);

  useEffect(() => {
    const getMailingList = async () => {
      const list = await MailChimpService.getList();
      setMailingList(list);
      const checked = inputList.filter((value, index) => {
        return checkList[index];
      });
      setCheckedInput(checked);
      setCheckedInputSize(checked.length);
    };
    getMailingList();
    setErrorText('');
    setAddedTagString(tagName);
    setAddedTagListFromString(tagName);
  }, [inputList, checkList, setAddedTagString, setAddedTagListFromString, tagName]);

  return (
    <CModal size="lg" show={isVisible} onClose={() => setVisible(false)}>
      <CModalHeader
        closeButton
        style={{ backgroundColor: "#152332", color: "white" }}
      >
        <CModalTitle>Export to MailChimp: {checkedInputSize} addresses</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>
          <CLabel>Export to list</CLabel>
          <CInputGroup>
            <CInput
              required={false}
              type="text"
              value={selectedListName}
              onChange={(e) => {
                setExported(false);
                setSelectedListName(e.target.value);
              }}
            />
            <CInputGroupAppend>
              <CDropdown>
                <CDropdownToggle caret color="info">
                  Select an existing list
                </CDropdownToggle>
                <CDropdownMenu>
                  {
                    mailingList.map((value, index) => {
                      return (
                        <CDropdownItem key={index} onClick={() => {
                            setSelectedList(value);
                            setSelectedListName(value.name);
                            getTagsByListId(value.chimp_id);
                            setExported(false);
                        }}>
                          {value.name}
                        </CDropdownItem>);
                    })
                  }
                </CDropdownMenu>
              </CDropdown>
            </CInputGroupAppend>
          </CInputGroup>

          <CLabel>Add tags</CLabel>
          <CInputGroup>
            <CInput
              required={false}
              type="text"
              value={addedTagString}
              onChange={(e) => {
                setAddedTagString(e.target.value);
                setAddedTagListFromString(e.target.value);
              }}
            />
            <CInputGroupAppend>
              <CDropdown>
                <CDropdownToggle caret color="info">
                  Add an existing tag
                </CDropdownToggle>
                <CDropdownMenu>
                  {
                    tagList.map((value, index) => {
                      return (
                        <CDropdownItem key={index} onClick={() => {
                          let newList = addedTagList;
                          newList.push(value);
                          setAddedTagList(newList);
                          setAddedTagStringFromList(newList);
                        }}>
                          {value.name}
                        </CDropdownItem>);
                    })
                  }
                </CDropdownMenu>
              </CDropdown>
            </CInputGroupAppend>
          </CInputGroup>
          <div>
            {
              addedTagList.map((value, index) => {
                return (
                  <CButton key={index}
                    style={{margin: "2px"}}
                    disabled={true}
                    color="success">
                    {value.name}
                  </CButton>
                )
              })
            }
          </div>
          <CAlert color="secondary" closeButton={true} show={errorText !== ""}>
            {errorText}
          </CAlert>
        </div>
      </CModalBody>
      <CModalFooter>
        {isLoading &&
          <CSpinner
            color="success"
            style={{float: "left", width:'2rem', height:'2rem'}}
          />
        }
        <CButton
          color="dark"
          onClick={() => {
            setVisible(false);
          }}
        >
        {exported || isLoading ? "OK" : "Cancel"}
        </CButton>{" "}
       {exported || isLoading ||
          <CButton
            color="success"
            onClick={() => {
              exportMailingList();
            }}
          >
            Save
          </CButton>
       }
      </CModalFooter>
    </CModal>
  );
};

ExportToMailChimpModal.prototype = propTypes;

export default ExportToMailChimpModal;
