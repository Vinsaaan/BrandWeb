import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./EditDescription.css";

const EditDescription = ({ initialDescription, onTextChange }) => {
  const [text, setText] = useState(initialDescription);

  const handleChange = (content, delta, source, editor) => {
    setText(content);
    if (typeof onTextChange === "function") {
      onTextChange(content);
    }
  };

  return (
    <div className="edit-description-container">
      <ReactQuill value={text} onChange={handleChange} />
    </div>
  );
};

export default EditDescription;
