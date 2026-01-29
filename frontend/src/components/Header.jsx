import React from 'react'
import { getGithubAuthUrl } from '../utils/api'

function Header({ user, setUser }) {
  const handleLogin = async () => {
    try {
      const url = await getGithubAuthUrl()
      window.location.href = url
    } catch (error) {
      console.error('Failed to get GitHub auth URL:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <header className="header">
      <div className="header-content">
        <h1>Quiz App</h1>
        <div className="user-section">
          {user ? (
            <div className="user-info">
              {user.avatar_url && (
                <img src={user.avatar_url} alt={user.username} className="avatar" />
              )}
              <span>{user.username}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} className="btn btn-primary">
              Login with GitHub
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
