import React, { useState } from "react";
import axios from "axios";
import "../styles/GlobalStyles.css"; // Add styling here if needed

function AdminAddModulePage() {
  const [title, setTitle] = useState(""); // Training module title
  const [description, setDescription] = useState(""); // Training module description
  const [content, setContent] = useState([{ heading: "", body: "" }]); // List of content sections
  const [success, setSuccess] = useState(""); // Success message
  const [error, setError] = useState(""); // Error message

  // Update content sections dynamically
  const handleContentChange = (index, field, value) => {
    const updatedContent = [...content];
    updatedContent[index][field] = value;
    setContent(updatedContent);
  };

  // Add a new section for the content
  const handleAddSection = () => {
    setContent([...content, { heading: "", body: "" }]);
  };

  // Submit the form to the backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess("");
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/modules",
        { title, description, content },
        { withCredentials: true } // Include session cookies
      );
      setSuccess("Module created successfully!");
      setTitle("");
      setDescription("");
      setContent([{ heading: "", body: "" }]); // Reset form
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create training module.");
    }
  };

  return (
    <div className="admin-add-module-page">
      <h1>Add a New Training Module</h1>
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

        <button type="submit">Create Module</button>
      </form>
    </div>
  );
}

export default AdminAddModulePage;
