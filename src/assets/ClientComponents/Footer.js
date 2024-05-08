import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";
import InstagramIcon from "../image/ClientComponents/InstagramIcon.png";
import ListIcon from "../image/ClientComponents/List.png";

const Footer = () => {
  let navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h4>PAGES</h4>
          <div className="footer-item" onClick={() => handleNavigation("/")}>
            <img src={ListIcon} alt="List" className="icon" />
            Home
          </div>
          <div
            className="footer-item"
            onClick={() => handleNavigation("/admin")}
          >
            <img src={ListIcon} alt="List" className="icon" />
            Login
          </div>
        </div>
        <div className="footer-column">
          <h4>SERVICES</h4>
          <div
            className="footer-item"
            onClick={() => handleNavigation("/brand")}
          >
            <img src={ListIcon} alt="List" className="icon" />
            Brand
          </div>
          <div
            className="footer-item"
            onClick={() => handleNavigation("/aboutus")}
          >
            <img src={ListIcon} alt="List" className="icon" />
            About Us
          </div>
          <div
            className="footer-item"
            onClick={() => handleNavigation("/support")}
          >
            <img src={ListIcon} alt="List" className="icon" />
            Support
          </div>
        </div>

        <div className="footer-column">
          <h4>SOCIAL MEDIA</h4>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={InstagramIcon} alt="Instagram" className="social-icon" />
          </a>
        </div>
      </div>
      <div className="business-name">Business Name</div>
    </footer>
  );
};

export default Footer;
