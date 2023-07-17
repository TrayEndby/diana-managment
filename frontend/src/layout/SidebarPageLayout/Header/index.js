import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import SearchBar from '../../../util/SearchBar';

import style from './style.module.scss';

const propTypes = {
  title: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  search: PropTypes.string,
  searchURL: PropTypes.string,
  btnText: PropTypes.string,
  btnOnClick: PropTypes.func,
};

const Header = ({ title, searchPlaceholder, search, searchURL, emptyToClear, btnText, btnOnClick, className }) => {
  return (
    <Card.Header className={classNames(style.header, className)}>
      <div className={style.leftBar}>
        <Card.Text>{title}</Card.Text>
        <SearchBar title={searchPlaceholder} search={search} searchURL={searchURL} emptyToClear={emptyToClear} />
        {btnText && (
          <Button variant="primary" onClick={btnOnClick}>
            {btnText}
          </Button>
        )}
      </div>
    </Card.Header>
  );
};

Header.propTypes = propTypes;

export default React.memo(Header);
