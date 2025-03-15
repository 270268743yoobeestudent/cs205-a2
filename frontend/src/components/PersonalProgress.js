// frontend/src/components/PersonalProgress.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/styles.css';

function PersonalProgress() {
  const [modules, setModules] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all available training modules
        const modulesRes = await axios.get('/api/employee/modules', { withCredentials: true });
        // Fetch all progress records for the logged‑in user
        const progressRes = await axios.get('/api/employee/progress', { withCredentials: true });
        setModules(modulesRes.data);
        setProgressRecords(progressRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching progress data:', err.response ? err.response.data : err.message);
        setError(
          err.response && err.response.data && err.response.data.message 
            ? err.response.data.message 
            : err.message
        );
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Combine progress records into one combined object.
  // This function unions all completedModules and concatenates all quizScores.
  const combineProgress = () => {
    const combined = {
      completedModules: [],
      quizScores: []
    };
    progressRecords.forEach(record => {
      if (record.completedModules && record.completedModules.length > 0) {
        record.completedModules.forEach(mod => {
          if (!combined.completedModules.some(cm => String(cm._id) === String(mod._id))) {
            combined.completedModules.push(mod);
          }
        });
      }
      if (record.quizScores && record.quizScores.length > 0) {
        combined.quizScores = combined.quizScores.concat(record.quizScores);
      }
    });
    return combined;
  };

  const combinedProgress = combineProgress();

  // Check if a module is completed based on the combined progress
  const isModuleCompleted = (moduleId) => {
    if (combinedProgress && combinedProgress.completedModules) {
      return combinedProgress.completedModules.some(m => String(m._id) === String(moduleId));
    }
    return false;
  };

  // For quiz info: filter combined quizScores by module and then select the highest score.
  // If no quiz entry exists, return defaults.
  const getHighestQuizInfoForModule = (moduleId) => {
    if (combinedProgress && combinedProgress.quizScores && combinedProgress.quizScores.length > 0) {
      const matchingEntries = combinedProgress.quizScores.filter(qs =>
        qs.quiz && qs.quiz.moduleId && String(qs.quiz.moduleId._id) === String(moduleId)
      );
      if (matchingEntries.length > 0) {
        const highestEntry = matchingEntries.reduce((prev, curr) => {
          return curr.score > prev.score ? curr : prev;
        }, matchingEntries[0]);
        const score = highestEntry.score;
        const passing = highestEntry.quiz && highestEntry.quiz.passingScore ? highestEntry.quiz.passingScore : 0;
        return { score, result: score >= passing ? "Passed" : "Failed" };
      }
    }
    return { score: "Not attempted", result: "N/A" };
  };

  if (loading) return <p>Loading progress...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My Progress</h2>
      {modules.length === 0 ? (
        <p>No modules available.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Module</th>
              <th>Completed</th>
              <th>Quiz Score</th>
              <th>Pass/Fail</th>
            </tr>
          </thead>
          <tbody>
            {modules.map(module => {
              const completed = isModuleCompleted(module._id) ? "Yes" : "No";
              const quizInfo = getHighestQuizInfoForModule(module._id);
              return (
                <tr key={module._id}>
                  <td>{module.title}</td>
                  <td>{completed}</td>
                  <td>{quizInfo.score}</td>
                  <td>{quizInfo.result}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PersonalProgress;
