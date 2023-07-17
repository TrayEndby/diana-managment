import React from 'react';
import PropTypes from 'prop-types';

import SearchBar from 'util/SearchBar';
import * as ROUTES from 'constants/routes';

const propTypes = {
  search: PropTypes.string
};

const CourseSearchBar = ({ search }) => (
  <SearchBar
    title="Search courses"
    search={search}
    searchURL={ROUTES.COURSE}
    className="mx-auto"
    emptyToClear
  />
)

CourseSearchBar.propTypes = propTypes;

export default CourseSearchBar;