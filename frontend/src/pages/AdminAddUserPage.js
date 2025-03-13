import React, { useState } from "react";
import axios from "axios";
import "../styles/GlobalStyles.css"; // Add custom styles if needed
import "../styles/AdminAddUserPage.css";

function AdminAddUserPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    role: "employee", // Default role
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/admin/users", formData, {
        withCredentials: true,
      });
      setSuccessMessage(`User ${response.data.data.firstName} ${response.data.data.lastName} added successfully!`);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        role: "employee",
        password: "",
      });
      setErrorMessage(""); // Clear any errors
    } catch (err) {
      console.error("Error adding user:", err.response?.data || err.message);
      setErrorMessage(err.response?.data?.message || "Failed to add user. Please try again.");
    }
  };

  return (
    <div className="admin-add-user-page">
      <h1>Add a New User</h1>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}

export default AdminAddUserPage;
