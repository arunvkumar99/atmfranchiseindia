import { createRoot } from 'react-dom/client'
import React from 'react'

// Minimal app for testing
const MinimalApp = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>React is Working!</h1>
      <p>If you can see this, the app is rendering.</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

// Try to render
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<MinimalApp />);
} else {
  if (import.meta.env.DEV) { console.error('Root element not found!'); }
}