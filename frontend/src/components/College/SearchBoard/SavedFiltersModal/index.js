import React from 'react';
import { withRouter } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import { PencilSquare, Archive, Check } from 'react-bootstrap-icons';

import storageService from '../../../../service/StorageService';

import style from './style.module.scss';
import { STORAGE_COLLEGE_SEARCH_SAVED } from '../../../../constants/storageKeys';

const SavedFiltersModal = ({ location, history, onHide }) => {
  const [savedSearches, setSavedSearches] = React.useState([]);
  const [isEditMode, setIsEditMode] = React.useState(false);

  React.useEffect(() => {
    storageService
      .get(STORAGE_COLLEGE_SEARCH_SAVED)
      .then(JSON.parse)
      .then((result) => {
        setSavedSearches(result || []);
      });
  }, []);

  const openSaved = (search) => {
    history.push(location.pathname + search);
    onHide();
  };

  const addToSaved = () => {
    const newSavedSearches = [
      ...savedSearches,
      {
        id: savedSearches.length,
        name: moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
        search: location.search,
      },
    ];
    storageService.set(STORAGE_COLLEGE_SEARCH_SAVED, JSON.stringify(newSavedSearches));
    setSavedSearches(newSavedSearches);
    setIsEditMode(true);
  };

  const deleteFromSaved = (id) => {
    const newSavedSearches = savedSearches.filter((i) => i.id !== id);
    storageService.set(STORAGE_COLLEGE_SEARCH_SAVED, JSON.stringify(newSavedSearches));
    setSavedSearches(newSavedSearches);
  };

  const updateNameofSaved = (id, newName) => {
    const newSavedSearches = savedSearches.map((i) => (i.id === id ? { ...i, name: newName } : i));
    storageService.set(STORAGE_COLLEGE_SEARCH_SAVED, JSON.stringify(newSavedSearches));
    setSavedSearches(newSavedSearches);
  };

  const finishChanging = () => {
    storageService.set(STORAGE_COLLEGE_SEARCH_SAVED, JSON.stringify(savedSearches));
    setIsEditMode(false);
  };

  return (
    <Modal show={true} centered onHide={onHide}>
      <Modal.Header>Saved Searches</Modal.Header>
      <Modal.Body>
        <Row className={style.actionsButton}>
          <Button variant="outline-primary" onClick={addToSaved}>
            Save current search
          </Button>
          {isEditMode ? (
            <div title="Save changes">
              <Check color="#53a548" size="24px" onClick={finishChanging} />
            </div>
          ) : (
            <div title="Edit names">
              <PencilSquare size="24px" onClick={() => setIsEditMode(true)} />
            </div>
          )}
        </Row>
        {savedSearches.map((i) => (
          <section key={i.id}>
            <Dropdown.Divider className={style.separator} />
            <Row className={style.item}>
              {isEditMode ? (
                <input placeholder="Name" onChange={(e) => updateNameofSaved(i.id, e.target.value)} value={i.name} />
              ) : (
                <p onClick={() => openSaved(i.search)}>{i.name}</p>
              )}
              <div title="Remove bookmark">
                <Archive size="24px" color="#dc3545" onClick={() => deleteFromSaved(i.id)} />
              </div>
            </Row>
          </section>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default withRouter(React.memo(SavedFiltersModal));
