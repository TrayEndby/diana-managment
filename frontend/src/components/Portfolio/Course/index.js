import React from 'react';

import Layout from '../Layout';

import UnWeightedGPA from './UWGPA';
import WeightedGPA from './WGPA';
import CurrentCourses from './CurrentCourses';
import CompletedCourses from './CompletedCourses';

import userProfileSearchService from '../../../service/UserProfileSearchService';
import ErrorDialog from '../../../util/ErrorDialog';

const STATUS = {
  COMPLETE: 1,
  CURRENT: 0,
};

class Course extends React.Component {
  constructor() {
    super();
    this.state = {
      schoolInfo: {},
      courseInfo: [],
      error: null,
      saved: {
        schoolInfoSaved: true,
        courseInfoSaved: true,
      },
    };
  }

  handleError = (e) => {
    console.error(e);
    this.setState({ error: e.message });
  };

  fetchData = async () => {
    const data = await userProfileSearchService.searchProfile();
    if (data && data.profile) {
      let schools = data.profile.schools;
      const latestSchool = schools ? schools[schools.length - 1] || {} : {};
      let courseInfo = data.profile.courses || [];
      this.setState({
        schoolInfo: {
          country: 'United States', // default value
          ...latestSchool,
        },
        courseInfo: courseInfo,
        error: null
      });
    }
  };

  setCourseInfo = (newCourse) => {
    let isNewCourse = true;
    let newCourseId = newCourse.id;
    let courses = this.state.courseInfo.map((course) => {
      const { id, course_id } = course;
      if ((newCourseId && id === newCourse.id) || (!newCourseId && !id && course_id === newCourse.course_id)) {
        // when update saved course or update a newly added course
        isNewCourse = false;
        return newCourse;
      } else {
        return course;
      }
    });

    if (isNewCourse) {
      courses = [...courses, newCourse];
    }
    this.setState({ courseInfo: courses });
    this.markUnsaved('courseInfoSaved', false);
  };

  deleteCourse = async (id, newCourse) => {
    try {
      if (id != null) {
        await userProfileSearchService.deleteCourse(id);
        this.fetchData();
      } else {
        // new course
        const courseInfo = this.state.courseInfo.filter(({ status, course_id }) => {
          if (course_id === newCourse.course_id && status === newCourse.status) {
            return false;
          } else {
            return true;
          }
        });
        this.setState({ courseInfo });
      }
    } catch (e) {
      this.handleError(e);
    }
  };

  saveCourseInfo = async () => {
    await userProfileSearchService.insertCourseInfo(this.state.courseInfo);
  };

  setSchoolInfo = (data) => {
    const schoolInfo = {
      ...this.state.schoolInfo,
      ...data,
    };
    this.setState({ schoolInfo });
    this.markUnsaved('schoolInfoSaved', false);
  };

  markUnsaved = (field, value) => {
    this.setState({
      saved: {
        ...this.state.saved,
        [field]: value,
      },
      error: null
    });
  };

  isSaved = () => {
    const { saved } = this.state;
    const flag = Object.values(saved).includes(false);
    return !flag;
  };

  saveSchoolInfo = async () => {
    await userProfileSearchService.insertSchoolInfo(this.state.schoolInfo);
  };

  saveChanges = async () => {
    const { saved } = this.state;
    if (!saved.schoolInfoSaved) {
      await this.saveSchoolInfo();
      this.markUnsaved('schoolInfoSaved', true);
    }
    if (!saved.courseInfoSaved) {
      await this.saveCourseInfo();
      this.markUnsaved('courseInfoSaved', true);
    }
    this.fetchData();
  };

  getCompletedCourses = () => {
    const { courseInfo } = this.state;
    return courseInfo.filter(({ status }) => status === STATUS.COMPLETE);
  };

  getCurrentCourses = () => {
    const { courseInfo } = this.state;
    return courseInfo.filter(({ status }) => !status);
  };

  render() {
    const { schoolInfo, saved, error } = this.state;
    const { uwGPA, wGPA, school_id } = schoolInfo;
    return (
      <Layout saved={saved} onSave={this.saveChanges} onMount={this.fetchData}>
        <ErrorDialog error={error} />
        <UnWeightedGPA uwGPA={uwGPA} onChange={this.setSchoolInfo} />
        <WeightedGPA wGPA={wGPA} onChange={this.setSchoolInfo} />
        <CompletedCourses
          courses={this.getCompletedCourses()}
          status={STATUS.COMPLETE}
          school_id={school_id}
          onChange={this.setCourseInfo}
          onDelete={this.deleteCourse}
        />
        <CurrentCourses
          courses={this.getCurrentCourses()}
          status={STATUS.CURRENT}
          school_id={school_id}
          onChange={this.setCourseInfo}
          onDelete={this.deleteCourse}
        />
      </Layout>
    );
  }
}

export default Course;