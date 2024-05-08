import React from "react";
import "./SavePartnerLogo.css";

const SavePartnerLogo = ({ onSave }) => {
  return (
    <div id="save-logo-btn-container">
      <button className="save-partner-logo-btn" onClick={onSave}>
        Save Logos Image
      </button>
    </div>
  );
};

export default SavePartnerLogo;
