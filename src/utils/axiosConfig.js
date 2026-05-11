import axios from "axios";

// Dynamic Base URL
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://niryat-aarambh-backend.onrender.com/api";

// Axios Instance
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

      // Clear Local Storage
      localStorage.removeItem("adminData");
      localStorage.removeItem("sellerData");
      localStorage.removeItem("buyerData");

      // Redirect to Login
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default api;