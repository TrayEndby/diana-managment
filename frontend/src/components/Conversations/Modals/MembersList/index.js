import React, { useState, useCallback, useEffect } from 'react';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import cn from 'classnames';
import useErrorHandler from 'util/hooks/useErrorHandler';
import ErrorDialog from 'util/ErrorDialog';
import GroupService from 'service/GroupService';
import Avatar from 'util/Avatar';
import style from './style.module.scss';
import { GROUP_ROLE, GROUP_STATUS } from '../../index';
import authService from 'service/AuthService';
import ProfilePopup from '../../ProfilePopup';

const MembersList = ({
  show,
  onClose,
  groupId,
  onDirectMessage,
  onRemove,
  isImOwner,
}) => {
  const [data, setData] = useState('');
  const [error, setError] = useErrorHandler();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupIsPublic, setGroupIsPublic] = useState(false);
  const myUserId = authService.getUID();

  const getMembers = useCallback(() => {
    GroupService.listMembers(groupId)
      .then((result) => {
        if (result.length) {
          let index = 0;
          const owner = result.find((res, i) => {
            index = i;
            return res.role === GROUP_ROLE.OWNER;
          });
          if (owner) {
            result.splice(index, 1);
            result.unshift(owner);
          }
          setMembers(result);
        }
      })
      .catch(setError);
  }, [groupId, setError]);

  useEffect(() => {
    GroupService.list().then((result) => {
      const thisGroup = result.find((res) => res.id === groupId);
      setGroupName(thisGroup?.name);
      setGroupIsPublic(thisGroup?.status === GROUP_STATUS.PUBLIC);
    });
    getMembers();
  }, [show, groupId, setError, getMembers]);

  useEffect(() => {
    const searchValue = data.toLowerCase();
    const filtered = members?.filter(({ user_name, email }) => {
      return (
        user_name.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue)
      );
    });

    setFilteredMembers(filtered);
  }, [data, members]);

  useEffect(() => {
    if (show) {
      setFilteredMembers(members);
      setData('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const handleChange = (e) => {
    setData(e.target.value);
  };

  const handleRemove = async (groupId, userId, member, isOwner) => {
    await onRemove(groupId, userId, member, isOwner);
    getMembers();
  };

  const membersCount = members?.length;
  return (
    <Modal
      className="App-modal conversation-members-modal"
      show={show}
      onHide={onClose}
      size="lg"
      aria-labelledby="calendar-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="add-group-modal">
          {membersCount} members in {groupName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ErrorDialog error={error} />
        <Form>
          <Form.Control
            placeholder="Search members"
            name="name"
            autoComplete="off"
            value={data}
            onChange={handleChange}
          />
          <div className={style.allContactsContainer}>
            {filteredMembers.map((contact) => {
              const isOwner =
                contact?.role === GROUP_ROLE.OWNER && !groupIsPublic;
              const isItMe = myUserId === contact.user_id;
              return (
                <div className={style.contactItem} key={contact.user_id}>
                  <ProfilePopup
                    targetUserName={contact.user_name}
                    targetUserId={contact.user_id}
                    onDirectMessage={onDirectMessage}
                  >
                    <div
                      className="App-clickable"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Avatar id={contact.user_id} size={50} />
                    </div>
                  </ProfilePopup>

                  <p className={cn(style.userName, { [style.owner]: isOwner })}>
                    {contact.user_name} {isOwner && <span>(owner)</span>}
                  </p>
                  {groupIsPublic ? (
                    <Button
                      variant="primary"
                      className="ml-auto"
                      onClick={() => onDirectMessage(contact.user_id)}
                    >
                      Message
                    </Button>
                  ) : (
                    <>
                      {!isItMe && isImOwner && (
                        <Button
                          variant="secondary"
                          className="ml-auto"
                          onClick={() =>
                            handleRemove(
                              groupId,
                              contact.user_id,
                              null,
                              isOwner,
                            )
                          }
                        >
                          Remove
                        </Button>
                      )}
                      {!isItMe && !isImOwner && (
                        <Button
                          variant="primary"
                          className="ml-auto"
                          onClick={() => onDirectMessage(contact.user_id)}
                        >
                          Message
                        </Button>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default MembersList;
