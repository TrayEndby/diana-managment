import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useHistory } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Search as SearchIcon } from 'react-bootstrap-icons';
import classNames from 'classnames';

import style from '../GeneralSearchBar/style.module.scss';

const propTypes = {
  title: PropTypes.string,
  search: PropTypes.string,
  searchURL: PropTypes.string,
  emptyToClear: PropTypes.bool,
  className: PropTypes.string,
  onSubmit: PropTypes.func,
};

const SearchBar = ({
  title,
  search,
  searchURL,
  emptyToClear,
  className,
  onSubmit,
}) => {
  let history = useHistory();
  let [searchKey, setSearchKey] = useState(search || '');
  let handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(searchKey);
    } else if (searchKey || emptyToClear) {
      const url = searchKey
        ? `${searchURL}?query=${encodeURIComponent(searchKey)}`
        : searchURL;
      history.push(url);
    }
  };

  useEffect(() => {
    setSearchKey(search || '');
  }, [search]);

  return (
    <Form
      className={classNames(style.gSearchBar, className)}
      onSubmit={handleSubmit}
    >
      <Form.Control
        type="search"
        placeholder={title}
        aria-label={title}
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
        className={style.gSearchBarInput}
      ></Form.Control>
      <Button
        variant="outline-secondary"
        className={style.gSearchBarSearchBtn}
        onClick={handleSubmit}
      >
        <SearchIcon />
      </Button>
    </Form>
  );
};

SearchBar.propTypes = propTypes;

export default SearchBar;
