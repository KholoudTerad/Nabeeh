import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ref, onValue, remove, get } from "firebase/database";
import { db } from "../../../../Config/firebaseConfig";
import "./Header_Admin_Class1.css";

const Admin_Class1 = () => {
  const { className } = useParams();
  const decodedClassName = decodeURIComponent(className);
  const [subject, grade] = decodedClassName.split(" - ");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`[DEBUG] Looking for: Subject="${subject}", Grade="${grade}"`);

    const checkAndCleanClasses = async () => {
      try {
        setLoading(true);
        
        // Get all data at once
        const [classesSnapshot, usersSnapshot] = await Promise.all([
          get(ref(db, 'classes')),
          get(ref(db, 'users'))
        ]);

        const classesData = classesSnapshot.val();
        const usersData = usersSnapshot.val();

        if (!classesData) {
          setLoading(false);
          return;
        }

        const teacherList = [];
        const deletionPromises = [];

        Object.entries(classesData).forEach(([classId, classItem]) => {
          // Match BOTH subject AND grade
          if (classItem.subject === subject && classItem.grade === grade) {
            const teacherUid = classItem.teacherId;
            
            if (teacherUid && usersData && usersData[teacherUid] && usersData[teacherUid].role === "teacher") {
              const teacher = usersData[teacherUid];
              teacherList.push({
                name: teacher.Name || `Teacher (${teacherUid})`,
                id: teacherUid
              });
            } else {
              // Teacher not found - queue for deletion
              console.log(`[DELETE] Orphaned class ${classId}`);
              deletionPromises.push(remove(ref(db, `classes/${classId}`)));
            }
          }
        });

        // Execute all deletions at once
        if (deletionPromises.length > 0) {
          await Promise.all(deletionPromises);
          console.log(`[SUCCESS] Deleted ${deletionPromises.length} orphaned classes`);
        }

        const uniqueTeachers = [...new Map(teacherList.map(item => [item.id, item])).values()];
        setTeachers(uniqueTeachers);
        setLoading(false);

      } catch (error) {
        console.error("Error in class cleanup:", error);
        setLoading(false);
      }
    };

    // Run the cleanup immediately on component mount
    checkAndCleanClasses();

    // Also set up real-time listeners for future changes
    const classesRef = ref(db, 'classes');
    const usersRef = ref(db, 'users');

    const unsubscribeClasses = onValue(classesRef, (snapshot) => {
      // Just trigger a refresh when classes change
      checkAndCleanClasses();
    });

    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      // Just trigger a refresh when users change
      checkAndCleanClasses();
    });

    return () => {
      unsubscribeClasses();
      unsubscribeUsers();
    };
  }, [subject, grade]);

  if (loading) {
    return <div className="class-container">Loading teacher data...</div>;
  }

  return (
    <div className="class-container">
      <h1 className="class-title">{subject} - {grade}</h1>
      <div className="sections-row">
        <div className="section-container">
          <h2 className="section-title">Teachers</h2>
          <div className="content-card">
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <Link
                  key={teacher.id}
                  to={`/admin/teacher-reports/${encodeURIComponent(teacher.name)}`}
                  className="content-item teacher-item"
                >
                  {teacher.name}
                </Link>
              ))
            ) : (
              <p className="no-teachers">
                No teachers found for {subject} - {grade}.<br />
                Orphaned classes have been automatically cleaned up.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_Class1;