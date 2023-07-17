import React, { useState } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import useErrorHandler from '../../../../util/hooks/useErrorHandler';
import ErrorDialog from '../../../../util/ErrorDialog';
import ProfileLink from '../../../../util/ProfileLink';
import ConfirmDialog from '../../../../util/ConfirmDialog';
import collabService from '../../../../service/CollaborationService';

const propTypes = {
  id: PropTypes.number.isRequired,
  members: PropTypes.array.isRequired,
  myProject: PropTypes.bool,
  className: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
};

const MemberActions = collabService.getMemberActions();

const useAction = (projectId, onUpdate) => {
  // { title: string, message: string, onSubmit: Function }
  const [handler, setHanlder] = useState(null);

  const setAction = (action, memberId) => {
    let title, message;
    switch (action) {
      case MemberActions.Deactivate:
        title = 'Deactivate member';
        message = 'Are you sure you want to deactivate the member';
        break;
      case MemberActions.Reactivate:
        title = 'Reactivate member';
        message = 'Are you sure you want to reactivate the member';
        break;
      case MemberActions.Suspend:
        title = 'Suspend member';
        message = 'Are you sure you want to suspend the member';
        break;
      case MemberActions.Reinstate:
        title = 'Reinstate member';
        message = 'Are you sure you want to reinstate the member';
        break;
      case MemberActions.Delete:
        title = 'Deny member request';
        message = "Are you sure you want to deny the member's request to join the project?";
        break;
      default:
        break;
    }

    if (action == null) {
      setHanlder(null);
    } else {
      setHanlder({
        title,
        message,
        onSubmit: async () => {
          await collabService.memberAction(action, projectId, memberId);
          onUpdate();
        },
      });
    }
  };

  return [handler, setAction];
};

const Members = ({ id, myProject, members, className, onUpdate }) => {
  const [action, setAction] = useAction(id, onUpdate);
  const [error, setError] = useErrorHandler(null);
  const MemberStatus = collabService.getMemberStatus();
  const MemberStatusMap = collabService.getMemberStatusNameMap();

  const handleApproveMember = async (member) => {
    try {
      await collabService.approveMember(id, member);
      onUpdate();
    } catch (e) {
      setError(e);
    }
  };

  return (
    <Card className={className}>
      <Card.Header as="header">
        <h4>Collborators</h4>
      </Card.Header>
      <Card.Body>
        {error && <ErrorDialog error={error} />}
        {members.map((member, index) => {
          const { name, user_id, status } = member;
          const isDeactivated = status === MemberStatus.Deactivated;
          const isSuspended = status === MemberStatus.Suspended;
          const isWaitingForApproval = status === MemberStatus.WaitingApproval;
          const statusName = MemberStatusMap[status || 0];
          return (
            <Row key={index} className="py-2 border-bottom align-items-center">
              <Col sm="5" className="App-textOverflow">
                Name: <ProfileLink id={user_id} name={name} />
              </Col>
              <Col sm="3" className={classNames({ 'text-danger': isSuspended }, 'App-textOverflow')}>
                {myProject && statusName ? `Status: ${statusName}` : ''}
              </Col>
              {myProject && (
                <Col sm="4">
                  {isWaitingForApproval && (
                    <ActionButton onClick={() => handleApproveMember(member)}>Approve</ActionButton>
                  )}
                  {isWaitingForApproval && (
                    <ActionButton variant="danger" onClick={() => setAction(MemberActions.Delete, user_id)}>
                      Deny
                    </ActionButton>
                  )}
                  {!isWaitingForApproval && !isSuspended && (
                    <ActionButton variant="danger" onClick={() => setAction(MemberActions.Suspend, user_id)}>
                      Suspend
                    </ActionButton>
                  )}
                  {!isWaitingForApproval && isSuspended && (
                    <ActionButton onClick={() => setAction(MemberActions.Reinstate, user_id)}>Restore</ActionButton>
                  )}
                  {/* {isDeactivated && (
                    <ActionButton onClick={() => setAction(MemberActions.Reactivate, user_id)}>
                      Reactivate
                    </ActionButton>
                  )} */}
                  {!isWaitingForApproval && !isDeactivated && !isSuspended && (
                    <ActionButton variant="danger" onClick={() => setAction(MemberActions.Deactivate, user_id)}>
                      Deactivate
                    </ActionButton>
                  )}
                </Col>
              )}
            </Row>
          );
        })}
      </Card.Body>
      {action && <ConfirmAction {...action} onClose={() => setAction(null)} />}
    </Card>
  );
};

const ConfirmAction = ({ title, message, onSubmit, onClose }) => {
  const [error, setError] = useErrorHandler(null);
  const handleSubmit = async () => {
    try {
      await onSubmit();
      onClose();
    } catch (e) {
      setError(e);
    }
  };

  return (
    <ConfirmDialog show={true} title={title} onSubmit={handleSubmit} onClose={onClose}>
      {
        <>
          {error && <ErrorDialog error={error} />}
          {message}
        </>
      }
    </ConfirmDialog>
  );
};

const ActionButton = ({ variant, children, onClick }) => (
  <Button variant={variant} className="float-right ml-2" style={{ width: '105px' }} onClick={onClick}>
    {children}
  </Button>
);

Members.propTypes = propTypes;

export default React.memo(Members);
