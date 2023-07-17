import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Image from 'react-bootstrap/Image';
import IconPlaceholder from 'assets/profile-avatar.svg';

import useIsMountedRef from '../hooks/useIsMountedRef';
import fileUploadService from 'service/FileUploadService';
import Modal from 'react-bootstrap/Modal'

const propTypes = {
  id: PropTypes.string,
  category: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

const ImagePreview = ({ id, size = 35, className, style }) => {
  const isMountedRef = useIsMountedRef();
  const [image, setImage] = useState(null);
  const [isInModal, setIsInModal] = useState(false);

  useEffect(() => {
    if (!id) {
      setImage(null);
    } else {
      fileUploadService.downloadById(id)
        .then((res) => {
          if (isMountedRef.current) {
            setImage(res);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [id, isMountedRef]);

  const imageStyle = {
    width: size,
    height: size,
    objectFit: 'cover',
    ...style,
  };

  return (
    <div className="App-clickable">
      <Image onClick={() => setIsInModal(true)} src={image || IconPlaceholder} className={className} style={imageStyle} loading="lazy" />
      <Modal show={isInModal} onHide={() => setIsInModal(false)} centered>
        <Modal.Header closeButton>
        </Modal.Header>
        <Image src={image} loading="lazy" />
      </Modal>
    </div>
  )
};

ImagePreview.propTypes = propTypes;

export default React.memo(ImagePreview);
