import React, { useState } from "react";
import "./EditBrandName.css"; // Make sure the CSS path is correct

const EditBrandName = ({ brandName, onSave, onCancel }) => {
  const [newName, setNewName] = useState(brandName);

  const handleSave = () => {
    onSave(newName);
  };

  return (
    <div className="edit-brand-name-overlay">
      <div className="edit-brand-name-container">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="edit-brand-name-input"
        />
        <div className="edit-brand-name-buttons">
          <button onClick={handleSave} className="save-button">
            Save
          </button>
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBrandName;
