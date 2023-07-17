import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import AddNameModal from '../../../../util/AddNameModal';
import ErrorDialog from '../../../../util/ErrorDialog';
import userProfileListService from '../../../../service/UserProfileListService';

const propTypes = {
  current: PropTypes.bool,
  show: PropTypes.bool.isRequired,
  course: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

/**
 * TODO: implement "Add option", make sure it is conditional and does not appear as course name
 * Add delete option
 */
class AddCourseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingSubjectList: true,
      loadingCourseList: false,
      subjectList: [],
      courseList: [],
      data: {
        subject_id: undefined,
        course_id: undefined,
        title: undefined,
        status: undefined,
        year: undefined,
        semester: undefined,
        score: undefined,
      },
      showAddNewCourseModal: false,
    };
  }

  componentDidMount() {
    this.fetchSubjectList();
  }

  componentDidUpdate(prevProps) {
    const { show, course } = this.props;
    if (!prevProps.show && show && course != null) {
      const data = {
        ...course,
      };
      this.setState({
        data,
      });
    }
  }

  handleError = (e) => {
    console.error(e);
    this.setState({
      error: e.message,
      loadingSubjectList: false,
      loadingCourseList: false,
    });
  };

  fetchSubjectList = async () => {
    try {
      this.setState({
        loadingSubjectList: true,
      });
      const subjectList = await userProfileListService.listID(12);
      this.setState({
        subjectList,
        loadingSubjectList: false,
      });
    } catch (e) {
      this.handleError(e);
    }
  };

  fetchCourseList = async (subject_id) => {
    if (!subject_id) {
      this.setState({
        courseList: [],
      });
    } else {
      try {
        this.setState({
          loadingCourseList: true,
        });
        const courseList = (await userProfileListService.categoryList(11, subject_id)).nameIds || [];
        this.setState({
          courseList,
          loadingCourseList: false,
        });
      } catch (e) {
        this.handleError(e);
      }
    }
  };

  handleSubjectChange = (event) => {
    let subject_id = event.target.value ? Number(event.target.value) : undefined;
    if (subject_id !== this.state.data.subject_id) {
      this.setState({
        data: {
          ...this.state.data,
          subject_id, //double check if id is the right attribute
          course_id: undefined,
        },
      });
      this.fetchCourseList(subject_id);
    }
  };

  handleCourseChange = (event) => {
    const value = event.target.value;
    if (value === 'add') {
      this.setState({
        showAddNewCourseModal: true,
      });
    } else {
      const course_id = value ? Number(value) : undefined;
      let title = undefined;
      if (course_id) {
        const course = this.state.courseList.filter(({ id }) => id === course_id)[0] || {};
        title = course.name;
      }
      this.setState({
        data: {
          ...this.state.data,
          course_id,
          title,
        },
      });
    }
  };

  handleAddNewCourse = (name) => {
    this.setState({
      data: {
        ...this.state.data,
        course_id: -1,
        title: name,
      },
    });
  };

  handleCloseAddNewCourseModal = () => {
    this.setState({
      showAddNewCourseModal: null,
    });
  };

  handleChange = (event) => {
    const name = event.target.name;
    let value = event.target.value || undefined;
    if (name === 'score') {
      value = value ? value.trim().toUpperCase() : value;
    }
    this.setState({
      data: {
        ...this.state.data,
        [name]: value,
      },
    });
  };

  handleSubmit = (event) => {
    try {
      event.preventDefault();
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        this.setState({ validated: true });
      } else {
        const { data } = this.state;
        const { score } = data;
        const score_num = Number(score);
        const validLetterScores = ['A', 'A+', 'A-', 'B', 'B+', 'B-', 'C', 'C+', 'C-', 'D', 'D+', 'D-', 'E', 'F'];
        if (!((score_num <= 100 && score_num >= 0) || validLetterScores.includes(score))) {
          throw new Error('Grade must be in the range of [0, 100] or a valid letter grade');
        } else {
          this.props.onSave(data);
          this.handleClose();
        }
      }
    } catch (e) {
      this.handleError(e);
    }
  };

  handleClose = () => {
    this.setState({
      validated: false,
      data: {},
      error: null,
    });
    this.props.onHide();
  };

  getGradeLabel = (current) => {
    const hint = 'out of 100 or letter grades';
    return current ? `Current grade (${hint})` : `Final grade (${hint})`;
  };

  render() {
    const { current, show, course } = this.props;
    const {
      data,
      validated,
      error,
      loadingSubjectList,
      loadingCourseList,
      subjectList,
      courseList,
      showAddNewCourseModal,
    } = this.state;
    const { title, subject_id, course_id, year, score, semester } = data;
    return (
      <Modal show={show} onHide={this.handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ErrorDialog error={error} />
          <Form validated={validated} onSubmit={this.handleSubmit}>
            {!course && (
              <Form.Group>
                <Form.Label>Subject</Form.Label>
                {loadingSubjectList ? (
                  <Form.Control value="Loading subjects..." disabled />
                ) : (
                  <Form.Control required as="select" value={subject_id || ''} onChange={this.handleSubjectChange}>
                    <option value="">Select course subject</option>
                    {subjectList.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </Form.Control>
                )}
              </Form.Group>
            )}
            <Form.Group>
              <Form.Label>Course name</Form.Label>
              {course && <Form.Control value={course.course_name} disabled />}
              {!course && loadingCourseList && <Form.Control value="Loading courses..." disabled />}
              {!course && !loadingCourseList && (
                <Form.Control
                  required
                  as="select"
                  value={course_id === -1 ? title : course_id || ''}
                  onChange={this.handleCourseChange}
                  disabled={course != null}
                >
                  <option value="">Select course name</option>
                  <option value="add">Not found? Add your course</option>
                  {course_id === -1 && (
                    <option value={title} style={{ display: 'none' }}>
                      {title}
                    </option>
                  )}
                  {courseList.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </Form.Control>
              )}
            </Form.Group>
            {!current && (
              <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Control required name="year" as="select" value={year || ''} onChange={this.handleChange}>
                  <option value="">Select year</option>
                  <option value={1}>Freshman</option>
                  <option value={2}>Sophomore</option>
                  <option value={3}>Junior</option>
                  <option value={4}>Senior</option>
                </Form.Control>
              </Form.Group>
            )}
            {!current && (
              <Form.Group onChange={this.handleSemesterChange}>
                <Form.Label>Semester</Form.Label>
                <Form.Control required name="semester" as="select" value={semester || ''} onChange={this.handleChange}>
                  <option value="">Select semester</option>
                  <option value={4}>Fall and spring</option>
                  <option value={1}>Fall only</option>
                  <option value={2}>Sping only</option>
                  <option value={3}>Summer</option>
                </Form.Control>
              </Form.Group>
            )}
            <Form.Group>
              <Form.Label>{this.getGradeLabel(current)}</Form.Label>
              <Form.Control
                required
                name="score"
                placeholder="Enter final grade"
                value={score || ''}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Button type="submit" className="float-right">
              Save
            </Button>
          </Form>
        </Modal.Body>
        <AddNameModal
          show={showAddNewCourseModal}
          title="Add you course"
          onSubmit={this.handleAddNewCourse}
          onClose={this.handleCloseAddNewCourseModal}
        />
      </Modal>
    );
  }
}

AddCourseModal.propTypes = propTypes;

export default AddCourseModal;
