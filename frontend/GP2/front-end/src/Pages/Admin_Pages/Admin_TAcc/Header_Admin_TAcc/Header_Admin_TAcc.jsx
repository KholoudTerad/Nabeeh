import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, onValue, update, remove, get } from "firebase/database";
import { getAuth, updatePassword, deleteUser } from "firebase/auth";
import { db } from "../../../../Config/firebaseConfig";
import './Header_Admin_TAcc.css';

const TeacherAccount = () => {
  const { teacherName } = useParams();
  const decodedName = decodeURIComponent(teacherName);
  const navigate = useNavigate();
  const auth = getAuth();

  const [teacherData, setTeacherData] = useState({
    Name: "",
    Username: "",
    email: "",
    password: "********",
    uid: ""
  });

  const [editableData, setEditableData] = useState({ ...teacherData });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const teachersRef = ref(db, 'users');
        onValue(teachersRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const teacher = Object.values(data).find(
              t => t.Name === decodedName && t.role === "teacher"
            );
            if (teacher) {
              setTeacherData({
                Name: teacher.Name || "",
                Username: teacher.Username || "",
                email: teacher.email || "",
                password: "********",
                uid: teacher.uid || ""
              });
              setEditableData({
                Name: teacher.Name || "",
                Username: teacher.Username || "",
                email: teacher.email || "",
                password: "********"
              });
            }
          }
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Error fetching teacher data:", error);
        setMessage("Failed to load teacher data");
        setIsLoading(false);
      }
    };

    fetchTeacherData();
  }, [decodedName]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditableData({ ...teacherData, password: "********" });
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const teachersRef = ref(db, 'users');
      onValue(teachersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const teacherKey = Object.keys(data).find(
            key => data[key].Name === decodedName && data[key].role === "teacher"
          );

          if (teacherKey) {
            update(ref(db, `users/${teacherKey}`), {
              Name: editableData.Name,
              Username: editableData.Username,
              email: editableData.email
            });
          }
        }
      });

      if (editableData.password !== "********") {
        await updatePassword(auth.currentUser, editableData.password);
      }

      setMessage("Changes saved successfully!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating teacher:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${decodedName}? This cannot be undone.`)) {
      try {
        setIsLoading(true);
  
        // 1. Get teacher data
        const usersSnapshot = await get(ref(db, 'users'));
        const usersData = usersSnapshot.val();
        if (!usersData) throw new Error("No users found.");
  
        const teacherKey = Object.keys(usersData).find(
          key => usersData[key].Name === decodedName && usersData[key].role === "teacher"
        );
        if (!teacherKey) throw new Error("Teacher not found.");
  
        const teacherUid = usersData[teacherKey].uid;
        console.log("Teacher UID to match:", teacherUid);
  
        // 2. Delete classes with matching teacherId
        const classesSnapshot = await get(ref(db, 'classes'));
        const classesData = classesSnapshot.val();
  
        if (classesData) {
          const deletionPromises = [];
          
          for (const classKey in classesData) {
            const classItem = classesData[classKey];
            console.log(`Checking class ${classKey} with teacherId:`, classItem.teacherId);
            
            if (classItem.teacherId && classItem.teacherId === teacherUid) {
              console.log("MATCH FOUND - Deleting class:", classKey);
              deletionPromises.push(remove(ref(db, `classes/${classKey}`)));
            }
          }
          
          // Execute all deletions
          await Promise.all(deletionPromises);
          console.log("Class deletions completed");
        }
  
        // 3. Delete teacher
        await remove(ref(db, `users/${teacherKey}`));
  
        // 4. Optional: Delete auth user
        if (auth.currentUser?.uid === teacherUid) {
          await deleteUser(auth.currentUser);
        }
  
        setMessage("Teacher and all associated classes deleted successfully!");
        setTimeout(() => navigate("/admin/teachers"), 2000);
  
      } catch (error) {
        console.error("Deletion error:", error);
        setMessage(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setEditableData({
      ...editableData,
      [e.target.name]: e.target.value
    });
  };

  if (isLoading) {
    return <div className="teacher-container">Loading...</div>;
  }

  return (
    <div className="teacher-container">
      <h1 className="Teacher-title">{decodedName}</h1>

      <div className="account-section">
        <h2 className="reports-title">Name</h2>
        <div className="reports-container">
          <div className="report">
            <input
              type="text"
              name="Name"
              value={editableData.Name}
              onChange={handleChange}
              className="input-field"
              disabled={!isEditing}
            />
          </div>
        </div>

        <h2 className="reports-title">Username</h2>
        <div className="reports-container">
          <div className="report">
            <input
              type="text"
              name="Username"
              value={editableData.Username}
              onChange={handleChange}
              className="input-field"
              disabled={!isEditing}
            />
          </div>
        </div>

        <h2 className="reports-title">Email</h2>
        <div className="reports-container">
          <div className="report">
            <input
              type="email"
              name="email"
              value={editableData.email}
              onChange={handleChange}
              className="input-field"
              disabled={!isEditing}
            />
          </div>
        </div>

        <h2 className="reports-title">Password</h2>
        <div className="reports-container">
          <div className="report">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={editableData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter new password"
              disabled={!isEditing}
            />
            <button 
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              disabled={!isEditing}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      </div>

      <div className="button-group">
        {!isEditing ? (
          <button 
            className="edit-button" 
            onClick={handleEditToggle}
            disabled={isLoading}
          >
            Edit Teacher
          </button>
        ) : (
          <>
            <button 
              className="submit-button" 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button 
              className="cancel-button" 
              onClick={handleEditToggle}
              disabled={isLoading}
            >
              Cancel
            </button>
          </>
        )}
        <button 
          className="delete-button" 
          onClick={handleDelete}
          disabled={isLoading || isEditing}
        >
          {isLoading ? "Deleting..." : "Delete Teacher"}
        </button>
      </div>
      
      {message && <div className="save-message">{message}</div>}
    </div>
  );
};

export default TeacherAccount;
