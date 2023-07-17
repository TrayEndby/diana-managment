import React from 'react';
import PropTypes from 'prop-types';

import Image from 'react-bootstrap/Image';
import IconPlaceholder from 'assets/profile-avatar.svg';

const propTypes = {
  image: PropTypes.string,
  size: PropTypes.number,
};

const UserIcon = ({ image, size = 35 }) => {
  const style = {
    width: size,
    height: size,
    borderRadius: '100%',
    objectFit: 'cover',
  };
  if (image) {
    return <Image src={image} style={style} />;
  } else {
    return <Image src={IconPlaceholder} style={style} />
  }
};

UserIcon.propTypes = propTypes;

export default UserIcon;
