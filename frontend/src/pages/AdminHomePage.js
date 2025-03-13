import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminHomePage.css';
import '../assets/logo.png';

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
        <Link to="/admin/reports">
          <button className="btn">Reports</button>
        </Link>
        <Link to="/admin/add-user">
          <button className="btn">Add User</button>
        </Link>
      </div>
    </div>
  );
}

export default AdminHomePage;
