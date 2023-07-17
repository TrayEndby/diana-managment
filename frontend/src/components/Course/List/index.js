import React from 'react';
import PropTypes from 'prop-types';

import CourseCard from '../Card';
import withInfiniteList from 'util/HOC/withInfiniteList';

const propTypes = {
  courses: PropTypes.array,
  view: PropTypes.string,
};

const CourseListCard = ({ view, item }) => <CourseCard view={view} course={item} />;

const List = withInfiniteList(CourseListCard);

const CourseList = ({ view, courses }) => (
  <List
    className={view === 'grid' ? 'App-grid-list' : null}
    view={view}
    items={courses}
  />
);

CourseList.propTypes = propTypes;

export default CourseList;
