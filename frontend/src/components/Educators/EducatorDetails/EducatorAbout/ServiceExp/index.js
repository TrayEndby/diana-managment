import React, { useEffect, useState } from 'react';
import { EditPencilOrange, AddPlusOrange } from '../../../../../util/Icon';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import cn from 'classnames';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import DateInput from '../../../../../util/DateInput';
import style from './style.module.scss';
import rowStyle from '../../style.module.scss';
import '../../style.scss';

const ServiceExp = ({ data, handleSave, handleDelete, isEducator }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newInfo, setNewInfo] = useState(data);
  const [newItem, setNewItem] = useState({});
  const [endDate, setEndDate] = useState('');

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
    let updatedField;

    if (name === 'presentDate') {
      if (event.target.checked) {
        updatedField = { endDate: 'Present' };
        setEndDate(newItem.endDate);
      } else {
        updatedField = { endDate };
      }
    } else {
      updatedField = { [name]: value };
    }
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
          <h5 className={cn(style.serviceHeadline, style.colorGreen)}>{info.title}</h5>
          {isEducator && (
            <div className={style.serviceEditContainer} onClick={() => handleEdit(info.id)}>
              <EditPencilOrange />
            </div>
          )}
        </div>
        <p className={style.serviceSubHeadline}>{info.subTitle}</p>
        <p className={rowStyle.editInfoRowText}>
          Experience: {info.beginDate} - {info.endDate}
        </p>
        <div className={style.serviceDesc}>
          <p className={rowStyle.editInfoRowText}>{info.description}</p>
        </div>
      </div>
    ));
  };

  return (
    <div className={rowStyle.editInfoRowContainer}>
      <div className={rowStyle.editInfoRowHeader}>
        <h4 className={cn(rowStyle.editInfoRowHeadline, rowStyle.colorOrange)}>Services & Related Experience</h4>
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
  const isPresentDate = data.endDate === 'Present';

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
        <Modal.Title>Add or Edit Related Experience</Modal.Title>
      </Modal.Header>
      <Form validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Provide a service name*</Form.Label>
            <Form.Control
              required
              placeholder="Ex. Biology tutoring"
              name="title"
              value={data.title}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Role (past or current role related to the service you provide)*</Form.Label>
            <Form.Control
              required
              name="subTitle"
              value={data.subTitle}
              onChange={handleChange}
              placeholder="Ex. High school biology teacher with online tutoring experience"
            />
          </Form.Group>
          <Form.Group className="checkbox-wrap">
            <FormCheck.Input type="checkbox" name="presentDate" onChange={handleChange} checked={isPresentDate} />
            <FormCheck.Label>I am currently working on this role</FormCheck.Label>
          </Form.Group>
          <Form.Group className="years-wrap">
            <DateInput required label="Start date*" name="beginDate" value={data.beginDate} onChange={handleChange} />
            {!isPresentDate ? (
              <DateInput required label="End date*" name="endDate" value={data.endDate} onChange={handleChange} />
            ) : (
              <Form.Group>
                <Form.Label>End date*</Form.Label>
                <div className="present-block">Present</div>
              </Form.Group>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Write your experience related to the service you provide"
              name="description"
              value={data.description}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          {data.id && (
            <Button className="btn-tertiary-dark" onClick={(e) => deleteItem(data.id)}>
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

export default ServiceExp;
