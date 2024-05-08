import React from "react";
import { useNavigate } from "react-router-dom";
import "./EditPartnerLogo.css";

function EditPartnerLogo() {
  const navigate = useNavigate();

  const handleEditHomepage = () => {
    navigate("/admin/edithomepage");
  };

  const openInNewTab = (url) => {
    const win = window.open(url, "_blank");
    win.focus();
  };

  const isDesktop = window.innerWidth > 768; // Adjust the breakpoint as needed

  return (
    <div className="edit-partner-logo-container">
      <button
        onClick={
          isDesktop
            ? () => openInNewTab("/admin/edithomepage")
            : handleEditHomepage
        }
        className="edit-partner-logo-btn"
      >
        Edit Partner
        <br />
        Logo
      </button>
    </div>
  );
}

export default EditPartnerLogo;
