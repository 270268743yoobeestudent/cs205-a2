// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './components/Welcome';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';

function App() {
  const [user, setUser] = useState(null);

  // On mount, load the user from localStorage
  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Welcome page as the default route */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        {user && user.role === 'admin' && (
          <Route path="/admin/*" element={<AdminDashboard />} />
        )}
        {user && user.role === 'employee' && (
          <Route path="/employee/*" element={<EmployeeDashboard />} />
        )}
        {/* Fallback route: if no match, navigate to the welcome page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
