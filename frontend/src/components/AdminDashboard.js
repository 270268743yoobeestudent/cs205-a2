// frontend/src/components/AdminDashboard.js
import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmployeeManagement from './EmployeeManagement';
import ModuleManagement from './ModuleManagement';
import QuizManagement from './QuizManagement';
import ReportGenerator from './ReportGenerator';
import '../styles/AdminDashboard.css';


function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optionally call the logout endpoint to destroy the session on the server
      await axios.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    // Clear user data and navigate back to login
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <nav>
        <ul>
          <li>
            <Link to="/admin/employees">Employee Management</Link>
          </li>
          <li>
            <Link to="/admin/modules">Module Management</Link>
          </li>
          <li>
            <Link to="/admin/quizzes">Quiz Management</Link>
          </li>
          <li>
            <Link to="/admin/reports">Report Generation</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="employees" element={<EmployeeManagement />} />
        <Route path="modules" element={<ModuleManagement />} />
        <Route path="quizzes" element={<QuizManagement />} />
        <Route path="reports" element={<ReportGenerator />} />
        <Route path="/" element={<h3>Welcome to Admin Dashboard</h3>} />
      </Routes>
    </div>
  );
}

export default AdminDashboard;
