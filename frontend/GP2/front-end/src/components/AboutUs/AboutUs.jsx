import React from 'react';
import "./AboutUs.css";
import { logo } from "../../assets";

const AboutUs = () => {
  return (
    <section /*id='AboutUs'*/ className="gray" id="about-section">
      <div className="wrapper" >
        <h2 className="AboutUs-heading">At Nabeeh</h2>
        
        <div className="content-container" >
          <div className="text-container">
            <p className="AboutUs-text">
              We use AI technologies like facial emotion recognition and eye 
              gaze tracking to help educators monitor student engagement, 
              especially in younger learners, providing actionable insights 
              to improve learning outcomes.
            </p>
          </div>

          <div className="aboutUs-cta">
            <img src={logo} alt="Logo" className="aboutUs-logo" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;