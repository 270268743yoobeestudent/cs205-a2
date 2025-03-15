// frontend/src/components/EmployeeDashboard.js
import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TrainingModuleViewer from './TrainingModuleViewer';
import InteractiveQuiz from './InteractiveQuiz';
import PersonalProgress from './PersonalProgress';

function EmployeeDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optionally, call the backend logout endpoint to destroy the session
      await axios.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    // Clear the local storage and navigate to login
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <h2>Employee Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <nav>
        <ul>
          <li>
            <Link to="/employee/modules">Training Modules</Link>
          </li>
          <li>
            <Link to="/employee/quiz">Take Quiz</Link>
          </li>
          <li>
            <Link to="/employee/progress">My Progress</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="modules" element={<TrainingModuleViewer />} />
        <Route path="quiz" element={<InteractiveQuiz />} />
        <Route path="progress" element={<PersonalProgress />} />
        <Route path="/" element={<h3>Welcome to Employee Dashboard</h3>} />
      </Routes>
    </div>
  );
}

export default EmployeeDashboard;
