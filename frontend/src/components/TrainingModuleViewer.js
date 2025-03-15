// frontend/src/components/TrainingModuleViewer.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/styles.css';

function TrainingModuleViewer() {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await axios.get('/api/employee/modules', { withCredentials: true });
      setModules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewModule = (module) => {
    setSelectedModule(module);
    setMessage('');
  };

  const handleBackToList = () => {
    setSelectedModule(null);
    setMessage('');
  };

  // Updated: includes withCredentials to send session cookies.
  const handleModuleCompleted = async () => {
    try {
      await axios.post(
        '/api/employee/modules/completed',
        { moduleId: selectedModule._id },
        { withCredentials: true }
      );
      setMessage('Module marked as completed!');
    } catch (err) {
      console.error(err);
      setMessage('Error marking module as completed');
    }
  };

  if (selectedModule) {
    return (
      <div>
        <h2>{selectedModule.title}</h2>
        {selectedModule.contentSections && selectedModule.contentSections.length > 0 ? (
          selectedModule.contentSections.map((section, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <h4>{section.header}</h4>
              <p>{section.content}</p>
            </div>
          ))
        ) : (
          <p>No content available for this module.</p>
        )}
        <button onClick={handleModuleCompleted}>Module Completed</button>
        <button onClick={handleBackToList} style={{ marginLeft: '10px' }}>Back to Modules</button>
        {message && <p>{message}</p>}
      </div>
    );
  }

  return (
    <div>
      <h2>Available Training Modules</h2>
      {modules.length === 0 ? (
        <p>No modules available.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {modules.map(module => (
            <li key={module._id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <strong>{module.title}</strong>
              <button onClick={() => handleViewModule(module)} style={{ marginLeft: '10px' }}>
                View Module
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TrainingModuleViewer;
