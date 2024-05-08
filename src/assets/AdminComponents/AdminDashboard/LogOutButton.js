import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "../AdminDashboard/LogOutButton.css";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/admin");
      })
      .catch((error) => {
        // An error happened.
        console.error("Logout Error:", error);
      });
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Log Out
    </button>
  );
};

export default LogoutButton;
