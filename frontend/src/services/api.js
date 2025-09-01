import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => { throw new Error(error.response?.data?.error || error.message); }
);

const apiService = {
  getRevenueData: (period = 'monthly', limit = 12) =>
    apiClient.get('/api/revenue', { params: { period, limit } }),
  getTopProducts: (limit = 10, sortBy = 'revenue') =>
    apiClient.get('/api/top-products', { params: { limit, sort_by: sortBy } }),
  getCustomerSegments: () => apiClient.get('/api/customer-segments'),
  getDashboardStats: () => apiClient.get('/api/dashboard-stats'),
};

export default apiService;
