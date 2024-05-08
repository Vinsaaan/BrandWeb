import React from "react";
import "./AreYouSureSave.css"; // Make sure this CSS file path is correct

const AreYouSureSave = ({ item, onSave, onCancel }) => {
  return (
    <div className="save-confirmation-overlay">
      <div className="save-confirmation">
        <p>
          Are you sure you want to save changes for{" "}
          <span className="save-item">{item}</span>?
        </p>
        <button className="save" onClick={onSave}>
          Yes, Save
        </button>
        <button className="cancel" onClick={onCancel}>
          No, Cancel
        </button>
      </div>
    </div>
  );
};

export default AreYouSureSave;
