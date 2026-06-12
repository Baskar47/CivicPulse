import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('civicUser') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const complaintAPI = {
  create: (data) => API.post('/complaints', data),
  getAll: (params) => API.get('/complaints', { params }),
  getOne: (id) => API.get(`/complaints/${id}`),
  updateStatus: (id, data) => API.put(`/complaints/${id}/status`, data),
  delete: (id) => API.delete(`/complaints/${id}`),
  getStats: () => API.get('/complaints/stats'),
};

export const adminAPI = {
  getUsers: () => API.get('/admin/users'),
  getStats: () => API.get('/admin/stats'),
};

export default API;
