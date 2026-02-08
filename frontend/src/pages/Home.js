/**
 * Home Page Component
 * 
 * Shows welcome message, login button, and list of quizzes.
 * This is the landing page for the Quiz App.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCall, API_URL } from '../api';

function Home() {
  // State for quizzes and user
  const [quizzes, setQuizzes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <h1>Welcome to the League Quiz</h1>
        <p>
          Test your Python knowledge with interactive quizzes and 
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

      {/* Quiz List */}
      <section className="mt-lg">
        <h2>Available Quizzes</h2>
        
        {quizzes.length === 0 ? (
          <p>No quizzes available yet.</p>
        ) : (
          quizzes.map((quiz) => (
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
    </div>
  );
}

export default Home;
