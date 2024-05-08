import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../image/Logo/HomePageLogo.png";

const Header = () => {
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="header">
      <div className="header-logo">
        <img src={logo} alt="HomePageLogo" onClick={refreshPage} />
      </div>
      <div className="header-nav">
        <Link to="/brand">Brand</Link>
        <Link to="/aboutus">About Us</Link>
        <Link to="/support">Support</Link>
      </div>
      <div className="header-login">
        <Link to="/admin" className="login-button">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Header;
