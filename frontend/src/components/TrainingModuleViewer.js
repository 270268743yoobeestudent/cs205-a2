// frontend/src/components/TrainingModuleViewer.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TrainingModuleViewer() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get('/api/employee/modules');
        setModules(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchModules();
  }, []);

  return (
    <div>
      <h2>Available Training Modules</h2>
      {modules.map(module => (
        <div key={module._id}>
          <h3>{module.title}</h3>
          <p>{module.content}</p>
          <p>Duration: {module.duration} minutes</p>
          {/* Optionally add a "Mark as Completed" button */}
        </div>
      ))}
    </div>
  );
}

export default TrainingModuleViewer;
