import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import AuthCallback from './pages/AuthCallback'
import Header from './components/Header'
import { getUser } from './utils/api'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getUser(token)
        .then(data => {
          setUser(data)
        })
        .catch(err => {
          console.error('Failed to get user:', err)
          localStorage.removeItem('token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="app">
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/quiz/:questionId" element={<QuizPage user={user} />} />
        <Route path="/auth/callback" element={<AuthCallback setUser={setUser} />} />
      </Routes>
    </div>
  )
}

export default App
