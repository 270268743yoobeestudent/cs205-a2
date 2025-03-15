// frontend/src/components/EmployeeQuizAttempt.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EmployeeQuizAttempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`/api/employee/quizzes/${quizId}`, { withCredentials: true });
        setQuiz(res.data);
        setAnswers(Array(res.data.questions.length).fill(''));
      } catch (err) {
        console.error('Error fetching quiz:', err.response ? err.response.data : err.message);
        setMessage('Error fetching quiz');
      }
    };
    fetchQuiz();
  }, [quizId]);

  if (!quiz) return <p>Loading quiz...</p>;

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/employee/quizzes', { quizId, answers }, { withCredentials: true });
      setResult(res.data);
      setSubmitted(true);
      setMessage('');
    } catch (err) {
      console.error('Error submitting quiz:', err.response ? err.response.data : err.message);
      setMessage('Error submitting quiz');
    }
  };

  if (submitted) {
    return (
      <div>
        <h2>Quiz Result</h2>
        <p>Score: {result.score}</p>
        <p>{result.passed ? "Passed" : "Failed"}</p>
        <button onClick={() => navigate('/employee/quiz')}>Back to Quiz List</button>
      </div>
    );
  }

  return (
    <div>
      <h2>{quiz.title || 'Quiz'}</h2>
      <p>Module: {quiz.moduleId?.title || 'N/A'}</p>
      <form onSubmit={handleSubmitQuiz}>
        {quiz.questions.map((question, index) => (
          <div key={index}>
            <p>{question.text}</p>
            {question.options.map((option, idx) => (
              <div key={idx}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={answers[index] === option}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  required
                />
                <label>{option}</label>
              </div>
            ))}
          </div>
        ))}
        <button type="submit">Submit Quiz</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default EmployeeQuizAttempt;
