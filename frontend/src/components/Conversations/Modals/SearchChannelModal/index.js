import React, { useState } from 'react';
import cn from 'classnames';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import useErrorHandler from 'util/hooks/useErrorHandler';
import ErrorDialog from 'util/ErrorDialog';
import GroupService from 'service/GroupService';
import AuthService from 'service/AuthService';
import socketService from 'service/SocketService';
import { Type } from 'constants/messages';

import style from './style.module.scss';

const SearchChannelModal = ({ show, onClose, subscribedGroups, fetchGroupLists, fetchMessages }) => {
  const [data, setData] = useState('');
  const [error, setError] = useErrorHandler();
  const [groups, setGroups] = useState(subscribedGroups);
  const [filteredGroups, setFilteredGroups] = useState([]);

  React.useEffect(() => {
    GroupService.findGroup().then((result) => {
      setGroups(result.map((group) => ({ ...group, isSubscribed: subscribedGroups.some((g) => g.id === group.id) })));
    });
  }, [subscribedGroups]);

  React.useEffect(() => {
    const searchValue = data.toLowerCase();
    const filtered = groups.filter(({ name }) => {
      return name.toLowerCase().includes(searchValue);
    });

    setFilteredGroups(filtered);
  }, [data, groups]);

  React.useEffect(() => {
    if (show) {
      setFilteredGroups(groups);
      setData('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const handleChange = (e) => {
    setData(e.target.value);
  };

  const joinGroup = async (groupId) => {
    try {
      const userId = AuthService.getUID();
      await GroupService.addMember(groupId, userId);
      const groups = await GroupService.list();
      const groupName = groups.find(gr => gr.id === groupId)?.name;
      socketService.sendNotification(
        userId,
        {
          text: `joined **${groupName}**`,
        },
        groupId,
        Type.JoinChannel,
      )
      fetchGroupLists();
      fetchMessages();
    } catch (error) {
      setError(error);
    }
  };

  const leaveGroup = async (groupId) => {
    try {
      const userId = AuthService.getUID();
      await GroupService.deleteMember(groupId, userId);
      fetchGroupLists();
    } catch (error) {
      setError(error);
    }
  };

  return (
    <Modal className="App-modal" show={show} onHide={onClose} size="lg" aria-labelledby="search-channel-modal" centered>
      <Modal.Header closeButton>
        <Modal.Title id="search-group-modal">Search channels</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ErrorDialog error={error} />
        <Form onSubmit={() => onClose()}>
          <Form.Control placeholder="Search name" name="name" autocomplete="off" value={data} onChange={handleChange} />
          <div className={style.allContactsContainer}>
            {filteredGroups.map((group) => (
              <div className={cn(style.contactItem)} key={group.id}>
                <p>{group.name}</p>
                <Button
                  onClick={() => (group.isSubscribed ? leaveGroup(group.id) : joinGroup(group.id))}
                  variant={group.isSubscribed ? 'dark' : 'primary'}
                >
                  {group.isSubscribed ? 'Leave' : 'Subscribe'}
                </Button>
              </div>
            ))}
          </div>
          <Button type="submit" className={cn('float-right', style.button)}>
            Ok
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SearchChannelModal;
