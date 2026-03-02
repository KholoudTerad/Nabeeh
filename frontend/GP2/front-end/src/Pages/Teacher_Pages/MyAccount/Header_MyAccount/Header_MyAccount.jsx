import React, { useEffect, useState } from "react";
import { auth, db } from "../../../../Config/firebaseConfig";
import { ref, get } from "firebase/database";
import "./Header_MyAccount.css";

const HeaderMyAccount = () => {
  const [userData, setUserData] = useState({
    Name: "",
    Username: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else {
            console.log("No data found for this user.");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="teacher-container">
      <h1 className="course-title">My Account</h1>

      {loading ? (
        <p>Loading user info...</p>
      ) : (
        <>
          <h2 className="reports-title">Name</h2>
          <div className="reports-container">
            <div className="report">
              <span>{userData.Name || "N/A"}</span>
            </div>
          </div>

          <h2 className="reports-title">Username</h2>
          <div className="reports-container">
            <div className="report">
              <span>{userData.Username || "N/A"}</span>
            </div>
          </div>

          <h2 className="reports-title">Email</h2>
          <div className="reports-container">
            <div className="report">
              <span>{userData.email || auth.currentUser?.email || "N/A"}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderMyAccount;
