import React from 'react';

const TestApp = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test App - React is Working!</h1>
      <p>If you can see this message, React is mounting correctly.</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

export default TestApp;