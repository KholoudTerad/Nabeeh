import React from "react";
import { useLocation } from "react-router-dom";
import "./Header_Teacher_Report.css";

const TeacherReport = () => {
  const location = useLocation();
  const { subject, grade, day, month, year } = location.state || {
    subject: "Math",
    grade: "3rd Grade",
    day: 1,
    month: "Jan",
    year: 2024
  };

  return (
    <div className="Report-container">
      <h1 className="Report-title">
        {`${subject} - ${grade} - ${day} - ${month} - ${year}`}
      </h1>

      <div className="teacher-report-pdf-container">
        <iframe 
          src={`/pdfs/${subject}_${grade.replace(' ', '_')}_${day}_${month}_${year}.pdf`}
          className="teacher-report-pdf" 
          title="Teacher Report"
        ></iframe>
      </div>
      
      <button 
        className="download-btn" 
        onClick={() => window.open(
          `/pdfs/${subject}_${grade.replace(' ', '_')}_${day}_${month}_${year}.pdf`, 
          "_blank"
        )}
      >
        Download
      </button>
    </div>
  );
};

export default TeacherReport;

