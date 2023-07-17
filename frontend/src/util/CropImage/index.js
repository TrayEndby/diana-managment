import React, { useState } from "react";
import Cropper from "react-cropper";
import { Button } from "react-bootstrap";
import "cropperjs/dist/cropper.css";
import style from './style.module.scss';

const CropImage = ({imgSrc, setUploadImage, setShow}) => {
  const [cropper, setCropper] = useState();
  const [preview, setPreview] = useState();

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setUploadImage(cropper);
    }
  };

  return (
    <div className={style.root}>
      <div>
        <h3>Edit picture</h3>
        <Cropper
          className={style.cropper}
          initialAspectRatio={1}
          src={imgSrc}
          viewMode={1}
          guides={true}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false}
          onInitialized={(instance) => {
            setCropper(instance);
          }}
          crop={(e) => {
            setPreview(e.target.cropper.getCroppedCanvas().toDataURL());
          }}
        />
      </div>
      <div>
        <div className={style.box}>
          <h5>Preview</h5>
          <img
            src={preview}
            alt="Preview"
            className={style.img_preview}
          />
        </div>
        <div className={style.box}>
          <Button className={style.button} onClick={getCropData}>Upload</Button>
          <Button className={style.button} variant="outline-info" onClick={() => setShow(false)}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default CropImage;
