import api from './api'

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),

  googleLogin: (token) =>
    api.post('/auth/google', { token }),

  
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  approveProducer: (id) =>
  api.put(`/auth/producer/${id}/approve`),

  rejectProducer: (id) =>
    api.put(`/auth/producer/${id}/reject`),

  getAllUsers: () =>
  api.get('/auth/users'),

  activateUser: (id) =>
    api.put(`/auth/users/${id}/activate`),

  deactivateUser: (id) =>
    api.put(`/auth/users/${id}/deactivate`),
}

