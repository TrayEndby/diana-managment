import React from 'react';
import { Redirect } from 'react-router-dom';
import { STORAGE_SPRINT_REGISTRATION } from 'constants/storageKeys';

import Menus from 'components/Menus';
import * as ROUTES from 'constants/routes';
import { PROFILE_TYPE } from 'constants/profileTypes';

const HomePage = ({ authedAs }) => {
  const sprintId = localStorage.getItem(STORAGE_SPRINT_REGISTRATION);
  if (sprintId !== '' && sprintId != null) {
    // when has sprint registration
    localStorage.removeItem(STORAGE_SPRINT_REGISTRATION);
    return (
      <Redirect to={`${ROUTES.SPRINT_DETAIL}/${sprintId}`} />
    );
  }
  const isEducator = authedAs.userType === PROFILE_TYPE.Educator;
  const hasEducatorProfile = authedAs.hasProfile;

  if (isEducator) {
    if (hasEducatorProfile) {
      return <Redirect to={{ pathname: ROUTES.EDUCATOR_DETAILS }} />;
    } else {
      return <Redirect to={{ pathname: ROUTES.EDUCATOR_PROFILE }} />;
    }
  } else {
    return <Menus />;
  }
};

export default HomePage;
