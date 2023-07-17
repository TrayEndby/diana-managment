import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../Spinner';
import useIsMountedRef from '../hooks/useIsMountedRef';
import fileUploadService from '../../service/FileUploadService';

const propTypes = {
  id: PropTypes.any,
  alt: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  customAlt: PropTypes.any,
  customLoading: PropTypes.any,
};

const Picture = ({ id, alt, customAlt, customLoading, className, style }) => {
  const isMountedRef = useIsMountedRef();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!id) {
      setImage(null);
      setLoading(false);
    } else {
      setLoading(true);

      fileUploadService
        .downloadById(id)
        .then((res) => {
          if (isMountedRef.current) {
            setImage(res);
          }
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isMountedRef]);

  if (loading) {
    return customLoading ? <>{customLoading}</> : <Spinner style={{ position: 'static', margin: 0 }} />;
  } else if (!image && customAlt) {
    return <>{customAlt}</>;
  } else {
    return <img src={image} alt={alt} className={className} style={style} loading="lazy" />;
  }
};

Picture.propTypes = propTypes;

export default React.memo(Picture);
