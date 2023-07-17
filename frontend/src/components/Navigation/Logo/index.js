import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Tooltip from 'util/Tooltip';

import style from '../style.module.scss';

const propTypes = {
  toMyGoals: PropTypes.bool.isRequired,
  redirect: PropTypes.string.isRequired,
};

const LOGO = ({ toMyGoals, redirect }) => {
  const title = toMyGoals ? 'Home' : '';
  const logo_src = '/logo192.png';
  const link = (
    <Link to={redirect}>
      <img alt={title} src={logo_src} className={style.logo}></img>
    </Link>
  );
  return (
    <Navbar.Brand className="py-0">
      {toMyGoals ? <Tooltip title={title}>{link}</Tooltip> : link}
    </Navbar.Brand>
  );
};

LOGO.propTypes = propTypes;

export default LOGO;
