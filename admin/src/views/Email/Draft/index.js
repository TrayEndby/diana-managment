import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import * as icons from "@coreui/icons";
import TheLayout from "containers/TheLayout";
import cn from "classnames";
import * as ADMIN_ROUTES from "routes";
import "react-quill-2/dist/quill.snow.css";
import styles from "./style.module.scss";
import { useHistory } from "react-router-dom";

const EmailDraftPage = () => {
  const [draftList, setDraftList] = useState([]);

  const history = useHistory();

  useEffect(() => {
    getDraftList();
  }, []);

  const getDraftList = async () => {
    // const drafts = await EmailService.getEmailTemplateList();
    setDraftList([
      { subject: "Mailing list subject1", last_modified: "Feb 22, 2020" },
      { subject: "Mailing list subject2", last_modified: "Feb 23, 2020" },
      { subject: "Mailing list subject3", last_modified: "Feb 24, 2020" },
      { subject: "Mailing list subject4", last_modified: "Feb 25, 2020" },
      { subject: "Mailing list subject5", last_modified: "Feb 26, 2020" },
      { subject: "Mailing list subject6", last_modified: "Feb 27, 2020" },
      { subject: "Mailing list subject7", last_modified: "Feb 28, 2020" },
      { subject: "Mailing list subject8", last_modified: "Feb 29, 2020" },
    ]);
  };

  return (
    <TheLayout title="Draft">
      <CCard className="">
        <CCardHeader className={styles.mainCardHeader}>
          <CButton
            color="success"
            className="float-right"
            onClick={() => history.push(ADMIN_ROUTES.EMAIL_CREATE_TEMPLATE)}
          >
            Create
          </CButton>
        </CCardHeader>
        <CCardBody className="d-flex flex-wrap">
          <div className={styles.listHeader}>
            <div className="float-left w-50 ml-4">Subject</div>
            <div className="float-right w-50">Last Modified</div>
          </div>
          <CCard className="w-100">
            {draftList.map((draft, index) => (
              <div>
                <div
                  className={styles.draftItem}
                  onClick={() => history.push(ADMIN_ROUTES.EMAIL_DRAFT_DETAIL)}
                >
                  <div className="pt-2 ml-2 h5 w-50 float-left">
                    {draft.subject}
                  </div>
                  <div className="pt-2 ml-2 h5 float-left">
                    {draft.last_modified}
                  </div>
                  <div
                    className={cn(
                      "float-right mr-2 mt-1",
                      styles.draftCardTrash
                    )}
                  >
                    <CIcon content={icons.cilTrash} />
                  </div>
                </div>
                {index !== draftList.length - 1 && (
                  <div className={styles.splitter}></div>
                )}
              </div>
            ))}
          </CCard>
        </CCardBody>
      </CCard>
    </TheLayout>
  );
};

export default EmailDraftPage;
