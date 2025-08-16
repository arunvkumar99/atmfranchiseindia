import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/i18n' // Initialize i18n before React

// Optimized rendering
const root = createRoot(document.getElementById("root")!)
root.render(<App />);
