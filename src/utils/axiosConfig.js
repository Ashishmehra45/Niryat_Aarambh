import axios from "axios";

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://www.transparentb2b.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 🔥 NAYA: REQUEST INTERCEPTOR (Har request ke sath token bhejne ke liye)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sellerToken"); // LocalStorage se token uthao
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Header me set karo
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// RESPONSE INTERCEPTOR (Jo tera pehle se sahi chal raha tha)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session Expired. Redirecting to Login...");

      const currentPath = window.location.pathname;
      let redirectUrl = "/login";

      if (currentPath.startsWith("/admin")) redirectUrl = "/admin/login";
      else if (currentPath.startsWith("/seller")) redirectUrl = "/seller/login";
      else if (currentPath.startsWith("/buyer")) redirectUrl = "/buyer/login";

      // Saara local data clear kar do
      localStorage.removeItem("adminData");
      localStorage.removeItem("sellerData");
      localStorage.removeItem("buyerData");
      localStorage.removeItem("sellerId");
      localStorage.removeItem("sellerToken"); // 🔥 Token bhi hategi

      window.location.href = redirectUrl;
    }
    return Promise.reject(error);
  },
);

export default api;
