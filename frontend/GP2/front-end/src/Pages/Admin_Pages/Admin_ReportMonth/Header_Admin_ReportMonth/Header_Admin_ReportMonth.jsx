import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import "./Header_Admin_ReportMonth.css";

const Admin_ReportMonth = () => {
  const { monthYear } = useParams();
  const navigate = useNavigate();
  const [month, year] = monthYear.split("-");
  const [groupedReports, setGroupedReports] = useState({});

  useEffect(() => {
    const db = getDatabase();
    const sessionsRef = ref(db, "classroom_sessions");

    onValue(sessionsRef, (snapshot) => {
      const data = snapshot.val();
      const reports = [];

      if (data) {
        Object.values(data).forEach((session) => {
          if (session.timestamp) {
            const date = new Date(session.timestamp);
            const sessionMonth = date.toLocaleString("default", {
              month: "short",
            });
            const sessionYear = date.getFullYear().toString();

            if (sessionMonth === month && sessionYear === year) {
              reports.push({
                subject: session.subject || "-",
                grade: session.grade || "-",
                day: date.getDate(),
                month: sessionMonth,
                year: sessionYear,
                hasPDF: session.hasPDF || false,
                engagement: session.engagement || false,
              });
            }
          }
        });
      }

      // Group reports by subject and grade
      const grouped = {};
      reports.forEach((report) => {
        const key = `${report.subject}-${report.grade}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(report);
      });

      setGroupedReports(grouped);
    });
  }, [month, year]);

  const handleReportClick = (report) => {
    navigate("/admin/AdminReport", {
      state: {
        subject: report.subject,
        grade: report.grade,
        day: report.day,
        month: report.month,
        year: report.year,
      },
    });
  };

  return (
    <div className="teacher-container">
      <h1 className="course-titlee">
        {month} - {year}
      </h1>

      {/* Reports Section */}
      <h2 className="reports-title">Reports</h2>

      {Object.entries(groupedReports).map(([subjectGrade, reports]) => {
        const [subject, grade] = subjectGrade.split("-");
        return (
          <div key={subjectGrade}>
            <h3 className="subject-header">
              {subject} - {grade}
            </h3>
            <div className="reports-container">
              {reports.map((report, index) => (
                <div className="report" key={index}>
                  <span>{`${report.day} ${report.month} - ${report.subject}`}</span>
                  {report.hasPDF ? (
                    <button
                      className="review-button"
                      onClick={() => handleReportClick(report)}
                    >
                      Ready to be reviewed
                    </button>
                  ) : (
                    <span className="not-ready">{report.engagement}</span>
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

export default Admin_ReportMonth;
