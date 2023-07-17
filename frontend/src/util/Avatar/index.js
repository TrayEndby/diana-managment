import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Image from 'react-bootstrap/Image';
import IconPlaceholder from 'assets/profile-avatar.svg';

import useIsMountedRef from '../hooks/useIsMountedRef';
import fileUploadService, { Category } from 'service/FileUploadService';

const propTypes = {
  id: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

const idCache = {};
const Avatar = ({ id, size = 35, className, style }) => {
  const isMountedRef = useIsMountedRef();
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!id) {
      setImage(null);
    } else {
      if (!idCache[id]) {
        idCache[id] = fileUploadService.download(Category.Profile, id, id)
      }
      else {
        idCache[id].then((res) => {
          if (isMountedRef.current) {
            setImage(res);
          }
        })
          .catch((e) => {
            console.error(e);
          });
      }
    }
  }, [id, isMountedRef]);

  const imageStyle = {
    width: size,
    height: size,
    borderRadius: '100%',
    objectFit: 'cover',
    ...style,
  };

  if (image) {
    return <Image src={image} className={className} style={imageStyle} loading="lazy" />;
  } else {
    return <Image src={IconPlaceholder} className={className} style={imageStyle} />;
  }
};

Avatar.propTypes = propTypes;

export default React.memo(Avatar);
