// frontend/src/components/PersonalProgress.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PersonalProgress() {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get('/api/employee/progress');
        setProgress(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProgress();
  }, []);

  return (
    <div>
      <h2>My Progress</h2>
      {progress.map((p, index) => (
        <div key={index}>
          <h3>
            Module: {p.moduleId ? p.moduleId.title : 'Module data not available'}
          </h3>
          <p>Completed: {p.completionStatus ? 'Yes' : 'No'}</p>
          <p>Quiz Attempts: {p.quizResults ? p.quizResults.length : 0}</p>
        </div>
      ))}
    </div>
  );
}

export default PersonalProgress;
