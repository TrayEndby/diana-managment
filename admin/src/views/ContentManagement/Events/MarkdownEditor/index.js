import React from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const MdEditor = ({ value, editorChange }) => {
  return (
    <SimpleMDE
      value={value}
      style={{ overflow: "scroll", height: "100%" }}
      onChange={editorChange}
    />
  );
};

export default React.memo(MdEditor);
