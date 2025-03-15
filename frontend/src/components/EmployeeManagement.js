// frontend/src/components/EmployeeManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ username: '', password: '', role: 'employee' });
  const [editingEmployee, setEditingEmployee] = useState(null);
  // Add a password field in the edit form. This field is optional; if left blank, the password remains unchanged.
  const [editForm, setEditForm] = useState({ username: '', role: '', password: '' });
  const [message, setMessage] = useState('');

  // Fetch all users on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/api/admin/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/employees', newEmployee);
      setNewEmployee({ username: '', password: '', role: 'employee' });
      setMessage('Employee added successfully!');
      fetchEmployees();
    } catch (err) {
      console.error(err);
      setMessage('Error adding employee');
    }
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee._id);
    // Pre-fill username and role; leave password empty so admin may input a new one if desired.
    setEditForm({ username: employee.username, role: employee.role, password: '' });
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/employees/${editingEmployee}`, editForm);
      setMessage('Employee updated successfully!');
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      setMessage('Error updating employee');
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`/api/admin/employees/${id}`);
      setMessage('Employee deleted successfully!');
      fetchEmployees();
    } catch (err) {
      console.error(err);
      setMessage('Error deleting employee');
    }
  };

  return (
    <div>
      <h2>Employee Management</h2>
      {message && <p>{message}</p>}
      
      <h3>Add New Employee</h3>
      <form onSubmit={handleAddEmployee}>
        <input
          type="text"
          placeholder="Username"
          value={newEmployee.username}
          onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newEmployee.password}
          onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
          required
        />
        <select
          value={newEmployee.role}
          onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add Employee</button>
      </form>
      
      <h3>Current Users</h3>
      <ul>
        {employees.map((employee) => (
          <li key={employee._id}>
            {editingEmployee === employee._id ? (
              <form onSubmit={handleUpdateEmployee}>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  required
                />
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="password"
                  placeholder="New Password (leave blank if unchanged)"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingEmployee(null)}>Cancel</button>
              </form>
            ) : (
              <div>
                <strong>{employee.username}</strong> - Role: {employee.role}{' '}
                <button onClick={() => handleEditClick(employee)}>Edit</button>
                <button onClick={() => handleDeleteEmployee(employee._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeeManagement;
