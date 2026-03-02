import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../../../../Config/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./Courses.css";

const Courses = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setSubjects([]);
        setLoading(false);
        return;
      }

      const teacherId = user.uid;

      try {
        const snapshot = await get(ref(db, "classes"));
        if (snapshot.exists()) {
          const classesData = Object.values(snapshot.val());

          // Filter classes linked to the current teacher
          const filteredClasses = classesData.filter(
            (cls) => cls.teacherId === teacherId
          );

          const subjectsMap = {};

          filteredClasses.forEach((cls) => {
            const { subject, grade } = cls;
            if (!subjectsMap[subject]) {
              subjectsMap[subject] = new Set();
            }
            subjectsMap[subject].add(grade);
          });

          const formattedSubjects = Object.entries(subjectsMap).map(
            ([name, grades]) => ({
              name,
              grades: Array.from(grades).sort(),
            })
          );

          setSubjects(formattedSubjects);
        } else {
          setSubjects([]);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="courses-container" id="courses-section">
      <h1 className="title">Courses</h1>
      {loading ? (
        <p>Loading...</p>
      ) : subjects.length === 0 ? (
        <p>No courses assigned to you.</p>
      ) : (
        <div className="courses-grid">
          {subjects.map((subject) => (
            <div className="course" key={subject.name}>
              <h2>{subject.name}</h2>
              <div className="card">
                {subject.grades.map((grade) => (
                  <Link
                    key={grade}
                    to={`/course/${encodeURIComponent(subject.name)}/${encodeURIComponent(grade)}`}
                    className="course-link"
                  >
                    {grade}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
