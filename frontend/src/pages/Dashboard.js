/**
 * Dashboard Page Component
 * 
 * Unified dashboard showing quiz options, user stats, and leaderboard.
 * Requires authentication.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCall, API_URL } from '../api';

function Dashboard() {
  // State for user, scores, quizzes, and leaderboard
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
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
        
        // Get quizzes
        const quizData = await apiCall('/api/quiz/questions');
        setQuizzes(quizData.quizzes || []);
        
        // Get leaderboard
        const leaderboardData = await apiCall('/api/leaderboard/');
        setLeaderboard(leaderboardData.leaderboard || []);
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
        <h1>
          Hello there, <span className="dashboard-username">{user.username}</span>!
        </h1>
        <p className="text-secondary">
          Role: <strong>{user.role}</strong>
        </p>
        <div className="dashboard-actions mt-md">
          {((user.role === 'Teacher') || (user.role === 'Developer')) && (
            <Link 
              to="/admin" 
              className="btn-secondary"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              Go to Admin Dashboard
            </Link>
          )}
          <a href={`${API_URL}/auth/logout`} className="btn-secondary logout-link">
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

      {/* Available Quizzes */}
      <section className="mt-lg">
        <h2>Available Quizzes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <h3>{quiz.title}</h3>
              <p>{quiz.description}</p>
              <p className="text-secondary">
                {quiz.questions?.length || 0} questions • {quiz.category}
              </p>
              <Link 
                to={`/quiz/${quiz.id}`} 
                className="btn-primary"
                style={{ textDecoration: 'none', display: 'inline-block', marginTop: '1rem' }}
              >
                Start Quiz
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="mt-lg">
        <h2>🏆 Leaderboard</h2>
        {leaderboard.length === 0 ? (
          <div className="card">
            <p>No scores yet. Be the first to take a quiz!</p>
          </div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Rank</th>
                <th>Player</th>
                <th style={{ width: '150px' }}>Role</th>
                <th style={{ width: '150px' }}>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.rank} className={user && entry.username === user.username ? 'highlight-row' : ''}>
                  <td>
                    <span className={`rank-badge ${entry.rank <= 3 ? `rank-${entry.rank}` : ''}`}>
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                    </span>
                  </td>
                  <td>
                    <strong>{entry.username}</strong>
                    {user && entry.username === user.username && <span style={{ color: '#ef6c00', marginLeft: '0.5rem' }}>← You</span>}
                  </td>
                  <td>
                    <span className="role-badge">{entry.role}</span>
                  </td>
                  <td>
                    <strong>{entry.total_points}</strong> pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
