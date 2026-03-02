import React, { useState } from "react";
import { ref, push, set } from "firebase/database"; // Firebase Realtime Database
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase Auth
import { auth, db } from "../../../../Config/firebaseConfig"; // Import Firebase config
import "./Header_Admin_AddT.css";

const HeaderAddT = () => {
  // State for new teacher inputs
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  });

  // Success message state
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    setNewTeacher({
      ...newTeacher,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    const { name, username, email, password } = newTeacher;

    if (name && username && email && password) {
      try {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // Store user details in Realtime Database
        await set(ref(db, `users/${userId}`), {
          Name: name,
          Username: username,
          email: email,
          role: "teacher"
        });

        // Reset form and show success message
        setNewTeacher({ name: "", username: "", email: "", password: "" });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error("Error adding teacher:", error);
        setError(error.message);
      }
    }
  };

  return (
    <div className="teacher-container">
      <h1 className="course-title">Add a Teacher</h1>

      <form onSubmit={handleSubmit}>
        <h2 className="reports-title">Name</h2>
        <div className="reports-container">
          <div className="report">
            <input
              type="text"
              name="name"
              value={newTeacher.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              className="input-field"
              required
            />
          </div>
        </div>

        <h2 className="reports-title">Username</h2>
        <div className="reports-container">
          <div className="report">
            <input
              type="text"
              name="username"
              value={newTeacher.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              className="input-field"
              required
            />
          </div>
        </div>

        <h2 className="reports-title">Email</h2>
        <div className="reports-container">
          <div className="report">
            <input
              type="email"
              name="email"
              value={newTeacher.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className="input-field"
              required
            />
          </div>
        </div>

        <h2 className="reports-title">Password</h2>
        <div className="reports-container">
          <div className="report">
            <input
              type="password"
              name="password"
              value={newTeacher.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              className="input-field"
              required
            />
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
          Teacher added successfully!
        </div>
      )}
    </div>
  );
};

export default HeaderAddT;
