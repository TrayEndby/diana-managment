import React from 'react';
import PropTypes from 'prop-types';

import CourseList from '../List';

const propTypes = {
  isSearching: PropTypes.bool,
  course: PropTypes.array,
  view: PropTypes.string,
};

const CourseSearchResults = ({ isSearching, courses, view }) => {
  if (isSearching) {
    return null;
  } else if (!courses) {
    // search is not triggered yet
    return null;
  } else if (courses.length === 0) {
    return <div className="text-white text-center">No results found</div>;
  } else {
    return <CourseList courses={courses} view={view} />;
  }
};

CourseSearchResults.propTypes = propTypes;

export default React.memo(CourseSearchResults);
