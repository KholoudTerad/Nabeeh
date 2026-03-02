import React from 'react';
import Navbar from '../Navbar2/Navbar2'; // ✅ Now correctly placed inside LogIn_Pages
import ContactUs from '../../new-ContactUs/NCU';
import AboutUs from '../../../components/AboutUs/AboutUs';
import Header from './HeaderA/HeaderA';
import Documents from './Documents/Documents';
import Storage from './Storage/Storage';

const AdminHome = () => {
  return (
    <>
      <Navbar />
      <Header />
      <AboutUs />
      <Documents />
      <Storage />
      <ContactUs />
    </>
  );
};

export default AdminHome;