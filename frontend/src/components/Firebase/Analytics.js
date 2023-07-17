import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { withFirebase } from './';

const logCurrentPage = (firebase) => {
  firebase.setCurrentScreen(window.location.pathname);
  firebase.logEvent('screen_view');
};

const AnalyticsComponent = ({ firebase }) => {
  const history = useHistory();
  useEffect(() => {
    logCurrentPage(firebase); // log the first page visit
    history.listen(() => {
      logCurrentPage(firebase);
    });
  }, [history, firebase]);
  return <div></div>;
};

export default withFirebase(AnalyticsComponent);
