import React from 'react';
import Navbar from '../Components/Navbar/Navbar';
import ContactUs from '../../../components/ContactUs/ContactUs';
import AboutUs from '../../../components/AboutUs/AboutUs';
import Header3 from './Header3/Header3'; // Using the new Header3 component

const ALogIn = () => {
  return (
    <>
      <Navbar />
      <Header3/>
      <AboutUs />
      <ContactUs />
    </>
  );
};

export default ALogIn;
