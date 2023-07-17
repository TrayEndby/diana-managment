import React from 'react';
import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import FormCard from '../../Layout/FormCard';
import AddCourseModal from '../AddModal';
import CourseItem from '../CourseItem';

import userProfileListService from '../../../../service/UserProfileListService';

const propTypes = {
  courses: PropTypes.array.isRequired,
  status: PropTypes.number.isRequired,
  school_id: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

class CompletedCourses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      allCourses: [],
      showAddModal: false,
      selectedCourse: null,
    };
  }

  componentDidMount() {
    this.fetchAllCourses();
  }

  fetchAllCourses = async () => {
    try {
      this.setState({ loading: true });
      const allCourses = await userProfileListService.listID(11);
      this.setState({
        allCourses,
        loading: false,
      });
    } catch (e) {
      this.handleError(e);
    }
  };

  handleError = (e) => {
    console.error(e);
    this.setState({
      error: e.messaage,
      loading: false,
    });
  };

  toggleAddModal = (showAddModal, selectedCourse) => {
    this.setState({
      showAddModal,
      selectedCourse,
    });
  };

  handleCloseAddModal = () => {
    this.toggleAddModal(false, null);
  };

  handleAddNewCourse = () => {
    this.toggleAddModal(true, null);
  };

  getCourseNameFromId = (course) => {
    const { course_id } = course;
    if (course_id === -1) {
      return course.title;
    } else {
      const courseInfo = this.state.allCourses.filter(({ id }) => id === course_id)[0] || {};
      return courseInfo.name;
    }
  };

  handleSelectCourse = (course) => {
    this.toggleAddModal(true, {
      ...course,
      course_name: this.getCourseNameFromId(course),
    });
  };

  handleAddOrUpdate = (data) => {
    const { courses, status, school_id } = this.props;
    const { selectedCourse } = this.state;
    if (selectedCourse) {
      if (selectedCourse.course_id !== data.course_id) {
        throw new Error("Cannot change existing's course name");
      }
    } else {
      const existingCourse = courses.filter(({ id }) => id === data.course_id);
      if (existingCourse.length) {
        throw new Error('Course already added');
      }
    }
    const course = {
      ...selectedCourse,
      ...data,
      status,
      school_id,
      course_name: undefined,
    };
    this.props.onChange(course);
  };

  render() {
    const { loading, error, showAddModal, selectedCourse, allCourses } = this.state;
    const { courses, onDelete } = this.props;
    return (
      <Card>
        <Card.Body>
          <Card.Title>Completed courses</Card.Title>
          <p>What courses have you completed so far in high school?</p>
          <FormCard loading={loading} error={error}>
            <Button
              variant="primary"
              onClick={this.handleAddNewCourse}
              style={{ width: 'fit-content', alignSelf: 'center' }}
            >
              Add course
            </Button>
            <Row style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
              {courses.map((course, index) => (
                <CourseItem
                  key={course.course_id}
                  allCourses={allCourses}
                  course={course}
                  name={this.getCourseNameFromId(course)}
                  onClick={this.handleSelectCourse}
                  onDelete={() => onDelete(course.id, course)}
                />
              ))}
            </Row>
          </FormCard>
        </Card.Body>
        <AddCourseModal
          show={showAddModal}
          allCourses={allCourses}
          course={selectedCourse}
          onHide={this.handleCloseAddModal}
          onSave={this.handleAddOrUpdate}
        />
      </Card>
    );
  }
}

CompletedCourses.propTypes = propTypes;

export default CompletedCourses;
