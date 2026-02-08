/**
 * Home Page Component
 * 
 * Shows welcome message, login button, and category grid for quizzes.
 * This is the landing page for the Quiz App.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCall, API_URL } from '../api';

/**
 * Category Card Icons - SVG components for each category
 */

// Python Icon - Snake-like design
function PythonIcon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="12" fill="#3776ab"/>
      <path d="M50 15C35 15 35 25 35 25V35H52V38H28C28 38 18 37 18 52C18 67 26 67 26 67H35V57C35 57 34 47 45 47H55C55 47 65 47 65 37V25C65 25 66 15 50 15ZM42 22C44.2091 22 46 23.7909 46 26C46 28.2091 44.2091 30 42 30C39.7909 30 38 28.2091 38 26C38 23.7909 39.7909 22 42 22Z" fill="#ffd43b"/>
      <path d="M50 85C65 85 65 75 65 75V65H48V62H72C72 62 82 63 82 48C82 33 74 33 74 33H65V43C65 43 66 53 55 53H45C45 53 35 53 35 63V75C35 75 34 85 50 85ZM58 78C55.7909 78 54 76.2091 54 74C54 71.7909 55.7909 70 58 70C60.2091 70 62 71.7909 62 74C62 76.2091 60.2091 78 58 78Z" fill="#ffd43b"/>
    </svg>
  );
}

// Java Icon - Coffee cup design
function JavaIcon({ size = 80 }) {
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

// Technology Icon - Gear/circuit design
function TechnologyIcon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="12" fill="#607d8b"/>
      {/* Circuit board pattern */}
      <circle cx="50" cy="50" r="15" stroke="white" strokeWidth="3" fill="none"/>
      <circle cx="50" cy="50" r="6" fill="#4caf50"/>
      {/* Connection lines */}
      <line x1="50" y1="20" x2="50" y2="35" stroke="white" strokeWidth="3"/>
      <line x1="50" y1="65" x2="50" y2="80" stroke="white" strokeWidth="3"/>
      <line x1="20" y1="50" x2="35" y2="50" stroke="white" strokeWidth="3"/>
      <line x1="65" y1="50" x2="80" y2="50" stroke="white" strokeWidth="3"/>
      {/* Corner nodes */}
      <circle cx="25" cy="25" r="5" fill="#4caf50"/>
      <circle cx="75" cy="25" r="5" fill="#4caf50"/>
      <circle cx="25" cy="75" r="5" fill="#4caf50"/>
      <circle cx="75" cy="75" r="5" fill="#4caf50"/>
      {/* Diagonal lines */}
      <line x1="30" y1="30" x2="40" y2="40" stroke="white" strokeWidth="2"/>
      <line x1="70" y1="30" x2="60" y2="40" stroke="white" strokeWidth="2"/>
      <line x1="30" y1="70" x2="40" y2="60" stroke="white" strokeWidth="2"/>
      <line x1="70" y1="70" x2="60" y2="60" stroke="white" strokeWidth="2"/>
    </svg>
  );
}

/**
 * Category definitions
 */
const CATEGORIES = [
  {
    id: 'python',
    name: 'Python',
    description: 'Python programming quizzes',
    Icon: PythonIcon,
    color: '#3776ab'
  },
  {
    id: 'java',
    name: 'Java',
    description: 'Java programming quizzes',
    Icon: JavaIcon,
    color: '#f89820'
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Robotics, AI, and tech concepts',
    Icon: TechnologyIcon,
    color: '#607d8b'
  }
];

function Home() {
  // State for quizzes, user, and selected category
  const [quizzes, setQuizzes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Load quizzes and check user on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Get quizzes
        const quizData = await apiCall('/api/quiz/questions');
        setQuizzes(quizData.quizzes || []);
        
        // Try to get current user (may fail if not logged in)
        try {
          const userData = await apiCall('/auth/me');
          setUser(userData);
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

  // Filter quizzes by selected category
  const filteredQuizzes = selectedCategory
    ? quizzes.filter(quiz => quiz.category === selectedCategory)
    : [];

  // Get quiz count for each category
  const getCategoryQuizCount = (categoryId) => {
    return quizzes.filter(quiz => quiz.category === categoryId).length;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="loading">
        <p>Loading quizzes...</p>
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

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Quiz-App</h1>
        <p>
          Test your programming knowledge with interactive quizzes and 
          Parsons Problems (drag-and-drop code ordering).
        </p>
        
        {/* Login or Dashboard button */}
        {user ? (
          <div>
            <p>Welcome back, <strong>{user.username}</strong>!</p>
            <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <a href={`${API_URL}/auth/login`} className="github-login">
            {/* GitHub Icon SVG */}
            <svg className="github-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Login with GitHub
          </a>
        )}
      </section>

      {/* Category Grid */}
      <section className="mt-lg">
        <h2>Choose a Category</h2>
        <p className="text-secondary mb-md">Click on a category to see available quizzes</p>
        
        <div className="category-grid">
          {CATEGORIES.map((category) => {
            const Icon = category.Icon;
            const quizCount = getCategoryQuizCount(category.id);
            const isSelected = selectedCategory === category.id;
            
            return (
              <div
                key={category.id}
                className={`category-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                style={{ '--category-color': category.color }}
              >
                <Icon size={80} />
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="quiz-count">{quizCount} quiz{quizCount !== 1 ? 'zes' : ''}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quiz List - Only show when a category is selected */}
      {selectedCategory && (
        <section className="mt-lg">
          <div className="section-header">
            <h2>{CATEGORIES.find(c => c.id === selectedCategory)?.name} Quizzes</h2>
            <button 
              className="btn-secondary"
              onClick={() => setSelectedCategory(null)}
              style={{ padding: '0.5rem 1rem' }}
            >
              ← Back to Categories
            </button>
          </div>
          
          {filteredQuizzes.length === 0 ? (
            <div className="card">
              <p>No quizzes available in this category yet.</p>
            </div>
          ) : (
            filteredQuizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-card">
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>
                <p className="text-secondary">
                  {quiz.questions?.length || 0} questions
                </p>
                <Link 
                  to={`/quiz/${quiz.id}`} 
                  className="btn-primary"
                  style={{ textDecoration: 'none', display: 'inline-block', marginTop: '1rem' }}
                >
                  Start Quiz
                </Link>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
}

export default Home;
