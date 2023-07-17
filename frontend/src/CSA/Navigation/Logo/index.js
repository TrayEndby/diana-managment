import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Tooltip from 'util/Tooltip';

import { SERVER_URL } from 'constants/server';

import style from '../style.module.scss';
import * as CSA_ROUTES from 'constants/CSA/routes';

const propTypes = {
  toHome: PropTypes.bool,
};

const LOGO = ({ toHome }) => {
  const title = toHome ? 'Go to Kyros.ai' : '';
  const src_app = "/logo192.png";
  const src_landing = "/dark-logo192.png";
  return (
    <Navbar.Brand className="py-0">
      {toHome ? (
        <Tooltip title={title}>
          <img
            alt={title}
            src={src_landing}
            className={style.logo}
            onClick={() => {
              window.location = SERVER_URL;
            }}
          />
        </Tooltip>
      ) : (
          <Link to={CSA_ROUTES.HOME}>
            <img alt={title} src={src_app} className={style.logo_nav} />
          </Link>
        )}
    </Navbar.Brand>
  );
};

LOGO.propTypes = propTypes;

export default LOGO;
