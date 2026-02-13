/**
 * Leaderboard Page Component
 * 
 * Shows personal stats at the top and the top 10 high scores globally below.
 * Displays only public info (username and points).
 */
import { useState, useEffect } from 'react';
import { apiCall, API_URL } from '../api';

function Leaderboard() {
  // State
  const [leaderboard, setLeaderboard] = useState([]);
  const [user, setUser] = useState(null);
  const [userScores, setUserScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load leaderboard and user data on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Get global leaderboard
        const data = await apiCall('/api/leaderboard/');
        setLeaderboard(data.leaderboard || []);
        
        // Try to get current user and their scores
        try {
          const userData = await apiCall('/auth/me');
          setUser(userData);
          
          const scoreData = await apiCall(`/api/leaderboard/user/${userData.username}`);
          setUserScores(scoreData.scores || []);
        } catch {
          // Not logged in - that's okay
          setUser(null);
        }
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
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
      </div>
    );
  }

  /**
   * Get the CSS class for rank badge
   */
  function getRankClass(rank) {
    if (rank === 1) return 'rank-badge rank-1';
    if (rank === 2) return 'rank-badge rank-2';
    if (rank === 3) return 'rank-badge rank-3';
    return 'rank-badge';
  }

  /**
   * Get emoji for top 3 ranks
   */
  function getRankEmoji(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  }

  // Calculate user's total points and rank
  const userTotalPoints = userScores.reduce((sum, s) => sum + s.score, 0);
  const userRank = user ? leaderboard.findIndex(entry => entry.username === user.username) + 1 : 0;

  return (
    <div>
      {/* Personal Stats - Only show if logged in */}
      {user && (
        <div className="card text-center mb-lg">
          <h2>Your Stats</h2>
          <div className="admin-stats mt-md">
            <div className="stat-card">
              <div className="stat-value">{userTotalPoints}</div>
              <div className="stat-label">Total Points</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{userScores.length}</div>
              <div className="stat-label">Quizzes Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {userRank > 0 ? (userRank <= 3 ? getRankEmoji(userRank) : `#${userRank}`) : 'Unranked'}
              </div>
              <div className="stat-label">Global Rank</div>
            </div>
          </div>
          {userRank === 0 && userScores.length === 0 && (
            <p className="text-secondary mt-md">
              Complete some quizzes to appear on the leaderboard!
            </p>
          )}
        </div>
      )}

      {/* Not logged in message */}
      {!user && (
        <div className="card text-center mb-lg">
          <h2>Your Stats</h2>
          <p className="text-secondary mt-md">
            <a href={`${API_URL}/auth/login`} className="github-login" style={{ display: 'inline-flex' }}>
              <svg className="github-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Login with GitHub
            </a>
            {' '}to track your personal stats
          </p>
        </div>
      )}

      {/* Header */}
      <div className="card text-center mb-lg">
        <h1>🏆 Global Leaderboard</h1>
        <p className="text-secondary">
          Top 10 quiz champions by total points
        </p>
      </div>

      {/* Leaderboard Table */}
      {leaderboard.length === 0 ? (
        <div className="card text-center">
          <p>No scores yet. Be the first to take a quiz!</p>
        </div>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Rank</th>
              <th>Player</th>
              <th style={{ width: '150px' }}>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry.rank}>
                <td>
                  <span className={getRankClass(entry.rank)}>
                    {getRankEmoji(entry.rank)}
                  </span>
                </td>
                <td>
                  <strong>{entry.username}</strong>
                </td>
                <td>
                  <strong>{entry.total_points}</strong> pts
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Info Note */}
      <div className="card mt-lg">
        <h3>How Points Work</h3>
        <p>
          Each correct answer in a quiz earns you 1 point. 
          Your total points are the sum of all correct answers 
          across all quizzes you've completed.
        </p>
        <p className="text-secondary">
          <em>
            Note: Only your GitHub username is displayed. 
            Your private information is kept secure.
          </em>
        </p>
      </div>
    </div>
  );
}

export default Leaderboard;
