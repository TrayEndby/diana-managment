import React from "react";
import { Editor } from '@tinymce/tinymce-react';

const tinyMCEAPIKey = "susx7vl65uowargciy6w23uos495nojyek29yyy5ubfj03zs";

const HtmlEditor = ({ value, editorChange }) => {
  const handleEditorInit = (content, editor) => {
    editor.setContent(value);
  };

  return (
    <Editor
      apiKey={tinyMCEAPIKey}
      init={{
        height: "100%",
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap preview anchor',
          'searchreplace visualblocks',
          'insertdatetime media paste code markdown'
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | ' +
          'alignleft aligncenter alignright alignjustify | markdown | ' +
          'bullist numlist outdent indent | link | image | removeformat'
      }}
      value={value}
      onEditorChange={editorChange}
      onInit={handleEditorInit}
    />
  );
};

export default React.memo(HtmlEditor);
