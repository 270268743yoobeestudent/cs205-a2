import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/GlobalStyles.css";
import "../styles/TrainingModules.css";

function TrainingModulesPage() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null); // Track which module is deleting

  // Fetch all training modules on page load
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/modules", {
          withCredentials: true, // Include authentication cookies
        });
        setModules(response.data.data);
      } catch (err) {
        setError("⚠️ Failed to load training modules. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // Handle deleting a module
  const handleDelete = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;

    setDeleting(moduleId);

    try {
      await axios.delete(`http://localhost:5000/api/modules/${moduleId}`, {
        withCredentials: true, // Include authentication cookies
      });
      setModules((prevModules) => prevModules.filter((m) => m._id !== moduleId));
      alert("✅ Module deleted successfully!");
    } catch (error) {
      alert("❌ Failed to delete module. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="loading">Loading modules...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="training-modules-page">
      <h1>📚 Training Modules</h1>

      {/* Add Module Button */}
      <div className="add-module-container">
        <Link to="/admin/add-module">
          <button className="btn btn-add-module">➕ Add New Module</button>
        </Link>
      </div>

      {/* Display Modules */}
      <div className="modules-container">
        {modules.map((module) => (
          <div className="module-box" key={module._id}>
            <h2>{module.title}</h2>
            <p>{module.description}</p>
            <div className="module-actions">
              <Link to={`/training-modules/${module._id}`}>
                <button className="btn btn-start">▶️ Start</button>
              </Link>
              <Link to={`/admin/edit-module/${module._id}`}>
                <button className="btn btn-edit">✏️ Edit</button>
              </Link>
              <button
                className="btn btn-delete"
                onClick={() => handleDelete(module._id)}
                disabled={deleting === module._id}
              >
                {deleting === module._id ? "⏳ Deleting..." : "🗑️ Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainingModulesPage;
