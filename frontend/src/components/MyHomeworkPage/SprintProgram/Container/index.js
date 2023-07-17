import React from 'react';
import PropTypes from 'prop-types';

import Tabs from '../Tabs';
import SidebarPageLayout from 'layout/SidebarPageLayout';

import styles from './style.module.scss';

const propTypes = {
  caption: PropTypes.string,
  sideBar: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  selectedTab: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

const SprintContainer = ({ children, selectedTab, caption, sideBar }) => {
  return (
    <div className={styles.sprintPage}>
      <Tabs selectedTab={selectedTab} />
      <SidebarPageLayout caption={caption} sideBar={sideBar} noHeader>
        {children}
      </SidebarPageLayout>
    </div>
  );
};

SprintContainer.propTypes = propTypes;

export default SprintContainer;
