import React, { useState } from 'react';
import cn from 'classnames';
import Collapse from 'react-bootstrap/Collapse';
import { X } from 'react-bootstrap-icons';
import { AddPlusWhite } from 'util/Icon';
import { CONTACT_TAG } from 'constants/contactTags';

import AddDirectUserModal from '../Modals/AddDirectUserModal';
import style from '../style.module.scss';

const DirectMessages = ({ title, directUsers, onSelect, selectedUser, onDelete, onAddUser }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const toggleAddUserModal = (e) => {
    e && e.stopPropagation();
    setIsAddUserOpen(prev => !prev)
  }

  const handleDelete = (e, id) => {
    e.stopPropagation();
    onDelete(id)
  }

  const renderTag = (tag) => {
    switch (tag) {
      case CONTACT_TAG.EDUCATOR:
        return 'E';
      case CONTACT_TAG.STUDENT:
        return 'S';
      case CONTACT_TAG.PARENT:
        return 'P';
      default:
        return '';
    }
  }

  if (!Array.isArray(directUsers)) return null
  return (
    <div className={style.sidebarItem}>
      <div className={cn(style.sidebarItemTitle, { [style.open]: isOpen })} onClick={() => setIsOpen(!isOpen)}>
        {title}
        <span className={style.sidebarItemAdd} onClick={toggleAddUserModal}>
          <AddPlusWhite />
        </span>
      </div>
      <Collapse in={isOpen} className={style.sidebarItemContent}>
        <div>
          {directUsers?.map(({ name, contact_id, unreadedMsgs, online, tags }, i) => {
            let isActive = false;
            if (selectedUser?.targetUserId) {
              isActive = selectedUser.targetUserId === contact_id;
            }
            return (
              <div key={i} className={cn(style.sidebarItemText, { [style.active]: isActive })} onClick={() => onSelect(contact_id)}>
                <span className={cn(style.userType, { [style.online]: online })}>{renderTag(tags)}</span>
                <span className={style.text}>{name}</span>
                {!!unreadedMsgs && <span className={style.unreadedRequests}>{unreadedMsgs}</span>}
                <span className={style.deleteCross}><X size="18px" onClick={(e) => handleDelete(e, contact_id)} /></span>
              </div>)
          })}
        </div>
      </Collapse>
      <AddDirectUserModal
        title="Add user to Direct messages"
        show={isAddUserOpen}
        onClose={toggleAddUserModal}
        onAddUser={onAddUser}
      />
    </div>
  )
}

export default DirectMessages;