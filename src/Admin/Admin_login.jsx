import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, Mail } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/axiosConfig";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/admin/login", formData);
      
      // Token save karna sabse zaroori hai
      localStorage.setItem("adminToken", res.data.token);
      
      toast.success("Welcome back, Admin!");
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Toaster />
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-200">
        <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="email" placeholder="Admin Email" 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="password" placeholder="Password" 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          <button 
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;