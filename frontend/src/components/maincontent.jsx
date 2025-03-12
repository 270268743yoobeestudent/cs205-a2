import React from 'react';

const MainContent = ({ content }) => {
  return (
    <main style={{ padding: '20px', flex: 1 }}>
      {content}
    </main>
  );
};

export default MainContent;
