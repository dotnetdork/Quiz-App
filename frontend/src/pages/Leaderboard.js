/**
 * Leaderboard Page Component
 * 
 * Shows the top 10 high scores globally.
 * Displays only public info (username and points).
 */
import { useState, useEffect } from 'react';
import { apiCall } from '../api';

function Leaderboard() {
  // State
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load leaderboard on mount
  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await apiCall('/api/leaderboard/');
        setLeaderboard(data.leaderboard || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadLeaderboard();
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

  return (
    <div>
      {/* Header */}
      <div className="card text-center mb-lg">
        <h1>🏆 Leaderboard</h1>
        <p className="text-secondary">
          All quiz champions ranked by total points
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
              <th style={{ width: '150px' }}>Role</th>
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
