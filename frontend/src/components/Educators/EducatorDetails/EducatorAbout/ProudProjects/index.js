import React, { useEffect, useState } from 'react';
import { EditPencilOrange, AddPlusOrange } from '../../../../../util/Icon';
import Form from 'react-bootstrap/Form';
import cn from 'classnames';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import projectImgPlaceholder from '../../../../../assets/Educator/educatorProjectPlaceholder.png';
import fileUploadService from '../../../../../service/FileUploadService';
import Spinner from '../../../../../util/Spinner';
import Picture from '../../../../../util/Picture';

import style from '../ServiceExp/style.module.scss';
import projectStyle from './projectStyle.module.scss';
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

  const save = (id) => {
    newItem.imageId = id;
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
    return newInfo.map((info) => {
      return (
        <div className={projectStyle.projectItem} key={info.id}>
          <div className={projectStyle.imageContainer}>
            {info.imageId ? (
              <Picture id={info.imageId} />
            ) : (
              <img src={projectImgPlaceholder} alt="Project placeholder" />
            )}
          </div>
          <div className={projectStyle.content}>
            <div className={projectStyle.header}>
              <h5 className={projectStyle.title}>{info.title}</h5>
              {isEducator && (
                <div className={projectStyle.editContainer} onClick={() => handleEdit(info.id)}>
                  <EditPencilOrange />
                </div>
              )}
            </div>
            <a href={info.subTitle} target="__blank" rel="noopener" className={cn(projectStyle.link, style.colorGrey)}>
              {info.subTitle}
            </a>
            <div className={projectStyle.description}>{info.description}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className={rowStyle.editInfoRowContainer}>
      <div className={rowStyle.editInfoRowHeader}>
        <h4 className={cn(rowStyle.editInfoRowHeadline, rowStyle.colorOrange)}>Projects I’m proud of</h4>
        {isEducator && (
          <div onClick={toggleEdit}>
            <AddPlusOrange />
          </div>
        )}
      </div>
      <div className={projectStyle.projectsContainer}>{renderContent()}</div>
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
  const [image, setImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  const inputFileRef = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchImage = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const image = await fileUploadService.downloadById(data.imageId);
      setImage(image);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  }, [data.imageId]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  const handleTriggerUpload = () => {
    inputFileRef.current.click();
  };

  const handleUpload = async (event) => {
    try {
      const pic = event.target.files[0];
      setIsLoading(true);
      setImage(null);
      const id = await fileUploadService.upload(pic);
      if (id) {
        setImage(URL.createObjectURL(pic));
        setImageId(id);
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      alert('Upload profile image failed');
    }
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      setValidated(false);
      save(imageId);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="educator-modal">
      <Modal.Header closeButton>
        <Modal.Title>Add or Edit Project</Modal.Title>
      </Modal.Header>
      <Form validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <div className={projectStyle.uploadContainer}>
            <div className={projectStyle.uploadedImg}>{isLoading ? <Spinner /> : <img src={image} alt="" />}</div>
            <Button className="ml-4 primary" variant="primary" onClick={handleTriggerUpload}>
              Upload picture
            </Button>
            <input ref={inputFileRef} type="file" style={{ display: 'none' }} onChange={handleUpload} />
          </div>
          <Form.Group>
            <Form.Label>Title*</Form.Label>
            <Form.Control
              required
              placeholder="Project Title"
              name="title"
              value={data.title}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Show website, youtube video or article*</Form.Label>
            <Form.Control required name="subTitle" value={data.subTitle} onChange={handleChange} placeholder="Link" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              value={data.description}
              onChange={handleChange}
              placeholder="Project Description"
            />
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
