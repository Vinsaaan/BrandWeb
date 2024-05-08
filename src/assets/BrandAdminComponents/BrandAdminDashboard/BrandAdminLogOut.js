import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "../../BrandAdminComponents/BrandAdminDashboard/BrandAdminLogOut.css"; // Make sure the path is correct

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth(); // Get the Firebase Auth instance.
    signOut(auth) // Sign out the user.
      .then(() => {
        // Sign-out successful, navigate to the admin login page.
        navigate("/admin");
      })
      .catch((error) => {
        // Handle any errors that occurred during sign-out.
        console.error("Logout Error:", error);
        // Optionally, provide user feedback about the logout error here.
      });
  };

  // Render the logout button and assign the handleLogout function to its onClick event.
  return (
    <button className="brand-admin-logout-button" onClick={handleLogout}>
      Log Out
    </button>
  );
};

export default LogoutButton;
