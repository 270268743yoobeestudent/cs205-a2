import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/GlobalStyles.css";

function EmployeeProgressPage() {
  const [progress, setProgress] = useState(null); // Holds progress data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error message, if any

  // Fetch employee progress on component load
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        console.log("Fetching employee progress..."); // Debugging
        const response = await axios.get("http://localhost:5000/api/users/me/progress", {
          withCredentials: true, // Include authentication cookies if required
        });
        console.log("Progress data fetched:", response.data); // Debugging the response
        setProgress(response.data.data);
      } catch (err) {
        console.error("Error fetching progress:", err.response?.data || err.message);
        setError("Failed to load progress. Please try again later.");
      } finally {
        setLoading(false); // Stop loading once the API call completes
      }
    };

    fetchProgress();
  }, []);

  if (loading) return <div>Loading progress...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="employee-progress-page">
      <h1>My Progress</h1>
      <div className="progress-summary">
        <p>
          <strong>Modules Completed:</strong> {progress?.completedModules?.length || 0} /{" "}
          {progress?.totalModules || 0}
        </p>
        <p>
          <strong>Modules Remaining:</strong> {progress?.remainingModules?.length || 0}
        </p>
        <p>
          <strong>Average Quiz Score:</strong>{" "}
          {progress?.averageQuizScore ? `${progress.averageQuizScore}%` : "N/A"}
        </p>
      </div>
      <div className="modules-container">
        <h2>Completed Modules:</h2>
        <ul>
          {progress?.completedModules?.map((module) => (
            <li key={module._id}>{module.title}</li>
          ))}
        </ul>

        <h2>Modules Remaining:</h2>
        <ul>
          {progress?.remainingModules?.map((module) => (
            <li key={module._id}>{module.title}</li>
          ))}
        </ul>

        <h2>Quiz Scores:</h2>
        <ul>
          {progress?.quizScores?.map((quiz, index) => (
            <li key={index}>
              Quiz: {quiz.title} | Score: {quiz.score}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EmployeeProgressPage;
