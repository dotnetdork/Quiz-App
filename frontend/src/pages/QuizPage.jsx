import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getQuestion, submitAnswer } from '../utils/api'
import ParsonsProblem from '../components/ParsonsProblem'

function QuizPage({ user }) {
  const { questionId } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    getQuestion(questionId)
      .then(data => {
        setQuestion(data)
      })
      .catch(err => {
        console.error('Failed to load question:', err)
        setError('Failed to load question. Please try again.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [questionId, user, navigate])

  const handleSubmit = async (answer) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please log in first')
      setTimeout(() => navigate('/'), 2000)
      return
    }

    try {
      const data = await submitAnswer(questionId, answer, token)
      setResult(data)
      setError(null)
    } catch (error) {
      console.error('Failed to submit answer:', error)
      setError('Failed to submit answer. Please try again.')
    }
  }

  if (loading) {
    return <div className="container"><div className="loading">Loading question...</div></div>
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Questions
        </button>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="container">
        <div className="error">Question not found</div>
        <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Questions
        </button>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="quiz-page">
        <button onClick={() => navigate('/')} className="btn btn-secondary back-btn">
          ← Back to Questions
        </button>
        
        <h2>{question.title}</h2>
        <p className="description">{question.description}</p>

        {question.type === 'parsons' && (
          <ParsonsProblem
            codeLines={question.code_lines}
            onSubmit={handleSubmit}
            result={result}
          />
        )}
      </div>
    </div>
  )
}

export default QuizPage
