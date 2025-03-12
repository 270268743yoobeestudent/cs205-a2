import React from 'react';

const Sidebar = ({ navigate }) => {
  return (
    <aside style={{ padding: '10px', backgroundColor: '#f4f4f4', height: '100vh', width: '200px' }}>
      <ul>
        <li onClick={() => navigate('training')}>Training Modules</li>
        <li onClick={() => navigate('quizzes')}>Quizzes</li>
        <li onClick={() => navigate('reports')}>Admin Reports</li>
        <li onClick={() => navigate('progress')}>Progress Tracking</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
