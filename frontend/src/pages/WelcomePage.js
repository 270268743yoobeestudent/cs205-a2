import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/GlobalStyles.css'; // Styling for the WelcomePage
import '../styles/WelcomePage.css';

function WelcomePage() {
  return (
    <div className="welcome-page">
      {/* Logo in the top-left corner */}
      <img
        src="/logo.png" // Replace this with the path to your logo file
        alt="Cyberwise Logo"
        className="logo"
      />

      {/* Main content */}
      <div className="welcome-content">
        <h1>Welcome To Cyberwise</h1>
        <h2>Cybersecurity Training Software</h2>
        <Link to="/login">
          <button className="btn">Login</button>
        </Link>
      </div>
    </div>
  );
}

export default WelcomePage;
