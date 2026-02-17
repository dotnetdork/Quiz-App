/**
 * Quiz Page Component
 * 
 * Displays a quiz with questions and handles submission.
 * Supports both multiple choice and Parsons problems.
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiCall, API_URL } from '../api';
import { useAuth } from '../utils/useAuth';
import MultipleChoice from '../components/MultipleChoice';
import ParsonsProblem from '../components/ParsonsProblem';
import OutputPrediction from '../components/OutputPrediction';
import DebuggingQuestion from '../components/DebuggingQuestion';
import FillInTheBlank from '../components/FillInTheBlank';
import FreeResponse from '../components/FreeResponse';
import FadedParsons from '../components/FadedParsons';
import AnimatedBackground from '../components/AnimatedBackground';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Map quiz IDs to animation themes
const QUIZ_THEMES = {
  'types_and_logic_01': 'geometric',
  'loops_module_01': 'spiral',
  'turtles_module_01': 'ocean',
  'data_structures_func_01': 'network',
  'java_basics_01': 'coffee',
  'java_oop_01': 'blocks',
  'tech_concepts_01': 'circuit',
  'cybersecurity_01': 'matrix',
  'robotics_01': 'gears'
};

function Quiz() {
  // Get quiz ID from URL
  const { quizId } = useParams();
  
  // Use custom auth hook
  const { user } = useAuth();
  
  // State
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [loginWarning, setLoginWarning] = useState(false);
  const [expandedResults, setExpandedResults] = useState({});

  // Load quiz data on mount
  useEffect(() => {
    async function loadQuiz() {
      try {
        // Load quiz
        const quizData = await apiCall(`/api/quiz/quiz/${quizId}`);
        setQuiz(quizData);
        
        // Initialize answers
        const initialAnswers = {};
        if (quizData.questions && Array.isArray(quizData.questions)) {
          quizData.questions.forEach((question) => {
            if (question.type === 'parsons') {
              // For Parsons, store the block indices in shuffled order
              const indices = question.blocks.map((_, index) => index);
              initialAnswers[question.id] = shuffleArray([...indices]);
            } else if (question.type === 'faded_parsons') {
              // For Faded Parsons, only shuffle non-fixed blocks
              const movableIndices = question.blocks
                .map((_, idx) => idx)
                .filter(idx => !(question.fixed_indices || []).includes(idx));
              initialAnswers[question.id] = shuffleArray([...movableIndices]);
            } else {
              initialAnswers[question.id] = null;
            }
          });
        }
        setAnswers(initialAnswers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadQuiz();
  }, [quizId]);

  /**
   * Shuffle array helper function
   */
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Handle answer change for a question
   */
  function handleAnswerChange(questionId, answer) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  }

  /**
   * Submit the quiz
   */
  async function handleSubmit() {
    if (!user) {
      setLoginWarning(true);
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Format answers for API
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        question_id: questionId,
        answer: answer,
      }));
      
      // Submit to API
      const result = await apiCall('/api/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({
          quiz_id: quizId,
          answers: formattedAnswers,
        }),
      });
      
      setResults(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Toggle expanded state for a result
   */
  function toggleResultExpanded(questionId) {
    setExpandedResults(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  }

  // Show loading state
  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <AnimatedBackground theme={QUIZ_THEMES[quizId] || 'default'} />
        <div className="loading" style={{ position: 'relative', zIndex: 1 }}>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <AnimatedBackground theme={QUIZ_THEMES[quizId] || 'default'} />
        <div className="error-message" style={{ position: 'relative', zIndex: 1 }}>
          <p>Error: {error}</p>
          <Link to="/" className="btn-secondary mt-md">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Show results after submission
  if (results) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <AnimatedBackground theme={QUIZ_THEMES[quizId] || 'default'} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="results-summary">
            <h1>Quiz Complete!</h1>
            <div className="score-display">
              {results.score} / {results.total}
            </div>
            <div className="score-label">
              {results.percentage}% Correct
            </div>
            
            {/* Show points awarded info for retakes */}
            {results.is_retake && (
              <div className="points-awarded-info">
                <p>
                  <strong>Points Awarded:</strong> +{results.points_awarded} pts
                  {results.points_awarded < results.score && (
                    <span className="points-note">
                      (Only new correct answers earn points on retakes)
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

        {/* Show individual results with expandable details */}
        <h2 className="mt-lg">Your Answers</h2>
        <p className="text-secondary mb-md">Click on any question to see details</p>
        {results.results.map((result, index) => {
          const isExpanded = expandedResults[result.question_id];
          
          return (
            <div 
              key={result.question_id} 
              className={`card ${result.correct ? 'text-success' : 'text-error'}`}
              style={{ 
                borderLeft: `5px solid ${result.correct ? 'var(--color-accent)' : 'var(--color-error)'}}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => toggleResultExpanded(result.question_id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleResultExpanded(result.question_id);
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0 }}>
                  <strong>Question {index + 1}:</strong>{' '}
                  {result.correct ? '✓ Correct!' : '✗ Incorrect'}
                </p>
                <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
                  {isExpanded ? '▼' : '▶'}
                </span>
              </div>
              
              {/* Expanded details */}
              {isExpanded && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
                  {/* Question prompt */}
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Question:</strong>
                    <p style={{ marginTop: '0.5rem' }}>{result.prompt}</p>
                  </div>
                  
                  {/* Show code if present */}
                  {result.code && (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Code:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        <SyntaxHighlighter
                          language="python"
                          style={tomorrow}
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            borderRadius: '8px',
                            fontSize: 'var(--font-base)',
                          }}
                        >
                          {result.code}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  )}
                  
                  {/* Show blocks for Parsons problems */}
                  {result.blocks && result.blocks.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Code blocks:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        {result.blocks.map((block, idx) => (
                          <div key={idx} style={{ 
                            backgroundColor: '#f5f5f5', 
                            padding: '0.5rem', 
                            marginBottom: '0.25rem',
                            borderRadius: '4px',
                            fontFamily: 'monospace'
                          }}>
                            {idx + 1}. {block}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Your answer */}
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Your Answer:</strong>
                    <div style={{ 
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: result.correct ? '#e8f5e9' : '#ffebee',
                      borderRadius: '4px'
                    }}>
                      {result.question_type === 'parsons' || result.question_type === 'faded_parsons' ? (
                        <div>Order: [{result.submitted ? result.submitted.join(', ') : 'Not answered'}]</div>
                      ) : (
                        <div>{result.submitted || 'Not answered'}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Correct answer */}
                  <div>
                    <strong>Correct Answer:</strong>
                    <div style={{ 
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: '#e8f5e9',
                      borderRadius: '4px'
                    }}>
                      {result.question_type === 'parsons' || result.question_type === 'faded_parsons' ? (
                        <div>Order: [{result.correct_answer ? result.correct_answer.join(', ') : 'N/A'}]</div>
                      ) : (
                        <div>{result.correct_answer || 'N/A'}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

          {/* Navigation buttons */}
          <div className="mt-lg" style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show error if quiz hasn't loaded for some reason
  if (!quiz) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <AnimatedBackground theme={QUIZ_THEMES[quizId] || 'default'} />
        <div className="error-message" style={{ position: 'relative', zIndex: 1 }}>
          <p>Error: Quiz not found or failed to load</p>
          <Link to="/dashboard" className="btn-secondary mt-md">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Get theme for this quiz
  const theme = QUIZ_THEMES[quizId] || 'default';

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Animated Background */}
      <AnimatedBackground theme={theme} />
      
      {/* Quiz Content - positioned above background */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Quiz Header */}
        <div className="card mb-lg">
          <h1>{quiz.title}</h1>
          <p>{quiz.description}</p>
          {!user && (
            <div className="error-message">
              <p>
                <strong>Note:</strong> You need to{' '}
                <a href={`${API_URL}/auth/login`}>log in</a>{' '}
                to submit your answers and save your score.
              </p>
            </div>
          )}
          {loginWarning && (
            <div className="error-message" role="alert">
              <p>
                <strong>Cannot submit:</strong> Please log in first to submit your quiz answers.
              </p>
            </div>
          )}
        </div>

      {/* Questions */}
      {quiz.questions.map((question, index) => (
        <div key={question.id} className="question">
          {/* Question Number and Prompt */}
          <div className="question-prompt">
            <span className="question-number">{index + 1}</span>
            {question.prompt}
          </div>

          {/* Render based on question type */}
          {question.type === 'multiple_choice' ? (
            <MultipleChoice
              options={question.options}
              selectedAnswer={answers[question.id]}
              onSelect={(answer) => handleAnswerChange(question.id, answer)}
            />
          ) : question.type === 'parsons' ? (
            <ParsonsProblem
              blocks={question.blocks}
              order={answers[question.id] || []}
              onOrderChange={(newOrder) => handleAnswerChange(question.id, newOrder)}
            />
          ) : question.type === 'output_prediction' ? (
            <OutputPrediction
              code={question.code}
              options={question.options}
              selectedAnswer={answers[question.id]}
              onSelect={(answer) => handleAnswerChange(question.id, answer)}
            />
          ) : question.type === 'debugging' ? (
            <DebuggingQuestion
              code={question.code}
              options={question.options}
              selectedAnswer={answers[question.id]}
              onSelect={(answer) => handleAnswerChange(question.id, answer)}
            />
          ) : question.type === 'fill_in_blank' ? (
            <FillInTheBlank
              code={question.code}
              options={question.options}
              selectedAnswer={answers[question.id]}
              onSelect={(answer) => handleAnswerChange(question.id, answer)}
            />
          ) : question.type === 'free_response' ? (
            <FreeResponse
              selectedAnswer={answers[question.id]}
              onAnswer={(answer) => handleAnswerChange(question.id, answer)}
              placeholder={question.placeholder}
            />
          ) : question.type === 'faded_parsons' ? (
            <FadedParsons
              blocks={question.blocks}
              fixedIndices={question.fixed_indices || []}
              order={answers[question.id] || []}
              onOrderChange={(newOrder) => handleAnswerChange(question.id, newOrder)}
            />
          ) : (
            <p>Unknown question type: {question.type}</p>
          )}
        </div>
      ))}

        {/* Submit Button */}
        <div className="mt-lg text-center">
          <button 
            className="btn-success" 
            onClick={handleSubmit}
            disabled={submitting}
            style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
