import React from 'react';
import { Link } from 'react-router-dom';  // ✅ Import Link
import './Header.css';

const Header = () => {
    return (
        <header>          
            <div className="wrapper">
                <div className="cta1">                
                    <p className="course-name">AI insights for better learning</p>
                    <h1>Take Your Teaching to the Next Level!</h1>
                    <Link to="/start" className="start-btn"> Start </Link>  {/* ✅ Use Link */}
                    <Link to="/admin" className="admin-link">Admin Log-In</Link>
                </div>
            </div> 
        </header>
    );
}

export default Header;
