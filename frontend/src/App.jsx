import React, { useState } from 'react';
import Header from './components/header';
import Footer from './components/footer';
import Sidebar from './components/sidebar';
import MainContent from './components/maincontent';

import TrainingModules from './pages/TrainingModules';
import Quizzes from './pages/Quizzes';
import AdminReports from './pages/AdminReports';
import ProgressTracking from './pages/ProgressTracking';

const App = () => {
  const [page, setPage] = useState('training');

  const renderPage = () => {
    switch (page) {
      case 'training':
        return <TrainingModules />;
      case 'quizzes':
        return <Quizzes />;
      case 'reports':
        return <AdminReports />;
      case 'progress':
        return <ProgressTracking />;
      default:
        return <TrainingModules />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar navigate={setPage} />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Header />
        <MainContent content={renderPage()} />
        <Footer />
      </div>
    </div>
  );
};

export default App;
