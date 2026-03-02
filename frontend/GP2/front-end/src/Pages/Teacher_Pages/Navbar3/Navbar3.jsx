import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Navbar3.css';

const Navbar = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <nav className="navbar">
      <a href="#" className="logot">Nabeeh</a>

      <div className="nav-links">

        <button className="MyAccount-btn" onClick={() => navigate("/TMyAccount")}>My Account</button>
        <a href="#about-section">About Us</a>
        <a href="#courses-section">Courses</a>   
        <button className="HomeT-btn" onClick={() => navigate("/TeacherHome")}>Home</button>
        {/* Corrected Logout Button */}
        <button className="logout-btn" onClick={() => navigate("/")}>Log Out</button>
      </div>
    </nav>
  );
};

export default Navbar;
