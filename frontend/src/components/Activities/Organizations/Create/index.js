import React from 'react';
import { Card, Button, Container, Dropdown, Modal } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import * as ROUTES from '../../../../constants/routes';
import ECAService from '../../../../service/ECAService';

import style from './style.module.scss';


const Create = ({ history }) => {
  const [name, setName] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [overview, setOverview] = React.useState('');
  const [id, setId] = React.useState(null);
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState(null);
  const [type, setType] = React.useState(null);
  const [categories, setCategories] = React.useState([]);
  const [types, setTypes] = React.useState([]);

  const [showConfirmModal, setShowConfirmModal] = React.useState(false);

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    history.push(ROUTES.ORGANIZATIONS_EXPLORE);
  };

  const handleShowConfirmModal = () => setShowConfirmModal(true);

  React.useEffect(() => {
    ECAService.getCategories().then((result) => {
      setCategories(result);
    });
  }, []);

  React.useEffect(() => {
    if (!category) {
      return;
    }
    setType(null);
    ECAService.getOrganizationsByCategory(category.id).then((result) => {
      setTypes(result);
    });
  }, [category]);

  const createProgram = () => {
    if (!name || !category) {
      alert('Fill all required fields');
      return;
    }
    ECAService.createProgram(name, overview, description, url, category.id, type ? type.id : null).then((result) => {
      if (result) {
        setId(result.id);
      }
      handleShowConfirmModal();
    });
  };

  const addProgramToSaved = () => {
    ECAService.addProgramToSaved(id, name).then(() => {
      history.push(ROUTES.ORGANIZATIONS_EXPLORE);
    });
  };

  return (
    <Container fluid className={style.wholeContainer}>
      <Button variant="primary" onClick={() => history.push(ROUTES.ORGANIZATIONS_EXPLORE)} className={style.exploreBtn}>
        Back to explore
      </Button>
      <Card className={style.mainContainer}>
        <Container fluid className={style.row}>
          <div className={style.image}>
            <p>Upload picture</p>
            <input type="file" />
          </div>
          <section className={style.mainInfo}>
            <section>
              <label>Student organization name*</label>
              <input
                type="text"
                placeholder="Enter student organization name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </section>
            <section className={style.categories}>
              <div>
                <label>Category*</label>
                <Dropdown className={style.dropdown}>
                  <Dropdown.Toggle variant="secondary" id="dropdown-category" className={style.dropdownButton}>
                    {category ? category.name : 'Select category'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {categories.map((item) => (
                      <Dropdown.Item key={item.id} onClick={() => setCategory(item)}>
                        {item.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div>
                <label>Type</label>
                <Dropdown className={style.dropdown}>
                  <Dropdown.Toggle
                    variant="secondary"
                    id="dropdown-type"
                    disabled={!category}
                    className={style.dropdownButton}
                  >
                    {type ? type.name : 'Select type'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {types.map((item) => (
                      <Dropdown.Item key={item.id} onClick={() => setType(item)}>
                        {item.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </section>
            <section>
              <label>Link to website</label>
              <input type="text" placeholder="Enter website URL" value={url} onChange={(e) => setUrl(e.target.value)} />
            </section>
            <section>
              <label>Student organization overview</label>
              <textarea
                maxLength={250}
                placeholder="Enter student organization overview."
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
              ></textarea>
            </section>
          </section>
        </Container>
        {/* <Container fluid className={style.overview}>
        <h3>Student organization overview</h3>
          <textarea
            placeholder="Enter student organization overview."
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
          ></textarea>
        </Container> */}
      </Card>
      <Card className={style.secondaryContainer}>
        <Card.Header className={style.header}>
          <h4>Details</h4>
        </Card.Header>
        <Card.Body className={style.details}>
          <h3>Student organization details</h3>
          <textarea
            maxLength={250}
            placeholder="Enter student organization details."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </Card.Body>
      </Card>
      <section className={style.submitBlock}>
        <Button variant="secondary" onClick={() => history.push(ROUTES.ORGANIZATIONS_EXPLORE)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={createProgram}>
          Submit
        </Button>
      </section>
      <Modal centered show={showConfirmModal} onHide={handleCloseConfirmModal}>
        <Modal.Header closeButton>
          <Modal.Title as="h6">Save this student organization to one of your lists:</Modal.Title>
        </Modal.Header>
        <Modal.Body className={style.modal}>
          <p>Current organizations</p>
          <Button variant="primary">Save to list</Button>
          <p> Saved organizations</p>
          <Button variant="primary" onClick={addProgramToSaved}>
            Save to list
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseConfirmModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default withRouter(React.memo(Create));
