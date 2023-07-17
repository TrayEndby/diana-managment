import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { Link } from 'react-router-dom';

import * as ROUTES from 'constants/routes';
import styles from './style.module.scss';

const propTypes = {
  selectedTab: PropTypes.number.isRequired,
};

const Tabs = ({ selectedTab }) => {
  return (
    <div className={styles.title}>
      <div>
        <Link
          className={cn({ [styles.selected]: selectedTab === 0 })}
          to={ROUTES.SPRINT_WORKSHOP}
        >
          Workshop Material
        </Link>
      </div>
      <div>
        <Link
          className={cn({ [styles.selected]: selectedTab === 1 })}
          to={ROUTES.HOMEWORK}
        >
          Homework
        </Link>
      </div>
    </div>
  );
};

Tabs.propTypes = propTypes;

export default Tabs;
