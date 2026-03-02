import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Navbar2.css';

const Navbar = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <nav className="navbar">
      <a href="#" className="logot">Nabeeh</a>

      <div className="nav-links">

        <button className="MyAccount-btn" onClick={() => navigate("/admin/Admin-Account")}>My Account</button>
        <a href="#about-section">About Us</a>
        <a href="#documents-section">Documents</a>
        <a href="#storage-section">Storage</a>
        <button className="HomeA-btn" onClick={() => navigate("/AdminHome")}>Home</button>
        {/* Corrected Logout Button */}
        <button className="logout-btn" onClick={() => navigate("/")}>Log Out</button>
      </div>
    </nav>
  );
};

export default Navbar;
