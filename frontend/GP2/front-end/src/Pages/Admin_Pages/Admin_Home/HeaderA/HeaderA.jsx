import React from 'react';
import { Link } from 'react-router-dom';  // ✅ Import Link
import './HeaderA.css';

const HeaderA = () => {
    return (
        <header>          
            <div className="wrapper">
                <div className="cta1">                
                    
                    <h1>To View All Reports!</h1>
                    <Link to="/admin/allReports" className="start-btn"> Click Here </Link>  {/* ✅ Use Link */}
                   
                </div>
            </div> 
        </header>
    );
}

export default HeaderA;

