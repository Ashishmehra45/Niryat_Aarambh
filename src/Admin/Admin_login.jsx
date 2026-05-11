import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, ArrowRight, Zap, Activity, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios'; // 🔥 Axios import kiya API call ke liye
import api from '../utils/axiosConfig'; // 🔥 Axios instance import kiya with baseURL and interceptors

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 Isko async banaya taaki API call ka wait kar sake
const handleLogin = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    toast.error("Please enter both email and password!");
    return;
  }

  const loadId = toast.loading("Verifying Root Access...");

  try {

    const response = await api.post('/admin/login', formData);

    if (response.status === 200) {

      console.log(response.data.admin);

      // Save Admin Data
      localStorage.setItem(
        'adminData',
        JSON.stringify(response.data.admin)
      );

      // Success Toast
      toast.success(
        response.data.message || "Login Successful",
        { id: loadId }
      );

      // Redirect
      navigate('/admin/dashboard');
    }

  } catch (error) {

    console.error("Admin Login Error:", error);

    toast.error(
      error.response?.data?.message ||
      "Invalid credentials! Unauthorized access.",
      { id: loadId }
    );
  }
};

  return (
    <div className="min-h-screen flex w-full font-sans bg-white">
      
      {/* LEFT PANEL - Deep Dark Tech Vibe */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 text-white relative overflow-hidden flex-col justify-between p-12 lg:p-16 z-0">
        {/* Abstract Glows */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <Zap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-widest text-white flex items-center gap-2">
              NIRYAT<span className="text-indigo-400">ADMIN</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Central Command Node</p>
          </div>
        </div>

        {/* Center Graphic/Text */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Activity size={14} className="animate-pulse" /> Network Secured
          </div>
          <h2 className="text-4xl lg:text-5xl font-black leading-[1.1] mb-6 tracking-tight">
            System Overseer <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Authentication</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-10 font-medium">
            Strictly restricted to authorized personnel. Monitor global supply chains, manage exporter nodes, and oversee buyer-seller communications from the command center.
          </p>

          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-sm w-fit">
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5"><ShieldCheck size={20} className="text-indigo-400"/></div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white">256-Bit Encrypted</h4>
                <p className="text-[10px] text-slate-400 mt-1">End-to-End Security</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <span>© 2026 Niryat Arambh</span>
          <span>Version 2.4.1</span>
        </div>
      </div>

      {/* RIGHT PANEL - Clean White Form Area */}
      <div className="w-full lg:w-1/2 bg-[#F4F7FB] flex items-center justify-center p-6 sm:p-12 relative z-10">
        
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-slate-900/20">
              <ShieldAlert size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Access</h2>
            <p className="text-slate-500 text-sm font-medium mt-2">Enter credentials to access the command center.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Operator Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="admin@niryatarambh.com" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 outline-none transition-all font-medium" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1 mr-1">
                <label className="block text-xs font-bold text-slate-700">Security Key (Password)</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="••••••••••••" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 outline-none transition-all font-medium" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black text-sm py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:shadow-indigo-600/20 mt-8">
              Initialize Override <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Unauthorized access is strictly prohibited.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;