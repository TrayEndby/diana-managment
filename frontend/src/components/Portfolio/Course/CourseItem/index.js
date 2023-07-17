import React from 'react';
import PropTypes from 'prop-types';

import { Item } from '../../Layout';

const propTypes = {
  current: PropTypes.bool,
  name: PropTypes.string,
  course: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

const getCourseYear = (year) => {
  switch (String(year)) {
    case '1':
      return 'Freshman';
    case '2':
      return 'Sophomore';
    case '3':
      return 'Junior';
    case '4':
      return 'Senior';
    default:
      return '';
  }
};

const CourseItem = ({ current, name, course, onClick, onDelete }) => {
  const { score, year } = course;
  return (
    <Item action style={{ width: 'fit-content' }} onClick={() => onClick(course)} onDelete={onDelete}>
      {current ? (
        <>
          <div className="mr-2">Course name: {name}</div>
          <div className="mr-2">Current grade: {score}</div>
        </>
      ) : (
        <>
          <div className="mr-2">Course name: {name}</div>
          <div className="mr-2">Year taken: {getCourseYear(year)}</div>
          <div className="mr-2">Final grade: {score}</div>
        </>
      )}
    </Item>
  );
};

CourseItem.propTypes = propTypes;

export default CourseItem;
