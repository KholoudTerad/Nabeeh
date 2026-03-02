import React from 'react';
import Navbar from '../Components/Navbar/Navbar'; // ✅ Now correctly placed inside LogIn_Pages
import ContactUs from '../../../components/ContactUs/ContactUs';
import AboutUs from '../../../components/AboutUs/AboutUs';
import Header from './Header/Header';

const StartPage = () => {
  return (
    <>
      <Navbar />
      <Header />
      <AboutUs />
      <ContactUs />
    </>
  );
};

export default StartPage;