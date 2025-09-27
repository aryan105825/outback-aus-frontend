import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'leaflet/dist/leaflet.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Landing.tsx";
import Dashboard from "./App";
import { ThemeProvider, createTheme } from '@mui/material';
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme} />
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>  </StrictMode>,
)
