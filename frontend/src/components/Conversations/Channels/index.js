import React from 'react';
import cn from 'classnames';
import { Collapse } from 'react-bootstrap';
import AddGroupModal from '../Modals/AddGroupModal';
import DeleteModal from '../Modals/DeleteModal';
import { AddPlusWhite } from 'util/Icon';
import { X } from 'react-bootstrap-icons';
import groupService from 'service/GroupService';
import SearchChannelModal from '../Modals/SearchChannelModal';
import { GROUP_ROLE } from '../index';

import style from '../style.module.scss';

const Channels = ({ category, data, fetchGroupLists, isPublic, onSelect, selected, onDelete, onCreateGroup, fetchMessages }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showSearchModal, setShowSearchModal] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);

  const handleOpenAddModal = React.useCallback((e) => {
    e.stopPropagation();
    setShowAddModal(true);
  }, []);

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCreateGroup = () => {
    setShowAddModal(false);
    onCreateGroup();
  };

  const handleOpenSearchModal = React.useCallback((e) => {
    e.stopPropagation();
    setShowSearchModal(true);
  }, []);

  const handleCloseSearchModal = React.useCallback(() => {
    setShowSearchModal(false);
    fetchGroupLists();
  }, [fetchGroupLists]);

  const handleDelete = (e, id, member) => {
    e.stopPropagation();
    if (!isPublic) {
      groupService.listMembers(id).then(result => {
        const ownerName = result.find(x => x.role === GROUP_ROLE.OWNER)?.user_name;
        setItemToDelete({ id, member, ownerName });
      })
        .catch(e => console.error(e))
    } else {
      onDelete(id, member)
    }
  }

  const handleCloseDeleteModal = () => {
    setItemToDelete(null)
  }

  const handleSubmitLeaveGroup = () => {
    const { id, member } = itemToDelete;
    onDelete(id, member)
    setItemToDelete(null)
  }

  return (
    <div className={style.sidebarItem}>
      <div className={cn(style.sidebarItemTitle, { [style.open]: isOpen })} onClick={() => setIsOpen(!isOpen)}>
        {category}
        <span className={style.sidebarItemAdd}>
          <AddPlusWhite />
          <section className={style.actions}>
            {isPublic && <p onClick={handleOpenSearchModal}>Search channels</p>}
            <p onClick={handleOpenAddModal}>Create a channel</p>
          </section>
        </span>
      </div>
      <Collapse in={isOpen} className={style.sidebarItemContent}>
        <div>
          {data.map(({ name, id, member, isNew, unreadedMsgs, hasNewMsgs }, i) => {
            let isActive = false;
            if (selected?.targetGroupId) {
              isActive = selected.targetGroupId === id;
            }
            return (
              <div key={i}
                className={cn(style.sidebarItemText, { [style.active]: isActive, [style.hasNewMsgs]: hasNewMsgs })}
                onClick={() => onSelect(id, name, member, isNew, isPublic, hasNewMsgs)}
              >
                <span className={style.text}>{name}</span>
                {!!unreadedMsgs && <span className={style.unreadedRequests}>{unreadedMsgs}</span>}
                <span className={style.deleteCross}><X size="18px" onClick={(e) => handleDelete(e, id, member)} /></span>
              </div>
            )
          })}
        </div>
      </Collapse>
      {showAddModal &&
        <AddGroupModal
          show={showAddModal}
          onClose={handleCloseAddModal}
          onSubmit={handleCreateGroup}
          isPublic={isPublic}
          onCreateGroup={onCreateGroup}
        />}
      {isPublic && showSearchModal && (
        <SearchChannelModal
          show={showSearchModal}
          onClose={handleCloseSearchModal}
          isPublic={isPublic}
          subscribedGroups={data}
          fetchGroupLists={fetchGroupLists}
          fetchMessages={fetchMessages}
        />
      )}
      <DeleteModal
        title="Leave private group"
        text={`If you leave the private channel, you will no longer be able to see any of its messages. To rejoin the private channel, you will have to be re-invited by ${itemToDelete?.ownerName || `group owner`}.
        Are you sure you wish to leave ? `}
        show={!!itemToDelete}
        onClose={handleCloseDeleteModal}
        onSubmit={handleSubmitLeaveGroup}
      />
    </div>
  );
};

export default React.memo(Channels);
