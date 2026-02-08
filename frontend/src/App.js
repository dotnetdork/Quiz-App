/**
 * Main App Component
 * 
 * This is the root component for the Quiz App.
 * It sets up routing and provides the main layout.
 */
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import page components
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';

/**
 * League Logo Component
 * Displays the League logo image with a fallback to an SVG icon
 */
function LeagueLogo({ className, size = 40 }) {
  const [imageError, setImageError] = useState(false);
  
  // External League logo URL
  const logoUrl = "https://www.jointheleague.org/_astro/flag-girl.DP40BSEm_2jGMpO.webp";
  
  if (imageError) {
    // Fallback SVG logo - stylized "L" with code brackets
    return (
      <svg 
        className={className}
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="League of Amazing Programmers Logo"
      >
        <rect width="40" height="40" rx="6" fill="#ef6c00"/>
        <path d="M10 12L16 20L10 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M30 12L24 20L30 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="20" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">L</text>
      </svg>
    );
  }
  
  return (
    <img 
      src={logoUrl}
      alt="League of Amazing Programmers Logo" 
      className={className}
      style={{ height: size, width: 'auto' }}
      onError={() => setImageError(true)}
    />
  );
}

/**
 * Navigation Component
 * Shows the top navigation bar with League logo
 */
function Navigation() {
  return (
    <nav className="nav">
      {/* Brand/Logo */}
      <Link to="/" className="nav-brand">
        <LeagueLogo className="nav-logo" size={40} />
        League Quiz
      </Link>
      
      {/* Navigation Links */}
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/leaderboard">Leaderboard</Link>
        </li>
      </ul>
    </nav>
  );
}

/**
 * Footer Component
 * Shows the footer with League branding
 */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <LeagueLogo className="footer-logo" size={50} />
        <p>© 2026 The League of Amazing Programmers</p>
        <p>
          <a href="https://www.jointheleague.org/" target="_blank" rel="noopener noreferrer">
            Visit jointheleague.org
          </a>
        </p>
      </div>
    </footer>
  );
}

/**
 * Main App Component
 */
function App() {
  return (
    <BrowserRouter>
      {/* Navigation bar */}
      <Navigation />
      
      {/* Main content area */}
      <main className="container">
        <Routes>
          {/* Home page - shows welcome and quiz list */}
          <Route path="/" element={<Home />} />
          
          {/* Dashboard - user's quiz history */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Quiz page - take a specific quiz */}
          <Route path="/quiz/:quizId" element={<Quiz />} />
          
          {/* Leaderboard - top scores */}
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* Admin page - teacher only */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      
      {/* Footer */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
