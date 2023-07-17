import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Container from 'react-bootstrap/Container';

import style from './style.module.scss';

const propTypes = {
  customTopBar: PropTypes.element.isRequired,
  children: PropTypes.any.isRequired,
  listView: PropTypes.bool,
  contentStyle: PropTypes.object,
};

const Layout = ({ customTopBar, children, listView, contentStyle }) => {
  return (
    <Container className={style.container} fluid>
      <div className={style.topBar}>{customTopBar}</div>
      <div
        className={classNames(style.content, {
          [style.listView]: listView,
        })}
        style={contentStyle}
      >
        {children}
      </div>
    </Container>
  );
};

Layout.propTypes = propTypes;

export default Layout;
