import axios from 'axios'

const API_BASE_URL = '/api'

export const getQuestions = async () => {
  const response = await axios.get(`${API_BASE_URL}/questions/`)
  return response.data
}

export const getQuestion = async (questionId) => {
  const response = await axios.get(`${API_BASE_URL}/questions/${questionId}`)
  return response.data
}

export const submitAnswer = async (questionId, answer, token) => {
  const response = await axios.post(`${API_BASE_URL}/quiz/submit`, {
    question_id: questionId,
    answer,
    token,
  })
  return response.data
}

export const getUser = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/auth/me`, {
    params: { token },
  })
  return response.data
}

export const getGithubAuthUrl = async () => {
  const response = await axios.get(`${API_BASE_URL}/auth/github`)
  return response.data.url
}

export const getQuizHistory = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/quiz/history`, {
    params: { token },
  })
  return response.data
}
