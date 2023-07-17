import React from 'react';
import { useHistory } from 'react-router-dom';

import { PlayFill } from 'react-bootstrap-icons';
import * as ROUTES from 'constants/routes';

const PlayListNavBar = React.memo(() => {
  const history = useHistory();
  return (
      <div
        className="App-text-white App-clickable"
        style={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 700,
          fontSize: '16px',
        }}
        onClick={() => history.push(ROUTES.COURSE_PLAYLIST)}
      >
        <div className="b-1">
          <PlayFill className="mr-1" />
        </div>
        My playlists
      </div>
  );
});

export default PlayListNavBar;
