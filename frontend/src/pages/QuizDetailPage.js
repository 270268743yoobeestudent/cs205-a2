import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/GlobalStyles.css";
import "../styles/QuizDetailPage.css";

function QuizDetailPage() {
  const { id } = useParams(); // Get quiz ID from the URL
  const [quiz, setQuiz] = useState(null); // Quiz details
  const [answers, setAnswers] = useState([]); // User's answers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // Quiz result after submission

  // Fetch quiz details by ID
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quizzes/${id}`, {
          withCredentials: true,
        });
        setQuiz(response.data.data);
        setAnswers(Array(response.data.data.questions.length).fill(null)); // Initialize empty answers
      } catch (err) {
        setError("Failed to load quiz details.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // Handle answer selection
  const handleAnswerChange = (questionIndex, optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  // Handle quiz submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/quizzes/${id}/submit`,
        { answers },
        { withCredentials: true }
      );
      setResult(response.data.data); // Store result (score, etc.)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit quiz.");
    }
  };

  if (loading) return <div>Loading quiz...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="quiz-detail-page">
      <h1>{quiz.title}</h1>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((question, index) => (
          <div key={index} className="question-container">
            <h3>Question {index + 1}: {question.question}</h3>
            <div className="options-container">
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="option-label">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={optionIndex}
                    checked={answers[index] === optionIndex}
                    onChange={() => handleAnswerChange(index, optionIndex)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="submit-quiz-button">Submit Quiz</button>
      </form>

      {result && (
        <div className="quiz-result">
          <h2>Quiz Results</h2>
          <p>Your Score: {result.score} / {result.totalQuestions}</p>
        </div>
      )}
    </div>
  );
}

export default QuizDetailPage;
