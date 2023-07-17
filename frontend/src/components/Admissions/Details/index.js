import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import DetailsTable from './Table';
import style from './style.module.scss';
import DetailHead from './head';
import DetailIcon from './icon';

export const TAB_NAMES = {
  ESSAYS: 'essays',
  TEST_SCORES: 'testScores',
  REC_LETTERS: 'recLetters',
  INTERVIEW: 'interview',
};

const defaultEssaysData = {
  columns: [
    {
      name: 'Prompt',
      category: 'prompt',
    },
    {
      name: 'Importance',
      category: 'importance',
    },
    {
      name: 'Essay status',
      category: 'status',
    },
    {
      name: 'Deadline',
      category: 'deadline',
    },
  ],
};

const defaultRecLettersData = {
  columns: [
    {
      name: 'Recommender',
      category: 'recommender',
    },
    {
      name: 'Importance',
      category: 'importance',
    },
    {
      name: 'Letter status',
      category: 'status',
    },
    {
      name: 'Deadline',
      category: 'deadline',
    },
  ],
};

const defaultTestScoresData = {
  columns: [
    {
      name: 'Test name',
      category: 'testName',
      position: 0,
    },
    {
      name: 'Importance',
      category: 'importance',
      position: 1,
    },
    {
      name: 'Test status',
      category: 'status',
      position: 2,
    },
    {
      name: 'Deadline',
      category: 'deadline',
      position: 3,
    },
    {
      name: 'Overall score',
      category: 'overallScore',
      position: 4,
    },
  ],
};

const defaultInterviewData = {
  columns: [
    {
      name: 'Importance',
      category: 'importance',
    },
    {
      name: 'Interview status',
      category: 'status',
    },
    {
      name: 'Deadline',
      category: 'deadline',
    },
  ],
};

const AdmissionDetails = (props) => {
  return (
    <Tabs defaultActiveKey={TAB_NAMES.ESSAYS} className={style.detailsTabContainer}>
      <Tab eventKey={TAB_NAMES.ESSAYS} title="Essays" className={style.detailsTab}>
        <DetailsTable data={defaultEssaysData} variant={TAB_NAMES.ESSAYS} collegeInfo={props.collegeInfo} />
      </Tab>
      <Tab eventKey={TAB_NAMES.REC_LETTERS} title="Recommendation letters" className={style.detailsTab}>
        <DetailsTable data={defaultRecLettersData} variant={TAB_NAMES.REC_LETTERS} collegeInfo={props.collegeInfo} />
      </Tab>
      <Tab eventKey={TAB_NAMES.TEST_SCORES} title="Test scores" className={style.detailsTab}>
        <DetailsTable data={defaultTestScoresData} variant={TAB_NAMES.TEST_SCORES} collegeInfo={props.collegeInfo} />
      </Tab>
      <Tab eventKey={TAB_NAMES.INTERVIEW} title="Interview" className={style.detailsTab}>
        <DetailsTable data={defaultInterviewData} variant={TAB_NAMES.INTERVIEW} collegeInfo={props.collegeInfo} />
      </Tab>
    </Tabs>
  );
};

export default AdmissionDetails;

export { DetailHead, DetailIcon };
