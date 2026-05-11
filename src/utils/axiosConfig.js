import axios from 'axios';

// Dynamic Base URL
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://niryat-aarambh-backend.onrender.com/api";

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {

      console.warn("Session Expired or No Cookie Found. Redirecting to Login...");

      // Clear local storage
      localStorage.removeItem('adminData');
      localStorage.removeItem('sellerData');
      localStorage.removeItem('buyerData');

      // Redirect
      window.location.href = '/admin/login';
    }

    return Promise.reject(error);
  }
);

export default api;