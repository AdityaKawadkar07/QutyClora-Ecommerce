import React from "react";
import "./Footer.css";
import footer_logo from "../assets/logo_big.png";
import instagram_icon from "../assets/instagram_icon.png";
import pintester_icon from "../assets/pintester_icon.png";
import linkedIn_icon from '../assets/linkedIn-icon.png'
import whatsapp_icon from "../assets/whatsapp_icon.png";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="footer">
      <div className="footer-logo">
        <img src={footer_logo} alt="" />
        <p>QutyClora</p>
      </div>
      <ul className="footer-links">
        <li onClick={() => navigate("/")}>Home</li>
        <li onClick={() => navigate("/about")}>About</li>
        <li onClick={() => navigate("/shop")}>Products</li>
        <li onClick={() => navigate("/contactus")}>Contact</li>
      </ul>
      <div className="footer-social-icon">
        <div className="footer-icons-container">
          <a
            href="https://www.instagram.com/qutycloraofficial?igsh=MThkMnBtMWk1czJodw=="
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={instagram_icon} alt="" />
          </a>
        </div>
        <div className="footer-icons-container">
        <a
            href="https://www.linkedin.com/in/quty-clora-bab23432a/?originalSubdomain=in"
            target="_blank"
            rel="noopener noreferrer"
          >
          <img src={linkedIn_icon} alt="" />
        </a>
        </div>
        <div className="footer-icons-container">
          <a
            href="https://wa.me/918767080016" // 🔥 Replace with your WhatsApp number
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={whatsapp_icon} alt="" />
          </a>
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright @2025 - All Right Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
