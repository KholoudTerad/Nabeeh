import React from 'react';
import { Link } from 'react-router-dom';  // ✅ Import Link
import './HeaderT.css';

const HeaderT = () => {
    return (
        <header>
            <div className="wrapper" id="home-section">
                <div className="Tcta" >                
                    
                    <h1>To View All My Reports</h1>
                    <Link to="/AllReportsTeacher" className="Tclick-btn"> Click Here </Link> 
                    
                </div>
            </div> 
        </header>
    );
}

export default HeaderT;
