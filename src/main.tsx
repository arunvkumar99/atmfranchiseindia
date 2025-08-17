import { createRoot } from 'react-dom/client'
import { Suspense } from 'react'
import App from './App.tsx'
import './index.css'
import './lib/i18n' // Initialize i18n before React

// Loading component
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Optimized rendering with Suspense for i18n
const root = createRoot(document.getElementById("root")!)
root.render(
  <Suspense fallback={<Loader />}>
    <App />
  </Suspense>
);
