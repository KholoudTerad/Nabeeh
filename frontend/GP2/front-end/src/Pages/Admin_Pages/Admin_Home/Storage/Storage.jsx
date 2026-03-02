import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import "./Storage.css";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const Storage = () => {
  const [sessionsByYear, setSessionsByYear] = useState({});

  useEffect(() => {
    const db = getDatabase();
    const sessionsRef = ref(db, "classroom_sessions");

    onValue(sessionsRef, (snapshot) => {
      const data = snapshot.val();
      const grouped = {};

      if (data) {
        Object.values(data).forEach((session) => {
          if (session.timestamp) {
            const date = new Date(session.timestamp);
            const year = date.getFullYear();
            const month = months[date.getMonth()];

            if (!grouped[year]) grouped[year] = new Set();
            grouped[year].add(month);
          }
        });
      }

      // Convert Sets to Arrays
      const groupedObj = {};
      Object.entries(grouped).forEach(([year, monthsSet]) => {
        groupedObj[year] = Array.from(monthsSet);
      });

      setSessionsByYear(groupedObj);
    });
  }, []);

  return (
    <div className="storage-container" id="storage-section">
      <h1 className="title">Storage</h1>
      <div className="storage-grid">
        {Object.entries(sessionsByYear).map(([year, months]) => (
          <div className="storage" key={year}>
            <h2>{year}</h2>
            <div className="card">
              {months.map((month) => (
                <Link
                  key={`${month}-${year}`}
                  to={`/admin/Report/${encodeURIComponent(month)}-${encodeURIComponent(year)}`}
                  className="storage-link"
                >
                  {month}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Storage;
