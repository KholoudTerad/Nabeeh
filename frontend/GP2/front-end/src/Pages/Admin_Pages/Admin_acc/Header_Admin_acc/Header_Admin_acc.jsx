import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../../../Config/firebaseConfig"; // adjust path as needed
import './Header_Admin_acc.css';

const AdminTAcc = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = ref(db, "users");

    const unsubscribe = onValue(usersRef, (snapshot) => {
      let foundAdmin = null;

      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        if (user.role === "admin") {
          foundAdmin = user;
        }
      });

      setAdminData(foundAdmin);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!adminData) return <p>No admin found.</p>;

  return (
    <div className="teacher-container">
      <h1 className="course-title">Admin Account</h1>

      <h2 className="reports-title">Name</h2>
      <div className="reports-container">
        <div className="report">
          <span>{adminData.Name || "N/A"}</span>
        </div>
      </div>

      <h2 className="reports-title">Username</h2>
      <div className="reports-container">
        <div className="report">
          <span>{adminData.Username || "N/A"}</span>
        </div>
      </div>

      <h2 className="reports-title">Email</h2>
      <div className="reports-container">
        <div className="report">
          <span>{adminData.email || "N/A"}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminTAcc;
