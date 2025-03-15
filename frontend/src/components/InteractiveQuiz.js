// frontend/src/components/InteractiveQuiz.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';

function InteractiveQuiz() {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Fetch the quiz from the dedicated endpoint
        const res = await axios.get('/api/employee/quizzes');
        setQuiz(res.data);
        setAnswers(Array(res.data.questions.length).fill(''));
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuiz();
  }, []);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const submitQuiz = async () => {
    try {
      const res = await axios.post('/api/employee/quizzes', {
        quizId: quiz._id,
        answers,
      });
      setFeedback(`You scored ${res.data.score}. ${res.data.passed ? 'Passed' : 'Failed'}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (!quiz) return <div>Loading quiz...</div>;

  return (
    <div>
      <h2>{quiz.moduleTitle || "Quiz"}</h2>
      {quiz.questions.map((q, index) => (
        <div key={index}>
          <p>{q.text}</p>
          {q.options.map((option, i) => (
            <div key={i}>
              <input
                type="radio"
                name={`question-${index}`}
                value={option}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />{' '}
              {option}
            </div>
          ))}
        </div>
      ))}
      <button onClick={submitQuiz}>Submit Quiz</button>
      {feedback && <p>{feedback}</p>}
    </div>
  );
}

export default InteractiveQuiz;
