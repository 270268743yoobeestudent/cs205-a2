import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/GlobalStyles.css";

function AdminAddQuizPage() {
  const [modules, setModules] = useState([]); // Training modules list
  const [title, setTitle] = useState(""); // Quiz title
  const [module, setModule] = useState(""); // Linked training module
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]); // Questions array
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch training modules to link the quiz
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/modules", {
          withCredentials: true, // Include authentication cookies
        });
        setModules(response.data.data);
      } catch (err) {
        setError("Failed to load training modules.");
      }
    };

    fetchModules();
  }, []);

  // Handle adding a new question
  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  // Handle question change dynamically
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "options") {
      updatedQuestions[index].options = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/quizzes",
        { module, title, questions },
        { withCredentials: true }
      );
      setSuccess("Quiz created successfully!");
      setTimeout(() => navigate("/quizzes"), 2000); // Redirect to quizzes after success
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create quiz.");
    }
  };

  return (
    <div className="admin-add-quiz-page">
      <h1>Create New Quiz</h1>
      {error && <div className="error-message">{error}</div>}
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
        <button type="button" onClick={handleAddQuestion}>
          Add Another Question
        </button>
        <button type="submit">Create Quiz</button>
      </form>
    </div>
  );
}

export default AdminAddQuizPage;
