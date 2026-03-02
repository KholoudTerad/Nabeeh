import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './Pages/LogIn_Pages/Start Page/Start_Page';
import ContactUs from './components/ContactUs/ContactUs';
import AboutUs from './components/AboutUs/AboutUs';
import TLogIn from './Pages/LogIn_Pages/T.log-In/T.Log-In';
import ALogIn from './Pages/LogIn_Pages/A.log-in/A.Log_In';
import THome from './Pages/Teacher_Pages/Teacher_Home/Teacher_Home';
import AHome from './Pages/Admin_Pages/Admin_Home/Admin_Home';
import AllReportT from './Pages/Teacher_Pages/Teacher_AllReports/Teacher_AllReports';
import TMyAccount from './Pages/Teacher_Pages/MyAccount/MyAccount';
import TCourses from './Pages/Teacher_Pages/Teacher_Course1/Teacher_Course1';
import OpenedClass from './Pages/Teacher_Pages/Teacher_Course2/Teacher_Course2';
import TReport from './Pages/Teacher_Pages/Teacher_Report/Teacher_Report';
import Admin_AddT from './Pages/Admin_Pages/Admin_AddT/Admin_AddT';
import Admin_AddClass from './Pages/Admin_Pages/Admin_AddClass/Admin_AddClass';
import TeacherAccount from './Pages/Admin_Pages/Admin_TAcc/Admin_TAcc';
import AdminAccount from './Pages/Admin_Pages/Admin_acc/Admin_acc';
import AClass1 from './Pages/Admin_Pages/Admin_Class1/Admin_Class';
import AClass2 from './Pages/Admin_Pages/Admin_Class2/Admin_Class2';
import AAllReport from './Pages/Admin_Pages/Admin_AllReports/Admin_AllReport';
import AReport from './Pages/Admin_Pages/Admin_Report/Admin_Report';
import AReportMonth from './Pages/Admin_Pages/Admin_ReportMonth/Admin_ReportMonth';
import AReportTeacher from './Pages/Admin_Pages/Admin_ReportT/Admin_ReportT';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        
        {/* Admin Routes */}
        <Route path="/AdminHome" element={<AHome />} />    
        <Route path="/admin" element={<ALogIn />} />
        <Route path="/admin/add-teacher" element={<Admin_AddT />} />
        <Route path="/admin/add-class" element={<Admin_AddClass />} />
        <Route path="/admin/teacher-account/:teacherName" element={<TeacherAccount />} />
        <Route path="/admin/Admin-Account" element={<AdminAccount />} />
        <Route path="/admin/class/:className" element={<AClass1 />} />
        <Route path="/admin/class/:className/subject/:subjectName"element={<AClass2 />}/>
        <Route path="/admin/allReports" element={<AAllReport />} />
        <Route path="/admin/AdminReport" element={<AReport />} />
        <Route path="/admin/Report/:monthYear" element={<AReportMonth />} />
        <Route path="/admin/teacher-reports/:teacherName" element={<AReportTeacher />} />


        {/* Teacher Routes */}
        <Route path="/start" element={<TLogIn />} />
        <Route path="/TeacherHome" element={<THome />} />
        <Route path="/AllReportsTeacher" element={<AllReportT />} />
        <Route path="/TMyAccount" element={<TMyAccount />} />
        <Route path="/course/:subject/:grade" element={<TCourses />} />
        <Route path="/OpenedClasse" element={<OpenedClass />} />
        <Route path="/TeacherReport" element={<TReport />} />
      </Routes>
    </Router>
  );
};

export default App;