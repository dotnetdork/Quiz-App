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
 * Navigation Component
 * Shows the top navigation bar
 */
function Navigation() {
  return (
    <nav className="nav">
      {/* Brand/Logo */}
      <Link to="/" className="nav-brand">
        📚 Quiz App
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
    </BrowserRouter>
  );
}

export default App;
