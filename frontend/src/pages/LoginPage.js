import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/GlobalStyles.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      // Debug: Log the login payload
      console.log("Attempting login with:", { username, password });

      // Send login request to the backend
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password },
        { withCredentials: true } // Ensure session cookies are sent
      );

      // Debug: Log the response from the backend
      console.log("Login response:", response.data);

      // Extract the user role from the response
      const role = response.data.user?.role;

      // Navigate based on user role
      if (role === "admin") {
        console.log("Redirecting to Admin Home...");
        navigate("/admin-home");
      } else if (role === "employee") {
        console.log("Redirecting to Employee Home...");
        navigate("/employee-home");
      } else {
        console.error("Unexpected user role:", role);
        setError("Unexpected user role. Please contact support.");
      }
    } catch (err) {
      // Debug: Log the error response
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
