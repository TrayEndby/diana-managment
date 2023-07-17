import React from 'react';
import PropTypes from 'prop-types';

import StudentCard from 'util/Card/StudentCard';
import ParentCard from 'util/Card/ParentCard';
import withInfiniteList from 'util/HOC/withInfiniteList';
import { handleMessage } from '../../utils';

const propTypes = {
  courses: PropTypes.array,
  view: PropTypes.string,
};

const StudentListCard = ({ item }) => <StudentCard content={item} onMessage={handleMessage} />;
const ParentListCard = ({ item }) => <ParentCard content={item} />;

const StudentList = withInfiniteList(StudentListCard);
const ParentList = withInfiniteList(ParentListCard);

const CustomerList = ({ students, parents }) => {
  return (
    <div style={{ margin: '-16px' }}>
      <StudentList className="App-grid-list" items={students} />
      <ParentList className="App-grid-list" items={parents} />
    </div>
  );
};

CustomerList.propTypes = propTypes;

export default CustomerList;
