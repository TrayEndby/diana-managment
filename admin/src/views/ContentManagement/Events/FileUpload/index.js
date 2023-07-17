import React, { useRef } from "react";
import PropTypes from "prop-types";
import { CButton } from "@coreui/react";

const propTypes = {
  className: PropTypes.string,
  index: PropTypes.number,
  value: PropTypes.string,
  setValue: PropTypes.func,
};

const FileUpload = ({ className, index, value, setValue }) => {
  const inputFile = useRef(null);

  const handleFileUpload = async (e) => {
    const { files } = e.target;
    if (files && files.length) {
      const imageURL = URL.createObjectURL(files[0]);
      setValue(imageURL, index);
    }
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  return (
    <div>
      <input
        style={{ display: "none" }}
        accept="image/x-png,image/gif,image/jpeg"
        ref={inputFile}
        onChange={handleFileUpload}
        type="file"
      />
      {(value == null || value === "") && (
        <div className={className}>
          <CButton
            onClick={onButtonClick}
            className="mt-2"
            color="primary"
            size="sm"
          >
            Upload Picture
          </CButton>
        </div>
      )}
      {value != null && value !== "" && (
        <img
          onClick={onButtonClick}
          src={value}
          style={{
            width: "60px",
            height: "60px",
            cursor: "pointer",
            borderRadius: "100%",
          }}
          alt=""
        />
      )}
    </div>
  );
};

FileUpload.prototype = propTypes;

export default FileUpload;
