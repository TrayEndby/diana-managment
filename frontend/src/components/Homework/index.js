import React from 'react';
import NavBar from './NavBar';
import Content from './Content';
import ComposePage from 'components/Essay/Compose';
import SprintContainer from 'components/MyHomeworkPage/SprintProgram/Container';

import { Actions } from './enums';
import {
  isInstructor,
  normalizeInstructorHomeworks,
  normalizeUserHomeworks,
  getSelectedHomeworkIds,
} from './util';
import { parseSearchParams } from 'util/helpers';
import ConfirmDialog from 'util/ConfirmDialog';

import { getUniqueArticleName } from 'components/Essay/util';
import writingService from 'service/WritingService';
import homeworkService from 'service/HomeworkService';
import * as ROUTES from 'constants/routes';
import { withRouter } from 'react-router-dom';

const propTypes = {};

class HomeworkPage extends React.Component {
  constructor() {
    super();
    this.state = {
      error: null,
      loading: false,
      folder: [],
      homeworks: [],
      confirmAction: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillMount() {
    this.unListen = this.props.history.listen((location, action) => {
      this.setState({
        homeworks: this.getHomeworks(this.state.folder),
      });
    });
  }
  componentWillUnmount() {
    this.unListen();
  }

  handleError = (e) => {
    console.error(e);
    this.setState({
      error: e.message,
      loading: false,
    });
  };

  fetchData = async () => {
    try {
      this.setState({ loading: true });
      await homeworkService.fetchSprintList();
      const homeworkData = await homeworkService.listHomeworks();
      const instructor = isInstructor();
      let sharedData = null;
      if (!instructor) {
        sharedData = await homeworkService.listShared(homeworkData.allArticles);
      }
      const folder = instructor
        ? normalizeInstructorHomeworks(homeworkData)
        : normalizeUserHomeworks(homeworkData, sharedData);
      const homeworks = this.getHomeworks(folder);
      this.setState({
        folder,
        homeworks,
        loading: false,
      });
    } catch (e) {
      this.handleError(e);
    }
  };

  getProgramId = () => {
    const { search } = this.props.history.location;
    const { program } = parseSearchParams(search);
    return program + '';
  };

  getHomeworkId = () => {
    const { search } = this.props.history.location;
    const { homework } = parseSearchParams(search);
    if (!homework) {
      return null;
    } else {
      return Number(homework);
    }
  };

  getHomeworks = (folder) => {
    const { pathname } = this.props.history.location;
    const programId = this.getProgramId();
    if (!programId) {
      return [];
    }
    const sprints = folder.filter(({ path }) => path === pathname)[0];
    if (!sprints) {
      return [];
    }
    for (const sprint of sprints.children) {
      for (const sprintProgram of sprint.children) {
        if (sprintProgram.id === programId) {
          return sprintProgram.homeworks;
        }
      }
    }
    return [];
  };

  handleActions = (action, payload) => {
    switch (action) {
      case Actions.new:
        this.handleNewHomework();
        break;
      case Actions.select:
        this.handleSelect(payload);
        break;
      case Actions.delete:
        this.setState({
          confirmAction: {
            title: 'Delete homework',
            message: 'Are you sure you want to delete the homework?',
            cb: () => this.handleDelete(payload),
          },
        });
        break;
      case Actions.toggleCheck:
        this.handleToggleCheck(payload);
        break;
      case Actions.publish:
        this.setState({
          confirmAction: {
            title: 'Publish homework',
            message: 'Are you sure you want to publish the selected homework?',
            cb: () => this.handlePublishHomework(),
          },
        });
        break;
      case Actions.unpublish:
        this.setState({
          confirmAction: {
            title: 'Unpublish homework',
            message: 'Are you sure you want to unpublish the homework?',
            cb: () => this.handleUnpublishHomework(payload),
          },
        });
        break;
      case Actions.copy:
        this.setState({
          confirmAction: {
            title: 'Copy homework',
            message: 'Are you sure you want to copy the selected homework?',
            cb: () => this.handleCopyHomework(),
          },
        });
        break;
      default:
        break;
    }
  };

  handleNewHomework = async () => {
    try {
      this.setState({ error: null });
      const title = getUniqueArticleName(this.state.homeworks, 'Homework');
      await homeworkService.create(title, this.getProgramId());
      this.fetchData();
    } catch (e) {
      this.handleError(e);
    }
  };

  handleToggleCheck = (id) => {
    const homeworks = this.state.homeworks.map((homework) => {
      if (homework.id === id) {
        return {
          ...homework,
          selected: !homework.selected,
        };
      } else {
        return homework;
      }
    });
    this.setState({
      homeworks,
    });
  };

  handlePublishHomework = async () => {
    try {
      this.setState({ error: null });
      const homeworks = this.state.homeworks;
      const selectedIds = getSelectedHomeworkIds(homeworks);
      const promises = selectedIds.map((id) => homeworkService.publish(id));
      await Promise.all(promises);
      this.fetchData();
    } catch (e) {
      this.handleError(e);
    }
  };

  handleUnpublishHomework = async (id) => {
    try {
      this.setState({ error: null });
      await homeworkService.unpublish(id);
      this.fetchData();
    } catch (e) {
      this.handleError(e);
    }
  };

  handleCopyHomework = async () => {
    try {
      this.setState({ error: null });
      const homeworks = this.state.homeworks;
      const selectedIds = getSelectedHomeworkIds(homeworks);
      await homeworkService.copy(selectedIds);
      this.fetchData();
    } catch (e) {
      this.handleError(e);
    }
  };

  handleSelect = (id) => {
    const program = this.getProgramId();
    const pathname = this.props.history.location.pathname;
    let url = `${pathname}?homework=${id}`;
    if (program) {
      url = `${url}&program=${program}`;
    }
    this.props.history.push(url);
  };

  handleDelete = async (id) => {
    try {
      this.setState({ error: null });
      await writingService.delete(id);
      this.fetchData();
    } catch (e) {
      this.handleError(e);
    }
  };

  backToList = () => {
    const program = this.getProgramId();
    const pathname = this.props.history.location.pathname;
    let url = pathname;
    if (program) {
      url = `${url}?program=${program}`;
    }
    this.props.history.push(url);
  };

  isTitleReadOnly = () => {
    const pathname = this.props.history.location.pathname;
    return (
      pathname === ROUTES.HOMEWORK_USER_MY ||
      pathname === ROUTES.HOMEWORK_USER_ALL
    );
  };

  isContentReadOnly = () => {
    const pathname = this.props.history.location.pathname;
    return (
      pathname === ROUTES.HOMEWORK_ADMIN_SUBMITTED ||
      pathname === ROUTES.HOMEWORK_USER_ALL
    );
  };

  shouldNotShare = () => {
    const pathname = this.props.history.location.pathname;
    return pathname !== ROUTES.HOMEWORK_USER_MY;
  };

  render() {
    const { error, loading, folder, homeworks, confirmAction } = this.state;
    const homeworkId = this.getHomeworkId();
    return (
      <SprintContainer
        selectedTab={1}
        sideBar={(closeSidebar) => (
          <NavBar list={folder} onCloseSidebar={closeSidebar} />
        )}
      >
        {!homeworkId && (
          <Content
            error={error}
            loading={loading}
            homeworks={homeworks}
            onAction={this.handleActions}
          />
        )}
        {homeworkId && (
          <ComposePage
            articleId={homeworkId}
            shareTitle="Share my homework"
            titleReadOnly={this.isTitleReadOnly()}
            contentReadOnly={this.isContentReadOnly()}
            noShare={this.shouldNotShare()}
            onClose={this.backToList}
            onChange={(type) => {
              if (
                type === 'addShareUser' ||
                type === 'deleteShareUser' ||
                type === 'title'
              ) {
                this.fetchData();
              }
            }}
          />
        )}
        {confirmAction != null && (
          <ConfirmDialog
            show={true}
            title={confirmAction.title}
            onSubmit={() => {
              confirmAction.cb();
              this.setState({ confirmAction: null });
            }}
            onClose={() => this.setState({ confirmAction: null })}
          >
            {confirmAction.message}
          </ConfirmDialog>
        )}
      </SprintContainer>
    );
  }
}

HomeworkPage.propTypes = propTypes;

export default withRouter(HomeworkPage);
