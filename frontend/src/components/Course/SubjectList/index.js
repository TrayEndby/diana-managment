import React, { Component } from 'react';
import {
  withRouter,
  Link
} from 'react-router-dom';
import classNames from 'classnames';

import Accordion from 'util/Accordion';

import * as ROUTES from 'constants/routes';
import courseService from 'service/CourseService';

/**
 * XXX TODO: a better select state
 */
class SubjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [],
      error: null
    };
  }

  async componentDidMount() {
    try {
      let subjects = await courseService.listSubjects();
      this.setState({
        subjects
      });
    } catch (error) {
      console.error(error);
      this.setState({
        error: error.message
      });
    }
  }

  isInChannel() {
    let path = this.props.location.pathname;
    return path && path.startsWith(ROUTES.COURSE_CHANNEL);
  }

  groupSubjects() {
    let highSchoolSubjects = [];
    let others = [];
    this.state.subjects.forEach((subject) => {
      if (subject.flag) {
        highSchoolSubjects.push(subject);
      } else {
        others.push(subject);
      }
    });
    return [{
      title: "High school courses",
      subjects: highSchoolSubjects
    }, {
      title: "Other",
      subjects: others
    }];
  }

  render() {
    if (this.state.error) {
      return null;
    }
    let subjectGroups = this.groupSubjects();
    let selectedSubjectId = this.isInChannel() ? Number(this.props.match.params.id) : null;
    return (
      <div>
        <h5 className="font-weight-bold">All Categories</h5>
        {
          subjectGroups.map(({ title, subjects }, index) => (
            <Accordion
              key={index}
              className="mt-2 App-text-white font-weight-bold"
              title={title}
            >
              <>
              {subjects.map(({ id, name }) => (
                <SubjectItem
                  key={id}
                  id={id}
                  name={name}
                  selected={selectedSubjectId === id}
                >
                </SubjectItem>
              ))}
              </>
            </Accordion>
          ))}
      </div>
    )
  }
}

const SubjectItem = ({ id, name, selected }) => {
  return (
    <div className={classNames('py-1', 'px-1', 'hover-darkBg', { 'bg-warning': selected })}>
      <Link
        className="App-textOverflow d-flex"
        to={`${ROUTES.COURSE_CHANNEL}/${id}`}
      >
        {name}
      </Link>
    </div>
  )
};

export default withRouter(SubjectList);