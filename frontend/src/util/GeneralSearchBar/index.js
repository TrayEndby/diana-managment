import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Search as SearchIcon } from 'react-bootstrap-icons';

import { matchCategoryToTitle, getSections } from './util';
import useOutsideClick from '../hooks/useOutsideClick';
import generalSearchService, { CATEGORY, NO_SEARCH_RESULTS } from '../../service/GeneralSearchService';

import style from './style.module.scss';

const propTypes = {
  title: PropTypes.string,
  alwaysActive: PropTypes.bool,
  collegeSearch: PropTypes.bool,
  className: PropTypes.string,
};

const GeneralSearchBar = ({ title, className, alwaysActive, collegeSearch }) => {
  const [isActive, setIsActive] = useState(alwaysActive ? true : false);
  const [searchKey, setSearchKey] = useState('');
  const [searchResults, setSearchResults] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const ref = useRef();

  const toggleActive = (active) => {
    if (alwaysActive) {
      return;
    } else {
      setIsActive(active);
    }
  };

  const handleSubmit = (e) => {
    if (!isActive) {
      toggleActive(true);
      return;
    }

    if (!searchKey) {
      toggleActive(false);
      setShowPopup(false);
      return;
    }

    e.preventDefault();
    search();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const search = async () => {
    try {
      const results = await generalSearchService.searchWithNormalization(searchKey, getSections(collegeSearch));
      setSearchResults(results);
      setShowPopup(true);
    } catch (e) {
      console.error('error', e.message);
      setSearchResults(null);
    }
  };

  useOutsideClick(ref, () => {
    setShowPopup(false);
  });

  const renderSearchResults = () => {
    return (
      <>
        {typeof searchResults === 'object' ? (
          <div className={style.searchResults} onClick={() => setShowPopup(false)}>
            {Object.keys(searchResults).map((el, i) => {
              const results = searchResults[el];
              return (
                results instanceof Array &&
                results.length > 0 && (
                  <React.Fragment key={i}>
                    <h3 className={style.resultHeadline}>{matchCategoryToTitle(el)}</h3>
                    <>
                      {el === CATEGORY.COLLEGE
                        ? results.map((item, index) => (
                            <Link to={item.searchUrl || ''} className={style.resultRow} key={index}>
                              {item.name}
                            </Link>
                          ))
                        : results.map((item, index) => (
                            <Link to={item.searchUrl || ''} className={style.resultRow} key={index}>
                              {item.title}
                            </Link>
                          ))}
                    </>
                  </React.Fragment>
                )
              );
            })}
          </div>
        ) : (
          <div className={style.noSearchResults}>
            <p className="text-center">{NO_SEARCH_RESULTS}</p>
          </div>
        )}
      </>
    );
  };

  const defaultTitle = title || 'Search resources, navigation';
  return (
    <div className={classNames(className, style.gSearchBar)} ref={ref}>
      {isActive && (
        <Form.Control
          type="search"
          placeholder={defaultTitle}
          aria-label={defaultTitle}
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          onClick={() => setShowPopup(true)}
          onKeyDown={handleKeyDown}
          className={style.gSearchBarInput}
          autoFocus
        />
      )}
      <Button variant="outline-secondary" className={style.gSearchBarSearchBtn} onClick={handleSubmit}>
        <SearchIcon {...(!isActive ? { color: '#fff' } : {})} />
      </Button>
      {searchResults && showPopup && renderSearchResults()}
    </div>
  );
};

GeneralSearchBar.propTypes = propTypes;

export default GeneralSearchBar;
