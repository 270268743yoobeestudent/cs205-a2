// frontend/src/components/EmployeeDashboard.js
import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TrainingModuleViewer from './TrainingModuleViewer';
import EmployeeQuizList from './EmployeeQuizList';
import EmployeeQuizAttempt from './EmployeeQuizAttempt';
import PersonalProgress from './PersonalProgress';
import '../styles/styles.css';

function EmployeeDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout error:', err);
    }
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
            <Link to="/employee/quiz">Quizzes</Link>
          </li>
          <li>
            <Link to="/employee/progress">My Progress</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="modules" element={<TrainingModuleViewer />} />
        <Route path="quiz" element={<EmployeeQuizList />} />
        <Route path="quiz/:quizId" element={<EmployeeQuizAttempt />} />
        <Route path="progress" element={<PersonalProgress />} />
        <Route path="/" element={<h3>Welcome to Employee Dashboard</h3>} />
      </Routes>
    </div>
  );
}

export default EmployeeDashboard;
