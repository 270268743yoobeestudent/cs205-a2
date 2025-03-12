import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/GlobalStyles.css";

function AdminEditModulePage() {
  const { id } = useParams(); // Module ID from the URL
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch the module data when the page loads
  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/modules/${id}`, {
          withCredentials: true, // Include session cookies
        });
        const module = response.data.data;
        setTitle(module.title);
        setDescription(module.description);
        setContent(module.content);
      } catch (err) {
        setError("Failed to fetch the module.");
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [id]);

  // Handle content changes dynamically
  const handleContentChange = (index, field, value) => {
    const updatedContent = [...content];
    updatedContent[index][field] = value;
    setContent(updatedContent);
  };

  // Add a new section to the content
  const handleAddSection = () => {
    setContent([...content, { heading: "", body: "" }]);
  };

  // Submit the form to update the module
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess("");
    setError("");
    try {
      const response = await axios.put(
        `http://localhost:5000/api/modules/${id}`,
        { title, description, content },
        { withCredentials: true }
      );
      setSuccess("Module updated successfully!");
      setTimeout(() => navigate("/training-modules"), 2000); // Redirect after success
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update training module.");
    }
  };

  if (loading) return <div>Loading module data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-edit-module-page">
      <h1>Edit Training Module</h1>
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Content Sections:</label>
        {content.map((section, index) => (
          <div key={index} className="content-section">
            <input
              type="text"
              placeholder="Heading"
              value={section.heading}
              onChange={(e) => handleContentChange(index, "heading", e.target.value)}
              required
            />
            <textarea
              placeholder="Body"
              value={section.body}
              onChange={(e) => handleContentChange(index, "body", e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddSection}>
          Add Section
        </button>

        <button type="submit">Update Module</button>
      </form>
    </div>
  );
}

export default AdminEditModulePage;
