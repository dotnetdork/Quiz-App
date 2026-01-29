import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getUser } from '../utils/api'

function AuthCallback({ setUser }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (token) {
      localStorage.setItem('token', token)
      
      getUser(token)
        .then(data => {
          setUser(data)
          navigate('/')
        })
        .catch(err => {
          console.error('Failed to get user:', err)
          localStorage.removeItem('token')
          navigate('/')
        })
    } else {
      navigate('/')
    }
  }, [searchParams, navigate, setUser])

  return (
    <div className="container">
      <div className="loading">Authenticating...</div>
    </div>
  )
}

export default AuthCallback
