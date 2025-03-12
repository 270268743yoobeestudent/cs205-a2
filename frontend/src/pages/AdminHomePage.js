import React from 'react';
import { Link } from 'react-router-dom';

function AdminHomePage() {
  return (
    <div className="home-page">
      <h1>Welcome, Admin!</h1>
      <div className="button-container">
        <Link to="/training-modules">
          <button className="btn">Training Modules</button>
        </Link>
        <Link to="/quizzes">
          <button className="btn">Quizzes</button>
        </Link>
        <Link to="/progress-tracking">
          <button className="btn">Progress Tracking</button>
        </Link>
        <Link to="/reports">
          <button className="btn">Reports</button>
        </Link>
      </div>
    </div>
  );
}

export default AdminHomePage;
