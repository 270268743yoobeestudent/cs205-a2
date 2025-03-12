import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/GlobalStyles.css";

function QuizListPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/quizzes", {
          withCredentials: true,
        });
        setQuizzes(response.data.data);
      } catch (err) {
        setError("Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <div>Loading quizzes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="quiz-list-page">
      <h1>Quizzes</h1>

      {/* Add Quiz Button for Admins */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Link to="/admin/add-quiz">
          <button className="add-quiz-button">Add New Quiz</button>
        </Link>
      </div>

      <div className="quizzes-container">
        {quizzes.map((quiz) => (
          <div className="quiz-box" key={quiz._id}>
            <h2>{quiz.title}</h2>
            <p>Related to: {quiz.module.title}</p>
            <div className="quiz-actions">
              <Link to={`/quizzes/${quiz._id}`}>
                <button className="take-quiz-button">Take Quiz</button>
              </Link>
              <Link to={`/admin/edit-quiz/${quiz._id}`}>
                <button className="edit-button">Edit</button>
              </Link>
              <button
                className="delete-button"
                onClick={async () => {
                  if (window.confirm("Are you sure you want to delete this quiz?")) {
                    try {
                      await axios.delete(`http://localhost:5000/api/quizzes/${quiz._id}`, {
                        withCredentials: true,
                      });
                      setQuizzes(quizzes.filter((q) => q._id !== quiz._id)); // Update the state
                      alert("Quiz deleted successfully!");
                    } catch (error) {
                      alert("Failed to delete quiz.");
                    }
                  }
                }}
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

export default QuizListPage;
