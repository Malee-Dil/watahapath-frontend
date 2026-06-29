import api from './api'

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByProducer: (producerId) => api.get(`/products/producer/${producerId}`),
  getMyProducts: () => api.get('/products/my'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  toggleVisibility: (id) => api.put(`/products/${id}/visibility`),
  uploadImage: (id, formData) =>
    api.post(`/products/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}
