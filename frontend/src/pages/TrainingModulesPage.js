import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/GlobalStyles.css";
import '../styles/TrainingModules.css';


function TrainingModulesPage() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all training modules on page load
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/modules", {
          withCredentials: true, // Include authentication cookies
        });
        setModules(response.data.data);
      } catch (err) {
        setError("Failed to load training modules.");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // Handle deleting a module
  const handleDelete = async (moduleId) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      try {
        await axios.delete(`http://localhost:5000/api/modules/${moduleId}`, {
          withCredentials: true, // Include authentication cookies
        });
        setModules(modules.filter((module) => module._id !== moduleId)); // Remove module from UI
        alert("Module deleted successfully!");
      } catch (error) {
        alert("Failed to delete module.");
      }
    }
  };

  if (loading) return <div>Loading modules...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="training-modules-page">
      <h1>Training Modules</h1>

      {/* Add Module Button for Admins */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Link to="/admin/add-module">
          <button className="add-module-button">Add New Module</button>
        </Link>
      </div>

      <div className="modules-container">
        {modules.map((module) => (
          <div className="module-box" key={module._id}>
            <h2>{module.title}</h2>
            <p>{module.description}</p>
            <div className="module-actions">
              <Link to={`/training-modules/${module._id}`}>
                <button className="start-module-button">Start Module</button>
              </Link>
              <Link to={`/admin/edit-module/${module._id}`}>
                <button className="edit-button">Edit</button>
              </Link>
              <button
                className="delete-button"
                onClick={() => handleDelete(module._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainingModulesPage;
