import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Documents.css";
import { ref, onValue } from "firebase/database";
import { db } from "../../../../Config/firebaseConfig";

const Documents = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // Fetch teachers
    const usersRef = ref(db, "users");
    const unsubscribeTeachers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const teacherList = Object.values(data).filter(
          (user) => user.role === "teacher"
        );
        setTeachers(teacherList);
      }
    });

    // Fetch classes
    const classesRef = ref(db, "classes");
    const unsubscribeClasses = onValue(classesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Format classes as "subject - grade"
        const classList = Object.values(data).map(
          (classItem) => `${classItem.subject} - ${classItem.grade}`
        );
        setClasses(classList);
      }
    });

    return () => {
      unsubscribeTeachers();
      unsubscribeClasses();
    };
  }, []);

  const documents = [
    {
      year: "Teachers",
      month: teachers.map((teacher) => teacher.Name),
    },
    {
      year: "Classes",
      month: classes,
    },
  ];

  return (
    <div className="documents-container" id="documents-section">
      <h1 className="title">Documents</h1>
      <div className="documents-grid">
        {documents.map((doc) => (
          <div className="documents" key={doc.year}>
            <h2>{doc.year}</h2>
            <div className="card">
              <div className="scrollable-list">
                {doc.month.map((item, index) => (
                  <Link
                    key={index}
                    to={
                      doc.year === "Teachers"
                        ? `/admin/teacher-account/${encodeURIComponent(item)}`
                        : `/admin/class/${encodeURIComponent(item)}`
                    }
                    className="documents-link"
                  >
                    {item}
                  </Link>
                ))}
              </div>
              <Link
                to={
                  doc.year === "Teachers"
                    ? "/admin/add-teacher"
                    : "/admin/add-class"
                }
                className="add-button"
              >
                {doc.year === "Teachers" ? "Add a Teacher" : "Add a Class"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;