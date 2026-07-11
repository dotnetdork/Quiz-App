/**
 * Crucible Component — "Prove" Mode
 *
 * Assessment, quiz history, and leaderboard in a battle-themed interface.
 * Three tabs: Arena (challenges), Gauntlet (history), Review Lab (leaderboard).
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCall } from '../api';
import { getRankEmoji, calculateTotalPoints } from '../utils/rankUtils';
import AnimatedBackground from '../components/AnimatedBackground';
import { useAuth, getPrefetchedData } from '../context/AuthContext';

/* SVG Icons (Lucide-style, 20x20) */

function SwordsIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" y1="19" x2="19" y2="13" />
      <line x1="16" y1="16" x2="20" y2="20" />
      <line x1="19" y1="21" x2="21" y2="19" />
      <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
      <line x1="5" y1="14" x2="9" y2="18" />
      <line x1="7" y1="17" x2="4" y2="20" />
      <line x1="3" y1="19" x2="5" y2="21" />
    </svg>
  );
}

function ShieldIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function RefreshIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function TrophyIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22h10c0-2-1-3.25-2.03-3.79A1.09 1.09 0 0114 17v-2.34" />
      <path d="M18 2H6v7a6 6 0 0012 0V2Z" />
    </svg>
  );
}

function ClockIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TargetIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

/* Category Icons */
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
          {attemptCount > 1 && (
            <span className={`expand-icon ${isExpanded ? 'rotated' : ''}`}>
              &#9660;
            </span>
          )}
          <Link to={`/quiz/${quizId}`} className="btn-retake" onClick={(e) => e.stopPropagation()}>
            Rematch
          </Link>

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

function getDifficultyLabel(questionCount) {
  if (questionCount <= 5) return { label: 'Beginner', color: '#4caf50' };
  if (questionCount <= 10) return { label: 'Intermediate', color: '#ef6c00' };
  return { label: 'Advanced', color: '#e53935' };
}

function Crucible() {
  const [activeTab, setActiveTab] = useState('arena');
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [scores, setScores] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const userData = authUser || await apiCall('/auth/me');
        setUser(userData);

        const prefetched = getPrefetchedData();

        if (prefetched) {
          setScores(prefetched.scores);
          setQuizzes(prefetched.quizzes);
          setLeaderboard(prefetched.leaderboard);
        } else {
          const [scoreData, quizData, leaderData] = await Promise.all([
            apiCall(`/api/leaderboard/user/${userData.username}`),
            apiCall('/api/quiz/questions'),
            apiCall('/api/leaderboard/')
          ]);

          setScores(scoreData.scores || []);
          setQuizzes(quizData.quizzes || []);
          setLeaderboard(leaderData.leaderboard || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [authUser]);

  if (loading) {
    return (
      <div className="dashboard-skeleton">
        <div className="skeleton-stats">
          <div className="skeleton-stat-card"></div>
          <div className="skeleton-stat-card"></div>
          <div className="skeleton-stat-card"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="card text-center mt-lg">
        <h2>Please Log In</h2>
        <p>You need to log in to access the Crucible.</p>
      </div>
    );
  }

  const totalPoints = calculateTotalPoints(scores);
  const userRank = leaderboard.findIndex(entry => entry.username === user.username) + 1;

  // Build lookup maps
  const quizMap = Object.fromEntries(quizzes.map(quiz => [quiz.id, quiz]));
  const completedQuizIds = new Set(scores.map(score => score.quiz_id));

  // Best scores per quiz
  const bestScores = {};
  scores.forEach(score => {
    if (!bestScores[score.quiz_id] || score.score > bestScores[score.quiz_id]) {
      bestScores[score.quiz_id] = score.score;
    }
  });

  // Sort quizzes: incomplete first, then completed
  const sortedQuizzes = [...quizzes].sort((a, b) => {
    const aCompleted = completedQuizIds.has(a.id);
    const bCompleted = completedQuizIds.has(b.id);
    if (aCompleted !== bCompleted) return aCompleted ? 1 : -1;
    return 0;
  });

  // Group scores by quiz for history
  const groupedHistory = {};
  scores.forEach(score => {
    if (!groupedHistory[score.quiz_id]) {
      groupedHistory[score.quiz_id] = [];
    }
    groupedHistory[score.quiz_id].push(score);
  });
  Object.keys(groupedHistory).forEach(quizId => {
    groupedHistory[quizId].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  });

  const getQuizTitle = (quizId) => quizMap[quizId]?.title || quizId;

  return (
    <>
      <AnimatedBackground theme="default" />
      <div className="crucible-page">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>

          {/* Stats Row */}
          <div className="stats-grid">
            <div className="stat-card-modern">
              <div className="stat-icon"><TrophyIcon size={24} /></div>
              <div className="stat-value">{totalPoints}</div>
              <div className="stat-label">Total Points</div>
            </div>
            <div className="stat-card-modern">
              <div className="stat-icon"><TargetIcon size={24} /></div>
              <div className="stat-value">{scores.length}</div>
              <div className="stat-label">Quizzes Taken</div>
            </div>
            <div className="stat-card-modern">
              <div className="stat-icon"><ClockIcon size={24} /></div>
              <div className="stat-value">{userRank > 0 ? `#${userRank}` : '-'}</div>
              <div className="stat-label">Global Rank</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <div className="tabs-header">
              <button
                className={`tab ${activeTab === 'arena' ? 'active' : ''}`}
                onClick={() => setActiveTab('arena')}
              >
                <SwordsIcon size={18} /> Arena
              </button>
              <button
                className={`tab ${activeTab === 'gauntlet' ? 'active' : ''}`}
                onClick={() => setActiveTab('gauntlet')}
              >
                <ShieldIcon size={18} /> Gauntlet
              </button>
              <button
                className={`tab ${activeTab === 'review' ? 'active' : ''}`}
                onClick={() => setActiveTab('review')}
              >
                <RefreshIcon size={18} /> Leaderboard
              </button>
            </div>

            <div className="tabs-content">
              {/* Arena Tab */}
              {activeTab === 'arena' && (
                <div className="tab-panel">
                  <h2>Arena</h2>
                  <p className="text-secondary mb-md">Select a category to browse challenges</p>

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
                        <h3>{CATEGORIES.find(c => c.id === selectedCategory)?.name} Challenges</h3>
                        <button className="btn-link" onClick={() => setSelectedCategory(null)}>&larr; Back</button>
                      </div>

                      {quizzes.filter(q => q.category === selectedCategory).length === 0 ? (
                        <p>No challenges available in this category.</p>
                      ) : (
                        <div className="quiz-grid">
                          {quizzes.filter(q => q.category === selectedCategory).map((quiz) => {
                            const isCompleted = completedQuizIds.has(quiz.id);
                            const questionCount = quiz.questions?.length || 0;
                            const difficulty = getDifficultyLabel(questionCount);

                            return (
                              <div key={quiz.id} className={`quiz-card-modern ${isCompleted ? 'completed' : ''}`}>
                                {isCompleted && <span className="completed-badge">&#10003; Completed</span>}
                                <h4 title={quiz.title}>{quiz.title}</h4>
                                <p>{quiz.description}</p>
                                {isCompleted && (
                                  <div className="quiz-meta" style={{ marginTop: '0.25rem' }}>
                                    <span className="score-badge">BEST SCORE: {bestScores[quiz.id]} pts</span>
                                  </div>
                                )}
                                
                                <div className="quiz-meta">
                                  <span
                                    className="difficulty-badge"
                                    style={{ backgroundColor: difficulty.color, color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}
                                  >
                                    {difficulty.label}
                                  </span>
                                  <span className="quiz-meta" style={{ margin: '0 0 0.5rem 0.25rem' }}>
                                    {questionCount} question{questionCount !== 1 ? 's' : ''}
                                  </span>
                                </div>

                                <Link to={`/quiz/${quiz.id}`} className={`btn-primary btn-block ${isCompleted ? 'btn-retake-quiz' : ''}`}>
                                  {isCompleted ? 'Rematch' : 'Challenge'}
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

              {/* Gauntlet Tab */}
              {activeTab === 'gauntlet' && (
                <div className="tab-panel">
                  <h2>Welcome to the Gauntlet</h2>
                  <p className="text-secondary mb-md">Home of your battle record. Every attempt tells a story.</p>

                  {scores.length === 0 ? (
                    <div className="empty-state">
                      <p>No quiz attempts yet. Head to the Arena to take on your first challenge.</p>
                      <button className="btn-primary" onClick={() => setActiveTab('arena')}>
                        Enter the Arena
                      </button>
                    </div>
                  ) : (
                    <div className="history-list">
                      {Object.keys(groupedHistory).map((quizId) => (
                        <QuizHistoryGroup
                          key={quizId}
                          quizId={quizId}
                          quizTitle={getQuizTitle(quizId)}
                          attempts={groupedHistory[quizId]}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Review Lab Tab */}
              {activeTab === 'review' && (
                <div className="tab-panel">
                  <h2><TrophyIcon size={22} /> Global Leaderboard</h2>
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
                                {getRankEmoji(entry.rank)}
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
      </div>
    </>
  );
}

export default Crucible;
