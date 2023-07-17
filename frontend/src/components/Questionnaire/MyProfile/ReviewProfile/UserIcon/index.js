import React from 'react';
import PropTypes from 'prop-types';

import { PersonCircle } from 'react-bootstrap-icons';
import Image from 'react-bootstrap/Image';
import style from './style.module.scss';

const propTypes = {
  image: PropTypes.string
};

const UserIcon = ({ image }) => {
  if (image) {
    return <Image src={image} className={style.image} />;
  } else {
    return <PersonCircle />;
  }
};

UserIcon.propTypes = propTypes;

export default UserIcon;
