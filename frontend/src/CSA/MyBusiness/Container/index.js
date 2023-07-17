import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import * as CSA_ROUTES from 'constants/CSA/routes';

import style from './style.module.scss';

const propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const BusinessContainer = ({ children, selectedTab }) => {
  let colors = ['grey', 'grey', 'grey'];
  colors[selectedTab] = 'white';
  return (
    <div className={cn('App-body', style.body)}>
      <div className={style.title}>
        <div style={{ width: '33%' }}>
          <Link style={{ color: colors[0] }} to={CSA_ROUTES.MY_BUSINESS_CONVERSATIONS}>My Conversations</Link>
        </div>
        <div style={{ width: '33%' }}>
          <Link style={{ color: colors[1] }} to={CSA_ROUTES.MY_CONTACTS_CUSTOMERS}>My Customers</Link>
        </div>
        <div style={{ width: '33%' }}>
          <Link style={{ color: colors[2] }} to={CSA_ROUTES.MY_CONTACTS_TEAM}>My team</Link>
        </div>
      </div>
      { children}
    </div >
  );
};

BusinessContainer.propTypes = propTypes;

export default BusinessContainer;
