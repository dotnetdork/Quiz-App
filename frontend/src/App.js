/**
 * Main App Component
 * 
 * This is the root component for the Quiz App.
 * It sets up routing and provides the main layout.
 */
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

// Import page components
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import ProtectedRoute from './components/ProtectedRoute';
import ClickParticles from './components/ClickParticles';

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
          <Link to="/dashboard">Dashboard</Link>
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
      <AppContent />
    </BrowserRouter>
  );
}

/**
 * AppContent - Handles conditional rendering of nav/footer based on route
 */
function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <>
      {/* Global click particle effects - disabled on login page */}
      {!isLoginPage && <ClickParticles />}
      
      {/* Navigation bar - hide on login page */}
      {!isLoginPage && <Navigation />}
      
      {/* Main content area */}
      <main className={isLoginPage ? '' : 'container'}>
        <Routes>
          {/* Login page - centered login with no nav/footer */}
          <Route path="/" element={<Login />} />
          
          {/* Dashboard - user's quiz history and quiz browsing */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Quiz page - take a specific quiz */}
          <Route path="/quiz/:quizId" element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      {/* Footer - hide on login page */}
      {!isLoginPage && <Footer />}
    </>
  );
}

export default App;
