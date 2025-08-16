import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Translation system initialization moved to App.tsx

// Optimized rendering
const root = createRoot(document.getElementById("root")!)
root.render(<App />);
