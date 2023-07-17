import React, { Component } from 'react';

import CoursePageLayout from '../Layout';
import PlayListBoard from './Board';

class CoursePlayListPage extends Component {
  render() {
    return (
      <CoursePageLayout>
        <PlayListBoard />
      </CoursePageLayout>
    );
  }
}

export default CoursePlayListPage;