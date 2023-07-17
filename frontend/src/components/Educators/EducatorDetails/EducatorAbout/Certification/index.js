import React, { useEffect, useState } from 'react';
import { EditPencilOrange, AddPlusOrange } from '../../../../../util/Icon';
import Form from 'react-bootstrap/Form';
import cn from 'classnames';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import DateInput from '../../../../../util/DateInput';
import style from '../ServiceExp/style.module.scss';
import rowStyle from '../../style.module.scss';
import '../../style.scss';

const Education = ({ data, handleSave, handleDelete, isEducator }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newInfo, setNewInfo] = useState(data);
  const [newItem, setNewItem] = useState({});

  useEffect(() => {
    setNewInfo(data);
  }, [data]);

  const toggleEdit = () => {
    isEdit ? setIsEdit(false) : setIsEdit(true);
  };

  const handleClose = () => {
    setNewItem({});
    setIsEdit(false);
  };

  const handleChange = (event) => {
    let { name, value } = event.target;
    const updatedField = { [name]: value };
    setNewItem({ ...newItem, ...updatedField });
  };

  const handleEdit = (id) => {
    setIsEdit(true);
    const itemToEdit = newInfo.find((info) => info.id === id);
    setNewItem(itemToEdit);
  };

  const save = () => {
    handleSave(newItem);
    setNewItem({});
    setIsEdit(false);
  };

  const deleteItem = (id) => {
    handleDelete(id);
    setNewItem({});
    setIsEdit(false);
  };

  const renderContent = () => {
    if (!Array.isArray(newInfo) || newInfo.length === 0) return null;
    return newInfo.map((info) => (
      <div className={style.serviceItem} key={info.id}>
        <div className={style.serviceHeader}>
          <h5 className={style.serviceHeadline}>{info.title}</h5>
          {isEducator && (
            <div className={style.serviceEditContainer} onClick={() => handleEdit(info.id)}>
              <EditPencilOrange />
            </div>
          )}
        </div>
        <p className={cn(style.serviceSubHeadline, style.colorGrey)}>{info.subTitle}</p>
        <p className={cn(rowStyle.editInfoRowText, style.colorGrey)}>{info.beginDate}</p>
        <div className={style.serviceDesc}>
          <p className={rowStyle.editInfoRowText}>{info.description}</p>
        </div>
      </div>
    ));
  };

  return (
    <div className={rowStyle.editInfoRowContainer}>
      <div className={rowStyle.editInfoRowHeader}>
        <h4 className={cn(rowStyle.editInfoRowHeadline, rowStyle.colorOrange)}>Licenses & Certifications</h4>
        {isEducator && (
          <div onClick={toggleEdit}>
            <AddPlusOrange />
          </div>
        )}
      </div>
      <div className={style.serviceContainer}>{renderContent()}</div>
      <div className={rowStyle.editInfoRowContent}>
        {isEdit && (
          <AddEditModal
            show={isEdit}
            data={newItem}
            handleClose={handleClose}
            handleChange={handleChange}
            save={save}
            deleteItem={deleteItem}
          />
        )}
      </div>
    </div>
  );
};

const AddEditModal = ({ show, handleClose, data, handleChange, save, deleteItem }) => {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setValidated(false);
      save();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="educator-modal">
      <Modal.Header closeButton>
        <Modal.Title>Licenses & Certifications</Modal.Title>
      </Modal.Header>
      <Form validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Name*</Form.Label>
            <Form.Control
              required
              placeholder="Certificate Name"
              name="title"
              value={data.title}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Issuing Organization*</Form.Label>
            <Form.Control
              required
              name="subTitle"
              value={data.subTitle}
              onChange={handleChange}
              placeholder="Organization Name"
            />
          </Form.Group>
          <Form.Group className="years-wrap">
            <DateInput required label="Issue date*" name="beginDate" value={data.beginDate} onChange={handleChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          {data.id && (
            <Button className="btn-tertiary-dark" onClick={() => deleteItem(data.id)}>
              Delete
            </Button>
          )}
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default Education;
