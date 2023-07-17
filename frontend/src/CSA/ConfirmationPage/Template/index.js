import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import * as CSA_ROUTES from 'constants/CSA/routes';

import style from './style.module.scss';

const propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const Confirmation = ({ title, children }) => (
  <Container fluid className={cn(style.container)}>
    <div className={style.box}>
      <div className={style.brand}>Kyros.ai</div>
      <h1 className={style.title}>{title}</h1>
      {children}
      <div className={style.link}>
        <Link to={CSA_ROUTES.HOME}>Back to homepage</Link>
      </div>
    </div>
  </Container>
);

Confirmation.propTypes = propTypes;

export default Confirmation;
