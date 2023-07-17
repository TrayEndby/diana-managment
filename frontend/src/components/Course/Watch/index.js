import React from 'react';
import { withRouter, useHistory } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';

import { NoteBoard } from '../Notes';
import AddPlayListModal from '../PlayList/AddModal';
import CourseForum from '../Forum';
import AddTaskModal from 'components/TasksManager/Task/AddModal';

import courseService from 'service/CourseService';
import * as ROUTES from 'constants/routes';

import style from './style.module.scss';

class CourseWatchPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showNotesCnt: 1,
      showAddPlayListModal: false,
      showAddTaskModal: false,
    };
  }

  toggleNotes = (showNotes) => {
    if (showNotes) {
      this.setState({
        showNotesCnt: this.state.showNotesCnt + 1,
      })
    } else {
      this.setState({
        showNotesCnt: 0,
      });
    }
  };

  toggleAddPlayListModal = (show) => {
    this.setState({
      showAddPlayListModal: show,
    });
  };

  toggleAddTaskModal = (show) => {
    this.setState({
      showAddTaskModal: show,
    });
  };

  /**
   * Return a url to add as resource of task
   * the limitation is no more than 1024 chars
   */
  getResourceURL = () => {
    let courseInfo = courseService.parseWatchURL(this.props.location.search);
    let url = courseService.getWatchURL(courseInfo);
    if (url.length >= 1024) {
      // remove description part
      delete courseInfo.description;
      url = courseService.getWatchURL({
        ...courseInfo,
        description: undefined,
      });
    }
    return url;
  };

  render() {
    const courseInfo = courseService.parseWatchURL(this.props.location.search) || {};
    const { showNotesCnt, showAddPlayListModal, showAddTaskModal } = this.state;
    const { from } = courseInfo;
    return (
      <>
        <div className={classNames('App-body', style.container)}>
          <section className={style.leftSection}>
            <div className={style.leftTop}>
              <div className={style.videoSection}>
                <CourseVideo course={courseInfo} />
              </div>
            </div>
            <div className={style.leftBottom}>
              <CourseOverview
                course={courseInfo}
                onAddTask={() => this.toggleAddTaskModal(true)}
                onSaveLater={() => this.toggleAddPlayListModal(true)}
              />
            </div>
          </section>
          <section className={classNames('p-2', style.rightSection)}>
            <BackButton from={from} />
            <div className={style.tabSection}>
              <div className={style.tabs}>
                <div
                  className={classNames(style.tab, { [style.activeTab]: showNotesCnt !== 0 })}
                  onClick={() => this.toggleNotes(true)}
                >
                  Notes
                </div>
                <div
                  className={classNames(style.tab, { [style.activeTab]: showNotesCnt === 0 })}
                  onClick={() => this.toggleNotes(false)}
                >
                  Course community
                </div>
              </div>
              <div className={style.tabContent}>
                {showNotesCnt !== 0 && <NoteBoard cnt={showNotesCnt} />}
                {showNotesCnt === 0 && <CourseForum />}
              </div>
            </div>
          </section>
        </div>
        <AddPlayListModal
          show={showAddPlayListModal}
          course={courseInfo}
          onSubmit={() => this.toggleAddPlayListModal(false)}
          onClose={() => this.toggleAddPlayListModal(false)}
        />
        <AddTaskModal
          show={showAddTaskModal}
          resource={this.getResourceURL()}
          onSubmit={() => this.toggleAddTaskModal(false)}
          onClose={() => this.toggleAddTaskModal(false)}
        />
      </>
    );
  }
}

const BackButton = ({ from }) => {
  const history = useHistory();
  if (from && from.startsWith(ROUTES.TEST_PREP)) {
    return (
      <Button
        className={style.backButton}
        onClick={() => {
          history.push(ROUTES.TEST_PREP_CHANNEL);
        }}
      >
        Back to test prep
      </Button>
    );
  } else {
    return (
      <Button
        className={style.backButton}
        onClick={() => {
          history.push(ROUTES.COURSE);
        }}
      >
        Back to my courses
      </Button>
    );
  }
};

const CourseError = () => (
  <div className="p-5">
    <div className="text-danger">Oops, course can not be reached</div>
  </div>
);

const CourseVideo = ({ course }) => {
  if (!course || !course.vid) {
    return <CourseError />;
  }
  const url = courseService.getEmbedUrl(course.vid);
  if (!url) {
    return <CourseError />;
  }
  return <iframe src={url} title={course.title} className={style.video} allowFullScreen></iframe>;
};

const CourseOverview = ({ course, onAddTask, onSaveLater }) => {
  return course ? (
    <Card className="py-2 rounded-0 border-0 h-100">
      <Card.Title as="div" className="pb-2 d-flex flex-row align-items-center border-bottom">
        <h5>{course.title}</h5>
        <div className="ml-auto">
          <Button className="mr-2 mb-1" onClick={onAddTask}>
            Add Task
          </Button>
          <Button className="mb-1" onClick={onSaveLater}>
            Save for later
          </Button>
        </div>
      </Card.Title>
      {course.description && <Card.Text>{course.description}</Card.Text>}
    </Card>
  ) : null;
};

export default withRouter(CourseWatchPage);
