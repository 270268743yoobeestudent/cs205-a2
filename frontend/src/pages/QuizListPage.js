import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/GlobalStyles.css";
import "../styles/QuizListPage.css";

function QuizListPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/quizzes", {
          withCredentials: true,
        });
        setQuizzes(response.data.data);
      } catch (err) {
        setError("⚠️ Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    setDeleting(quizId);

    try {
      await axios.delete(`http://localhost:5000/api/quizzes/${quizId}`, {
        withCredentials: true,
      });
      setQuizzes((prevQuizzes) => prevQuizzes.filter((q) => q._id !== quizId));
      alert("✅ Quiz deleted successfully!");
    } catch (error) {
      alert("❌ Failed to delete quiz.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="loading">⏳ Loading quizzes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="quiz-list-page">
      <h1>📚 Available Quizzes</h1>

      {/* Quiz List */}
      <div className="quizzes-container">
        {quizzes.map((quiz) => (
          <div className="quiz-box" key={quiz._id}>
            <h2>{quiz.title}</h2>
            <p>📖 Related to: {quiz.module?.title || "Unknown Module"}</p>
            <div className="quiz-actions">
              <Link to={`/quizzes/${quiz._id}`}>
                <button className="take-quiz-button">▶️ Take Quiz</button>
              </Link>
              <Link to={`/admin/edit-quiz/${quiz._id}`}>
                <button className="edit-button">✏️ Edit</button>
              </Link>
              <button
                className="delete-button"
                onClick={() => handleDelete(quiz._id)}
                disabled={deleting === quiz._id}
              >
                {deleting === quiz._id ? "⏳ Deleting..." : "🗑️ Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Move Add Quiz Button to Bottom */}
      <div className="add-quiz-container">
        <Link to="/admin/add-quiz">
          <button className="add-quiz-button">➕ Add New Quiz</button>
        </Link>
      </div>
    </div>
  );
}

export default QuizListPage;
