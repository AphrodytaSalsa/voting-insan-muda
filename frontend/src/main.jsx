import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Welcome from './Welcome.jsx'
import App from './App.jsx'
import Results from './Results.jsx'
import LoginResults from './LoginResults.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/voting" element={<App />} />
        <Route path="/login-results" element={<LoginResults />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
