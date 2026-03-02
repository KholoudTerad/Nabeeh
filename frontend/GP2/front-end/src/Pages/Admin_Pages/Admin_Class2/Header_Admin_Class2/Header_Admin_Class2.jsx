import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Header_Admin_Class2.css";

const Admin_Class2 = () => {
  const { className, subjectName } = useParams();
  const navigate = useNavigate();
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  // Dummy data
  const allReportsData = [
    { id: 1, subject: "Math", grade: "3rd Grade", day: 1, month: "Jan", year: 2024, hasPDF: true },
    { id: 2, subject: "Math", grade: "3rd Grade", day: 5, month: "Jan", year: 2024, hasPDF: false },
    { id: 3, subject: "Science", grade: "2nd Grade", day: 10, month: "Feb", year: 2024, hasPDF: true },
    { id: 4, subject: "Science", grade: "2nd Grade", day: 15, month: "Feb", year: 2024, hasPDF: false },
    { id: 5, subject: "Science", grade: "3rd Grade", day: 15, month: "Jan", year: 2025, hasPDF: false },
  ];

  const teachers = ["Sara Ahmad", "Reem Sultan", "Amal Khalid"];

  const handleSave = () => {
    setActionMessage("Changes saved successfully!");
    setTimeout(() => setActionMessage(""), 3000);
  };

  const handleDelete = () => {
    setActionMessage("Class configuration deleted!");
    setTimeout(() => {
      setActionMessage(" ");
      navigate(-1);
    }, 2000);
  };
  const handleReportClick = (report) => {
    navigate("/admin/AdminReport", { 
      state: {
        subject: report.subject,
        grade: report.grade,
        day: report.day,
        month: report.month,
        year: report.year
      }
    });
  };

  return (
    <div className="teacher-container">
      <h1 className="course-titlee">{subjectName} - {className}</h1>
      
      {/* Reports Section */}
      <h2 className="reports-title">Reports</h2>
      <div className="reports-container">
        {allReportsData
          .filter((report) => report.subject === subjectName && report.grade === className) // ✅ Correct filtering
          .map((report) => (
            <div className="report" key={report.id}>
              <span>{`${report.subject} - ${report.grade} - ${report.day} - ${report.month} - ${report.year}`}</span>
              {report.hasPDF ? (
                <button 
                className="review-button"
                onClick={() => handleReportClick(report)}
              >
                Ready to be reviewed
              </button>
              ) : (
                <span className="not-ready">Not Ready Yet</span>
              )}
            </div>
          ))}
      </div>

      {/* Teacher Section */}
      <h2 className="reports-title">Teacher Name</h2>
      <div className="reports-container">
        <div className="report">
          <select 
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="input-field"
          >
            {teachers.map(teacher => (
              <option key={teacher} value={teacher}>{teacher}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="action-buttons">
        <button onClick={handleSave} className="submit-button1">Save Changes</button>
        <button onClick={handleDelete} className="delete-btn1">Delete</button>
      </div>

      {actionMessage && (
        <div className="action-message">{actionMessage}</div>
      )}
    </div>
  );
};

export default Admin_Class2;


