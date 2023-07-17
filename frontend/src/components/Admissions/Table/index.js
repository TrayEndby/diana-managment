import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import style from './style.module.scss';
import { TypeDropdown } from '../../College/MyList';
import AdmissionsService from '../../../service/AdmissionsService';
import Spinner from '../../../util/Spinner';
import { getNameFromId } from '../../../util/helpers';
import CollegeService from '../../../service/CollegeService';
import Icon from '../../../util/Icon';
import EditRowModal from '../EditRowModal';
import { DetailHead, DetailIcon } from '../Details/';
import ConfirmDialog from '../../../util/ConfirmDialog';

const AdmColumns = ['Name', 'Admissions status', 'Admissions round', 'Essay', 'Tests', 'Rec.letter', 'Interview', 'App. deadline'];

const InterviewStatusList = [
  { name: 'No', id: 2 },
  { name: 'Yes', id: 1 }
];

const compareByName = (a, b) => {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();

  let comparison = 0;
  if (nameA > nameB) {
    comparison = 1;
  } else if (nameA < nameB) {
    comparison = -1;
  }
  return comparison;
}

const removeFromList = { id: 0, name: 'Remove from list' };

const AdmissionsTable = (props) => {
  const titleRef = useRef();
  const contentRef = useRef();
  const [admTypeList, setAdmTypeList] = useState();
  const [admApplicationStatusList, setAdmApplicationStatusList] = useState();
  const [rows, setRows] = useState();
  const [isLoading, setIsLoading] = useState();
  const [showModal, setShowModal] = useState(false);
  const [dataToEdit, setDataToEdit] = useState();
  const [admissionToRemove, setAdmissionToRemove] = useState(null);

  const [allUserCollegeEssays, setAllUserCollegeEssays] = useState();
  const [allUserCollegeRecLetters, setAllUserCollegeRecLetters] = useState();
  const [allUserCollegeTests, setAllUserCollegeTests] = useState();

  const fetchAdmissionData = async () => {
    try {
      setIsLoading(true);
      const admTypeListResp = await AdmissionsService.GetCollegeAdmissionType();
      const admApplicationStatusListResp = await AdmissionsService.GetCollegeAdmissionApplicationStatus();
      const getMyList = await CollegeService.getMyList();
      const filteredMyAdmList = getMyList.filter(item => item.status !== 6);
      // remove Consider item from admission status list select
      const filteredAdmApplicationStList = admApplicationStatusListResp.filter(item => item.id !== 6);
      filteredAdmApplicationStList.push(removeFromList);

      //sorting by name in alphabetic order
      const sortedAdmApplicationStList = filteredAdmApplicationStList.sort(compareByName);
      const sortedAdmTypeListResp = admTypeListResp.sort(compareByName);

      setRows(filteredMyAdmList);
      setAdmTypeList(sortedAdmTypeListResp);
      setAdmApplicationStatusList(sortedAdmApplicationStList);

      const allUserCollegeEssaysResponse = await AdmissionsService.GetUserCollegeEssays();
      const allUserCollegeRecLetters = await AdmissionsService.GetUserCollegeRecLetters();
      const allUserCollegeTestsResponse = await AdmissionsService.GetUserCollegeTests();

      setAllUserCollegeEssays(allUserCollegeEssaysResponse);
      setAllUserCollegeRecLetters(allUserCollegeRecLetters);
      setAllUserCollegeTests(allUserCollegeTestsResponse);

    } catch (e) {
      console.error(e);
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    contentRef.current.addEventListener('scroll', () => {
      titleRef.current.scrollLeft = contentRef.current.scrollLeft;
    });

    titleRef.current.addEventListener('scroll', () => {
      contentRef.current.scrollLeft = titleRef.current.scrollLeft;
    });

    fetchAdmissionData();
  }, [])

  const parse = (string) => {
    try {
      return JSON.parse(string);
    } catch (e) {
      console.error("error string", string);
      console.error(e);
      return {};
    }
  }

  const handleChange = (name, value, collegeId) => {
    const propertyToUpdate = { [name]: +value };
    // updating in State changed row
    const updatedRows = rows.map((item) => {
      if (item.college_id === collegeId) {
        return {
          ...item,
          ...propertyToUpdate
        }
      }
      return item;
    });
    setRows(updatedRows);

    // preparing and posting changed data
    const changedRow = rows.find((item) => item.college_id === collegeId);
    const userAdmissionCollegeToUpdate = {
      ...changedRow,
      ...propertyToUpdate
    }
    CollegeService.updateMyList(userAdmissionCollegeToUpdate);
  }

  const modalOnChange = (name, value) => {
    let propertyToUpdate;
    if (name === 'RegularAdmissionDeadline') {
      propertyToUpdate = { [name]: value };
    } else {
      propertyToUpdate = { [name]: +value };
    }
    setDataToEdit({ ...dataToEdit, ...propertyToUpdate });
  }

  const handleShowEditModal = (e, collegeData, modalVariant) => {
    e.stopPropagation();
    setShowModal(modalVariant);

    const internal = parse(collegeData.internal);
    const { RegularAdmissionDeadline } = internal;
    const newCollegeData = { ...collegeData, RegularAdmissionDeadline };
    setDataToEdit(newCollegeData)
  }

  const handleSave = async () => {
    setShowModal(false);
    let payload;
    let internal

    if (dataToEdit.RegularAdmissionDeadline) {
      internal = parse(dataToEdit.internal);
      internal = { ...internal, ...{ RegularAdmissionDeadline: dataToEdit.RegularAdmissionDeadline } };
      internal = JSON.stringify(internal);
    } else {
      internal = dataToEdit.internal;
    }

    const updateUserCollegeAdmissionsData = {
      id: dataToEdit.id,
      college_id: dataToEdit.college_id,
      major_id: 1,
      status: dataToEdit.status,
      admission_type: dataToEdit.admission_type,
      recommendation_letter_required: dataToEdit?.recommendation_letter_required,
      interview_required: dataToEdit.interview_required,
      essay_required: dataToEdit?.essay_required,
      test_required: dataToEdit?.test_required,
      deadline: dataToEdit?.RegularAdmissionDeadline,
      internal,
    }
    payload = await CollegeService.updateMyList(updateUserCollegeAdmissionsData);

    if (payload.res === 1) {
      fetchAdmissionData();
    }
  }

  const handleDeleteAdmission = (item) => {
    setAdmissionToRemove(item);
  }

  const handleDelete = async (id) => {
    try {
      await CollegeService.deleteFromMyList(id);
      setAdmissionToRemove(null);
      const filteredRow = rows.filter(row => row.id !== id);
      setRows(filteredRow);
      // await this.fetchMyList(); // refresh
    } catch (e) {
      this.handleError(e);
    }
  };

  const { onSelect } = props;
  return (
    <div className={style.table}>
      <div ref={titleRef} className={style.thead}>
        <DetailHead>Details</DetailHead>
        {AdmColumns.map((item, key) => {
          if (item === 'Essay' || item === 'Tests' || item === 'Rec.letter') {
            return (
              <div key={key} className={style.theadThSmall}>
                {item}
              </div>)
          }
          return (
            <div key={key} className={style.theadTh}>
              {item}
            </div>)
        })}
      </div>
      <div ref={contentRef} className={style.tbody}>
        {isLoading ? <Spinner /> : (
          !rows ? (<p className={'text-primary'}>No colleges, please go to My colleges list to add</p>)
            : (
              <>
                {admTypeList && rows.map((item, key) => {
                  const internal = parse(item.internal);
                  const { status, college_id, admission_type, interview_required } = item;
                  const { name, RegularAdmissionDeadline } = internal;
                  const essayRequired = item?.essay_required || 1;
                  const testsRequired = item?.test_required || 0;
                  const recLetterRequired = item?.recommendation_letter_required || 2;

                  const essayCount = allUserCollegeEssays.filter(x => x.college_id === item.college_id)?.length || 0;
                  const recLettersCount = allUserCollegeRecLetters.filter(x => x.college_id === item.college_id)?.length || 0;
                  const testsCount = allUserCollegeTests.filter(x => x.college_id === item.college_id)?.length || 0;

                  const admStatusName = getNameFromId(admApplicationStatusList, +status)?.name;
                  const admTypeName = getNameFromId(admTypeList, +admission_type)?.name;
                  const interviewStatusName = getNameFromId(InterviewStatusList, +interview_required)?.name;

                  return (
                    <div key={key} className={classNames(style.tbodyRow, style.clickable)} onClick={() => { onSelect(item) }}>
                      <DetailIcon />
                      <div className={style.tbodyTd}>
                        {name}
                      </div>
                      <div className={style.tbodyTd}>
                        <TypeDropdown
                          value={admStatusName}
                          options={admApplicationStatusList}
                          onSelect={(value) => handleChange('status', value, college_id)}
                          onClick={(e) => e.stopPropagation()}
                          onRemove={() => handleDeleteAdmission(item.id)}
                        />
                      </div>
                      <div className={style.tbodyTd}>
                        <TypeDropdown
                          value={admTypeName || admTypeList[0].name}
                          options={admTypeList}
                          onSelect={(value) => handleChange('admission_type', value, college_id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className={style.tbodyTdSmall}>
                        {essayCount}/{essayRequired < essayCount ? essayCount : essayRequired}
                        <button onClick={(e) => { handleShowEditModal(e, item, 'essay') }} className={style.triangleBtn}>
                          <Icon variant="redTriangle" />
                        </button>
                      </div>
                      <div className={style.tbodyTdSmall}>
                        {testsCount}/{testsRequired < testsCount ? testsCount : testsRequired}
                        <button onClick={(e) => { handleShowEditModal(e, item, 'tests') }} className={style.triangleBtn}>
                          <Icon variant="redTriangle" />
                        </button>
                      </div>
                      <div className={style.tbodyTdSmall}>
                        {recLettersCount}/{recLetterRequired < recLettersCount ? recLettersCount : recLetterRequired}
                        <button onClick={(e) => { handleShowEditModal(e, item, 'recLetters') }} className={style.triangleBtn}>
                          <Icon variant="redTriangle" />
                        </button>
                      </div>

                      <div className={style.tbodyTd}>
                        <TypeDropdown
                          value={interviewStatusName || InterviewStatusList[0].name}
                          options={InterviewStatusList}
                          onSelect={(value) => handleChange('interview_required', value, college_id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      <div className={style.tbodyTd}>
                        {RegularAdmissionDeadline ? RegularAdmissionDeadline : 'No info'}
                        <button onClick={(e) => { handleShowEditModal(e, item, 'deadline') }} className={style.triangleBtn}>
                          <Icon variant="redTriangle" />
                        </button>
                      </div>

                    </div>
                  )
                })}
              </>))}
      </div>
      <EditRowModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onChange={modalOnChange}
        onSave={handleSave}
        RegularAdmissionDeadline={dataToEdit?.RegularAdmissionDeadline}
      />
      <ConfirmDialog
        show={admissionToRemove !== null}
        title="Remove from list"
        onSubmit={() => handleDelete(admissionToRemove)}
        onClose={() => setAdmissionToRemove(null)}
      >
        Are you sure you want to remove the college from the list?
        </ConfirmDialog>
    </div>
  )
}

export default AdmissionsTable;