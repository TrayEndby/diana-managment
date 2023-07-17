import React from 'react';


import Layout from '../Layout';
import ChannelBoard from '../../Course/Channel/ChannelBoard';

import testPrepService from '../../../service/TestPrepService';

class TestPrepChannel extends React.PureComponent {
  onFetchCategories = async () => {
    return [];
  }

  onFetchCoursesInCategory = async () => {
    return testPrepService.listCourses();
  }

  render() {
    return (
      <Layout>
        <ChannelBoard onFetchCategories={this.onFetchCategories} onFetchCoursesInCategory={this.onFetchCoursesInCategory}/>
      </Layout>
    )
  }
}

export default TestPrepChannel;