import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import useErrorHandler from 'util/hooks/useErrorHandler';
import userProfileSearchService, {
  ProfileSearchType,
} from 'service/UserProfileSearchService';
import { useDebouncedCallback } from 'use-debounce';
import Spinner from 'util/Spinner';

import style from './style.module.scss';

const propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

const NO_RESULTS = 'No such user in our system';

const AddDirectUserModal = ({ title, show, onClose, onAddUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useErrorHandler();
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const debounced = useDebouncedCallback(
    (value) => getSearchResults(value),
    500,
  );

  React.useEffect(() => {
    debounced.callback(searchTerm);
  }, [searchTerm, debounced]);

  const getSearchResults = async (value) => {
    setError(null);
    if (value) {
      setIsSearching(true);
      let limitedProfiles;
      if (value.includes('@')) {
        limitedProfiles = await userProfileSearchService.searchLimitedProfiles(
          ProfileSearchType.Email,
          value,
        );
      } else {
        limitedProfiles = await userProfileSearchService.searchLimitedProfiles(
          ProfileSearchType.UserName,
          value,
        );
      }

      if (limitedProfiles) {
        setSearchResults(limitedProfiles);
      } else {
        setSearchResults(null);
        setError(NO_RESULTS);
      }
    } else {
      setSearchResults(null);
      setError(null);
    }
    setIsSearching(false);
  };

  const handleChange = async (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const handleClose = () => {
    onClose();
    setError();
  };

  const handleAdd = (i) => {
    onAddUser(searchResults[i]?.profileId);
    onClose();
    setError();
    setSearchResults(null);
    setSearchTerm('');
  };

  return (
    <Modal
      className={cn("App-modal", style.modal)}
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="add-direct-user-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className={style.inputContainer}>
            <Form.Control
              placeholder="Add by name or email"
              name="name"
              autoComplete="off"
              value={searchTerm}
              onChange={handleChange}
            />
            {isSearching ? (
              <Spinner />
            ) : (
              <>
                {searchResults && (
                  <div className={style.searchResults}>
                    {searchResults?.map((res, i) => (
                      <p
                        key={i}
                        className={cn(style.resultRow, {
                          [style.disabled]: res.isMember,
                        })}
                        onClick={() => handleAdd(i)}
                      >
                        <span>{`${res?.firstName} ${res?.lastName}`}</span>
                      </p>
                    ))}
                  </div>
                )}
                {error && (
                  <div className={cn(style.searchResults, style.error)}>
                    <p className={cn(style.resultRow, style.error)}>
                      <span>{error}</span>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

AddDirectUserModal.propTypes = propTypes;

export default AddDirectUserModal;
