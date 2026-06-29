import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('watahapath_token')
    const storedUser = localStorage.getItem('watahapath_user')
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('watahapath_token')
        localStorage.removeItem('watahapath_user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials)
    const { token: newToken, user: newUser } = res.data
    localStorage.setItem('watahapath_token', newToken)
    localStorage.setItem('watahapath_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    return newUser
  }, [])

  const register = useCallback(async (userData) => {
    const res = await authService.register(userData)
    const { token: newToken, user: newUser } = res.data
    localStorage.setItem('watahapath_token', newToken)
    localStorage.setItem('watahapath_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('watahapath_token')
    localStorage.removeItem('watahapath_user')
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((updatedUser) => {
    const merged = { ...user, ...updatedUser }
    localStorage.setItem('watahapath_user', JSON.stringify(merged))
    setUser(merged)
  }, [user])

  const isAuthenticated = !!token && !!user
  const role = user?.role || null

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, role, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
