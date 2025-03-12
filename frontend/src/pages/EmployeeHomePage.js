import React from 'react';
import { Link } from 'react-router-dom';

function EmployeeHomePage() {
  return (
    <div className="home-page">
      <h1>Welcome, Employee!</h1>
      <div className="button-container">
        <Link to="/training-modules">
          <button className="btn">Training Modules</button>
        </Link>
        <Link to="/quizzes">
          <button className="btn">Quizzes</button>
        </Link>
        <Link to="/employee-progress">
          <button className="btn">Progress Tracking</button>
        </Link>
      </div>
    </div>
  );
}

export default EmployeeHomePage;
