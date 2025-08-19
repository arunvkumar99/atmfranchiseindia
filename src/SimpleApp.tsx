import React from 'react';

const SimpleApp = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#333' }}>React App is Working!</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'white', borderRadius: '5px' }}>
        <h2>Debug Info:</h2>
        <p>Window location: {window.location.href}</p>
        <p>React version: {React.version}</p>
      </div>
    </div>
  );
};

export default SimpleApp;