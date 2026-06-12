import axios from 'axios';

const API = axios.create({ baseURL: 'https://civicpulse-84oo.onrender.com' });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('civicUser') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export const authAPI = {
  login: (data) => API.post('api/auth/login', data),
  register: (data) => API.post('api/auth/register', data),
  getProfile: () => API.get('api/auth/profile'),
  updateProfile: (data) => API.put('api/auth/profile', data),
};

export const complaintAPI = {
  create: (data) => API.post('api/complaints', data),
  getAll: (params) => API.get('api/complaints', { params }),
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
