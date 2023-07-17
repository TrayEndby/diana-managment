import React from 'react';
import { Link } from 'react-router-dom';

import { FileText } from 'react-bootstrap-icons';

import * as ROUTES from 'constants/routes';

const propTypes = {};

const NoteNabBar = () => {
  return (
    <Link to={ROUTES.COURSE_NOTE}>
      <div className="App-text-white hover-darkBg mb-1" style={{
        display: 'flex',
        alignItems: 'center',
        fontWeight: 700
      }}>
        <FileText className="mr-1" />
        My Notes
      </div>
      {/* <h5 className="py-1 hover-darkBg">My notes</h5> */}
    </Link>
  );
};

NoteNabBar.propTypes = propTypes;

export default NoteNabBar;
