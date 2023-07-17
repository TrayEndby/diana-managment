import React, { useState, useCallback, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import PostsSection from '../Posts';
import Detail from '../Detail';
import RequestJoinModal from '../RequestJoin';
import { AddEventModal } from '../../Calendar';

import { isMyProject, isMemberWaitingApprove } from '../util';
import { parseSearchParams } from '../../../util/helpers';
import useErrorHandler from '../../../util/hooks/useErrorHandler';
import ErrorDialog from '../../../util/ErrorDialog';
import * as ROUTES from '../../../constants/routes';
import { Type } from '../../../constants/messages';
import collaborationService from '../../../service/CollaborationService';
import messageService from '../../../service/MessageService';
import socketService from '../../../service/SocketService';
import calendarService from '../../../service/CalendarService';

import style from './style.module.scss';

const WorkSpace = ({ location: { search }, history }) => {
  const [project, setProject] = useState({});
  const [roleInfo, setRoleInfo] = useState({});
  const [hasAccess, setHasAccess] = useState(false);
  const [isProjectView, setProjectView] = useState(true);
  const [calendar, setCalendar] = useState();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [error, setError] = useErrorHandler(null);
  const [loadingMsg, setLoadingMsg] = useState('Loading...');
  const [editable, setEditable] = useState(false);
  let { id, my } = parseSearchParams(search);
  id = id + ""; // change to string
  const memberWaitingApprove = isMemberWaitingApprove(roleInfo);
  const myProject = isMyProject(project);

  const fetchProject = useCallback(
    async (id, showLoading = true) => {
      try {
        if (showLoading) {
          setLoadingMsg('Loading...');
        }

        let project = null;
        let roleInfo = null;
        try {
          project = await collaborationService.getMyProjectDetails(id);
          if (project == null) {
            [project, roleInfo] = await collaborationService.getPublicProjectDetails(id);
          } else {
            setHasAccess(true);
          }

          if (isMyProject(project)) {
            const projectCalendar = await calendarService.getCalendarByProjectId(project.id);
            setCalendar(projectCalendar);
          }
        } catch (e) {
          [project, roleInfo] = await collaborationService.getPublicProjectDetails(id);
        }

        if (!project) {
          setError('Cannot find project');
        }
        setProject(project);
        setRoleInfo(roleInfo || {});
        setEditable(false);
      } catch (e) {
        console.error(e);
        setError(e);
      } finally {
        if (showLoading) {
          setLoadingMsg(null);
        }
      }
    },
    [setError],
  );

  const goBack = useCallback(
    (my) => {
      history.push(my === 'true' ? ROUTES.COLLABORATIONS_MY_PROJECTS : ROUTES.COLLABORATIONS_EXPLORE_PROJECTS);
    },
    [history],
  );

  useEffect(() => {
    if (isNaN(id)) {
      goBack(my);
    } else {
      fetchProject(id);
    }
  }, [id, my, fetchProject, goBack]);

  const handleRefresh = () => {
    fetchProject(id, false);
  };

  const handleUpdateProject = async (data, file) => {
    try {
      await collaborationService.updateProject(id, data, file);
      setEditable(false);
    } catch (e) {
      if (e.message === 'no row updated') {
        // this error can be ignored
        setEditable(false);
      } else {
        throw e;
      }
    }
  };

  const handleCancelProject = () => {
    setProject({ ...project }); // rest project
    setEditable(false);
  };

  const handleUpdatePost = (callback) => {
    setProject({
      ...project,
      item: callback(project.item || []),
    });
  };

  const sendMessage = async (message) => {
    try {
      const { owner_id } = project;
      const content = {
        text: message,
        type: Type.JoinProject,
        path: `${ROUTES.COLLABORATIONS_WORKSPACE}?id=${id}&my=true`,
      };
      const sent = await socketService.sendNotification(owner_id, content);
      if (!sent) {
        // try the message api directly
        await messageService.send(owner_id, content);
      }
    } catch (e) {
      setError(e);
    }
  };

  const handleRequestJoin = async (message) => {
    try {
      setLoadingMsg('Joining...');
      await collaborationService.addMember(id, message);
      await sendMessage(message);
      setShowJoinModal(false);
      handleRefresh();
    } catch (e) {
      if (e && e.message.includes('Duplicate entry')) {
        await sendMessage(message);
        setShowJoinModal(false);
        handleRefresh();
      } else {
        setError(e);
      }
    } finally {
      setLoadingMsg(null);
    }
  };

  return (
    <Container fluid style={{ overflow: 'auto', padding: '1rem' }}>
      <Row className="px-4">
        <Col sm="1">
          <Button variant="link" onClick={() => goBack(my)}>
            Back
          </Button>
        </Col>
        <Col sm="8">
          {hasAccess && (
            <Button className="btn-tertiary-light mr-2" disabled={isProjectView} onClick={() => setProjectView(true)}>
              Project View
            </Button>
          )}
          {hasAccess && (
            <Button className="btn-tertiary-light" disabled={!isProjectView} onClick={() => setProjectView(false)}>
              Post View
            </Button>
          )}
        </Col>
        <Col sm="3">
          {!hasAccess && memberWaitingApprove && (
            <Button variant="secondary" className="mr-2" disabled>
              Request sent
            </Button>
          )}
          {!hasAccess && !memberWaitingApprove && !loadingMsg && (
            <Button className="mr-2" onClick={() => setShowJoinModal(true)}>
              Request to join
            </Button>
          )}
          {myProject && (
            <Button
              className="mr-2"
              disabled={loadingMsg != null}
              onClick={editable ? handleCancelProject : () => setEditable(!editable)}
            >
              {editable ? 'View' : 'Edit'}
            </Button>
          )}
          {myProject && calendar != null && (
            <Button className="mr-2" disabled={loadingMsg != null} onClick={() => setShowAddEventModal(true)}>
              Add event
            </Button>
          )}
          {/* internal use only */}
          {/* {myProject && (
            <Button
              variant="danger"
              onClick={() => {
                collaborationService.deleteProject(project);
              }}
            >
              Delete
            </Button>
          )} */}
        </Col>
      </Row>
      {loadingMsg && <div style={{ color: 'white' }}>{loadingMsg}</div>}
      {!loadingMsg && error && <ErrorDialog error={error} />}
      {!loadingMsg && !error && !isProjectView && (
        <PostsSection
          id={id}
          className={style.mainContainer}
          posts={project.item || []}
          onUpdate={handleUpdatePost}
          onRefresh={handleRefresh}
        />
      )}
      {!loadingMsg && !error && isProjectView && (
        <Detail
          project={project}
          editable={editable}
          onRefresh={handleRefresh}
          onSubmit={handleUpdateProject}
          onCancel={handleCancelProject}
        />
      )}
      {showJoinModal && <RequestJoinModal onClose={() => setShowJoinModal(false)} onSubmit={handleRequestJoin} />}
      {showAddEventModal && (
        <AddEventModal
          show={true}
          event={{ calendar_id: calendar?.id }}
          calendars={calendar ? [calendar] : []}
          onClose={() => setShowAddEventModal(false)}
        />
      )}
    </Container>
  );
};

export default withRouter(React.memo(WorkSpace));
