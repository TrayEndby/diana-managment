import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { CameraFill } from 'react-bootstrap-icons';
import Image from 'react-bootstrap/Image';
import userProfilePicService from 'service/UserProfilePicService';
import personalWebsiteService from 'service/CSA/PersonalizedWebsiteService';

import style from './style.module.scss';

const propTypes = {
  data: PropTypes.object,
  unverified: PropTypes.bool,
};

const BasicSection = ({ data, unverified }) => {
  const inputFileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [mouseHover, setMouseHover] = useState(false);

  const fetchProfileImage = async () => {
    try {
      const image = await userProfilePicService.download();
      setImage(image);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProfileImage();
  }, []);

  const handleTriggerUpload = () => {
    inputFileRef.current.click();
  };

  const handleUpload = async (event) => {
    try {
      const pic = event.target.files[0];
      await userProfilePicService.upload(pic);
      setImage(URL.createObjectURL(pic));
    } catch (e) {
      console.error(e);
      alert('Upload profile image failed');
    }
  };

  const handleImageMouseMove = () => {
    setMouseHover(true);
  };

  const handleImageMouseLeave = () => {
    setMouseHover(false);
  };

  const personalWebsiteURL = personalWebsiteService.getWebsiteURL(
    data.personalWebsiteName,
  );
  return (
    <div className={style.basicSection}>
      <div
        className={style.photoView}
        onClick={handleTriggerUpload}
        onMouseMove={handleImageMouseMove}
        onMouseLeave={handleImageMouseLeave}
        style={{ backgroundImage: image }}
      >
        {image == null ? (
          <CameraFill size={65} />
        ) : mouseHover ? (
          <div>
            <Image fluid src={image} className={style.image} />
            <div className={style.mask}> </div>
            <CameraFill
              size={65}
              style={{ marginTop: '-150px', marginLeft: '30px' }}
            />
          </div>
        ) : (
          <Image src={image} className={style.image} />
        )}
        <input
          ref={inputFileRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
      </div>
      <h4>{data.firstName + ' ' + data.lastName}</h4>
      <h5>CSA ID: {data.code}</h5>
      <div className="separator" />
      {unverified && (
        <div className={style.flexItem}>
          <div className={style.keyText}>Status</div>
          <div className={style.valueText}>Wait for verification</div>
        </div>
      )}
      <div className={style.flexItem}>
        <div className={style.keyText}>Login email</div>
        <div className={style.valueText}>{data.email}</div>
      </div>
      <div className={style.flexItem}>
        <div className={style.keyText}>Kyros website</div>
        <div
          className={cn(style.valueText, 'App-clickable')}
          onClick={() => {
            const win = window.open(personalWebsiteURL, '_blank');
            win.focus();
          }}
        >
          {personalWebsiteURL}
        </div>
      </div>
    </div>
  );
};

BasicSection.propTypes = propTypes;

export default BasicSection;
