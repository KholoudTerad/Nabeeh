import React from 'react';
import Navbar from '../Navbar3/Navbar3'; 
import ContactUs from '../../new-ContactUs/NCU';
import AboutUs from '../../../components/AboutUs/AboutUs';
import Header from './HeaderT/HeaderT';
import Courses from './Courses/Courses';

const TeacherHome = () => {
  return (
    <>
      <Navbar />
      <Header />
      <AboutUs />
      <Courses />
      <ContactUs />
    </>
  );
};

export default TeacherHome;