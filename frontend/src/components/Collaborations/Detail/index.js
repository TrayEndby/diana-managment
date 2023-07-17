import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';

import Members from './Members';

import { getNameById, getStatusNameById, isMyProject } from '../util';
import ErrorDialog from '../../../util/ErrorDialog';
import ProfileLink from '../../../util/ProfileLink';
import useErrorHandler from '../../../util/hooks/useErrorHandler';
import useIsMountedRef from '../../../util/hooks/useIsMountedRef';
import ECAService from '../../../service/ECAService';
import collabService from '../../../service/CollaborationService';
import fileUploadService from '../../../service/FileUploadService';

import style from './style.module.scss';

const propTypes = {
  project: PropTypes.object.isRequired,
  editable: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onRefresh: PropTypes.func,
};

const Detail = ({ project, editable, onSubmit, onCancel, onRefresh }) => {
  const isMountedRef = useIsMountedRef();
  const [error, setError] = useErrorHandler(null);
  const [data, setData] = useState({ ...project });
  const [category, setCategory] = useState(project ? project.eca_category : undefined);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [inSubmit, setInSumbit] = useState(false);
  const { id, name, status, owner_id, owner_name, eca_type, overview, description, member, picture_id } = data;
  const myProject = isMyProject(project);

  const handleChangeData = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSetPic = (event) => {
    try {
      const file = event.target.files[0];
      setFile(file);
      setImage(URL.createObjectURL(file));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (typeof onSubmit === 'function') {
      try {
        setInSumbit(true);
        await onSubmit(
          {
            ...data,
            status: Number(data.status),
            eca_category: Number(category),
            eca_type: data.eca_type == null ? null : Number(data.eca_type),
          },
          file,
        );
      } catch (e) {
        setError(e);
      } finally {
        if (isMountedRef.current) {
          setInSumbit(false);
        }
      }
    }
  };

  useEffect(() => {
    setData({
      ...project,
    });
  }, [project]);

  useEffect(() => {
    setInSumbit(false);
  }, [editable]);

  useEffect(() => {
    ECAService.getCategories()
      .then((result) => {
        setCategories(result);
      })
      .catch(setError);
  }, [setError]);

  useEffect(() => {
    if (!category) {
      return;
    }

    if (editable) {
      // only clear in editable case
      setData({
        ...data,
        eca_type: null,
      });
    }
    ECAService.getOrganizationsByCategory(category)
      .then((result) => {
        setTypes(result);
      })
      .catch(setError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, setError]);

  useEffect(() => {
    fileUploadService.downloadById(picture_id).then((res) => {
      setImage(res);
    });
  }, [picture_id]);

  return (
    <>
      {error && <ErrorDialog error={error} />}
      {editable ? (
        <EditableDetail
          name={name}
          status={status}
          category={category}
          eca_type={eca_type}
          overview={overview}
          description={description}
          categories={categories}
          pic={image}
          types={types}
          inSubmit={inSubmit}
          onChange={handleChangeData}
          setCategory={setCategory}
          onSetPic={handleSetPic}
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      ) : (
        <ViewOnlyDetail
          id={id}
          myProject={myProject}
          name={name}
          owner_id={owner_id}
          owner_name={owner_name}
          status={getStatusNameById(status)}
          type={getNameById(types, Number(eca_type))}
          overview={overview}
          description={description}
          members={member}
          pic={image}
          onUpdate={onRefresh}
        />
      )}
    </>
  );
};

const EditableDetail = ({
  name,
  status,
  category,
  eca_type,
  overview,
  description,
  categories,
  types,
  pic,
  inSubmit,
  onChange,
  setCategory,
  onSetPic,
  onSubmit,
  onCancel,
}) => {
  return (
    <Form onSubmit={onSubmit}>
      <Card className={style.mainContainer}>
        <Container fluid className={style.row}>
          <div className={style.image}>
            {pic && <Image src={pic} fluid style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />}
            {!pic && <p>Upload picture</p>}
            {<Form.File id="project-pic" onChange={onSetPic} />}
          </div>
          <section className={style.mainInfo}>
            <Form.Group controlId="colla-project-name">
              <Form.Label>Project name*</Form.Label>
              <Form.Control
                required
                name="name"
                placeholder="Enter project name"
                value={name || ''}
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group controlId="colla-project-status">
              <Form.Label>Status*</Form.Label>
              <Form.Control required as="select" name="status" value={status} onChange={onChange}>
                <option value="">Select status</option>
                {collabService.getProjectStatusList().map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="colla-project-category">
              <Form.Label>Category*</Form.Label>
              <Form.Control required as="select" value={category || ''} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select category</option>
                {categories.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="colla-project-type">
              <Form.Label>Type*</Form.Label>
              {category ? (
                <Form.Control required as="select" name="eca_type" value={eca_type || ''} onChange={onChange}>
                  <option value="">Select type</option>
                  {types.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </Form.Control>
              ) : (
                <Form.Control placeholder="Select a category first" disabled />
              )}
            </Form.Group>
            <Form.Group controlId="colla-project-overview">
              <Form.Label>Project overview</Form.Label>
              <Form.Control
                as="textarea"
                name="overview"
                maxLength={250}
                placeholder="Write an overview of your project."
                value={overview}
                onChange={onChange}
              />
            </Form.Group>
          </section>
        </Container>
      </Card>
      <Card className={style.secondaryContainer}>
        <Card.Header as="header">
          <h5>Description</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group>
            <Form.Control
              as="textarea"
              name="description"
              maxLength={250}
              placeholder="Describe your project in more detail here."
              value={description}
              onChange={onChange}
            />
          </Form.Group>
        </Card.Body>
      </Card>
      <section className={style.submitBlock}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="success" type="submit" disabled={inSubmit}>
          {inSubmit ? 'Submiting...' : 'Submit'}
        </Button>
      </section>
    </Form>
  );
};

const ViewOnlyDetail = ({
  id,
  myProject,
  name,
  owner_id,
  owner_name,
  status,
  type,
  overview,
  description,
  members,
  pic,
  onUpdate,
}) => {
  return (
    <>
      <Card className={style.mainContainer}>
        <Container fluid className={style.row}>
          {pic ? (
            <div className={style.image}>
              <Image src={pic} fluid style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div className={style.image}>No Project Image</div>
          )}
          <section className={style.mainInfo}>
            <Card.Text>Project name: {name}</Card.Text>
            {!myProject && (
              <Card.Text>
                Owner: <ProfileLink id={owner_id} name={owner_name} />
              </Card.Text>
            )}
            <Card.Text>Status: {status} </Card.Text>
            <Card.Text>Type: {type}</Card.Text>
            <h6>Project overview</h6>
            <Card.Text>{overview || 'N/A'}</Card.Text>
          </section>
        </Container>
      </Card>
      <Card className={style.secondaryContainer}>
        <Card.Header as="header">
          <h5>Description</h5>
        </Card.Header>
        <Card.Body>
          <div>{description || 'N/A'}</div>
        </Card.Body>
      </Card>
      {members && (
        <Members
          id={id}
          myProject={myProject}
          members={members}
          className={style.secondaryContainer}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

Detail.propTypes = propTypes;

export default React.memo(Detail);
