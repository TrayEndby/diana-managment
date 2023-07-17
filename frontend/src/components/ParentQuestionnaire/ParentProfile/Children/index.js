import React, { useState } from 'react';
import AddEditModal from './AddEditModal';
import cn from 'classnames';
import { AddPlusGreen, EditPencilGreen } from 'util/Icon';

import style from './style.module.scss';

const Children = ({ list, addChild, disabled, deleteChild }) => {
  const [isAddModalShow, setIsAddModalShow] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

  const showModal = () => setIsAddModalShow(true);
  const closeModal = () => setIsAddModalShow(false);

  const handleEdit = (id) => {
    setSelectedChild(id);
    showModal();
  }

  const handleSubmit = (item) => {
    setSelectedChild(null);
    addChild(item)
  }

  const handleDelete = (item) => {
    setSelectedChild(null);
    deleteChild(item);
  }

  return (
    <div className={style.servicesWrap}>
      <div className={style.servicesHeader}>
        <h3 className={style.servicesTitle}>Child information</h3>
        <div onClick={showModal} className={cn(style.serviceAdd, { [style.addDisabled]: disabled })}>
          <AddPlusGreen />
        </div>
      </div>

      {Array.isArray(list) && list.length !== 0 && (
        <div className={style.servicesList}>
          {list.map((child, key) => {
            const { name, email } = child;
            return (
              <ChildItem
                id={key}
                key={key}
                name={name}
                email={email}
                onEdit={handleEdit}
              />
            );
          })}
        </div>
      )}

      <AddEditModal
        selectedChild={selectedChild}
        list={list}
        show={isAddModalShow}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

const ChildItem = ({ id, name, email, onEdit }) => (
  <div className={style.serviceItem}>
    <div className={style.editButton} onClick={() => onEdit(id)} title="Edit">
      <EditPencilGreen />
    </div>
    <div className={style.serviceItemRow}>
      <p className={cn(style.serviceItemInfo, style.serviceItemName)}>{name}</p>
    </div>
    <div className={style.serviceItemRow}>
      <p className={cn(style.serviceItemInfo, style.serviceItemEmail)}>{email}</p>
    </div>
  </div>
);

export default Children;
