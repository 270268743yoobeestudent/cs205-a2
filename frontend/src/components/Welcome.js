// frontend/src/components/Welcome.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/login');
  };

  return (
    <div className="welcome-container">
      <h1>Welcome to Cyberwise Cybersecurity Training</h1>
      <p>Enhance your skills and stay safe online.</p>
      <button onClick={handleContinue}>Continue to Login</button>
    </div>
  );
}

export default Welcome;
