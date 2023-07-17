import React, { useState, useEffect } from "react";
import {
  CInput,
  CButton,
  CSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CCol,
} from "@coreui/react";
import PropTypes from "prop-types";
import CountryListInput from "../CountryListInput";
import MailingListService from "service/Admin/MailingListService";
import UserProfileService from "service/UserProfileListService";

const propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  listId: PropTypes.number,
  getContactsList: PropTypes.func,
};

const NewContactModal = ({ isVisible, setVisible, listId, getContactsList }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [role, setRole] = useState(0);
  const [country, setCountry] = useState(null);
  const [roleList, setRoleList] = useState([]);

  useEffect(() => {
    getRoleList();
  }, []);

  const getRoleList = async () => {
    let roles = await UserProfileService.listName(6);
    roles = roles.nameIds;
    setRoleList(roles);
  };

  const addContact = async () => {
    console.log(listId);
    if (listId === null) return;
    const contact = {
      id: listId,
      member: [
        {
          email,
          first_name: firstName,
          last_name: lastName,
          role,
          zip_code: zipCode,
          country,
        },
      ],
    };
    console.log("contact", contact);
    try {
      await MailingListService.addMailingUsers(contact);
      if (getContactsList) {
        await getContactsList();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <CModal show={isVisible} onClose={() => setVisible(false)} size={"lg"}>
      <CModalHeader
        closeButton
        style={{ backgroundColor: "#152332", color: "white" }}
      >
        <CModalTitle>Add New Contact</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol>
            <div>First Name</div>
            <div>
              <CInput
                required={false}
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="mt-3">Role</div>
            <div>
              <CSelect
                custom
                style={{ color: "#0b0b0b" }}
                value={role || 0}
                placeholder="Choose..."
                onChange={(e) => {
                  setRole(e.target.value);
                  console.log("role", e);
                }}
              >
                <option value="0">Select Role...</option>
                {roleList.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </CSelect>
            </div>
            <div className="mt-3">Country</div>
            <div>
              <CountryListInput
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </CCol>
          <CCol>
            <div>Last Name</div>
            <div>
              <CInput
                required={false}
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="mt-3">Contact email</div>
            <div>
              <CInput
                required={false}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-3">Zip code</div>
            <div>
              <CInput
                required={false}
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
          </CCol>
        </CRow>
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
        <CButton
          color="success"
          onClick={() => {
            addContact();
            setVisible(false);
          }}
        >
          Add contact
        </CButton>{" "}
      </CModalFooter>
    </CModal>
  );
};

NewContactModal.prototype = propTypes;

export default NewContactModal;
