import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotesPage from './pages/NotesPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Keep auth state in sync across tabs and after login/logout
  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener('storage', syncAuth);
    window.addEventListener('auth-changed', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('auth-changed', syncAuth);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/notes"
              element={isAuthenticated ? <NotesPage /> : <Navigate to="/login" />}
            />
            <Route path="/" element={<Navigate to={isAuthenticated ? '/notes' : '/login'} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
