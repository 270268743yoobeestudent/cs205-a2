import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/GlobalStyles.css";

function AdminEditQuizPage() {
  const { id } = useParams(); // Get quiz ID from the URL
  const navigate = useNavigate();

  const [modules, setModules] = useState([]); // List of training modules
  const [title, setTitle] = useState(""); // Quiz title
  const [module, setModule] = useState(""); // Linked training module
  const [questions, setQuestions] = useState([]); // Quiz questions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch quiz details and training modules on page load
  useEffect(() => {
    const fetchQuizAndModules = async () => {
      try {
        // Fetch quiz details
        const quizResponse = await axios.get(`http://localhost:5000/api/quizzes/${id}`, {
          withCredentials: true,
        });
        const quiz = quizResponse.data.data;
        setTitle(quiz.title);
        setModule(quiz.module._id); // Pre-select the linked module
        setQuestions(quiz.questions);

        // Fetch training modules
        const modulesResponse = await axios.get("http://localhost:5000/api/modules", {
          withCredentials: true,
        });
        setModules(modulesResponse.data.data);
      } catch (err) {
        setError("Failed to load quiz details or training modules.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAndModules();
  }, [id]);

  // Handle updating a question dynamically
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "options") {
      updatedQuestions[index].options = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  // Handle form submission to update the quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const response = await axios.put(
        `http://localhost:5000/api/quizzes/${id}`,
        { module, title, questions },
        { withCredentials: true }
      );
      setSuccess("Quiz updated successfully!");
      setTimeout(() => navigate("/quizzes"), 2000); // Redirect to quizzes after success
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update quiz.");
    }
  };

  if (loading) return <div>Loading quiz details...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-edit-quiz-page">
      <h1>Edit Quiz</h1>
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Quiz Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="module">Link to Training Module:</label>
        <select
          id="module"
          value={module}
          onChange={(e) => setModule(e.target.value)}
          required
        >
          <option value="">Select a module</option>
          {modules.map((mod) => (
            <option key={mod._id} value={mod._id}>
              {mod.title}
            </option>
          ))}
        </select>

        <label>Questions:</label>
        {questions.map((q, index) => (
          <div key={index} className="question-container">
            <input
              type="text"
              placeholder={`Question ${index + 1}`}
              value={q.question}
              onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
              required
            />
            <div className="options-container">
              {q.options.map((option, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  placeholder={`Option ${optIndex + 1}`}
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...q.options];
                    updatedOptions[optIndex] = e.target.value;
                    handleQuestionChange(index, "options", updatedOptions);
                  }}
                  required
                />
              ))}
            </div>
            <label>
              Correct Answer (0-3):
              <input
                type="number"
                min="0"
                max="3"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(index, "correctAnswer", parseInt(e.target.value))}
                required
              />
            </label>
          </div>
        ))}
        <button type="submit">Update Quiz</button>
      </form>
    </div>
  );
}

export default AdminEditQuizPage;
