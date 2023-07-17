import React, { useState, useEffect } from 'react';
import { EditPencilOrange } from '../../../../../util/Icon';
import FormControl from 'react-bootstrap/FormControl';
import cn from 'classnames';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import rowStyle from '../../style.module.scss';
import '../../style.scss';

const ShortBio = ({ data, handleSave, isEducator }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newInfo, setNewInfo] = useState(data);

  useEffect(() => {
    setNewInfo(data);
  }, [data]);

  const toggleEdit = () => {
    isEdit ? setIsEdit(false) : setIsEdit(true);
  };

  const handleClose = () => setIsEdit(false);

  const handleChange = (e) => {
    const { value } = e.target;
    setNewInfo(value);
  };

  const save = () => {
    handleSave(newInfo);
    setIsEdit(false);
  };

  return (
    <div className={rowStyle.editInfoRowContainer}>
      <div className={rowStyle.editInfoRowHeader}>
        <h4 className={cn(rowStyle.editInfoRowHeadline, rowStyle.colorOrange)}>Short bio</h4>
        {isEducator && (
          <div onClick={toggleEdit}>
            <EditPencilOrange />
          </div>
        )}
      </div>
      <div className={rowStyle.editInfoRowText}>
        {isEdit ? (
          <EditModal show={isEdit} data={newInfo} handleClose={handleClose} handleChange={handleChange} save={save} />
        ) : (
          <div>{newInfo}</div>
        )}
      </div>
    </div>
  );
};

const EditModal = ({ show, handleClose, data, handleChange, save }) => (
  <Modal show={show} onHide={handleClose} centered className="educator-modal">
    <Modal.Header closeButton>
      <Modal.Title>Short Bio</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <FormControl
        as="textarea"
        rows={5}
        value={data}
        onChange={(e) => handleChange(e)}
        placeholder="Write your short bio here…"
      />
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={save}>
        Save
      </Button>
    </Modal.Footer>
  </Modal>
);

export default React.memo(ShortBio);
