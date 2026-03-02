import React, { useEffect, useState } from "react";
import "./Header_Admin_AllReport.css";
import { db } from "../../../../Config/firebaseConfig";
import { ref, onValue } from "firebase/database";

const AAllReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const reportsRef = ref(db, "classroom_sessions");

    onValue(reportsRef, (snapshot) => {
      const data = snapshot.val();
      const allReports = [];

      if (data) {
        for (let id in data) {
          const session = data[id];
          const date = session.timestamp ? new Date(session.timestamp) : null;

          allReports.push({
            id,
            subject: session.subject || "-",
            grade: session.grade || "-",
            day: date ? date.getDate() : "-",
            month: date ? date.toLocaleString("default", { month: "short" }) : "-",
            year: date ? date.getFullYear() : "-",
            hasPDF: session.hasPDF || false,
            engagement: session.engagement,
          });
        }
      }

      setReports(allReports);
    });
  }, []);

  return (
    <div className="teacher-container">
      <h1 className="course-title">All Reports</h1>
      <h2 className="reports-title">Reports</h2>
      <div className="reports-container">
        {reports.length === 0 ? (
          <p>No reports available.</p>
        ) : (
          reports.map((report) => (
            <div className="report static-report" key={report.id}>
              <span>{`${report.subject} - ${report.grade} - ${report.day}/${report.month}/${report.year}`}</span>
              {`${
                report.engagement !== undefined
                  ? report.engagement + "%"
                  : "No data"
              }`}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AAllReports;
