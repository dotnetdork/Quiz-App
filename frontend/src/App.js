/**
 * Main App Component
 * 
 * This is the root component for the Quiz App.
 * It sets up routing and provides the main layout.
 */
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import page components
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';

/**
 * App Logo Component
 * Displays an orange square with a zap (lightning bolt) symbol
 */
function AppLogo({ className, size = 40 }) {
  return (
    <svg 
      className={className}
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Quiz-App Logo"
    >
      {/* Orange square background */}
      <rect width="40" height="40" rx="4" fill="#ef6c00"/>
      {/* Zap/Lightning bolt symbol */}
      <path 
        d="M22 6L10 22H18L16 34L30 18H22L24 6H22Z" 
        fill="white" 
        stroke="white" 
        strokeWidth="1" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Navigation Component
 * Shows the top navigation bar with Quiz-App logo
 */
function Navigation() {
  return (
    <nav className="nav">
      {/* Brand/Logo */}
      <Link to="/" className="nav-brand">
        <AppLogo className="nav-logo" size={40} />
        Quiz-App
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
 * Shows the footer with Quiz-App branding
 */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
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
          
          {/* Leaderboard - all scores */}
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
