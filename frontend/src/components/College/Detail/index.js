import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import Overview from './Overview';
import Chancing from './Chancing';
import Cost from './Cost';
import Admissions from './Admissions';
import Academics from './Academics';
import Careers from './Careers';
import Majors from './Majors';
import Sports from './Sports';
import Aid from './Aid';

import CloseButton from '../../../util/CloseButton';
import classNames from 'classnames';
import * as style from './style.module.scss';

const propTypes = {
  college: PropTypes.object,
  sportsList: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

/**
 * Categories of the college attribute:
 * Title:
 *  name, url
 * Overview:
 *  description
 *  imageLink
 ?  ranking
 *  rankRangeLow
 *  rankRangeHigh
 *  address
 *  city
 *  state
 *  zip
 * Chancing:
 *  avgGPA
 *  percentageAdmitted
 *  percentageAdmittedandEnrolled
 *  evaluation
 * Cost & Scholarships:
 *  inStateTuition
 *  outStateTuition
 *  averagePrice
 * Admissions statistics:
 *  totalApplicants
 *  totalEnrollment
 *  totalUGEnrollment
 *  percentageOfOutOfState ? students
 *  percentageOfInState
 *  percentageOfInternational
 * Academics:
 ?  facultyratio
 * Major:
 *  Architecture 
 *  Business 
 *  Chemistry 
 *  ComputerScience 
 *  CriminalJustice 
 *  Economics 
 *  Engineering 
 *  English 
 *  Film 
 *  Finance 
 *  History 
 *  PoliticalScience 
 *  Premed 
 *  Psychology
 * Career:
 *  salaryAfter10Years
 * Sports:
 *  MenSports
 *  WomenSports
 * Location
 */
const CollegeDetail = ({ college, sportsList, onSelect, onClose }) => {
  if (college === null) {
    return null;
  }
  if (!college) {
    return (
      <Card className={classNames('light-dark-container', style.container)}>
        <Card.Header className={classNames('dark-grey-container row m-0 align-items-center', style.header)}>
          <h5 className="text-center col-lg text-white">No data for this college</h5>
          {onClose && <CloseButton onClick={onClose}></CloseButton>}
        </Card.Header>
      </Card>
    );
  }
  const { name, status_str } = college;
  return (
    <Card className={classNames('light-dark-container', style.container)}>
      <Card.Header className={classNames('dark-grey-container row m-0 align-items-center', style.header)}>
        <h5 className="text-center col-lg text-white">{name}</h5>
        {status_str ? (
          <div className="mx-1">{`Status: ${status_str}`}</div>
        ) : (
          <Button size="sm" className="mr-3 float-right" onClick={() => onSelect(college)}>
            Add to list
          </Button>
        )}
        {onClose && <CloseButton onClick={onClose}></CloseButton>}
      </Card.Header>
      <Card.Body className="light-dark-container overflow-auto" style={{ maxHeight: '100%' }}>
        <Overview college={college} />
        <Chancing college={college} />
        <Cost college={college} />
        <Aid college={college} />
        <Admissions college={college} />
        <Academics college={college} />
        <Careers college={college} />
        <Majors college={college} />
        <Sports college={college} sportsList={sportsList} />
      </Card.Body>
    </Card>
  );
};

CollegeDetail.propTypes = propTypes;

export default CollegeDetail;
