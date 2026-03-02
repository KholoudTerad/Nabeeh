/*import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header2.css';

const Header2 = () => {

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/Teacher_Home');
    };

    return (
        <header>
            <div className="wrapper">
                <div className="cta">                
                    <h1>Log In</h1>

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Username</label>
                            <input type="text" placeholder="Enter your username" />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" placeholder="Enter your password" />
                        </div>

                        <p>If you can't log in, please contact us</p>
                        <button type="submit">Log In</button>
                    </form>
                </div>
            </div> 
        </header>
    );
}

export default Header2;*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../../Config/firebaseConfig";
import { ref, get } from "firebase/database";
import "./Header2.css";

const Header2 = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Fetch all users from Realtime Database
            const usersRef = ref(db, "users");
            const snapshot = await get(usersRef);

            if (!snapshot.exists()) {
                setError("No users found in database.");
                setLoading(false);
                return;
            }

            const usersData = snapshot.val();
            console.log("Fetched Users Data:", usersData); // Debugging

            // Find user by username (case-insensitive)
            const foundUser = Object.values(usersData).find(user =>
                user.Username?.toLowerCase() === username.toLowerCase()
            );

            if (!foundUser) {
                setError("Username not found.");
                setLoading(false);
                return;
            }

            console.log("Found User:", foundUser); // Debugging

            const { email, role } = foundUser;

            if (!email) {
                setError("Error: No email found for this user.");
                setLoading(false);
                return;
            }

            if (role !== "teacher") {
                setError("Access denied! Only teachers can log in.");
                setLoading(false);
                return;
            }

            // Authenticate using Firebase Auth (email & password)
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Login successful!", userCredential.user);

            navigate("/TeacherHome");
        } catch (error) {
            console.error("Login error:", error);
            setError("Invalid username or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <header>
            <div className="wrapper">
                <div className="cta">
                    <h1>Teacher Log In</h1>

                    {error && <p className="error-message">{error}</p>}

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <p>If you can't log in, please contact us!</p>
                        <button type="submit" className="THome-btn" disabled={loading}>
                            {loading ? "Logging in..." : "Log In"}
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
};

export default Header2;

