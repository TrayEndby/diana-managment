import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { SearchNavBar } from '../Search';
import NoteNabBar from '../Notes/NavBar';
import PlayListNavBar from '../PlayList/NavBar';
import SubjectList from '../SubjectList';
import CourseSearchBar from '../SearchBar';

import SidebarPageLayout from 'layout/SidebarPageLayout';
import * as ROUTES from 'constants/routes';

import style from './style.module.scss';

const propTypes = {
  children: PropTypes.any,
  search: PropTypes.string,
  className: PropTypes.string,
};

const CoursePageLayout = ({ children, search, className }) => {
  const history = useHistory();
  const showSearchBar = history.location.pathname !== ROUTES.COURSE_NOTE;
  return (
    <SidebarPageLayout
      sideBar={() => (
        <div className={style.topBar}>
          <SearchNavBar />
          <NoteNabBar />
          <PlayListNavBar />
          <div className={style.divider}></div>
          <SubjectList />
        </div>
      )}
      noHeader
      contentClassName={style.content}
    >
      {showSearchBar && (
        <div className={style.searchBar}>
          <CourseSearchBar search={search} />
        </div>
      )}
      <div className={classNames(style.main, className)}>{children}</div>
    </SidebarPageLayout>
  );
};

CoursePageLayout.propTypes = propTypes;

export default CoursePageLayout;
