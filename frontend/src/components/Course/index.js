import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import CourseSearchPage from './Search';
import CourseChannelPage from './Channel';
import CoursePlayListPage from './PlayList';
import CourseWatchPage from './Watch';
import CourseNotePage from './Notes';
import CourseList from './List';

import * as ROUTES from '../../constants/routes';

const CoursePage = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${ROUTES.COURSE_CHANNEL}/:id`}>
        <CourseChannelPage />
      </Route>
      <Route exact path={`${ROUTES.COURSE_PLAYLIST}`}>
        <CoursePlayListPage />
      </Route>
      <Route path={`${ROUTES.COURSE_PLAYLIST}/:id`}>
        <CoursePlayListPage />
      </Route>
      <Route path={ROUTES.COURSE_WATCH}>
        <CourseWatchPage />
      </Route>
      <Route path={ROUTES.COURSE_NOTE}>
        <CourseNotePage />
      </Route>
      <Route path={path}>
        <CourseSearchPage />
      </Route>
    </Switch>
  );
};

export default CoursePage;
export { CourseList };
