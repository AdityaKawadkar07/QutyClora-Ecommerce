import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import navlogo from "../../assets/nav-logo.svg";
import navProfile from "../../assets/nav-logo.png";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("auth-token"); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-id");
    navigate("/login"); // Redirect to login page
    toast.success("Logout Succesful");
  };

  return (
    <div className="navbar">
      <img src={navlogo} alt="Logo" className="nav-logo" />
      <div className="nav-right">
      {isLoggedIn && (
          <>
            <img src={navProfile} className="nav-profile" alt="Profile" />
            <h5>Welcome Admin!</h5>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
