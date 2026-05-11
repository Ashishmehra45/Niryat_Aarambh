import axios from 'axios';

// 1. Ek custom axios instance banao
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true // Har request me cookie automatically jayegi
});

// 2. RESPONSE INTERCEPTOR: Ye har API response ko check karega
api.interceptors.response.use(
  (response) => {
    // Agar sab theek hai toh response aage bhej do
    return response;
  },
  (error) => {
    // Agar error aayi aur uska status 401 (Unauthorized) hai
    if (error.response && error.response.status === 401) {
      
      console.warn("Session Expired or No Cookie Found. Redirecting to Login...");
      
      // Frontend ka kachra (localstorage) saaf karo
      localStorage.removeItem('adminData');
      localStorage.removeItem('sellerData');
      localStorage.removeItem('buyerData');

      // User ko login page par fenk do
      // window.location.href use karte hain yahan kyunki React Router ka 'navigate' yahan directly kaam nahi karta
      window.location.href = '/admin/login'; 
    }
    
    return Promise.reject(error);
  }
);

export default api;