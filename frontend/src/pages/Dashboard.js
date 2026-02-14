/**
 * Enhanced Dashboard Component
 * 
 * Dynamic tabbed interface with:
 * - Quizzes tab (browse and take quizzes)
 * - History tab (user's quiz attempts with collapsible groups)
 * - Leaderboard tab (global rankings and personal stats)
 */
import { useState, useEffect, useRef } from 'react';
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

// Animated Skill Bar component
function AnimatedSkillBar({ skill, count, totalQuizzes, color, delay }) {
  const [width, setWidth] = useState(0);
  const percentage = (count / totalQuizzes) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  const skillLabels = {
    'python': 'Python',
    'java': 'Java',
    'technology': 'Technology'
  };

  return (
    <div className="skill-bar-container animated">
      <div className="skill-label">
        <span>{skillLabels[skill] || skill}</span>
        <span className="skill-count">{count} quiz{count !== 1 ? 'zes' : ''}</span>
      </div>
      <div className="skill-bar">
        <div 
          className="skill-bar-fill animated-fill" 
          style={{ 
            width: `${width}%`,
            backgroundColor: color,
            transition: `width 2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`
          }}
        >
          <span className="skill-percentage">{Math.round(percentage)}%</span>
        </div>
      </div>
    </div>
  );
}

// Collapsible quiz history group
function QuizHistoryGroup({ quizTitle, quizId, attempts }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const latestAttempt = attempts[0];
  const attemptCount = attempts.length;

  return (
    <div className={`history-group ${isExpanded ? 'expanded' : ''}`}>
      <div 
        className="history-group-header"
        onClick={() => attemptCount > 1 && setIsExpanded(!isExpanded)}
        style={{ cursor: attemptCount > 1 ? 'pointer' : 'default' }}
      >
        <div className="history-group-info">
          <div className="history-quiz-title">
            <strong>{quizTitle}</strong>
            {attemptCount > 1 && (
              <span className="attempt-count-badge">
                {attemptCount} attempt{attemptCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="history-latest">
            <span className="score-badge">{latestAttempt.score} pts</span>
            <span className="history-date">{new Date(latestAttempt.timestamp).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="history-group-actions">
          <Link to={`/quiz/${quizId}`} className="btn-retake" onClick={(e) => e.stopPropagation()}>
            Retake Quiz →
          </Link>
          {attemptCount > 1 && (
            <span className={`expand-icon ${isExpanded ? 'rotated' : ''}`}>
              ▼
            </span>
          )}
        </div>
      </div>
      {isExpanded && attemptCount > 1 && (
        <div className="history-group-details">
          {attempts.slice(1).map((attempt, index) => (
            <div key={index} className="history-attempt-row">
              <span className="attempt-number">Attempt {attemptCount - index - 1}</span>
              <span className="score-badge secondary">{attempt.score} pts</span>
              <span className="history-date">{new Date(attempt.timestamp).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState('quizzes');
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showProfileAnimation, setShowProfileAnimation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileRef = useRef(null);

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
        
        // Trigger profile animation after data loads
        setTimeout(() => setShowProfileAnimation(true), 100);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    setIsLoggingOut(true);
    
    // Navigate after animation completes
    setTimeout(() => {
      window.location.href = `${API_URL}/auth/logout`;
    }, 800);
  };

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

  // Get set of completed quiz IDs
  const completedQuizIds = new Set(scores.map(s => s.quiz_id));

  // Calculate skills from quiz history
  const calculateSkills = () => {
    if (!scores.length || !quizzes.length) {
      return {};
    }
    
    // Optimize: Create quiz lookup map for O(1) access instead of O(n) find
    const quizMap = Object.fromEntries(quizzes.map(q => [q.id, q]));
    
    const skillCounts = {};
    scores.forEach(score => {
      const quiz = quizMap[score.quiz_id];
      if (quiz && quiz.category) {
        const category = quiz.category;
        skillCounts[category] = (skillCounts[category] || 0) + 1;
      }
    });
    return skillCounts;
  };

  const skills = calculateSkills();
  const totalQuizzes = Object.values(skills).reduce((sum, count) => sum + count, 0);

  // Group scores by quiz for history display
  const groupedHistory = () => {
    const groups = {};
    scores.forEach(score => {
      if (!groups[score.quiz_id]) {
        groups[score.quiz_id] = [];
      }
      groups[score.quiz_id].push(score);
    });
    
    // Sort each group by timestamp (most recent first)
    Object.keys(groups).forEach(quizId => {
      groups[quizId].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    });
    
    return groups;
  };

  // Get quiz title by ID
  const getQuizTitle = (quizId) => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz ? quiz.title : quizId;
  };

  const historyGroups = groupedHistory();

  return (
    <div className={`dashboard-container ${isLoggingOut ? 'transitioning-out' : ''}`}>
      {/* User Profile Card */}
      <div className={`user-profile-card ${showProfileAnimation ? 'loaded' : ''}`} ref={profileRef}>
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              <img 
                src={`https://github.com/${user.username}.png`} 
                alt={`${user.username}'s avatar`}
                onError={(e) => {
                  e.target.src = '/images/clearRobot3Color1.png';
                }}
              />
            </div>
            <div className="avatar-ring"></div>
          </div>
          <div className="profile-info">
            <h2>{user.username}</h2>
            <div className="role-badge">{user.role}</div>
          </div>
          <a 
            href={`${API_URL}/auth/logout`} 
            className="btn-logout"
            onClick={handleLogout}
          >
            Logout
          </a>
        </div>

        {/* Skills Chart with Animation */}
        <div className="skills-section">
          <h3 aria-label="Skills Profile">📊 Skills Profile</h3>
          {totalQuizzes > 0 ? (
            <div className="skills-chart">
              {Object.entries(skills).map(([skill, count], index) => {
                const categoryData = CATEGORIES.find(c => c.id === skill);
                return (
                  <AnimatedSkillBar
                    key={skill}
                    skill={skill}
                    count={count}
                    totalQuizzes={totalQuizzes}
                    color={categoryData?.color || '#607d8b'}
                    delay={showProfileAnimation ? index * 200 : 0}
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-secondary empty-skills">Complete quizzes to build your skills profile!</p>
          )}
        </div>
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
                      {filteredQuizzes.map((quiz) => {
                        const isCompleted = completedQuizIds.has(quiz.id);
                        return (
                          <div key={quiz.id} className={`quiz-card-modern ${isCompleted ? 'completed' : ''}`}>
                            {isCompleted && <span className="completed-badge">✓ Completed</span>}
                            <h4 title={quiz.title}>{quiz.title}</h4>
                            <p>{quiz.description}</p>
                            <div className="quiz-meta">
                              <span>📝 {quiz.questions?.length || 0} questions</span>
                            </div>
                            <Link to={`/quiz/${quiz.id}`} className={`btn-primary btn-block ${isCompleted ? 'btn-retake-quiz' : ''}`}>
                              {isCompleted ? 'Retake Quiz →' : 'Start Quiz →'}
                            </Link>
                          </div>
                        );
                      })}
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
                <div className="history-list">
                  {Object.keys(historyGroups).map((quizId) => (
                    <QuizHistoryGroup
                      key={quizId}
                      quizId={quizId}
                      quizTitle={getQuizTitle(quizId)}
                      attempts={historyGroups[quizId]}
                    />
                  ))}
                </div>
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
