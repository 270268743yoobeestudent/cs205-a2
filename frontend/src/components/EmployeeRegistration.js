// frontend/src/components/EmployeeRegistration.js
import React, { useState } from 'react';
import axios from 'axios';

function EmployeeRegistration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegistration = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/employees', { username, password });
      setMessage('Employee registered successfully.');
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error(error);
      setMessage('Error registering employee.');
    }
  };

  return (
    <div>
      <h2>Register New Employee</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleRegistration}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register Employee</button>
      </form>
    </div>
  );
}

export default EmployeeRegistration;
