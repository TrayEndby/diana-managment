import React, { useState, useEffect, useRef } from 'react';
import { TypeDropdown } from '../../../College/MyList';
import style from '../../Table/style.module.scss';
import Button from 'react-bootstrap/Button';
import {
  Link
} from 'react-router-dom';
import * as ROUTES from '../../../../constants/routes';
import AddRowModal from '../../AddRowModal';
import { EssayStatus } from './mock';
import AdmissionsService from '../../../../service/AdmissionsService';
import Spinner from '../../../../util/Spinner';
import { getNameFromId } from '../../../../util/helpers';
import { TAB_NAMES } from '../index';
import { Trash } from 'react-bootstrap-icons';
import ConfirmDialog from '../../../../util/ConfirmDialog';
import cn from 'classnames';

const API_ADM_CATEGORIES = {
  TEST_SCORES: 'Test Scores',
  IMPORTANCE: 'importance',
  ESSAY: 'Essay prompt',
  REC_LETTERS: 'recommendation letters',
  INTERVIEW: 'Interview'
}

const DetailsTable = (props) => {
  const titleRef = useRef();
  const contentRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [importanceList, setImportanceList] = useState();
  const [selectedData, setSelectedData] = useState();
  const [columns, setColumns] = useState(props.data.columns);
  const [rows, setRows] = useState([]);
  const [modalData, setModalData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [duplicationError, setDuplicationError] = useState(false);
  // for test scores tab
  const [testsStatusList, setTestsStatusList] = useState();
  const [testsList, setTestsList] = useState();
  // for essay tab
  const [essayStatusList, setEssayStatusList] = useState();
  // for reccomendation letters tab
  const [recLettersStatusList, setRecLettersStatusList] = useState();
  // for interview tab
  const [interviewStatusList, setInterviewStatusList] = useState();

  const fetchAdmissionData = async () => {
    try {
      setIsLoading(true);
      const admissionsCatStatus = await AdmissionsService.GetCollegeAdmissionCategoryStatus();
      const importanceListResponse = admissionsCatStatus.filter(item => item.category === API_ADM_CATEGORIES.IMPORTANCE);
      setImportanceList(importanceListResponse);

      let addRowData;
      switch (props.variant) {
        case TAB_NAMES.TEST_SCORES:
          addRowData = await fetchTestScoresData(admissionsCatStatus, importanceListResponse, props.collegeInfo.college_id);
          break;
        case TAB_NAMES.ESSAYS:
          addRowData = await fetchEssaysData(admissionsCatStatus, importanceListResponse, props.collegeInfo.college_id);
          break;
        case TAB_NAMES.REC_LETTERS:
          addRowData = await fetchRecLettersData(admissionsCatStatus, importanceListResponse, props.collegeInfo.college_id);
          break;
        case TAB_NAMES.INTERVIEW:
          addRowData = await fetchInterviewData(admissionsCatStatus, importanceListResponse, props.collegeInfo.college_id);
          break;
        default: addRowData = [];
      }

      setRows(addRowData);
    } catch (e) {
      console.error(e);
    }
    finally {
      setIsLoading(false)
    }
  }

  const fetchTestScoresData = async (admissionsCatStatus, importanceList, collegeId) => {
    const testsStatusListResponse = admissionsCatStatus.filter(item => item.category === API_ADM_CATEGORIES.TEST_SCORES);
    setTestsStatusList(testsStatusListResponse);
    let testsListResponse = await AdmissionsService.GetUserProfileTestInfos();
    setTestsList(testsListResponse);

    // calculate overallScore to each test
    testsListResponse = testsListResponse.map((test) => {
      const overallScore = test.name_scores.reduce((prev, cur) => prev + cur.score, 0);
      return {
        ...test,
        overallScore
      }
    })

    setModalData({ testsList: testsListResponse, importanceList, statusList: testsStatusListResponse });

    const allUserCollegeTests = await AdmissionsService.GetUserCollegeTests();
    const userCollegeTestsForThisCollege = allUserCollegeTests.filter(item => item.college_id === collegeId);

    const addRowData = userCollegeTestsForThisCollege.map(item => {
      const testForThisCollege = getNameFromId(testsListResponse, item.user_test_id);
      const { overallScore, name_scores, ...testNameId } = testForThisCollege;

      return {
        internalId: item.id,
        category: API_ADM_CATEGORIES.TEST_SCORES,
        testName: { ...testNameId, internalId: item.id },
        importance: item.importance,
        status: getNameFromId(testsStatusListResponse, item.status).id,
        overallScore,
        name_scores,
        deadline: item.deadline || ''
      }
    })

    setAdditionalColumns(addRowData);
    return addRowData;
  }

  const fetchEssaysData = async (admissionsCatStatus, importanceList, collegeId) => {
    const essayStatusListResponse = admissionsCatStatus.filter(item => item.category === API_ADM_CATEGORIES.ESSAY);
    setEssayStatusList(essayStatusListResponse);
    setModalData({ importanceList, statusList: essayStatusListResponse });

    const allUserCollegeEssays = await AdmissionsService.GetUserCollegeEssays();
    const userCollegeEssaysForThisCollege = allUserCollegeEssays.filter(item => item.college_id === collegeId);

    const addRowData = userCollegeEssaysForThisCollege.map(item => {
      return {
        internalId: item.id,
        category: API_ADM_CATEGORIES.ESSAY,
        prompt: item.prompt,
        importance: item.importance,
        status: getNameFromId(admissionsCatStatus, item.status).id,
        deadline: item.deadline || ''
      }
    })
    return addRowData;
  }

  const fetchRecLettersData = async (admissionsCatStatus, importanceList, collegeId) => {
    const recLettersStatusListResponse = admissionsCatStatus.filter(item => item.category === API_ADM_CATEGORIES.REC_LETTERS);
    setRecLettersStatusList(recLettersStatusListResponse);
    setModalData({ importanceList, statusList: recLettersStatusListResponse });

    const allUserCollegeRecLetters = await AdmissionsService.GetUserCollegeRecLetters();
    const userCollegeRecLettersForThisCollege = allUserCollegeRecLetters.filter(item => item.college_id === collegeId);

    const addRowData = userCollegeRecLettersForThisCollege.map(item => {
      return {
        internalId: item.id,
        category: API_ADM_CATEGORIES.REC_LETTERS,
        recommender: item?.recommender || 'No info',
        importance: item.importance,
        status: item.status,
        deadline: item.deadline || ''
      }
    })
    return addRowData;
  }

  const fetchInterviewData = async (admissionsCatStatus, importanceList, collegeId) => {
    const interviewStatusListResponse = admissionsCatStatus.filter(item => item.category === API_ADM_CATEGORIES.INTERVIEW);
    setInterviewStatusList(interviewStatusListResponse);
    setModalData({ importanceList, statusList: interviewStatusListResponse });

    const allUserCollegeInterviews = await AdmissionsService.GetUserCollegeInterviews();
    const userCollegeInterviewsForThisCollege = allUserCollegeInterviews.filter(item => item.college_id === collegeId);

    const addRowData = userCollegeInterviewsForThisCollege.map(item => {
      return {
        internalId: item.id,
        category: API_ADM_CATEGORIES.INTERVIEW,
        importance: item.importance,
        status: item.status,
        deadline: item.deadline || ''
      }
    })
    return addRowData;
  }

  useEffect(() => {
    contentRef.current.addEventListener('scroll', () => {
      titleRef.current.scrollLeft = contentRef.current.scrollLeft;
    });

    titleRef.current.addEventListener('scroll', () => {
      contentRef.current.scrollLeft = titleRef.current.scrollLeft;
    });

    fetchAdmissionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // for creating additional columns with scores on Test Scores tab
  const setAdditionalColumns = (rowsData) => {
    let additionalColumns = columns;
    rowsData.forEach(item => {
      item.name_scores.forEach(el => {
        if (additionalColumns.filter(x => x.name === el.name).length === 0) {
          additionalColumns.push({ ...el, category: 'name_scores' });
        }
      })
    })
    setColumns([...additionalColumns])
  }

  const handleAddRow = async () => {
    const { importanceList } = modalData;

    if (props.variant === TAB_NAMES.TEST_SCORES) {
      const { statusList } = modalData;

      // removing added in table test before pushing test lists to modal
      let filteredTestsList = modalData.testsList;
      rows.forEach((item) => {
        filteredTestsList = filteredTestsList.filter((obj) => obj.id !== item.testName?.id)
      })

      setModalData({ ...modalData, testsList: filteredTestsList });
      setSelectedData({
        testName: filteredTestsList[0],
        importance: importanceList[0].id,
        status: statusList[0].id,
        overallScore: filteredTestsList[0]?.overallScore,
        name_scores: filteredTestsList[0]?.name_scores
      })
    }

    if (props.variant === TAB_NAMES.ESSAYS) {
      setSelectedData({ importance: importanceList[0].id, status: essayStatusList[0].id })
    }

    if (props.variant === TAB_NAMES.REC_LETTERS) {
      setSelectedData({ importance: importanceList[0].id, status: recLettersStatusList[0].id })
    }

    if (props.variant === TAB_NAMES.INTERVIEW) {
      setSelectedData({ importance: importanceList[0].id, status: interviewStatusList[0].id })
    }

    setShowModal(true);
  }

  const handleChange = (name, value, id) => {
    const { testsList } = modalData;
    if (!id) {
      // onChange is in modal
      switch (name) {
        case 'testName':
          const getTestNameFromId = getNameFromId(testsList, value);
          const { overallScore, name_scores, ...testNameId } = getTestNameFromId;
          setSelectedData({ ...selectedData, testName: testNameId, name_scores, overallScore });
          break
        case 'importance':
          setSelectedData({ ...selectedData, importance: +value });
          break
        case 'status':
          setSelectedData({ ...selectedData, status: +value });
          break
        case 'deadline':
          setSelectedData({ ...selectedData, deadline: value });
          break
        case 'prompt':
          setSelectedData({ ...selectedData, prompt: value });
          break

        default: setSelectedData({ ...selectedData, [name]: value });
      }
    } else {
      // onChange is in Tab table
      const propertyToUpdate = { [name]: +value };
      let updatedRows;

      if (props.variant === TAB_NAMES.TEST_SCORES) {
        //updating state rows
        updatedRows = rows.map((item) => {
          if (item.testName?.id === id) {
            return {
              ...item,
              ...propertyToUpdate
            }
          }
          return item;
        });

        // preparing and posting changed data
        const changedRow = rows.find((item) => item.testName?.id === id);
        const userCollegeTestToUpdate = {
          id: changedRow?.testName?.internalId,
          college_id: props.collegeInfo.college_id,
          user_test_id: id,
          importance: changedRow.importance,
          status: changedRow.status,
          ...propertyToUpdate
        }
        AdmissionsService.UpdateUserCollegeTests([userCollegeTestToUpdate]);
      }

      if (props.variant === TAB_NAMES.ESSAYS) {
        //updating state rows
        updatedRows = rows.map((item) => {
          if (item.internalId === id) {
            return {
              ...item,
              ...propertyToUpdate
            }
          }
          return item;
        });

        // preparing and posting changed data
        const changedRow = rows.find((item) => item.internalId === id);
        const userCollegeEssaysToUpdate = {
          id: changedRow.internalId,
          prompt: changedRow.prompt,
          college_id: props.collegeInfo.college_id,
          importance: changedRow.importance,
          status: changedRow.status,
          ...propertyToUpdate
        }

        AdmissionsService.UpdateUserCollegeEssays([userCollegeEssaysToUpdate]);
      }

      if (props.variant === TAB_NAMES.REC_LETTERS) {
        //updating state rows
        updatedRows = rows.map((item) => {
          if (item.internalId === id) {
            return {
              ...item,
              ...propertyToUpdate
            }
          }
          return item;
        });

        // preparing and posting changed data
        const changedRow = rows.find((item) => item.internalId === id);
        const userCollegeRecLettersToUpdate = {
          id: changedRow.internalId,
          recommender: changedRow.recommender,
          college_id: props.collegeInfo.college_id,
          importance: changedRow.importance,
          status: changedRow.status,
          ...propertyToUpdate
        }

        AdmissionsService.UpdateUserCollegeRecLetters([userCollegeRecLettersToUpdate]);
      }

      if (props.variant === TAB_NAMES.INTERVIEW) {
        //updating state rows
        updatedRows = rows.map((item) => {
          if (item.internalId === id) {
            return {
              ...item,
              ...propertyToUpdate
            }
          }
          return item;
        });

        // preparing and posting changed data
        const changedRow = rows.find((item) => item.internalId === id);
        const userCollegeInterviewsToUpdate = {
          id: changedRow.internalId,
          college_id: props.collegeInfo.college_id,
          importance: changedRow.importance,
          status: changedRow.status,
          ...propertyToUpdate
        }

        AdmissionsService.UpdateUserCollegeInterviews([userCollegeInterviewsToUpdate]);
      }

      setRows(updatedRows);
    }
  }

  // handle case when user adding row that is already exist
  const checkForDuplication = () => {
    if (selectedData?.prompt) {
      return !!rows.find(x => x.prompt === selectedData.prompt);
    }
    if (selectedData?.recommender) {
      return !!rows.find(x => x.recommender === selectedData.recommender);
    }
  }

  const checkForAddRow = () => {
    return testsList?.length === rows?.length;
  }

  const checkForTests = () => {
    if (!testsList?.length) return true;
    return testsList?.length === rows?.length;
  }

  const handleSave = async () => {
    if (checkForDuplication()) {
      return setDuplicationError(true);
    };

    setShowModal(false);
    let res;

    if (props.variant === TAB_NAMES.TEST_SCORES) {
      setAdditionalColumns([selectedData]);

      const insertUserCollegeTestData = [{
        college_id: props.collegeInfo.college_id,
        user_test_id: selectedData.testName.id,
        importance: selectedData.importance,
        status: selectedData.status,
        deadline: selectedData?.deadline
      }]
      res = await AdmissionsService.InsertUserCollegeTests(insertUserCollegeTestData);
    }

    if (props.variant === TAB_NAMES.ESSAYS) {

      const insertUserCollegeEssayData = [{
        college_id: props.collegeInfo.college_id,
        prompt: selectedData?.prompt,
        importance: selectedData.importance,
        status: selectedData.status,
        deadline: selectedData?.deadline,
      }]
      res = await AdmissionsService.InsertUserCollegeEssays(insertUserCollegeEssayData);
    }

    if (props.variant === TAB_NAMES.REC_LETTERS) {
      const insertUserCollegeEssayData = [{
        college_id: props.collegeInfo.college_id,
        recommender: selectedData.recommender,
        importance: selectedData.importance,
        status: selectedData.status,
        deadline: selectedData?.deadline,
      }]
      res = await AdmissionsService.InsertUserCollegeRecLetters(insertUserCollegeEssayData);
    }

    if (props.variant === TAB_NAMES.INTERVIEW) {
      const insertUserCollegeInterviewData = [{
        college_id: props.collegeInfo.college_id,
        importance: selectedData.importance,
        status: selectedData.status,
        deadline: selectedData?.deadline,
      }]
      res = await AdmissionsService.InsertUserCollegeInterviews(insertUserCollegeInterviewData);
    }

    if (res === 1) {
      fetchAdmissionData();
    }
  }

  const handleDeleteRow = async () => {
    const { internalId, category } = itemToDelete;
    let res;

    switch (category) {
      case API_ADM_CATEGORIES.ESSAY:
        res = await AdmissionsService.DeleteUserCollegeEssayById(internalId);
        break;

      case API_ADM_CATEGORIES.REC_LETTERS:
        res = await AdmissionsService.DeleteUserCollegeRecommendationLetterById(internalId);
        break;

      case API_ADM_CATEGORIES.TEST_SCORES:
        res = await AdmissionsService.DeleteUserCollegeTestById(internalId);
        break;

      case API_ADM_CATEGORIES.INTERVIEW:
        res = await AdmissionsService.DeleteUserCollegeInterviewById(internalId);
        break;

      default: return null;
    }

    setItemToDelete(null);
    if (res === 1) fetchAdmissionData();
  }

  const isTestsTab = props.variant === TAB_NAMES.TEST_SCORES;
  return (
    <div className={style.table}>
      <div ref={titleRef} className={cn(style.thead, style.withLeftIcon)}>
        {!isLoading && (
          <>
            {columns && columns.map((item, key) =>
              <div key={key} className={style.theadTh}>
                {item.name}
              </div>
            )}
          </>)}
      </div>

      <div ref={contentRef} className={style.tbody}>
        {isLoading ? <Spinner /> : (
          <>
            {rows && rows.map((item, key) => {

              return (
                <div key={key} className={cn(style.tbodyRow, style.withLeftIcon)} >
                  <Trash onClick={() => setItemToDelete({ internalId: item.internalId, category: item.category })} className={style.tableDeleteIcon} />
                  {
                    columns.map((col, i) => {
                      const { category } = col;
                      const { internalId } = item;
                      let result = item[category];
                      const testId = item.testName?.id;

                      if (category === 'testName') {
                        result = result.name;
                      }

                      if (category === 'importance') {
                        const importanceName = getNameFromId(importanceList, item?.importance)?.name;
                        result = (
                          <TypeDropdown
                            value={importanceName}
                            options={importanceList}
                            onSelect={(value) => handleChange(category, value, testId || internalId)}
                          />
                        )
                      }

                      if (category === 'status') {
                        switch (props.variant) {
                          case TAB_NAMES.TEST_SCORES:
                            const testStatusName = getNameFromId(testsStatusList, item.status).name;
                            result = (
                              <TypeDropdown
                                value={testStatusName}
                                options={testsStatusList}
                                onSelect={(value) => handleChange(category, value, testId)}
                              />
                            )
                            break;
                          case TAB_NAMES.ESSAYS:
                            const essayStatusName = getNameFromId(essayStatusList, item.status).name;
                            result = (
                              <TypeDropdown
                                value={essayStatusName}
                                options={essayStatusList}
                                onSelect={(value) => handleChange(category, value, internalId)}
                              />
                            )
                            break;
                          case TAB_NAMES.REC_LETTERS:
                            const recLettersStatusName = getNameFromId(recLettersStatusList, item.status).name;
                            result = (
                              <TypeDropdown
                                value={recLettersStatusName}
                                options={recLettersStatusList}
                                onSelect={(value) => handleChange(category, value, internalId)}
                              />
                            )
                            break;
                          case TAB_NAMES.INTERVIEW:
                            const interviewStatusName = getNameFromId(interviewStatusList, item.status).name;
                            result = (
                              <TypeDropdown
                                value={interviewStatusName}
                                options={interviewStatusList}
                                onSelect={(value) => handleChange(category, value, internalId)}
                              />
                            )
                            break;
                          default: result = null;
                        }
                      }

                      if (category === 'essayStatus') {
                        result = (
                          <TypeDropdown
                            value={item.essayStatus}
                            options={EssayStatus}
                            onSelect={(value) => handleChange(category, value, internalId)}
                          />
                        )
                      }

                      if (category === 'name_scores') {
                        const nameScores = item.name_scores;
                        const score = nameScores.find(x => x.name === col.name)?.score;
                        return (<div key={i} className={style.tbodyTd}>
                          {score || 'N/A'}
                        </div>)
                      }

                      return (
                        <div key={i} className={style.tbodyTd}>
                          {result || 'N/A'}
                        </div>
                      );
                    }
                    )
                  }
                </div>
              )
            })
            }
            <div className={style.additionalSection}>
              <Button className={cn('btn-tertiary-dark', { 'disabled': isTestsTab ? checkForTests() : checkForAddRow() })} onClick={handleAddRow}>
                Add row
              </Button>
              {isTestsTab && checkForTests() && <span className={style.noTests}>No tests, please add tests in Portfolio</span>}
              {isTestsTab && (
                <Link to={ROUTES.PORTFOLIO_TEST}>
                  <Button>
                    Edit test in my portfolio
                  </Button>
                </Link>
              )}
            </div>

            <AddRowModal
              show={showModal}
              handleClose={() => setShowModal(false)}
              data={modalData}
              selectedData={selectedData}
              onChange={handleChange}
              onSave={handleSave}
              variant={props.variant}
              error={duplicationError}
            />

            <ConfirmDialog
              show={!!itemToDelete}
              title="Delete row from list"
              onClose={() => setItemToDelete(null)}
              onSubmit={handleDeleteRow}
            >
              Are you sure you want to delete the row from list?
            </ConfirmDialog>
          </>)}
      </div>
    </div>
  )
}

export default DetailsTable;