import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import useErrorHandler from 'util/hooks/useErrorHandler';
import GroupService from 'service/GroupService';
import userProfileSearchService, {
  ProfileSearchType,
} from 'service/UserProfileSearchService';
import socketService from 'service/SocketService';
import { useDebouncedCallback } from 'use-debounce';
import Spinner from 'util/Spinner';
import { Type } from 'constants/messages';

import 'components/Educators/EducatorDetails/EducatorAbout/Skills/SkillsList/style.scss';
import style from './style.module.scss';

const propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

const NO_RESULTS = 'No such user in our system';

const InviteFriends = ({ show, onClose, groupId, onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useErrorHandler();
  const [saving, setSaving] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [memberList, setMemberList] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const debounced = useDebouncedCallback(
    (value) => getSearchResults(value),
    500,
  );

  React.useEffect(() => {
    GroupService.listMembers(groupId)
      .then((members) => {
        setMemberList(members);
      })
      .catch(setError);
  }, [groupId, setError]);

  React.useEffect(() => {
    debounced.callback(searchTerm);
  }, [searchTerm, debounced]);

  const getSearchResults = async (value) => {
    setError(null);
    if (value) {
      setIsSearching(true);
      let limitedProfiles;
      if (value.includes('@')) {
        limitedProfiles = await userProfileSearchService.searchLimitedProfiles(
          ProfileSearchType.Email,
          value,
        );
      } else {
        limitedProfiles = await userProfileSearchService.searchLimitedProfiles(
          ProfileSearchType.UserName,
          value,
        );
      }

      if (limitedProfiles) {
        const checkedLimitedProfiles = limitedProfiles.map((profile) => {
          const isMember = !!memberList.find(
            (m) => m.user_id === profile.profileId,
          );
          return { ...profile, isMember };
        });
        setSearchResults(checkedLimitedProfiles);
      } else {
        setSearchResults(null);
        setError(NO_RESULTS);
      }
    } else {
      setSearchResults(null);
      setError(null);
    }
    setIsSearching(false);
  };

  const handleChange = async (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const handleAdd = (i) => {
    const selectedItem = searchResults[i];
    setSelectedUsers([...selectedUsers, selectedItem]);
    setSearchTerm('');
  };

  const handleRemove = (i) => {
    const arrayToUpdate = [...selectedUsers];
    arrayToUpdate.splice(i, 1);
    setSelectedUsers(arrayToUpdate);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError(null);
      setSaving(true);
      const deffer = [];
      if (selectedUsers.length) {
        const groups = await GroupService.list();
        const groupName = groups.find((gr) => gr.id === groupId)?.name;
        selectedUsers.forEach(({ profileId, firstName, lastName }) => {
          const name = `${firstName} ${lastName}`;
          deffer.push(GroupService.addMember(groupId, profileId));
          deffer.push(
            socketService.sendNotification(
              profileId,
              {
                text: `${name} was added to **${groupName}** by`,
                profileId,
                name,
              },
              groupId,
              Type.AddToChannel,
            ),
          );
        });
        await Promise.all(deffer);
        onSubmit();
      }
      handleClose();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedUsers([]);
    setError();
    setSearchTerm('');
    setSearchResults(null);
  };

  return (
    <Modal
      className="App-modal"
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="invite-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="add-group-modal">Invite users</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className={style.inputContainer}>
            <Form.Control
              placeholder="Add by name or email"
              name="name"
              autoComplete="off"
              value={searchTerm}
              onChange={handleChange}
            />
            {isSearching ? (
              <Spinner />
            ) : (
              <>
                {searchResults && (
                  <div className={style.searchResults}>
                    {searchResults?.map((res, i) => (
                      <p
                        key={i}
                        className={cn(style.resultRow, {
                          [style.disabled]: res.isMember,
                        })}
                        onClick={() => handleAdd(i)}
                      >
                        <span>{`${res?.firstName} ${res?.lastName}`}</span>
                      </p>
                    ))}
                  </div>
                )}
                {error && (
                  <div className={cn(style.searchResults, style.error)}>
                    <p className={cn(style.resultRow, style.error)}>
                      <span>{error}</span>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className={style.chosenContactContainer}>
            <div className="skill-container">
              {selectedUsers?.map((user, i) => (
                <div className="skill-item" key={i}>
                  {`${user?.firstName} ${user?.lastName}`}
                  <span
                    className="skill-item__remove"
                    onClick={() => handleRemove(i)}
                  ></span>
                </div>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            className={cn('float-right', style.button)}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Send Invite'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

InviteFriends.propTypes = propTypes;

export default InviteFriends;
