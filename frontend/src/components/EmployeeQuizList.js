// frontend/src/components/EmployeeQuizList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

function EmployeeQuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('/api/employee/quizzes/all', { withCredentials: true });
        setQuizzes(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quizzes:', err.response ? err.response.data : err.message);
        setError('Error fetching quizzes');
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) return <p>Loading quizzes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Available Quizzes</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes available.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {quizzes.map(quiz => (
            <li key={quiz._id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <strong>{quiz.title || 'Untitled Quiz'}</strong> - Module: {quiz.moduleId?.title || 'N/A'} - Passing Score: {quiz.passingScore}
              <Link to={`/employee/quiz/${quiz._id}`} style={{ marginLeft: '10px' }}>
                <button>Attempt Quiz</button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EmployeeQuizList;
