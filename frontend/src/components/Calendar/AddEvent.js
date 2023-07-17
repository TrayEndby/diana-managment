import React from 'react';
import { useHistory, Redirect } from 'react-router-dom';

import * as ROUTES from 'constants/routes';

const propTypes = {};

const AddCalendarEventRedirect = () => {
  const history = useHistory();
  return <Redirect to={`${ROUTES.CALENDAR}${history.location.search}&type=add`} />;
};

AddCalendarEventRedirect.propTypes = propTypes;

export default AddCalendarEventRedirect;
