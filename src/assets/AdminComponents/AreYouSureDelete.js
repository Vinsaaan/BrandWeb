import React from "react";
import "./AreYouSureDelete.css";

const AreYouSureDelete = ({ item, onDelete, onCancel }) => {
  return (
    <div className="delete-confirmation-overlay">
      <div className="delete-confirmation">
        <p>
          Are you sure you want to delete{" "}
          <span className="delete-item">{item}</span>?
        </p>
        <button className="delete" onClick={onDelete}>
          Yes, Delete
        </button>
        <button className="cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AreYouSureDelete;
