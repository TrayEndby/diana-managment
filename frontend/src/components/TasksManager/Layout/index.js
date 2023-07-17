import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Container from 'react-bootstrap/Container';

import ArrowNavIcon from 'util/ArrowNavIcon';
import * as ROUTES from 'constants/routes';
import styles from './style.module.scss';

const propTypes = {
  customTopBar: PropTypes.element.isRequired,
  children: PropTypes.any.isRequired,
  contentStyle: PropTypes.object,
};

const Layout = ({ customTopBar, children, contentStyle }) => {
  return (
    <Container className={cn("App-body", styles.container)} fluid>
      <div className={styles.topBar}>{customTopBar}</div>
      <div className={styles.contentWrapper}>
        <div
          className={styles.content}
          style={contentStyle}
        >
          {children}
        </div>
        <ArrowNavIcon direction="right" text="Manual Drive" path={ROUTES.HOME} />
      </div>
    </Container>
  );
};

Layout.propTypes = propTypes;

export default Layout;
