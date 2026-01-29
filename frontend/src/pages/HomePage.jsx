import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getQuestions } from '../utils/api'

function HomePage({ user }) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getQuestions()
      .then(data => {
        setQuestions(data)
      })
      .catch(err => {
        console.error('Failed to load questions:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="container"><div className="loading">Loading questions...</div></div>
  }

  return (
    <div className="container">
      <div className="home-page">
        <h2>Welcome to Quiz App</h2>
        <p className="subtitle">Practice coding with Parsons Problems</p>
        
        {!user && (
          <div className="info-box">
            <p>Please log in with GitHub to start solving problems.</p>
          </div>
        )}

        <div className="questions-list">
          <h3>Available Questions</h3>
          {questions.length === 0 ? (
            <p>No questions available yet.</p>
          ) : (
            <div className="questions-grid">
              {questions.map((question) => (
                <Link
                  key={question.id}
                  to={user ? `/quiz/${question.id}` : '#'}
                  className={`question-card ${!user ? 'disabled' : ''}`}
                  onClick={(e) => !user && e.preventDefault()}
                >
                  <h4>{question.title}</h4>
                  <p>{question.description}</p>
                  <span className="question-type">{question.type}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
