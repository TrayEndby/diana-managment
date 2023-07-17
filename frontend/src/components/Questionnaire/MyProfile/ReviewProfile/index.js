import React, { useState, useEffect, useRef } from 'react';
import style from './style.module.scss';
import classnames from 'classnames';
import UserIcon from './UserIcon';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CropImage from '../../../../util/CropImage';
import { uploadCropImage } from '../../../../util/CropImage/util';

const ReviewProfile = ({ authedAs, handleUploadAvatar }) => {
  const [image, setImage] = useState(null);
  const [show, setShow] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const inputFileRef = useRef(null);

  useEffect(() => {
    setImage(authedAs?.avatar);
  }, [authedAs]);

  const setUploadImage = (pic) => {
    setShow(false);
    uploadCropImage(pic, handleUploadAvatar, 200);
  };

  const handleSelectFile = (e) => {
    if (e.target.files[0] != null) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      setShow(true);
    }
  };

  const handleTriggerUpload = () => {
    inputFileRef.current.click();
  };

  return (
    <>
      <h3
        className={`font-weight-bold mb-4 mt-4 ${classnames(style.subTitle)}`}
      >
        <span className={` ${classnames(style.subTitleSpan)}`}>
          Profile Information
        </span>
      </h3>
      <div className={classnames(style.editPicture)}>
        <span className={style.dot}>
          <UserIcon image={image} style={{ width: '100px', height: '100px' }} />
        </span>
        <Button
          className="ml-4 font-weight-bold"
          variant="primary"
          onClick={handleTriggerUpload}
        >
          Change photo
        </Button>
        <input
          ref={inputFileRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleSelectFile}
        />
      </div>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <CropImage
          imgSrc={imageSrc}
          setUploadImage={setUploadImage}
          setShow={setShow}
        />
      </Modal>
    </>
  );
};

export default ReviewProfile;
