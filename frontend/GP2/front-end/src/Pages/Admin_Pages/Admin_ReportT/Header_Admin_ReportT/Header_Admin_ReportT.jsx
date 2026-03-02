// Admin_ReportTeacher.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Header_Admin_ReportT.css"; 

const Admin_ReportTeacher = () => {
  const { teacherName } = useParams();
  const navigate = useNavigate();

  // Updated dummy data with teacher field
  const allReportsData = [
    { id: 1, teacher: "Sara Ahmad", subject: "Math", grade: "3rd Grade", day: 1, month: "Jan", year: 2024, hasPDF: true },
    { id: 2, teacher: "Sara Ahmad", subject: "Math", grade: "3rd Grade", day: 5, month: "Jan", year: 2024, hasPDF: false },
    { id: 3, teacher: "Reem Sultan", subject: "Science", grade: "2nd Grade", day: 10, month: "Feb", year: 2024, hasPDF: true },
    { id: 4, teacher: "Reem Sultan", subject: "Science", grade: "2nd Grade", day: 15, month: "Feb", year: 2024, hasPDF: false },
    { id: 5, teacher: "Amal Khalid", subject: "Science", grade: "3rd Grade", day: 15, month: "Jan", year: 2025, hasPDF: false },
  ];

  // Filter reports by teacher's name
  const filteredReports = allReportsData.filter(report => 
    report.teacher === decodeURIComponent(teacherName)
  );

  // Group reports by subject and grade
  const groupedReports = filteredReports.reduce((acc, report) => {
    const key = `${report.subject}-${report.grade}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(report);
    return acc;
  }, {});

  const handleReportClick = (report) => {
    navigate("/admin/AdminReport", { 
      state: {
        teacher: report.teacher,
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
      <h1 className="course-titlee">{decodeURIComponent(teacherName)}</h1>
      
      <h2 className="reports-title">Reports</h2>
      
      {Object.entries(groupedReports).map(([subjectGrade, reports]) => {
        const [subject, grade] = subjectGrade.split("-");
        return (
          <div key={subjectGrade}>
            <h3 className="subject-header">{subject} - {grade}</h3>
            <div className="reports-container">
              {reports.map(report => (
                <div className="report" key={report.id}>
                  <span>{`${report.day} ${report.month} ${report.year} - ${report.subject}`}</span>
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
          </div>
        );
      })}
    </div>
  );
};

export default Admin_ReportTeacher;