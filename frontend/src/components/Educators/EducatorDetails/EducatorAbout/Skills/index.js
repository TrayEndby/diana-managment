import React, { useState, useEffect } from 'react';
import { EditPencilOrange } from '../../../../../util/Icon';
import FormControl from 'react-bootstrap/FormControl';
import cn from 'classnames';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import SkillsList from './SkillsList';

import rowStyle from '../../style.module.scss';
import '../../style.scss';

const Skills = ({ data, handleSave, isEducator }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newInfo, setNewInfo] = useState(data);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    setNewInfo(data);
  }, [data]);

  const toggleEdit = () => {
    isEdit ? setIsEdit(false) : setIsEdit(true);
  };

  const handleClose = () => {
    setNewInfo(data);
    setIsEdit(false);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setNewSkill(value);
  };

  const handleAdd = () => {
    setNewInfo([...newInfo, newSkill]);
    setNewSkill('');
  };

  const handleRemove = (index) => {
    const newList = [...newInfo];
    newList.splice(index, 1);
    setNewInfo(newList);
  };

  const save = () => {
    handleSave(newInfo);
    setIsEdit(false);
  };

  return (
    <div className={rowStyle.editInfoRowContainer}>
      <div className={rowStyle.editInfoRowHeader}>
        <h4 className={cn(rowStyle.editInfoRowHeadline, rowStyle.colorOrange)}>Skills</h4>
        {isEducator && (
          <div onClick={toggleEdit}>
            <EditPencilOrange />
          </div>
        )}
      </div>
      <div className={rowStyle.editInfoRowContent}>
        {isEdit ? (
          <EditModal
            show={isEdit}
            data={newInfo}
            newSkill={newSkill}
            handleClose={handleClose}
            handleChange={handleChange}
            handleAdd={handleAdd}
            handleRemove={handleRemove}
            save={save}
          />
        ) : (
          <div>
            <SkillsList skills={newInfo} />
          </div>
        )}
      </div>
    </div>
  );
};

const EditModal = ({ show, handleClose, data, handleChange, save, handleAdd, handleRemove, newSkill }) => (
  <Modal show={show} onHide={handleClose} centered className="educator-modal">
    <Modal.Header closeButton>
      <Modal.Title>Add Skills</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="educator-modal__content">
        <div className="educator-modal__content-row">
          <FormControl value={newSkill} onChange={(e) => handleChange(e)} placeholder="Add a skill.." />
          <Button variant="primary" onClick={handleAdd} className="ml-2">
            Add
          </Button>
        </div>
        <div className="educator-modal__content-row">
          <SkillsList skills={data} isEditable handleRemove={handleRemove} />
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={save}>
        Save
      </Button>
    </Modal.Footer>
  </Modal>
);

export default React.memo(Skills);
