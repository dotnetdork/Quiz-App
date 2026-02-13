/**
 * Enhanced Dashboard Component
 * 
 * Dynamic tabbed interface with:
 * - Quizzes tab (browse and take quizzes)
 * - History tab (user's quiz attempts)
 * - Leaderboard tab (global rankings and personal stats)
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCall, API_URL } from '../api';

// Category Icons
function PythonIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="12" fill="#3776ab"/>
      <path d="M50 15C35 15 35 25 35 25V35H52V38H28C28 38 18 37 18 52C18 67 26 67 26 67H35V57C35 57 34 47 45 47H55C55 47 65 47 65 37V25C65 25 66 15 50 15ZM42 22C44.2091 22 46 23.7909 46 26C46 28.2091 44.2091 30 42 30C39.7909 30 38 28.2091 38 26C38 23.7909 39.7909 22 42 22Z" fill="#ffd43b"/>
      <path d="M50 85C65 85 65 75 65 75V65H48V62H72C72 62 82 63 82 48C82 33 74 33 74 33H65V43C65 43 66 53 55 53H45C45 53 35 53 35 63V75C35 75 34 85 50 85ZM58 78C55.7909 78 54 76.2091 54 74C54 71.7909 55.7909 70 58 70C60.2091 70 62 71.7909 62 74C62 76.2091 60.2091 78 58 78Z" fill="#ffd43b"/>
    </svg>
  );
}

function JavaIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="12" fill="#f89820"/>
      <path d="M35 25C35 25 40 30 50 30C60 30 65 25 65 25" stroke="white" strokeWidth="4" strokeLinecap="round"/>
      <path d="M30 35H70V70C70 75 65 80 50 80C35 80 30 75 30 70V35Z" fill="white"/>
      <path d="M30 35H70V45H30V35Z" fill="#5382a1"/>
      <path d="M72 45C75 45 78 48 78 52C78 56 75 60 72 60" stroke="white" strokeWidth="4" strokeLinecap="round"/>
      <text x="50" y="68" textAnchor="middle" fill="#f89820" fontSize="16" fontWeight="bold" fontFamily="Arial">JAVA</text>
    </svg>
  );
}

function TechnologyIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="12" fill="#607d8b"/>
      <circle cx="50" cy="50" r="15" stroke="white" strokeWidth="3" fill="none"/>
      <circle cx="50" cy="50" r="6" fill="#4caf50"/>
      <line x1="50" y1="20" x2="50" y2="35" stroke="white" strokeWidth="3"/>
      <line x1="50" y1="65" x2="50" y2="80" stroke="white" strokeWidth="3"/>
      <line x1="20" y1="50" x2="35" y2="50" stroke="white" strokeWidth="3"/>
      <line x1="65" y1="50" x2="80" y2="50" stroke="white" strokeWidth="3"/>
      <circle cx="25" cy="25" r="5" fill="#4caf50"/>
      <circle cx="75" cy="25" r="5" fill="#4caf50"/>
      <circle cx="25" cy="75" r="5" fill="#4caf50"/>
      <circle cx="75" cy="75" r="5" fill="#4caf50"/>
      <line x1="30" y1="30" x2="40" y2="40" stroke="white" strokeWidth="2"/>
      <line x1="70" y1="30" x2="60" y2="40" stroke="white" strokeWidth="2"/>
      <line x1="30" y1="70" x2="40" y2="60" stroke="white" strokeWidth="2"/>
      <line x1="70" y1="70" x2="60" y2="60" stroke="white" strokeWidth="2"/>
    </svg>
  );
}

const CATEGORIES = [
  { id: 'python', name: 'Python', Icon: PythonIcon, color: '#3776ab' },
  { id: 'java', name: 'Java', Icon: JavaIcon, color: '#f89820' },
  { id: 'technology', name: 'Technology', Icon: TechnologyIcon, color: '#607d8b' }
];

function Dashboard() {
  const [activeTab, setActiveTab] = useState('quizzes');
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const userData = await apiCall('/auth/me');
        setUser(userData);
        
        const [scoreData, quizData, leaderData] = await Promise.all([
          apiCall(`/api/leaderboard/user/${userData.username}`),
          apiCall('/api/quiz/questions'),
          apiCall('/api/leaderboard/')
        ]);
        
        setScores(scoreData.scores || []);
        setQuizzes(quizData.quizzes || []);
        setLeaderboard(leaderData.leaderboard || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) {
    return <div className="loading-spinner"><p>Loading dashboard...</p></div>;
  }

  if (error || !user) {
    return (
      <div className="card text-center mt-lg">
        <h2>Please Log In</h2>
        <p>You need to log in to view your dashboard.</p>
        <a href={`${API_URL}/auth/login`} className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
          Login with GitHub
        </a>
      </div>
    );
  }

  const totalPoints = scores.reduce((sum, s) => sum + s.score, 0);
  const userRank = leaderboard.findIndex(entry => entry.username === user.username) + 1;
  const filteredQuizzes = selectedCategory
    ? quizzes.filter(quiz => quiz.category === selectedCategory)
    : [];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome, <span className="username-highlight">{user.username}</span>!</h1>
          <p className="text-secondary">Role: {user.role}</p>
        </div>
        <a href={`${API_URL}/auth/logout`} className="btn-secondary">Logout</a>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card-modern">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{totalPoints}</div>
          <div className="stat-label">Total Points</div>
        </div>
        <div className="stat-card-modern">
          <div className="stat-icon">📝</div>
          <div className="stat-value">{scores.length}</div>
          <div className="stat-label">Quizzes Completed</div>
        </div>
        <div className="stat-card-modern">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{userRank > 0 ? `#${userRank}` : '-'}</div>
          <div className="stat-label">Global Rank</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            📚 Quizzes
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📋 History
          </button>
          <button 
            className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            🏅 Leaderboard
          </button>
        </div>

        <div className="tabs-content">
          {activeTab === 'quizzes' && (
            <div className="tab-panel">
              <h2>Browse Quizzes</h2>
              <p className="text-secondary mb-md">Select a category to view available quizzes</p>
              
              <div className="category-grid-modern">
                {CATEGORIES.map((category) => {
                  const Icon = category.Icon;
                  const quizCount = quizzes.filter(q => q.category === category.id).length;
                  const isSelected = selectedCategory === category.id;
                  
                  return (
                    <div
                      key={category.id}
                      className={`category-card-modern ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                      style={{ '--category-color': category.color }}
                    >
                      <Icon size={60} />
                      <h3>{category.name}</h3>
                      <span className="quiz-badge">{quizCount} quiz{quizCount !== 1 ? 'zes' : ''}</span>
                    </div>
                  );
                })}
              </div>

              {selectedCategory && (
                <div className="quiz-list mt-lg">
                  <div className="section-header">
                    <h3>{CATEGORIES.find(c => c.id === selectedCategory)?.name} Quizzes</h3>
                    <button className="btn-link" onClick={() => setSelectedCategory(null)}>← Back</button>
                  </div>
                  
                  {filteredQuizzes.length === 0 ? (
                    <p>No quizzes available in this category.</p>
                  ) : (
                    <div className="quiz-grid">
                      {filteredQuizzes.map((quiz) => (
                        <div key={quiz.id} className="quiz-card-modern">
                          <h4>{quiz.title}</h4>
                          <p>{quiz.description}</p>
                          <div className="quiz-meta">
                            <span>📝 {quiz.questions?.length || 0} questions</span>
                          </div>
                          <Link to={`/quiz/${quiz.id}`} className="btn-primary btn-block">
                            Start Quiz →
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="tab-panel">
              <h2>Quiz History</h2>
              {scores.length === 0 ? (
                <div className="empty-state">
                  <p>📝 You haven't taken any quizzes yet.</p>
                  <button className="btn-primary" onClick={() => setActiveTab('quizzes')}>
                    Browse Quizzes
                  </button>
                </div>
              ) : (
                <table className="modern-table">
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
                        <td><strong>{score.quiz_id}</strong></td>
                        <td><span className="score-badge">{score.score} pts</span></td>
                        <td>{new Date(score.timestamp).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="tab-panel">
              <h2>🏆 Global Leaderboard</h2>
              <p className="text-secondary mb-md">Top 10 quiz champions by total points</p>
              
              {leaderboard.length === 0 ? (
                <p>No scores yet. Be the first!</p>
              ) : (
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry) => (
                      <tr key={entry.rank} className={entry.username === user.username ? 'highlight' : ''}>
                        <td>
                          <span className={`rank-badge ${entry.rank <= 3 ? `rank-${entry.rank}` : ''}`}>
                            {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                          </span>
                        </td>
                        <td>
                          <strong>{entry.username}</strong>
                          {entry.username === user.username && <span className="you-badge">You</span>}
                        </td>
                        <td><strong>{entry.total_points}</strong> pts</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
