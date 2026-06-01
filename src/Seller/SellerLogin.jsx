import React, { useState } from "react";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom"; 
import api from "../utils/axiosConfig"; 

const SellerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // ACTUAL Handle Login (Email/Phone + Password)
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both Email/Phone and Password!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Logging securely...");

    try {
      // ✅ ACTUAL BACKEND CALL FOR LOGIN
      const res = await api.post("/sellers/login", { 
        email: email, 
        password: password 
      });

      toast.success(res.data.message || "Logged in successfully!", { id: toastId });
      
      // 🔥 SABSE ZAROORI: Token aur Details localStorage mein save karo
      // (Dono keys save kar di hain taaki interceptor aur protected routes perfect chalein)
      localStorage.setItem("sellerToken", res.data.token); 
      localStorage.setItem("token", res.data.token); 
      localStorage.setItem("sellerId", res.data.seller._id);
      
      // User ka naam bhi save kar lo taaki Header mein Avatar sahi dikhe
      localStorage.setItem("userName", res.data.seller.businessName || res.data.seller.ownerName || "Seller");

      // ✅ Redirect to Dashboard
      navigate("/seller/dashboard");
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Invalid Credentials", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <Toaster position="top-right" />
      
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-8 text-center text-white relative">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-inner">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-black mb-1">Seller Hub</h2>
          <p className="text-blue-100 text-sm">Sign in to your account</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5 animate-in slide-in-from-bottom-4">
            
            {/* Email or Phone Input */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Business Email or Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. contact@company.com or 9876543210"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-700 font-medium"
                  autoFocus
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 flex justify-between">
                Password
                <span className="text-blue-600 hover:underline cursor-pointer normal-case tracking-normal">Forgot?</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-700 font-bold tracking-widest"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Secure Login"} 
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/seller/register" className="text-blue-600 font-bold hover:underline transition-colors">
              Register here
            </Link>
          </p>
        </div>
            
      </div>
    </div>
  );
};

export default SellerLogin;