import React, { useState, useEffect } from "react";
import { ref, push, set, get } from "firebase/database"; // Firebase Database
import { db } from "../../../../Config/firebaseConfig"; // Firebase Config
import "./Header_Admin_AddClass.css";

const HeaderAddClass = () => {
  // State for registered teachers
  const [registeredTeachers, setRegisteredTeachers] = useState([]);

  // State for new class inputs
  const [newClass, setNewClass] = useState({
    subject: "",
    grade: "",
    teacherId: ""
  });

  // Success & error messages
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch teachers from Firebase
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const snapshot = await get(ref(db, "users"));
        if (snapshot.exists()) {
          const teachersArray = Object.entries(snapshot.val())
            .filter(([_, user]) => user.role === "teacher")
            .map(([id, user]) => ({
              id,
              name: user.Name
            }));
          setRegisteredTeachers(teachersArray);
        } else {
          setRegisteredTeachers([]);
        }
      } catch (err) {
        console.error("Error fetching teachers:", err);
      }
    };
    
    fetchTeachers();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    setNewClass({
      ...newClass,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const { subject, grade, teacherId } = newClass;

    if (!subject || !grade || !teacherId) {
      setError("All fields are required.");
      return;
    }

    // Get the current date and format it
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace("T", " ").split(".")[0]; // "YYYY-MM-DD HH:mm:ss"

    try {
      // Create a new class reference
      const newClassRef = push(ref(db, "classes"));

      // Store class details in Firebase
      await set(newClassRef, {
        subject,
        grade,
        teacherId,
        createdAt: formattedDate // Add creation date
      });

      // Reset form & show success message
      setNewClass({ subject: "", grade: "", teacherId: "" });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding class:", error);
      setError("Failed to add class. Try again.");
    }
  };

  return (
    <div className="teacher-container">
      <h1 className="course-title">Add a Class</h1>

      <form onSubmit={handleSubmit}>
        <h2 className="reports-title">Subject</h2>
        <div className="reports-container">
          <div className="report">
            <input
              type="text"
              name="subject"
              value={newClass.subject}
              onChange={handleInputChange}
              placeholder="Enter subject"
              className="input-field"
              required
            />
          </div>
        </div>

        <h2 className="reports-title">Grade</h2>
        <div className="reports-container">
          <div className="report">
            <input
              type="text"
              name="grade"
              value={newClass.grade}
              onChange={handleInputChange}
              placeholder="Enter grade"
              className="input-field"
              required
            />
          </div>
        </div>

        <h2 className="reports-title">Teacher Name</h2>
        <div className="reports-container">
          <div className="report">
            <select
              name="teacherId"
              value={newClass.teacherId}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select a teacher</option>
              {registeredTeachers.length > 0 ? (
                registeredTeachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))
              ) : (
                <option disabled>No teachers available</option>
              )}
            </select>
          </div>
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>

      {/* Error message */}
      {error && (
        <div style={{ color: "red", textAlign: "center", marginTop: "15px" }}>
          {error}
        </div>
      )}

      {/* Success message */}
      {showSuccess && (
        <div style={{ color: "#404041", fontSize: "16px", textAlign: "center", marginTop: "15px" }}>
          Class added successfully!
        </div>
      )}
    </div>
  );
};

export default HeaderAddClass;
