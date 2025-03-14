import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/GlobalStyles.css';
import '../styles/WelcomePage.css';
import logo from '../assets/logo.png'; // Import the logo

function WelcomePage() {
  return (
    <div className="welcome-page">
      {/* Logo at the top */}
      <div className="logo-container">
        <img src={logo} alt="Cyberwise Logo" className="logo" />
      </div>

      {/* Main content */}
      <div className="welcome-content">
        <h1>Welcome To <span className="highlight">Cyberwise</span></h1>
        <h2>Your Cybersecurity Training Hub</h2>
        
        <p className="description">
          Learn essential cybersecurity skills to protect your digital world.
        </p>

        {/* Buttons */}
        <div className="button-container">
          <Link to="/login">
            <button className="btn">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
