import React from 'react';
import { withRouter } from 'react-router-dom';

import CoursePageLayout from '../Layout';
import ChannelBoard from './ChannelBoard';

import courseService from '../../../service/CourseService';
/**
 * XXX TO DO:
 * 1. handle case that subjectId is not valid
 */
class CourseChannelPage extends React.PureComponent {
  onFetchCategories = async (subjectId) => {
    return courseService.listCategoriesInSubject(subjectId);
  };

  onFetchCoursesInCategory = async (categoryId) => {
    return courseService.listCoursesInCategory(categoryId);
  };

  render() {
    let subjectId = Number(this.props.match.params.id);
    return (
      <CoursePageLayout>
        <ChannelBoard
          subjectId={subjectId}
          onFetchCategories={this.onFetchCategories}
          onFetchCoursesInCategory={this.onFetchCoursesInCategory}
        />
      </CoursePageLayout>
    );
  }
}

export default withRouter(CourseChannelPage);
