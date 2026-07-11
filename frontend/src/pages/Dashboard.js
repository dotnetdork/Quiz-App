/**
 * Dashboard — Hub Page
 *
 * Three-zone layout:
 * - Mission Control: user profile hero with primary stats
 * - Status Panel: cards linking to Learn, Crucible, Studio
 * - Vitals: compact stats (streak, rank, total points)
 */
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { apiCall, API_URL } from '../api';
import { calculateTotalPoints } from '../utils/rankUtils';
import AnimatedBackground from '../components/AnimatedBackground';
import { useAuth, getPrefetchedData } from '../context/AuthContext';

/* Lucide-style SVG Icons */
function BookOpenIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}

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

function PaletteIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" /><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" /><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
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

function BarChartIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_901_1558)">
        <path d="M29 7H30C30.553 7 31 7.447 31 8V30C31 30.553 30.553 31 30 31H2C1.447 31 1 30.553 1 30V8C1 7.447 1.447 7 2 7H19M6 28V19H10V28M14 28V13H18V28M22 28V1H26V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_901_1558">
          <rect width="32" height="32" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function ArrowRightIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function AnimatedSkillBar({ skill, count, totalQuizzes, color, delay }) {
  const [width, setWidth] = useState(0);
  const percentage = (count / totalQuizzes) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  const skillLabels = { python: 'Python', java: 'Java', technology: 'Technology' };

  return (
    <div className="skill-bar-container animated">
      <div className="skill-label">
        <span>{skillLabels[skill] || skill}</span>
        <span className="skill-count">{count} quiz{count !== 1 ? 'zes' : ''}</span>
      </div>
      <div className="skill-bar">
        <div className="skill-bar-fill animated-fill" style={{ width: `${width}%`, backgroundColor: color, transition: `width 2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms` }}>
          <span className="skill-percentage">{Math.round(percentage)}%</span>
        </div>
      </div>
    </div>
  );
}

const CATEGORIES = [
  { id: 'python', name: 'Python', color: '#3776ab' },
  { id: 'java', name: 'Java', color: '#f89820' },
  { id: 'technology', name: 'Technology', color: '#607d8b' }
];

function Dashboard() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [scores, setScores] = useState([]);
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileAnimation, setShowProfileAnimation] = useState(false);
  const profileRef = useRef(null);

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

        sessionStorage.removeItem('isAuthenticating');
        setShowProfileAnimation(true);
      } catch (err) {
        setError(err.message);
        sessionStorage.removeItem('isAuthenticating');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [authUser]);

  if (loading) {
    const isAuthenticating = sessionStorage.getItem('isAuthenticating') === 'true';
    return (
      <div className="dashboard-skeleton">
        <div className="skeleton-profile-card"><div className="skeleton-avatar"></div><div className="skeleton-text"></div><div className="skeleton-text short"></div></div>
        <div className="skeleton-stats"><div className="skeleton-stat-card"></div><div className="skeleton-stat-card"></div><div className="skeleton-stat-card"></div></div>
        {isAuthenticating && <div className="loading-bar-overlay"><div className="loading-bar"><div className="loading-bar-fill"></div></div></div>}
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="card text-center mt-lg">
        <h2>Please Log In</h2>
        <p>You need to log in to view your dashboard.</p>
        <a href={`${API_URL}/auth/login`} className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>Login with GitHub</a>
      </div>
    );
  }

  const totalPoints = calculateTotalPoints(scores);
  const userRank = leaderboard.findIndex(entry => entry.username === user.username) + 1;

  // Calculate skills from quiz history
  const quizMap = Object.fromEntries(quizzes.map(quiz => [quiz.id, quiz]));
  const skills = {};
  scores.forEach(score => {
    const quiz = quizMap[score.quiz_id];
    if (quiz?.category) {
      skills[quiz.category] = (skills[quiz.category] || 0) + 1;
    }
  });
  const totalQuizzes = Object.values(skills).reduce((sum, c) => sum + c, 0);

  return (
    <>
      <AnimatedBackground theme="dashboard" />
      <div className="dashboard-container" style={{ position: 'relative', zIndex: 1 }}>

        {/* ZONE 1: Mission Control — Profile Hero */}
        <div className={`user-profile-card ${showProfileAnimation ? 'loaded' : ''}`} ref={profileRef}>
          <div className="profile-header">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                <img src={`https://github.com/${user.username}.png`} alt={`${user.username}'s avatar`} onError={(e) => { e.target.src = '/images/clearRobot3Color1.png'; }} />
              </div>
              <div className="avatar-ring"></div>
            </div>
            <div className="profile-info">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '30px', flexWrap: 'wrap' }}>
                <div>
                  <h2>{user.username}</h2>
                  <div className="role-badge">{user.role}</div>
                </div>
                <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', minWidth: '300px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                    <div className="stat-label">Total Points</div>
                    <div className="stat-icon" style={{ marginBottom: '8px' }}></div>
                    <div className="stat-value">{totalPoints}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                    <div className="stat-label">Quizzes Taken</div>
                    <div className="stat-icon" style={{ marginBottom: '8px' }}></div>
                    <div className="stat-value">{scores.length}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                    <div className="stat-label">Global Rank</div>
                    <div className="stat-icon" style={{ marginBottom: '8px' }}></div>
                    <div className="stat-value">{userRank > 0 ? `#${userRank}` : '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="skills-section">
            <h3 aria-label="Skills Profile"><BarChartIcon size={18} /> Skills Profile</h3>
            {totalQuizzes > 0 ? (
              <div className="skills-chart">
                {Object.entries(skills).map(([skill, count], index) => {
                  const cat = CATEGORIES.find(c => c.id === skill);
                  return <AnimatedSkillBar key={skill} skill={skill} count={count} totalQuizzes={totalQuizzes} color={cat?.color || '#607d8b'} delay={showProfileAnimation ? index * 200 : 0} />;
                })}
              </div>
            ) : (
              <p className="text-secondary empty-skills">Complete quizzes to build your skills profile!</p>
            )}
          </div>
        </div>

        {/* ZONE 2: Status Panel — Three Destination Cards */}
        <div className="status-panel">
          <Link to="/learn" className="zone-card zone-learn">
            <div className="zone-card-icon"><BookOpenIcon size={28} /></div>
            <div className="zone-card-content">
              <h3>Learn</h3>
              <p>Browse courses by category and build your skills</p>
              <span className="zone-card-stat">{courses.length} courses available</span>
            </div>
            <ArrowRightIcon size={20} />
          </Link>

          <Link to="/crucible" className="zone-card zone-crucible">
            <div className="zone-card-icon"><SwordsIcon size={28} /></div>
            <div className="zone-card-content">
              <h3>Crucible</h3>
              <p>Test your skills with fun challenges and track your rank</p>
              <span className="zone-card-stat">{quizzes.length} challenges ready</span>
            </div>
            <ArrowRightIcon size={20} />
          </Link>

          <Link to="/course/build-real-stuff" className="zone-card zone-studio">
            <div className="zone-card-icon"><PaletteIcon size={28} /></div>
            <div className="zone-card-content">
              <h3>Studio</h3>
              <p>Design and build real applications with AI guidance</p>
              <span className="zone-card-stat">AI-assisted UI/UX development</span>
            </div>
            <ArrowRightIcon size={20} />
          </Link>
        </div>

      </div>
    </>
  );
}

export default Dashboard;
