import React, { useEffect, useState } from "react";
import "./Header_Teacher_AllReports.css";
import { useNavigate } from "react-router-dom";
import { db } from "../../../../Config/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const TeacherAllReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    // Wait for auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const teacherId = user.uid;
      const reportsRef = ref(db, "classroom_sessions");

      onValue(reportsRef, (snapshot) => {
        const data = snapshot.val();
        const filteredReports = [];

        for (let id in data) {
          const session = data[id];

          if (session.teacherId === teacherId) {
            filteredReports.push({
              id,
              ...session,
            });
          }
        }

        setReports(filteredReports);
        setLoading(false);
      });
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <div className="teacher-container">
      <h1 className="course-title">My Reports</h1>
      <h2 className="reports-title">Reports</h2>

      <div className="reports-container">
        {loading ? (
          <p>Loading...</p>
        ) : reports.length === 0 ? (
          <p>No reports available for you.</p>
        ) : (
          reports.map((report) => (
            <div className="report" key={report.id}>
              <span>{`${report.subject} - ${report.grade} - (${new Date(report.timestamp).toLocaleDateString()})`}</span>
              <span className="engagement-rate">
                {report.engagement !== undefined
                  ? `${report.engagement}%`
                  : "No data"}
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default TeacherAllReports;
