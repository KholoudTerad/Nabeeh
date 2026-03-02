import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav>
      <a href="#" className = "logot">Nabeeh</a>

      <ul>
        <li>
          <a href="#contact-section" className="nav-link">Contact Us</a>
        </li>

        <li>
          <a href="#about-section" className="nav-link">About Us</a>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
