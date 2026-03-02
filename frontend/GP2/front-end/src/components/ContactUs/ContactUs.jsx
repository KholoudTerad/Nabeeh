import React from 'react';
import './ContactUs.css';
import { icon1 } from "../../assets"; // Email Icon
import { icon2 } from "../../assets"; // Phone Icon

const ContactUs = () => {
  return (
    <div className="contact-container" id="contact-section">
      <h2 className="contact-title">Contact Us !</h2>
      <div className="contact-info">
        <div className="contact-item">
          <img src={icon1} alt="Email Icon" className="contact-icon" />
          <span className="contact-text email">Nabeeh@gmail.com</span>
        </div>
        <div className="contact-item">
          <img src={icon2} alt="Phone Icon" className="contact-icon" />
          <span className="contact-text phone">+966 55 555 5555</span>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
