import React, { useEffect, useState, useCallback, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import ReactMarkdown from 'react-markdown';
import {
  EnvelopeFill,
  ReplyFill,
  ChatRightText,
  X,
} from 'react-bootstrap-icons';
import Tooltip from 'util/Tooltip';

import cn from 'classnames';
import moment from 'moment';

import Requests from './Requests';
import DirectMessages from './DirectMessages';
import Channels from './Channels';
import InviteFriends from './Modals/InviteFriends';
import MembersList from './Modals/MembersList';
import ProfilePopup from './ProfilePopup';
import DeleteModal from './Modals/DeleteModal';
import { SidebarOpenIcon, SidebarCloseIcon } from 'util/Icon';
import ReactQuill, { Quill } from 'react-quill-2';
import Picker from 'emoji-picker-react';
import InfiniteScroll from 'react-infinite-scroller';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';
import ImagePreview from 'util/ImagePreview';

import Avatar from 'util/Avatar';
import { SendMessage, AddUser } from 'util/Icon';
import { sortByDate } from 'util/helpers';
import socketService from 'service/SocketService';
import messageService from 'service/MessageService';
import contactService from 'service/ContactService';
import GroupService from 'service/GroupService';
import authService from 'service/AuthService';
import fileUploadService, { Category } from 'service/FileUploadService';

import { Type } from 'constants/messages';
import { GROUP_TYPE } from 'constants/groupTypes';
import {
  STORAGE_CONVERSATION_CHANNELS,
  STORAGE_CONVERSATION_SELECTED,
} from 'constants/storageKeys';

import style from './style.module.scss';
import 'react-quill-2/dist/quill.snow.css';
import UserProfileSearchService from 'service/UserProfileSearchService';

const MSG_DIALOG_TYPE = {
  DIRECT: 'direct',
  CHANNEL: 'channel',
  REQUEST: 'request',
};

const MSG_STATUS = {
  READ: 1,
  ARCHIVED: 2,
  REQUEST_ACCEPTED: 3,
  REQUEST_DECLINED: 4,
};

export const GROUP_ROLE = {
  OWNER: 2,
};

export const CONTACT_STATUS = {
  DIRECT_MESSAGE: 64,
  NORMAL: 2,
};

export const GROUP_STATUS = {
  DEACTIVATED: 64,
  PUBLIC: 1,
};

const DECLINE_MSG =
  'Dear student, I’m sorry for declining your request. Unfortunately, right at this time I don’t have available slots, if you wish you can send me another request in the near future. Thank you for understanding! ';
const SELECTED_ID = 'selectedId';

const formats = [
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'indent',
];

Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);

const modules = {
  toolbar: {
    container: [
      [
        'bold',
        'italic',
        'underline',
        'strike',
        { list: 'ordered' },
        { list: 'bullet' },
        'link',
      ],
    ],
  },
  keyboard: {
    bindings: {
      custom: {
        key: 'Enter',
        shiftKey: false,
        handler: () => {
          return false;
        },
      },
    },
  },
  imageDropAndPaste: {
    handler: imageHandler,
  },
};

let mediaId = [];
function imageHandler(imageDataUrl, type, imageData) {
  imageData
    .minify({
      maxWidth: 1080,
      maxHeight: 1080,
      quality: 0.7,
    })
    .then((miniImageData) => {
      const filename = '_' + Math.random().toString(36).substr(2, 9);
      // var blob = miniImageData.toBlob()
      const file = miniImageData.toFile(filename);
      fileUploadService
        .upload(file, filename, Category.MessageMedia)
        .then((id) => {
          mediaId.push(id);
        })
        .catch((error) => {
          console.error('Uploading failed', error);
        });
    });
}

let msgId = 0;
const Conversations = ({ location, history, wholePage }) => {
  const [requestsList] = useState([]);
  const [requestsToEducators] = useState([]);
  const [requestsToFriend] = useState([]);
  const [directUsersList, setDirectUsersList] = useState([]);
  const [publicGroups, setPublicGroups] = useState([]);
  const [privateGroups, setPrivateGroups] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [allMessages, setAllMessages] = useState([]);
  const [messageDialogType, setMessageDialogType] = useState(
    MSG_DIALOG_TYPE.DIRECT,
  ); // type of message dialog component, it looks different on requests and direct messages
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const isScrollEnabled = useRef(true);

  useEffect(() => {
    socketService.addMessageEvenListener((newMessage) => {
      const targetGroupId =
        newMessage?.targetGroupId || newMessage?.target_group_id;
      if (Object.keys(newMessage).length > 0) {
        if (targetGroupId) {
          fetchGroupLists(targetGroupId);
        } else {
          fetchContactList();
        }
      }
    });
    //get latest viewed channel/user dialog
    try {
      const id = localStorage.getItem(STORAGE_CONVERSATION_SELECTED);
      handleChangeQuery(id);
    } catch (e) {
      console.error(e);
    }

    fetchContactList();

    return () => {
      socketService.removeMessageEvenListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (0 < allMessages.length < 100) {
      setHasMoreMessages(false);
      isScrollEnabled.current = true;
    }
  }, [allMessages]);

  useEffect(() => {
    handleUnreadMessages();
  }, [directUsersList, publicGroups, privateGroups]);

  const normalizeMessages = (allMessages) => {
    const filteredAllMsg = allMessages?.filter(
      (msg) => !Object.keys(msg.content).includes('path'),
    );
    return sortByDate(filteredAllMsg);
  };

  const getUserMessages = async (selectedId, msgId) => {
    const receivedMessages = await messageService.listUserMessages(
      selectedId,
      msgId,
    );
    const sentMessages = await messageService.listSentMessagesToUser(
      selectedId,
      msgId,
    );
    const allMessages = [...receivedMessages, ...sentMessages];
    return normalizeMessages(allMessages);
  };

  const getGroupMessages = async (selectedId, msgId) => {
    const receivedMessages = await messageService.listGroupMessages(
      selectedId,
      msgId,
    );
    const sentMessages = await messageService.listSentMessagesToGroup(
      selectedId,
      msgId,
    );
    const allMessages = [...receivedMessages, ...sentMessages];
    return normalizeMessages(allMessages);
  };

  const fetchMessages = useCallback(async (type, selectedId) => {
    let msgs;
    try {
      if (type === MSG_DIALOG_TYPE.DIRECT) {
        msgs = await getUserMessages(selectedId);
        msgId = msgs[0]?.id;
        setAllMessages(msgs);

        const contactListToUpdate = [...directUsersList];
        const index = contactListToUpdate.findIndex(
          (ct) => ct.contact_id === selectedId,
        );
        if (index > 0) {
          contactListToUpdate[index].unreadedMsgs = 0;
          setDirectUsersList(contactListToUpdate);
        }
      }

      if (type === MSG_DIALOG_TYPE.CHANNEL) {
        msgs = await getGroupMessages(selectedId);
        setAllMessages(msgs);
      }

      // const allMsg = [...receivedMsg, ...sentMsg];
      // const filteredAllMsg = allMsg?.filter((msg) => {
      //   return !Object.keys(msg.content).includes('path');
      // });

      // const requestMsgs = filteredAllMsg.filter(
      //   (msg) => ((msg.type === Type.RequestToEducator && !msg.status) || (msg.type === Type.RequestForFriend && !msg.status))
      // );

      // const uniqRequests = requestMsgs.filter(
      //   (v, i, a) => a.findIndex((t) => t.source_user_id === v.source_user_id) === i,
      // );
      // const sourceUidRequests = uniqRequests.filter((rq) => rq.source_user_id);
      // setRequestsList(sourceUidRequests);

      // const educatorRq = sourceUidRequests.filter((rq) => rq.type === Type.RequestToEducator);
      // setRequestsToEducators(educatorRq);

      // const friendRq = sourceUidRequests.filter((rq) => rq.type === Type.RequestForFriend);
      // setRequestsToFriend(friendRq);

      // const resultAllMsg = sortByDate(filteredAllMsg);
      // setAllMessages(resultAllMsg);
    } catch (e) {
      console.error(e);
    }

    return msgs;
  }, []);

  const fetchContactList = async () => {
    const receivedMsg = allMessages.filter((msg) => msg.source_user_id);
    await addToContacts(receivedMsg);
    const contactUsersListResp = await contactService.listContact();

    if (contactUsersListResp) {
      const contactsWithUnreadedMsgs = [];
      contactUsersListResp.forEach((contactUser) => {
        const thisUserMsgs = receivedMsg.filter(
          (msg) => msg?.source_user_id === contactUser?.contact_id,
        );
        const unreadedMsgs = thisUserMsgs.filter(
          (msg) => msg.status !== MSG_STATUS.READ && !msg.target_group_id,
        ).length;
        const isDirectUser =
          contactUser.status === CONTACT_STATUS.DIRECT_MESSAGE;
        if (unreadedMsgs || isDirectUser) {
          contactsWithUnreadedMsgs.push({ ...contactUser, unreadedMsgs });
        }
      });
      setDirectUsersList(contactsWithUnreadedMsgs);
    }
  };

  const addToContacts = async (receivedMsg) => {
    const contactList = await contactService.listContact();
    const uniqMsgs = receivedMsg.filter(
      (v, i, a) =>
        a.findIndex((t) => t.source_user_id === v.source_user_id) === i,
    );
    for (let msg of uniqMsgs) {
      const isUserInContacts = contactList.find(
        (ct) => msg.source_user_id === ct.contact_id,
      );
      if (!isUserInContacts) {
        await contactService.addContact(
          msg.source_user_id,
          CONTACT_STATUS.DIRECT_MESSAGE,
        );
      }
    }
  };

  const handleUnreadMessages = async () => {
    const uMessages = await messageService.getAllUnreadMessages();
    const msg = uMessages?.msg || [];
    const unreadDirect = msg.filter((x) => x.source_user_id);
    const unreadGroup = msg.filter((x) => x.target_group_id);
    const allGroups = [...privateGroups, ...publicGroups];
    if (unreadDirect?.length && directUsersList?.length) {
      for (let i in unreadDirect) {
        const index = directUsersList.findIndex(
          (x) => x.contact_id === unreadDirect[i].source_user_id,
        );
        if (index >= 0) {
          directUsersList[index].unreadedMsgs = +unreadDirect[i].content;
        }
      }
    }
    if (unreadGroup?.length && allGroups?.length) {
      for (let i in unreadGroup) {
        const indexInPrivate = privateGroups.findIndex(
          (x) => x.id === unreadGroup[i].target_group_id,
        );
        const indexInPublic = publicGroups.findIndex(
          (x) => x.id === unreadGroup[i].target_group_id,
        );
        if (indexInPrivate >= 0) {
          privateGroups[indexInPrivate].unreadedMsgs = +unreadGroup[i].content;
        }
        if (indexInPublic >= 0) {
          publicGroups[indexInPublic].unreadedMsgs = +unreadGroup[i].content;
        }
      }
    }
  };

  useEffect(() => {
    if (location.state) {
      const { targetUserId } = location.state;
      handleSelectUser(MSG_DIALOG_TYPE.DIRECT, targetUserId);
    }
    if (location.search) {
      const search = new URLSearchParams(location.search);
      const selectedId = search.get(SELECTED_ID);
      if (isNaN(selectedId)) {
        handleSelectUser(MSG_DIALOG_TYPE.DIRECT, selectedId);
      } else {
        GroupService.list()
          .then((groups) => {
            const selectedGroup = groups?.find(
              (group) => group.id === selectedId,
            );
            if (selectedGroup) {
              const { id, name, member, status = null } = selectedGroup;
              const isPublic = status === 1;
              handleSelectChannel(id, name, member, false, isPublic);
            }
          })
          .catch((error) => console.error(error));
        //}
      }
    }
  }, [directUsersList]);

  const fetchGroupLists = React.useCallback((targetGroupId) => {
    return GroupService.list().then((result) => {
      result.sort((a, b) => a.name.localeCompare(b.name));
      let groupWithNewMsgs = null;
      if (targetGroupId) {
        result.forEach((r) => {
          if (r?.id.toString() === targetGroupId) {
            r.hasNewMsgs = true;
            groupWithNewMsgs = targetGroupId;
          }
        });
      }
      try {
        let storageGroups = JSON.parse(
          localStorage.getItem(STORAGE_CONVERSATION_CHANNELS),
        );
        if (!storageGroups) {
          result.forEach((x) => (x.isNew = false));
          storageGroups = [...result];
          localStorage.setItem(
            STORAGE_CONVERSATION_CHANNELS,
            JSON.stringify(storageGroups),
          );
        } else {
          for (let group of result) {
            const inStorage = !!storageGroups?.find(
              (gr) => gr?.id === group.id,
            );
            if (!inStorage) {
              group.isNew = true;
            }
            if (group.id === groupWithNewMsgs) {
              for (let storageGroup of storageGroups) {
                if (storageGroup.id === groupWithNewMsgs) {
                  storageGroup.hasNewMsgs = true;
                }
              }
              for (let res of result) {
                if (res.id === groupWithNewMsgs) {
                  res.hasNewMsgs = true;
                }
              }
            }
          }
          localStorage.setItem(
            STORAGE_CONVERSATION_CHANNELS,
            JSON.stringify(storageGroups),
          );
        }
      } catch (e) {
        console.error(e);
      }

      setPublicGroups(
        result.filter((group) => group?.status === GROUP_STATUS.PUBLIC),
      );
      setPrivateGroups(
        result.filter((group) => !group?.status && group?.name !== 'Friends'),
      );

      const hasFriendsGroup = result.find(
        (group) => group.type === GROUP_TYPE.GroupTypeFriend,
      );
      if (!hasFriendsGroup) {
        GroupService.create({
          name: 'Friends',
          description: 'List of friends',
          type: GROUP_TYPE.GroupTypeFriend,
        });
      }

      return result;
    });
  }, []);

  useEffect(() => {
    fetchGroupLists();
  }, [fetchGroupLists]);

  const handleSelectUser = async (type, id) => {
    handleChangeQuery(id);
    msgId = null;
    if (type === MSG_DIALOG_TYPE.REQUEST) {
      setMessageDialogType(MSG_DIALOG_TYPE.REQUEST);
      const selectedRequest = requestsList.find((x) => x.id === id);
      setSelectedUser({
        targetUserId: selectedRequest.source_user_id,
        targetUserName: selectedRequest.source_user_name,
      });
    }
    if (type === MSG_DIALOG_TYPE.DIRECT && id) {
      setMessageDialogType(MSG_DIALOG_TYPE.DIRECT);
      const publicProfile = await UserProfileSearchService.fetchPublicProfile(
        id,
      );
      const targetUserName = publicProfile?.firstName + publicProfile?.lastName;
      const msgs = await fetchMessages(type, id);
      setSelectedUser({ targetUserId: id, targetUserName });
      setReadMessagesWithUser(id, msgs);
    }
  };

  const handleSelectChannel = async (
    id,
    name,
    member,
    isNew,
    isPublic,
    hasNewMsgs,
  ) => {
    setIsCollapsed(false);
    handleChangeQuery(id);
    msgId = null;
    setMessageDialogType(MSG_DIALOG_TYPE.CHANNEL);
    const isOwner = !!member?.find((x) => x.role === GROUP_ROLE.OWNER);
    setSelectedUser({
      targetGroupId: id,
      targetUserName: name,
      isOwner,
      isPublic,
      isNew,
    });
    const allGroups = [...privateGroups, ...publicGroups];
    if (isNew) {
      const newChannel = allGroups.find((gr) => gr.id === id);
      try {
        let storageGroups = JSON.parse(
          localStorage.getItem(STORAGE_CONVERSATION_CHANNELS),
        );
        storageGroups.push(newChannel);
        localStorage.setItem(
          STORAGE_CONVERSATION_CHANNELS,
          JSON.stringify(storageGroups),
        );
        fetchGroupLists();
      } catch (e) {
        console.error(e);
      }
    }
    if (hasNewMsgs) {
      try {
        let storageGroups = JSON.parse(
          localStorage.getItem(STORAGE_CONVERSATION_CHANNELS),
        );
        for (let group of storageGroups) {
          if (group?.id.toString() === id) {
            group.hasNewMsgs = false;
          }
        }
        localStorage.setItem(
          STORAGE_CONVERSATION_CHANNELS,
          JSON.stringify(storageGroups),
        );
        fetchGroupLists();
      } catch (e) {
        console.error(e);
      }
    }
    const msgs = await fetchMessages(MSG_DIALOG_TYPE.CHANNEL, +id);
    setReadMessagesWithGroup(id, msgs);
  };

  const setReadMessagesWithUser = async (selectedId, msgsList) => {
    const index = directUsersList.findIndex((x) => x.contact_id === selectedId);
    if (index >= 0) {
      directUsersList[index].unreadedMsgs = 0;
      setDirectUsersList(directUsersList);
    }
    if (msgsList?.length) {
      const msgId = msgsList[msgsList.length - 1].id;
      messageService.setMsgStatusToUser(msgId, MSG_STATUS.READ, selectedId);
    }
  };

  const setReadMessagesWithGroup = async (selectedId, msgsList) => {
    const publicIndex = publicGroups.findIndex((x) => x.id === selectedId);
    const privateIndex = privateGroups.findIndex((x) => x.id === selectedId);
    if (publicIndex >= 0) {
      publicGroups[publicIndex].unreadedMsgs = 0;
      setPublicGroups(publicGroups);
    }
    if (privateIndex >= 0) {
      privateGroups[privateIndex].unreadedMsgs = 0;
      setPrivateGroups(privateGroups);
    }
    if (msgsList?.length) {
      const msgId = msgsList[msgsList.length - 1].id;
      messageService.setMsgStatusToGroup(msgId, MSG_STATUS.READ, selectedId);
    }
  };

  const refreshMsgHistory = () => {
    const targetId = selectedUser?.targetUserId || selectedUser?.targetGroupId;
    if (targetId && messageDialogType) {
      fetchMessages(messageDialogType, targetId);
    }
  };

  const handleSendMessage = async (
    message,
    e,
    type = Type.User,
    targetUserId = selectedUser.targetUserId,
    targetGroupId = selectedUser.targetGroupId,
    replyTo,
  ) => {
    if (e) e.preventDefault();
    let textWithoutImg = message;
    if (message?.includes('<img src=')) {
      const startIndex = message.indexOf('<img src=');
      const lastIndex = message.indexOf('">');
      if (startIndex > 0 && lastIndex > 0) {
        textWithoutImg = message.replace(
          message.substring(startIndex, lastIndex + 2),
          '',
        );
      }
    }
    try {
      const content = {
        text: textWithoutImg,
      };
      // if have some pasted images
      if (mediaId.length) {
        content.upload_id = mediaId;
      }
      socketService.sendNotification(
        targetUserId,
        content,
        targetGroupId,
        type,
        replyTo,
      );
    } catch (e) {
      console.error(e);
    }
    refreshMsgHistory();
    mediaId = [];
  };

  const handleAcceptRequest = async (userId, msgId) => {
    const msgResp = await messageService.getMsg(msgId);
    const resp = await messageService.setMsgStatus(
      msgId,
      MSG_STATUS.REQUEST_ACCEPTED,
    );
    const msg = msgResp.msg[0];
    if (resp) {
      let groups = await GroupService.list();
      if (msg.type === Type.RequestToEducator) {
        const contacts = await contactService.listContact();
        const educatorContact = contacts.find(
          (contact) => contact.contact_id === userId,
        );
        if (!educatorContact) {
          await contactService.addContact(
            userId,
            CONTACT_STATUS.DIRECT_MESSAGE,
          );
        }
        const msgContent = JSON.parse(msg.content);
        const { serviceName } = msgContent;
        if (groups.length) {
          const hasSuchServiceGroup = groups.find(
            (group) =>
              group.name === serviceName &&
              group.type === GROUP_TYPE.GroupTypeTutoring,
          );
          if (!hasSuchServiceGroup) {
            await GroupService.create({
              name: serviceName,
              type: GROUP_TYPE.GroupTypeTutoring,
              description: `Group for tutoring ${serviceName}`,
            });
            groups = await GroupService.list();
          }
        } else {
          await GroupService.create({
            name: serviceName,
            type: GROUP_TYPE.GroupTypeTutoring,
            description: `Group for tutoring ${serviceName}`,
          });
          groups = await GroupService.list();
        }
        const studentsGroupId = groups.find(
          (group) =>
            group.name === serviceName &&
            group.type === GROUP_TYPE.GroupTypeTutoring,
        ).id;
        const userInGroup = await isUserInGroup(studentsGroupId, userId);
        if (!userInGroup) {
          await GroupService.addMember(studentsGroupId, userId, 0);
        }
      }
      if (msg.type === Type.RequestForFriend) {
        if (groups.length) {
          const friendsGroupId = groups.find(
            (group) => group.type === GROUP_TYPE.GroupTypeFriend,
          ).id;
          const userInGroup = await isUserInGroup(friendsGroupId, userId);
          if (!userInGroup) {
            await GroupService.addMember(friendsGroupId, userId, 0);
          }
        }
      }
      fetchContactList();
      refreshMsgHistory();
      handleSelectUser(MSG_DIALOG_TYPE.DIRECT, userId);
    }
  };

  const isUserInGroup = async (groupId, idToAdd) => {
    const listMembers = await GroupService.listMembers(groupId);
    return !!listMembers.find((member) => member.user_id === idToAdd);
  };

  const handleDeclineRequest = async (userId, msgId) => {
    const resp = await messageService.setMsgStatus(
      msgId,
      MSG_STATUS.REQUEST_DECLINED,
    );
    if (resp) {
      handleSendMessage(DECLINE_MSG);
      refreshMsgHistory();
      handleSelectUser(MSG_DIALOG_TYPE.DIRECT, userId);
    }
  };

  const handleDirectMessage = (targetUserId) => {
    handleAddDirectUser(targetUserId);
  };

  const handleChangeQuery = (id) => {
    history.push({
      pathname: location.pathname,
      search: `?${SELECTED_ID}=${id}`,
    });
    try {
      const storageId = localStorage.getItem(STORAGE_CONVERSATION_SELECTED);
      if (+storageId !== id) {
        localStorage.setItem(STORAGE_CONVERSATION_SELECTED, id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddDirectUser = async (profileId) => {
    if (!profileId) return;
    const contactList = await contactService.listContact();
    const isUserInContacts = !!contactList.find(
      (ct) => ct.contact_id === profileId,
    );
    if (isUserInContacts) {
      await contactService.updateContact(
        profileId,
        CONTACT_STATUS.DIRECT_MESSAGE,
      );
    } else {
      await contactService.addContact(profileId, CONTACT_STATUS.DIRECT_MESSAGE);
    }
    await fetchContactList();
    await fetchMessages();
    handleSelectUser(MSG_DIALOG_TYPE.DIRECT, profileId);
  };

  const handleDeleteDirectUser = async (id) => {
    await contactService.updateContact(id, CONTACT_STATUS.NORMAL);
    fetchContactList();
    setSelectedUser({});
    handleChangeQuery(null);
  };

  const handleLeaveChannel = async (groupId, member) => {
    const myUserId = authService.getUID();
    removeFromGroup(groupId, myUserId, member);
    setSelectedUser({});
    handleChangeQuery(null);
  };

  const removeFromGroup = async (groupId, userId, member, isOwner) => {
    let isImOwner;
    if (member?.length) {
      isImOwner = member[0]?.role === GROUP_ROLE.OWNER;
    } else {
      isImOwner = isOwner;
    }
    if (isImOwner) {
      await GroupService.deactivate(groupId);
    } else {
      await GroupService.deleteMember(groupId, userId);
    }
    fetchGroupLists();
  };

  const onCreateGroup = async (channelName, isPublic) => {
    const groups = await fetchGroupLists();
    const createdChannel = groups.find((gr) => gr.name === channelName);
    if (createdChannel) {
      const { id, name, member } = createdChannel;
      handleSelectChannel(id, name, member, true, isPublic);
      const msg = `created this private channel! This is the beginning of the ** ${name} ** conversation.`;
      handleSendMessage(msg, null, Type.CreateChannel, null, id);
    }
  };

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleHasMoreMessages = (value) => {
    setHasMoreMessages(value);
  };

  const handleLoadMoreMessages = async () => {
    if (msgId) {
      const selectedId = selectedUser?.targetUserId;
      const msgs = await getUserMessages(selectedId, msgId);
      if (!msgs.length) {
        msgId = null;
        setHasMoreMessages(false);
        isScrollEnabled.current = true;
      } else {
        if (isScrollEnabled.current) {
          isScrollEnabled.current = false;
        }
        const newAllMsgs = [...msgs, ...allMessages];
        msgId = newAllMsgs[0]?.id;
        setAllMessages(newAllMsgs);
      }
    }
  };

  return (
    <div
      className={cn(style.container, {
        [style.wholePage]: wholePage,
      })}
    >
      <div className={cn(style.sidebar, { [style.open]: isCollapsed })}>
        <h2 className={style.title}>My conversations</h2>
        <div className={style.closeIcon} onClick={handleToggleSidebar}>
          <SidebarCloseIcon />
        </div>
        <div className={style.sidebarContent}>
          <Requests
            title="Educators requests"
            data={requestsToEducators}
            selectedUser={selectedUser}
            onSelect={(id) => handleSelectUser(MSG_DIALOG_TYPE.REQUEST, id)}
          />
          <Requests
            title="Friends requests"
            data={requestsToFriend}
            selectedUser={selectedUser}
            onSelect={(id) => handleSelectUser(MSG_DIALOG_TYPE.REQUEST, id)}
          />
          <Channels
            category="Public Channels"
            data={publicGroups}
            fetchGroupLists={fetchGroupLists}
            fetchMessages={fetchMessages}
            isPublic={true}
            onSelect={handleSelectChannel}
            selected={selectedUser}
            onDelete={handleLeaveChannel}
            onCreateGroup={onCreateGroup}
          />
          <Channels
            category="Private Channels"
            data={privateGroups}
            fetchGroupLists={fetchGroupLists}
            onSelect={handleSelectChannel}
            selected={selectedUser}
            onDelete={handleLeaveChannel}
            onCreateGroup={onCreateGroup}
          />
          <DirectMessages
            title="Direct messages"
            directUsers={directUsersList}
            selectedUser={selectedUser}
            onSelect={(id) => {
              handleSelectUser(MSG_DIALOG_TYPE.DIRECT, id);
              setIsCollapsed(false);
            }}
            onDelete={handleDeleteDirectUser}
            onAddUser={handleAddDirectUser}
          />
        </div>
      </div>

      <MessageDialog
        type={messageDialogType}
        targetUser={selectedUser}
        allMsg={allMessages}
        onSendMessage={handleSendMessage}
        onAccept={handleAcceptRequest}
        onDecline={handleDeclineRequest}
        onDirectMessage={handleDirectMessage}
        refreshMsgHistory={refreshMsgHistory}
        removeFromGroup={removeFromGroup}
        handleToggleSidebar={handleToggleSidebar}
        onLoadMore={handleLoadMoreMessages}
        hasMoreMessages={hasMoreMessages}
        handleHasMoreMessages={handleHasMoreMessages}
        isScrollEnabled={isScrollEnabled}
      />
    </div>
  );
};

const MessageDialog = ({
  type,
  targetUser = {},
  allMsg,
  onSendMessage,
  onDirectMessage,
  refreshMsgHistory,
  removeFromGroup,
  handleToggleSidebar,
  onLoadMore,
  hasMoreMessages,
  isScrollEnabled,
  handleHasMoreMessages,
}) => {
  const [msgsWithUser, setMsgsWithUser] = useState([]);
  const [isOpenedInvitingModal, setIsOpenedInvitingModal] = useState(false);
  const [isOpenedMembersListModal, setIsOpenedMembersListModal] = useState(
    false,
  );
  const [userToRemove, setUserToRemove] = useState(null);
  const [message, setMessage] = useState('');
  const [threadMessage, setThreadMessage] = useState('');
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [isEmojiShow, setIsEmojiShow] = useState(false);
  const [isThreadEmojiShow, setIsThreadEmojiShow] = useState(false);
  const messagesEndRef = useRef(null);
  const quillRef = useRef(null);
  const threadQuillRef = useRef(null);
  const {
    targetUserId,
    targetUserName,
    targetGroupId,
    isOwner,
    isPublic,
  } = targetUser;
  const [groupOwner, setGroupOwner] = useState();
  const [isMessageWithEmail, setIsMessageWithEmail] = useState(false);
  const [allReplyMessages, setAllReplyMessages] = useState([]);
  const [threadReplyMessages, setThreadReplyMessages] = useState([]);
  const [selectedThreadMessage, setSelectedThreadMessage] = useState(null);

  const myName = authService.getDisplayName();

  const getGroupOwner = (groupId) => {
    if (groupId) {
      GroupService.listMembers(groupId).then((membersList) => {
        if (membersList.length) {
          const groupOwnerFind = membersList.find(
            (m) => m.role === GROUP_ROLE.OWNER,
          )?.user_name;
          setGroupOwner(groupOwnerFind);
        }
      });
    }
  };

  const handleOpenThread = (value) => {
    setIsThreadOpen(value);
  };

  const handleThreadMessages = (msg, messages) => {
    const selectedMsg = msg || selectedThreadMessage;
    const replyMessage = messages || allReplyMessages;
    const replyMsgs = replyMessage?.filter(
      (msg) => msg.reply_to === selectedMsg?.id,
    );
    setThreadReplyMessages([selectedMsg, ...replyMsgs]);
    setSelectedThreadMessage(selectedMsg);
    setIsThreadOpen(true);
  };

  useEffect(() => {
    if (message === '<p><br></p>') {
      setMessage('');
    }
  }, [message]);

  useEffect(() => {
    const filterByUserId = allMsg
      ?.filter((msg) => {
        if (targetUserId) {
          return (
            !msg?.target_group_id &&
            (msg?.source_user_id === targetUserId ||
              msg?.target_user_id === targetUserId)
          );
        } else {
          return msg?.target_group_id === targetGroupId;
        }
      })
      .filter((msg) => typeof msg.content.text === 'string' && !msg.reply_to);

    if (type !== MSG_DIALOG_TYPE.REQUEST) {
      setMsgsWithUser(filterByUserId);
    } else {
      const onlyRequests = filterByUserId.filter(
        (msg) =>
          msg.type === Type.RequestToEducator ||
          (msg.type === Type.RequestForFriend && !msg.status),
      );
      setMsgsWithUser(onlyRequests);
    }
    if (targetGroupId && (isOwner || isPublic)) {
      GroupService.listMembers(targetGroupId).then((membersList) => {
        if (membersList.length <= 1) {
          setIsOpenedInvitingModal(true);
        }
      });
    }

    if (allMsg.length >= 100) {
      handleHasMoreMessages(true);
    }

    const replyMsgs = allMsg?.filter((msg) => msg.reply_to);
    setAllReplyMessages(replyMsgs);

    if (isThreadOpen) {
      handleThreadMessages(selectedThreadMessage, replyMsgs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUserId, targetGroupId, allMsg]);

  React.useEffect(() => {
    isScrollEnabled.current = true;
  }, [targetUserId, targetGroupId, isScrollEnabled]);

  React.useEffect(() => {
    if (isScrollEnabled.current) {
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView();
        }
      }, 300);
    }
  }, [targetUserId, targetGroupId, allMsg, setMsgsWithUser, isScrollEnabled]);

  React.useEffect(() => {
    getGroupOwner(targetGroupId);
  }, [targetGroupId]);

  // const acceptRequest = () => {
  //   const lastMsg = msgsWithUser[msgsWithUser.length - 1];
  //   if (!lastMsg?.status) {
  //     if (message) {
  //       onSendMessage(message);
  //       setMessage('');
  //     }
  //     onAccept(targetUserId, lastMsg.id);
  //   }
  // };

  // const declineRequest = () => {
  //   const lastMsg = msgsWithUser[msgsWithUser.length - 1];
  //   if (!lastMsg?.status) {
  //     if (message) {
  //       onSendMessage(message);
  //       setMessage('');
  //     }
  //     onDecline(targetUserId, lastMsg.id);
  //   }
  // };

  const onSubmit = (e) => {
    if (!isMessageWithEmail) {
      if (selectedThreadMessage?.id) {
        // send message in thread
        onSendMessage(
          threadMessage,
          e,
          undefined,
          undefined,
          undefined,
          selectedThreadMessage?.id,
        );
      } else {
        onSendMessage(message, e);
      }
    } else {
      onSendMessage(message, e, Type.WithEmailNotification);
      setIsMessageWithEmail(false);
    }
    setMessage('');
    setThreadMessage('');
  };

  const onEnter = (e) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      e.stopPropagation();
      onSubmit(e);
    }
  };

  // const handleChange = (e) => {
  //   setMessage(e.target.value);
  // };

  const handleAddFriend = async (uid) => {
    const content = {
      serviceName: 'Friend request',
      text: 'Hi, please add me to your Friends',
    };
    await messageService.send(uid, content, Type.RequestForFriend);
  };

  const handleDirectMessage = (id) => {
    onDirectMessage(id);
    setIsOpenedMembersListModal(false);
  };

  const handleSetUserToRemove = (groupId, userId, member, isOwner) => {
    setUserToRemove({ groupId, userId, member, isOwner });
    setIsOpenedMembersListModal(false);
  };

  const handleRemoveFromGroup = async () => {
    const { groupId, userId, member, isOwner } = userToRemove || {};
    await removeFromGroup(groupId, userId, member, isOwner);
    setUserToRemove(null);
    setIsOpenedMembersListModal(true);
  };

  const addEmoji = (event, emojiObject) => {
    const editor = quillRef.current.getEditor();
    const delta = editor.getContents();
    const lastInsertIndex = delta?.ops.length - 1;
    const insertation =
      delta.ops[lastInsertIndex].insert.replace(/\n$/, '') + emojiObject.emoji;
    delta.ops[lastInsertIndex].insert = insertation;
    editor.setContents(delta);
    setIsEmojiShow(false);
  };

  const addThreadEmoji = (event, emojiObject) => {
    const editor = threadQuillRef.current.getEditor();
    const delta = editor.getContents();
    const lastInsertIndex = delta?.ops.length - 1;
    const insertation =
      delta.ops[lastInsertIndex].insert.replace(/\n$/, '') + emojiObject.emoji;
    delta.ops[lastInsertIndex].insert = insertation;
    editor.setContents(delta);
    setIsThreadEmojiShow(false);
  };

  const handleSetMessage = (value) => {
    setMessage(value);
  };

  const handleSetThreadMessage = (value) => {
    setThreadMessage(value);
  };

  const handleSetIsEmojiShow = () => {
    setIsEmojiShow((prev) => !prev);
  };

  const handleSetIsThreadEmojiShow = () => {
    setIsThreadEmojiShow((prev) => !prev);
  };

  const handleMessageWithEmail = () => {
    setIsMessageWithEmail((prev) => !prev);
  };

  const renderNoUser = () => <h2>No user/channel selected</h2>;
  return (
    <div className={style.msgContent}>
      {Object.keys(targetUser).length === 0 ? (
        renderNoUser()
      ) : (
        <>
          <div className={style.msgContentTitle}>
            <div className={style.collapsedPanel}>
              <div className={style.openIcon} onClick={handleToggleSidebar}>
                <SidebarOpenIcon />
              </div>
            </div>
            <p>{targetUserName}</p>
            {targetGroupId && (
              <div className={style.actions}>
                <p
                  onClick={() => setIsOpenedMembersListModal(true)}
                  className={style.viewAll}
                >
                  View all members
                </p>
                {(isOwner || isPublic) && (
                  <AddUser onClick={() => setIsOpenedInvitingModal(true)} />
                )}
              </div>
            )}
          </div>
          <div className={style.msgHistory}>
            <InfiniteScroll
              pageStart={0}
              loadMore={onLoadMore}
              hasMore={hasMoreMessages}
              loader={
                <div className="loader ml-1 text-dark text-center" key={0}>
                  Loading ...
                </div>
              }
              useWindow={false}
              initialLoad={false}
              isReverse={true}
            >
              <MsgHistory
                msgsWithUser={msgsWithUser}
                handleAddFriend={handleAddFriend}
                onDirectMessage={handleDirectMessage}
                myName={myName}
                groupOwner={groupOwner}
                onReply={handleThreadMessages}
              />
            </InfiniteScroll>
            <div ref={messagesEndRef}></div>
            <ThreadSidebar
              isOpen={isThreadOpen}
              messages={threadReplyMessages}
              handleAddFriend={handleAddFriend}
              onDirectMessage={handleDirectMessage}
              myName={myName}
              groupOwner={groupOwner}
              handleOpenThread={handleOpenThread}
            >
              <MessageWrite
                quillRef={threadQuillRef}
                message={threadMessage}
                handleSetMessage={handleSetThreadMessage}
                onEnter={onEnter}
                handleSetIsEmojiShow={handleSetIsThreadEmojiShow}
                addEmoji={addThreadEmoji}
                isEmojiShow={isThreadEmojiShow}
                onSubmit={onSubmit}
                handleMessageWithEmail={handleMessageWithEmail}
                isMessageWithEmail={isMessageWithEmail}
              />
            </ThreadSidebar>
          </div>

          <MessageWrite
            quillRef={quillRef}
            message={message}
            handleSetMessage={handleSetMessage}
            onEnter={onEnter}
            handleSetIsEmojiShow={handleSetIsEmojiShow}
            addEmoji={addEmoji}
            isEmojiShow={isEmojiShow}
            onSubmit={onSubmit}
            handleMessageWithEmail={handleMessageWithEmail}
            isMessageWithEmail={isMessageWithEmail}
          />
        </>
      )}
      <InviteFriends
        show={isOpenedInvitingModal}
        onClose={() => setIsOpenedInvitingModal(false)}
        groupId={targetGroupId}
        onSubmit={refreshMsgHistory}
      />
      <MembersList
        show={isOpenedMembersListModal}
        onClose={() => setIsOpenedMembersListModal(false)}
        groupId={targetGroupId}
        onDirectMessage={handleDirectMessage}
        onRemove={handleSetUserToRemove}
        isImOwner={isOwner}
      />
      <DeleteModal
        title="Remove user"
        text={`Are you sure want to remove this user from group?`}
        show={!!userToRemove}
        onClose={() => setUserToRemove(null)}
        onSubmit={handleRemoveFromGroup}
      />
    </div>
  );
};

const MessageWrite = ({
  quillRef,
  message,
  handleSetMessage,
  onEnter,
  handleSetIsEmojiShow,
  addEmoji,
  onSubmit,
  handleMessageWithEmail,
  isEmojiShow,
  isMessageWithEmail,
}) => {
  return (
    <div className={style.msgBox}>
      {/* {type === MSG_DIALOG_TYPE.REQUEST ? (
        <div className={style.requestMessageWrap}>
          <FormControl
            as="textarea"
            value={message}
            onChange={(e) => handleChange(e)}
            placeholder="Write customized message…"
            rows={2}
          />
          <div className={style.buttonsWrap}>
            <Button onClick={acceptRequest}>Accept</Button>
            <Button onClick={declineRequest} className="btn-tertiary-dark">
              Decline
                    </Button>
          </div>
        </div>
      ) : ( */}
      <div className={style.messageWrap}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={message}
          modules={modules}
          formats={formats}
          onChange={handleSetMessage}
          onKeyDown={(e) => onEnter(e)}
        />
        <Tooltip title="Add emoji" placement="top">
          <span
            className={style.emojiTrigger}
            onClick={() => handleSetIsEmojiShow()}
          >
            {String.fromCodePoint(0x1f60a)}
          </span>
        </Tooltip>
        {isEmojiShow && (
          <div className={style.emojiContainer}>
            <Picker
              onEmojiClick={addEmoji}
              disableSearchBar={true}
              native={true}
            />
          </div>
        )}
        <SendViaEmail
          checked={isMessageWithEmail}
          onChange={handleMessageWithEmail}
        />
        <Button className={style.sendButton} onClick={(e) => onSubmit(e)}>
          <SendMessage />
        </Button>
      </div>
      {/* )} */}
    </div>
  );
};

const MsgHistory = ({
  msgsWithUser,
  handleAddFriend,
  onDirectMessage,
  myName,
  groupOwner,
  onReply,
}) => {
  let prevDate;
  const today = moment().format('YYYY-MM-DD');
  const isThread = !onReply;
  return (
    <>
      {msgsWithUser?.map((msg, key) => {
        const timeStamp = moment.utc(msg.created_ts).local();
        const time = timeStamp.format('hh:mm:ss A');
        let date = timeStamp.format('YYYY-MM-DD');
        if (date === today) {
          date = 'Today';
        }
        let isDateSame = true;
        if (date !== prevDate) {
          isDateSame = false;
          prevDate = date;
        }
        const userName = msg.source_user_name || myName;
        let fromUserId = null;
        let fromUserName = null;
        if (msg.type === Type.AddToChannel) {
          fromUserId = msg.content?.profileId;
          fromUserName = msg.content?.name;
        }
        return (
          <div key={key}>
            {!isDateSame && !isThread && (
              <div className={style.msgGroupDateRow}>
                <span className={style.msgGroupDate}>{date}</span>
              </div>
            )}
            <div
              className={cn(
                style.msgRow,
                !msg.source_user_name && style.outcommingMessage,
              )}
            >
              <div className={style.msgAvatar}>
                <ProfilePopup
                  targetUserName={fromUserName || msg.source_user_name}
                  targetUserId={fromUserId || msg.source_user_id}
                  hide={userName === myName}
                  onAddFriend={handleAddFriend}
                  onDirectMessage={onDirectMessage}
                >
                  <button className={style.avatarButton}>
                    <Avatar
                      id={
                        fromUserId || msg.source_user_id || authService.getUID()
                      }
                      size={50}
                    />
                  </button>
                </ProfilePopup>
              </div>
              <MsgContent
                msg={msg}
                username={userName}
                userId={msg.source_user_id}
                myName={myName}
                time={time}
                fromUserId={fromUserId}
                fromUserName={fromUserName}
                groupOwner={groupOwner}
                onDirectMessage={onDirectMessage}
                handleAddFriend={handleAddFriend}
                onReply={onReply}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

const MsgContent = ({
  msg,
  username,
  userId,
  time,
  groupOwner,
  onDirectMessage,
  myName,
  fromUserId,
  fromUserName,
  handleAddFriend,
  onReply,
}) => {
  const { type, reply_count } = msg;
  const { upload_id } = msg?.content;
  const isThread = !onReply;
  switch (type) {
    case Type.RequestToEducator:
    case Type.RequestForFriend:
      return (
        <div className={style.msgRowContent}>
          <div className={style.msgRowHeader}>
            <ProfilePopup
              targetUserName={fromUserName || msg.source_user_name}
              targetUserId={fromUserId || msg.source_user_id}
              hide={username === myName}
              onAddFriend={handleAddFriend}
              onDirectMessage={onDirectMessage}
            >
              <span className={style.msgUserName}>{username}</span>
            </ProfilePopup>
            <span className={style.msgTime}>{time}</span>
          </div>
          <RequestMsg msg={msg} />
        </div>
      );

    case Type.CreateChannel:
      return (
        <div className={style.msgRowContent}>
          <div className={style.msgTextContainer}>
            <ProfilePopup
              targetUserName={fromUserName || msg.source_user_name}
              targetUserId={fromUserId || msg.source_user_id}
              hide={username === myName}
              onAddFriend={handleAddFriend}
              onDirectMessage={onDirectMessage}
            >
              <span className={style.msgLink}>{username} </span>
            </ProfilePopup>
            <ReactMarkdown escapeHtml={false} source={msg.content.text} />
          </div>
        </div>
      );

    case Type.AddToChannel:
      return (
        <div className={style.msgRowContent}>
          <div className={style.msgRowHeader}>
            <ProfilePopup
              targetUserName={fromUserName || msg.source_user_name}
              targetUserId={fromUserId || msg.source_user_id}
              hide={username === myName}
              onAddFriend={handleAddFriend}
              onDirectMessage={onDirectMessage}
            >
              <span className={style.msgUserName}>
                {msg.content?.name || username}
              </span>
            </ProfilePopup>
            <span className={style.msgTime}>{time}</span>
          </div>
          <div className={style.msgTextContainer}>
            <ReactMarkdown escapeHtml={false} source={msg.content.text} />
            <ProfilePopup
              targetUserName={username}
              targetUserId={userId}
              hide={username === myName}
              onDirectMessage={onDirectMessage}
            >
              <span className={style.msgLink}> {groupOwner}</span>
            </ProfilePopup>
          </div>
        </div>
      );

    case Type.JoinChannel:
      return (
        <div className={style.msgRowContent}>
          <div className={style.msgRowHeader}>
            <ProfilePopup
              targetUserName={fromUserName || msg.source_user_name}
              targetUserId={fromUserId || msg.source_user_id}
              hide={username === myName}
              onAddFriend={handleAddFriend}
              onDirectMessage={onDirectMessage}
            >
              <span className={style.msgUserName}>{username}</span>
            </ProfilePopup>
            <span className={style.msgTime}>{time}</span>
          </div>
          <div className={style.msgTextContainer}>
            <ReactMarkdown escapeHtml={false} source={msg.content.text} />
          </div>
        </div>
      );

    default:
      return (
        <div className={style.messageTextWrap}>
          <div className={style.msgRowContent}>
            {!isThread && <MessageMenu onReply={() => onReply(msg)} />}
            <div className={style.msgRowHeader}>
              <ProfilePopup
                targetUserName={fromUserName || msg.source_user_name}
                targetUserId={fromUserId || msg.source_user_id}
                hide={username === myName}
                onAddFriend={handleAddFriend}
                onDirectMessage={onDirectMessage}
              >
                <span className={style.msgUserName}>{username}</span>
              </ProfilePopup>
              <span className={style.msgTime}>{time}</span>
            </div>

            <div className={style.msgTextContainer}>
              <ReactMarkdown escapeHtml={false} source={msg.content.text} />
              {type === Type.WithEmailNotification && (
                <SendViaEmail disabled tooltipText="Email sent" />
              )}
            </div>
          </div>
          {upload_id?.length && (
            <div className={style.mediaPanel}>
              {upload_id.map((id, key) => (
                <ImagePreview key={key} id={id} size={120} />
              ))}
            </div>
          )}
          {!isThread && reply_count && (
            <div className={style.showReplies} onClick={() => onReply(msg)}>
              <span className={style.showRepiesText}>
                Show {reply_count} replies
              </span>
            </div>
          )}
        </div>
      );
  }
};

const MessageMenu = ({ onReply }) => (
  <div className={style.msgMenuContainer}>
    <div className={cn(style.msgMenuItem, style.reply)} onClick={onReply}>
      <Tooltip title="Reply" placement="top">
        <ReplyFill />
      </Tooltip>
    </div>
  </div>
);

const ThreadSidebar = ({
  children,
  isOpen,
  messages,
  handleAddFriend,
  handleDirectMessage,
  myName,
  groupOwner,
  handleOpenThread,
}) => {
  return (
    <section className={cn(style.threadSidebar, { [style.isOpen]: isOpen })}>
      <header className={style.threadHeader}>
        <h2 className={style.threadHeadline}>
          <ChatRightText /> Thread
        </h2>
        <div
          className={style.threadClose}
          onClick={() => handleOpenThread(false)}
        >
          <X size={24} />
        </div>
      </header>
      <div className={style.threadMsgHistory}>
        <MsgHistory
          msgsWithUser={messages}
          handleAddFriend={handleAddFriend}
          onDirectMessage={handleDirectMessage}
          myName={myName}
          groupOwner={groupOwner}
        />
      </div>
      {children}
    </section>
  );
};

const SendViaEmail = ({
  tooltipText,
  tooltipPlacement,
  checked,
  disabled,
  onChange,
}) => (
  <Tooltip
    title={tooltipText || 'Send via email also'}
    placement={tooltipPlacement || 'top'}
  >
    <label className={style.sendViaEmailLabel}>
      <input
        type="checkbox"
        onChange={onChange}
        disabled={disabled}
        checked={checked}
        className={style.sendViaEmailCheckbox}
      />
      <EnvelopeFill />
    </label>
  </Tooltip>
);

const RequestMsg = ({ msg }) => (
  <div className={style.msgTextContainer}>
    <p className={style.msg}>
      {msg.content.serviceName && (
        <span className={style.msgOrange}>Requested: </span>
      )}
      {msg.content.serviceName}
    </p>
    <p className={style.msg}>
      {msg.content.timeZone && (
        <span className={style.msgOrange}>Time zone: </span>
      )}
      {msg.content.timeZone}
    </p>
    <p className={style.msg}>
      {msg.content.frequency && (
        <span className={style.msgOrange}>Frequency: </span>
      )}
      {msg.content.frequency}
    </p>
    <p className={style.msg}>
      {msg.content.text && <span className={style.msgOrange}>Message: </span>}
      {msg.content.text}
    </p>
  </div>
);

export default React.memo(withRouter(Conversations));
