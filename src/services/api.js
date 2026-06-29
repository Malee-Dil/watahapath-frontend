import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ✅ REQUEST INTERCEPTOR (FIX AUTH)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('watahapath_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// RESPONSE INTERCEPTOR (unwrap API response)
api.interceptors.response.use(
  (response) => {
    if (response.data?.success !== undefined) {
      const { data, pagination } = response.data
      response.data = data
      if (pagination) response.pagination = pagination
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('watahapath_token')
      localStorage.removeItem('watahapath_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api