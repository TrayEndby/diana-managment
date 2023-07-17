import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as ROUTES from '../../constants/routes';

const propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const ProfileLink = ({ id, name }) => {
  return <Link to={{ pathname: ROUTES.PUBLIC_PROFILE, state: { id } }}>{name}</Link>;
};

ProfileLink.propTypes = propTypes;

export default ProfileLink;
