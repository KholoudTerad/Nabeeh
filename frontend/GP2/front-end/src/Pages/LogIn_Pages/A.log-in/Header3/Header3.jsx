import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../../Config/firebaseConfig"; // Ensure correct imports
import { ref, get } from "firebase/database";
import "./Header3.css";

const Header3 = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Fetch all users from Realtime Database
            const usersRef = ref(db, "users");
            const snapshot = await get(usersRef);

            if (!snapshot.exists()) {
                setError("No users found in database.");
                return;
            }

            const usersData = snapshot.val();
            let foundUser = null;

            // Loop through users and match the username
            Object.entries(usersData).forEach(([uid, user]) => {
                if (user.Username.toLowerCase() === username.toLowerCase()) {
                    foundUser = { uid, ...user };
                }
            });

            if (!foundUser) {
                setError("Username not found.");
                return;
            }

            console.log("Found User:", foundUser); // Debugging
            console.log("User Email:", foundUser?.email); // Debugging

            const { email, role, uid } = foundUser;

            if (!email) {
                setError("Error: No email found for this user.");
                return;
            }

            if (role !== "admin") {
                setError("Access denied! Only admins can log in.");
                return;
            }

            // Authenticate using email & password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            if (userCredential.user.uid === uid) {
                console.log("Login successful!");
                navigate("/AdminHome");
            } else {
                setError("Authentication failed.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Invalid username or password.");
        }
    };

    return (
        <header>
            <div className="wrapper">
                <div className="cta">
                    <h1>Admin Log In</h1>

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
                        <button type="submit" className="AHome-btn">Log In</button>
                    </form>
                </div>
            </div>
        </header>
    );
};

export default Header3;
