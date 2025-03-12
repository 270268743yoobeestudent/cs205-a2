import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Validate session by calling the backend
        const response = await axios.get("http://localhost:5000/api/auth/session", {
          withCredentials: true, // Ensure session cookies are sent
        });

        console.log("Session validation response:", response.data); // Debugging

        setIsAuthenticated(true);
        setUserRole(response.data.role); // Set user role based on session
      } catch (err) {
        console.error("Session validation failed:", err.response?.data || err.message);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    checkSession();
  }, []);

  if (loading) return <div>Loading...</div>; // Optional loading spinner
  if (!isAuthenticated) return <Navigate to="/login" />; // Redirect to login if not authenticated
  if (!allowedRoles.includes(userRole)) return <Navigate to="/" />; // Redirect if role not allowed

  return children; // Render protected children if authenticated and role matches
};

export default ProtectedRoute;
