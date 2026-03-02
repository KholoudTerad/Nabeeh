import React from 'react';
import Navbar from '../Components/Navbar/Navbar';
import ContactUs from '../../../components/ContactUs/ContactUs';
import AboutUs from '../../../components/AboutUs/AboutUs';
import Header2 from './Header2/Header2'; // Using the new Header2 component

const TLogIn = () => {
  return (
    <>
      <Navbar />
      <Header2 />
      <AboutUs />
      <ContactUs />
    </>
  );
};

export default TLogIn;