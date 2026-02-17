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

  // Load quiz data on mount
  useEffect(() => {
    async function loadQuiz() {
      try {
        // Load quiz
        const quizData = await apiCall(`/api/quiz/quiz/${quizId}`);
        setQuiz(quizData);
        
        // Initialize answers
        const initialAnswers = {};
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

  // Show loading state
  if (loading) {
    return (
      <div className="loading">
        <p>Loading quiz...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <Link to="/" className="btn-secondary mt-md">
          Back to Home
        </Link>
      </div>
    );
  }

  // Show results after submission
  if (results) {
    return (
      <div>
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

        {/* Show individual results */}
        <h2 className="mt-lg">Your Answers</h2>
        {results.results.map((result, index) => (
          <div 
            key={result.question_id} 
            className={`card ${result.correct ? 'text-success' : 'text-error'}`}
            style={{ 
              borderLeft: `5px solid ${result.correct ? 'var(--color-accent)' : 'var(--color-error)'}` 
            }}
          >
            <p>
              <strong>Question {index + 1}:</strong>{' '}
              {result.correct ? '✓ Correct!' : '✗ Incorrect'}
            </p>
          </div>
        ))}

        {/* Navigation buttons */}
        <div className="mt-lg" style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
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
  );
}

export default Quiz;
