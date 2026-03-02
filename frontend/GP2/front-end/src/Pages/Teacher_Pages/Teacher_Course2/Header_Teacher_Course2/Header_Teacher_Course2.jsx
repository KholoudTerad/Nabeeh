import React from "react";
import './Header_Teacher_Course2.css'
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const TeacherCourse2 = () => {
    const navigate = useNavigate(); // Hook for navigation
  return (
    <div className="teacher-container">
      <h1 className="course-title">The Class Is Being Recorded</h1>

      <button className="end-class-button" onClick={() => navigate("/TeacherHome")}>End the Class</button>


      
    </div>
  );
};

export default TeacherCourse2;