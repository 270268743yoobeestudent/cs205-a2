import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/GlobalStyles.css";

function TrainingModuleDetailPage() {
  const { id } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/modules/${id}`, {
          withCredentials: true,
        });
        setModule(response.data.data);
      } catch (err) {
        setError("Failed to load the module.");
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [id]);

  if (loading) return <div>Loading module...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!module) return <div>Module not found.</div>;

  return (
    <div className="training-module-detail-page">
      <Link to="/training-modules">
        <button className="back-button">Back to Training Modules</button>
      </Link>
      <h1>{module.title}</h1>
      <p>{module.description}</p>
      <div className="module-content">
        {module.content.map((section, index) => (
          <div key={index} className="content-section">
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainingModuleDetailPage;