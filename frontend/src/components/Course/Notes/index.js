import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import NoteBoard from './Board';

import CoursePageLayout from '../Layout';
import * as ROUTES from '../../../constants/routes';

const propTypes = {};

const CourseNotePage = ({ history }) => {
  const [cnt, setCnt] = useState(0);

  useEffect(() => {
    if (history.location.pathname === ROUTES.COURSE_NOTE && !history.location.search) {
      setCnt((cnt) => cnt + 1);
    }
  }, [history.location]);

  return (
    <CoursePageLayout>
      <NoteBoard cnt={cnt} wholePage />
    </CoursePageLayout>
  );
};

CourseNotePage.propTypes = propTypes;

export default withRouter(CourseNotePage);

export { NoteBoard };
