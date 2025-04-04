import React, { useState, useEffect } from 'react';
import './Admin.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);

  // Check screen size and update state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
      if (window.innerWidth > 800) {
        setSidebarOpen(false); // Ensure sidebar is always visible on large screens
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle Sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside (only on mobile)
  const handleOutsideClick = (e) => {
    if (isMobile && sidebarOpen && !e.target.closest('.sidebar-container') && !e.target.closest('.menu-btn')) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="admin" onClick={handleOutsideClick}>
      {/* Show menu button only on small screens */}
      {isMobile && (
        <button className="menu-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      )}

      {/* Sidebar with conditional class */}
      <div className={`sidebar-container ${sidebarOpen || !isMobile ? 'show' : ''}`}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
