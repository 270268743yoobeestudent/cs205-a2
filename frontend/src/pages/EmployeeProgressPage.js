import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/GlobalStyles.css";
import "../styles/EmployeeProgressPage.css";

function EmployeeProgressPage() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        console.log("Fetching employee progress...");
        const response = await axios.get("http://localhost:5000/api/users/me/progress", {
          withCredentials: true,
        });
        console.log("Progress data fetched:", response.data);
        setProgress(response.data.data);
      } catch (err) {
        console.error("Error fetching progress:", err.response?.data || err.message);
        setError("Failed to load progress. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) return <div className="loading">⏳ Loading your progress...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="employee-progress-page">
      <h1>📊 My Progress</h1>

      <div className="progress-summary">
        <p>
          <strong>Modules Completed:</strong> {progress?.completedModules?.length || 0} /{" "}
          {progress?.totalModules || 0}
        </p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(progress?.completedModules?.length / progress?.totalModules) * 100}%`,
            }}
          ></div>
        </div>
        <p>
          <strong>Average Quiz Score:</strong>{" "}
          {progress?.averageQuizScore ? `${progress.averageQuizScore}%` : "N/A"}
        </p>
      </div>

      {/* Completed Modules */}
      <div className="module-section">
        <h2>✅ Completed Modules</h2>
        {progress?.completedModules?.length > 0 ? (
          <ul className="module-list">
            {progress.completedModules.map((module) => (
              <li key={module._id} className="completed">{module.title}</li>
            ))}
          </ul>
        ) : (
          <p>No modules completed yet.</p>
        )}
      </div>

      {/* Remaining Modules */}
      <div className="module-section">
        <h2>📌 Modules Remaining</h2>
        {progress?.remainingModules?.length > 0 ? (
          <ul className="module-list">
            {progress.remainingModules.map((module) => (
              <li key={module._id} className="remaining">{module.title}</li>
            ))}
          </ul>
        ) : (
          <p>All modules completed! 🎉</p>
        )}
      </div>

      {/* Quiz Scores */}
      <div className="module-section">
        <h2>📝 Quiz Scores</h2>
        {progress?.quizScores?.length > 0 ? (
          <ul className="module-list">
            {progress.quizScores.map((quiz, index) => (
              <li key={index}>
                <strong>{quiz.title}</strong> - Score: <span className="score">{quiz.score}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No quiz scores available.</p>
        )}
      </div>
    </div>
  );
}

export default EmployeeProgressPage;
