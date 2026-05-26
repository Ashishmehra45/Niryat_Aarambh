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

      // 1. Pata karo user abhi kis route par hai
      const currentPath = window.location.pathname;
      let redirectUrl = "/login"; // Default fallback

      // 2. Path ke hisaab se Login URL decide karo
      if (currentPath.startsWith("/admin")) {
        redirectUrl = "/admin/login";
      } else if (currentPath.startsWith("/seller")) {
        // Agar tera seller login "/seller/login" hai, toh wo likh. 
        // Agar main login page "/login" hi hai seller ka, toh "/login" likh dena.
        redirectUrl = "/seller/login"; 
      } else if (currentPath.startsWith("/buyer")) {
        redirectUrl = "/buyer/login";
      }

      // 3. Clear all Local Storage data
      localStorage.removeItem("adminData");
      localStorage.removeItem("sellerData");
      localStorage.removeItem("buyerData");
      localStorage.removeItem("sellerId"); // Backup IDs bhi clear kar do

      // 4. Sahi login page par bhej do
      window.location.href = redirectUrl;
    }

    return Promise.reject(error);
  }
);

export default api;