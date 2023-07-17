import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CDataTable,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import TheLayout from "containers/TheLayout";
import emailService from "service/Admin/EmailService";
import authService from "service/AuthService";
import * as ADMIN_ROUTES from "routes";
import "react-quill-2/dist/quill.snow.css";
import styles from "./style.module.scss";
import TemplatePreviewModal from "./TemplatePreviewModal";
import DeleteModal from "./DeleteModal";
import { useHistory } from "react-router-dom";

const EmailTemplatePage = () => {
  const [templateList, setTemplateList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [previewModal, showPreviewModal] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState("");
  const [userName, setUserName] = useState("");
  const history = useHistory();

  useEffect(() => {
    getTemplateList();
    getUserName();
  }, [userName]);

  const getUserName = () => {
    setUserName(authService.getDisplayName());
  };

  const templateFields = [
    'name',
    { key: 'subject', _style: { width: '20%'} },
    { key: 'description', _style: { width: '20%'} },
    'creator',
    { key: 'updated_ts', label: 'Updated'},
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      sorter: false,
      filter: false
    }
  ];

  const getTemplateList = async () => {
    try {
      setLoading(true);
      let templates = await emailService.getEmailTemplateList();
      let newTemplateList = [];
      templates.forEach((template, index) => {
        let newTemplate = {
          creator: template.creator || '',
          creator_id: template.creator_id || '',
          description: template.description || '',
          name: template.name || '',
          subject: template.subject || '',
          updated_ts: template.updated_ts,
        };
        newTemplateList.push(newTemplate);
        if (index === templates.length - 1) {
          setTemplateList(newTemplateList);
        }
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const showTemplateDetails = async (item) => {
    let template = templateList.find(
      (e) => { return e.name === item.name }
    )
    let templateDetail = await emailService.getEmailTemplate(template.name);
    template.html = templateDetail[0].template;
    template.prewview = templateDetail[0].template.replace(
      "background-color: grey;",
      "background-color: white;display: flex;font-size:x-small;"
    );
    setCurrentTemplate(template.name);

    showPreviewModal(true);
  };

  return (
    <TheLayout title="Email Templates">
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
        {!isLoading && (
          <CCardBody>
            <CDataTable
              items={templateList}
              fields={templateFields}
              tableFilter
              footer
              itemsPerPageSelect
              itemsPerPage={20}
              hover
              sorter
              responsive
              pagination
              scopedSlots = {{
                'show_details':
                  (item, index) => {
                    return (
                      <td className="py-2">
                        <CButton
                          color="primary"
                          variant="outline"
                          size="sm"
                          onClick={()=>{showTemplateDetails(item)}}
                        >
                          <CIcon content={freeSet.cilDescription} size="sm" />
                        </CButton>
                      </td>
                    )
                  }
              }}
            />
          </CCardBody>
        )}
      </CCard>
      <TemplatePreviewModal
        isVisible={previewModal}
        setVisible={showPreviewModal}
        templateName={currentTemplate}
        showDelete={showDeleteModal}
      />
      <DeleteModal
        isVisible={deleteModal}
        setVisible={showDeleteModal}
        templateName={currentTemplate}
        getTemplateList={getTemplateList}
      />
    </TheLayout>
  );
};

export default EmailTemplatePage;
