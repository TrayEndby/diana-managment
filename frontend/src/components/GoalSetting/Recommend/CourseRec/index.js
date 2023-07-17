import React from 'react';
import PropTypes from 'prop-types';

import { CourseList } from '../../../Course';
import Section from '../Section';

const propTypes = {
  courses: PropTypes.array.isRequired,
};

const CourseRec = ({ courses }) => {
  if (!courses || !courses.length) {
    return null;
  }
  return (
    <Section title="Courses">
      <CourseList courses={courses} />
    </Section>
  );
};

CourseRec.propTypes = propTypes;

export default CourseRec;
