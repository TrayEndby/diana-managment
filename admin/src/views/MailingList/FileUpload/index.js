import React, { useRef } from "react";
import PropTypes from "prop-types";
import { CButton } from "@coreui/react";
import csv from "csv";
import UserProfileService from "service/UserProfileListService";
import MailingListService from "service/Admin/MailingListService";

const propTypes = {
  className: PropTypes.string,
  mailId: PropTypes.number,
  getContactsList: PropTypes.func,
};

const FileUpload = ({ mailId, getContactsList, className }) => {
  const inputFile = useRef(null);

  const handleFileUpload = async (e) => {
    const { files } = e.target;
    if (files && files.length) {
      let roleList = await UserProfileService.listName(6);
      roleList = roleList.nameIds;
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        const members = [];
        csv.parse(fileContent, async (err, data) => {
          if (err) return;
          for (let i = 1; i < data.length; i++) {
            const email = data[i][1];
            const first_name = data[i][2];
            const last_name = data[i][3];
            const role_string = data[i][4];
            const zip_code = data[i][6];
            const country = data[i][7];
            const roleMatch = roleList.filter(
              (role) => role.name.toUpperCase() === role_string.toUpperCase()
            );
            let role = 0;
            if (roleMatch.length > 0) {
              role = roleMatch[0].id;
            }
            if (first_name === "" && last_name === "" && email === "") continue;
            const addMember = {
              email,
              first_name,
              last_name,
              role,
              zip_code,
              country,
            };
            members.push(addMember);
          }
          console.log(members);
          const mailList = {
            id: mailId,
            member: members,
          };
          console.log(mailList);
          await MailingListService.addMailingUsers(mailList);
          getContactsList();
        });
      };
      reader.readAsBinaryString(files[0]);
    }
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  return (
    <div className={className}>
      <input
        style={{ display: "none" }}
        accept=".csv"
        ref={inputFile}
        onChange={handleFileUpload}
        type="file"
      />
      <CButton onClick={onButtonClick} color="success">
        Import CSV File
      </CButton>
    </div>
  );
};

FileUpload.prototype = propTypes;

export default FileUpload;
