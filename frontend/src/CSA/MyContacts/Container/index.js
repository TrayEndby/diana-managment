import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CSABodyContainer from '../../Container';
import * as CSA_ROUTES from 'constants/CSA/routes';

import style from './style.module.scss';

const propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const BusinessContainer = ({ children, selectedTab }) => {
  let colors = ['black', 'black', 'black'];
  let backgroundcolors = ['grey', 'grey', 'grey'];
  colors[selectedTab] = 'green';
  backgroundcolors[selectedTab] = 'lightgrey';
  return (
    <CSABodyContainer title="My Contacts">
      <div className={style.title}>
        <div style={{ width: '50%', paddingTop: '5px' }}>
          <Link style={{ color: colors[1] }} to={CSA_ROUTES.MY_CONTACTS_CUSTOMERS}>My Customers</Link>
        </div>
        <div style={{ width: '50%', paddingTop: '5px' }}>
          <Link style={{ color: colors[2] }} to={CSA_ROUTES.MY_CONTACTS_TEAM}>My team</Link>
        </div>
      </div>
      { children}
    </CSABodyContainer >
  );
};

BusinessContainer.propTypes = propTypes;

export default BusinessContainer;
