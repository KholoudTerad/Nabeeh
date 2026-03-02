import React from 'react';
import './NCU.css';
import { icon1b } from "../../assets"; // Email Icon
import { icon2b } from "../../assets"; // Phone Icon

const ContactUs = () => {
  return (
    <div className="ncontact-container" id="ncontact-section">
      <h2 className="ncontact-title">Contact Us !</h2>
      <div className="ncontact-info">
        <div className="ncontact-item">
          <img src={icon1b} alt="Email Icon" className="ncontact-icon" />
          <span className="ncontact-text email">Nabeeh@gmail.com</span>
        </div>
        <div className="ncontact-item">
          <img src={icon2b} alt="Phone Icon" className="ncontact-icon" />
          <span className="ncontact-text phone">+966 55 555 5555</span>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
