import React from "react";
import "./SaveEdit.css";

const SaveEdit = ({ onSave, onCancel }) => {
  const handleCancel = () => {
    if (onCancel) onCancel(); // Call onCancel function if provided
  };

  const handleSave = () => {
    if (onSave) onSave(); // Call onSave function if provided
  };

  return (
    <div className="save-edit-container">
      <button className="save-button" onClick={handleSave}>
        Save
      </button>
      <button className="cancel-button" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
};

export default SaveEdit;
