import { createRoot } from 'react-dom/client'
import App from './App.tsx'
// import SimpleApp from './SimpleApp.tsx'
import './index.css'
import './lib/i18n' // Initialize i18n before React

// Add error handling
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    try {
      const root = createRoot(rootElement);
      root.render(<App />);
      console.log("React app mounted successfully!");
    } catch (error) {
      console.error("Error mounting React app:", error);
      // Fallback to show error on page
      rootElement.innerHTML = `<div style="color: red; padding: 20px;">
        <h1>Error loading application</h1>
        <pre>${error}</pre>
      </div>`;
    }
  } else {
    console.error("Root element not found!");
  }
});
