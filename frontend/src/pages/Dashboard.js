/**
 * Dashboard Page Component
 * 
 * Shows the user's quiz history and scores.
 * Requires authentication.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCall, API_URL } from '../api';

function Dashboard() {
  // State for user and scores
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Get current user
        const userData = await apiCall('/auth/me');
        setUser(userData);
        
        // Get user's scores
        const scoreData = await apiCall(`/api/leaderboard/user/${userData.username}`);
        setScores(scoreData.scores || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (error || !user) {
    return (
      <div className="text-center mt-lg">
        <h2>Please Log In</h2>
        <p>You need to log in to view your dashboard.</p>
        <a href={`${API_URL}/auth/login`} className="github-login mt-md" style={{ display: 'inline-flex' }}>
          Login with GitHub
        </a>
      </div>
    );
  }

  // Calculate total points
  const totalPoints = scores.reduce((sum, s) => sum + s.score, 0);

  return (
    <div>
      {/* User Info Header */}
      <div className="card text-center">
        <h1>Welcome, {user.username}!</h1>
        <p className="text-secondary">
          Role: <strong>{user.role}</strong>
        </p>
        {((user.role === 'Teacher') || (user.role === 'Developer')) && (
          <Link 
            to="/admin" 
            className="btn-secondary mt-sm"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            Go to Admin Dashboard
          </Link>
        )}
        <div className="mt-md">
          <a href={`${API_URL}/auth/logout`} className="btn-secondary">
            Logout
          </a>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="admin-stats mt-lg">
        <div className="stat-card">
          <div className="stat-value">{totalPoints}</div>
          <div className="stat-label">Total Points</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{scores.length}</div>
          <div className="stat-label">Quizzes Completed</div>
        </div>
      </div>

      {/* Quiz History */}
      <section className="mt-lg">
        <h2>Your Quiz History</h2>
        
        {scores.length === 0 ? (
          <div className="card">
            <p>You haven't taken any quizzes yet.</p>
            <Link 
              to="/" 
              className="btn-primary mt-md"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              Browse Quizzes
            </Link>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={index}>
                  <td>{score.quiz_id}</td>
                  <td>{score.score}</td>
                  <td>{new Date(score.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Quick Links */}
      <section className="mt-lg">
        <h2>Quick Links</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link 
            to="/" 
            className="btn-primary"
            style={{ textDecoration: 'none' }}
          >
            Take a Quiz
          </Link>
          <Link 
            to="/leaderboard" 
            className="btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            View Leaderboard
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
