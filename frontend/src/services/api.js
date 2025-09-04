// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request/response interceptors for error handling
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const dashboardService = {
  /**
   * Get dashboard overview KPIs
   */
  async getDashboardOverview(days = 30) {
    try {
      const response = await apiClient.get(`/api/dashboard/overview?days=${days}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch dashboard overview: ${error.message}`);
    }
  },

  /**
   * Get sales trends data
   */
  async getSalesTrends(period = 'daily', days = 30) {
    try {
      const response = await apiClient.get(`/api/sales/trends?period=${period}&days=${days}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch sales trends: ${error.message}`);
    }
  },

  /**
   * Get top products
   */
  async getTopProducts(limit = 10, category = 'all') {
    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (category !== 'all') {
        params.append('category', category);
      }
      
      const response = await apiClient.get(`/api/products/top?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch top products: ${error.message}`);
    }
  },

  /**
   * Get customer segments
   */
  async getCustomerSegments() {
    try {
      const response = await apiClient.get('/api/customers/segments');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch customer segments: ${error.message}`);
    }
  },

  /**
   * Get geographic sales data
   */
  async getGeographicSales() {
    try {
      const response = await apiClient.get('/api/sales/geographic');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch geographic sales: ${error.message}`);
    }
  },

  /**
   * Get recent orders
   */
  async getRecentOrders(limit = 10) {
    try {
      const response = await apiClient.get(`/api/orders/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch recent orders: ${error.message}`);
    }
  },

  /**
   * Get category performance
   */
  async getCategoryPerformance() {
    try {
      const response = await apiClient.get('/api/analytics/categories');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch category performance: ${error.message}`);
    }
  },

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }
};

export default dashboardService;