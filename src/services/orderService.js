import api from './api'

export const orderService = {
  getAll: () => api.get('/orders/admin/all'),
  getMyOrders: () => api.get('/orders/my'),
  getProducerOrders: () => api.get('/orders/producer/items'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancel: (id) => api.patch(`/orders/${id}/cancel`),
  updateOrderItemStatus: (itemId, status) =>
  api.patch(`/orders/item/${itemId}/status`, { status }),
}

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  updateStatus: (id, status) => api.put(`/users/${id}/status`, { status }),
  approveProducer: (id) => api.put(`/users/${id}/approve`),
  rejectProducer: (id) => api.put(`/users/${id}/reject`),
  delete: (id) => api.delete(`/users/${id}`),
  getDashboardStats: () => api.get('/users/admin/stats'),
  getProducerStats: () => api.get('/users/producer/stats'),
  getCustomerStats: () => api.get('/users/customer/stats'),
}
