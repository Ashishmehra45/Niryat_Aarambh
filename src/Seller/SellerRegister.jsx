import React, { useState } from 'react';
import { Mail, Lock, User, Building, Phone, ArrowRight, ShieldCheck, TrendingUp, Globe, LogIn, FileText } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const SellerAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Toggle check via Router state or default false
  const [isLogin, setIsLogin] = useState(location.state?.showLogin || false);

  // Seller specific state
  const [formData, setFormData] = useState({
    companyName: '', fullName: '', email: '', phone: '', gstNumber: '', password: ''
  });

  const [loginData, setLoginData] = useState({
    email: '', password: ''
  });

  const handleRegisterChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading("Setting up your storefront...");
    
    try {
      const response = await axios.post('http://localhost:5000/api/sellers/register', formData, { withCredentials: true });

      if (response.status === 201) {
        toast.success("Seller Account Created! Please Sign In.", { id: loadId }); 
        setIsLogin(true); 
      } 
    } catch (error) {
      console.error("API call failed:", error);
      const errorMsg = error.response?.data?.message || "Registration failed!";
      toast.error(errorMsg, { id: loadId });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading("Accessing seller dashboard...");
    
    try {
      const response = await axios.post('http://localhost:5000/api/sellers/login', loginData, { withCredentials: true });

      if (response.status === 200) {
        localStorage.setItem('sellerToken', response.data.token);
        localStorage.setItem('sellerData', JSON.stringify(response.data.seller));

        toast.success("Welcome back, Partner!", { id: loadId });
        navigate('/seller/dashboard'); 
      }
    } catch (error) {
      console.error("Login failed:", error);
      const errorMsg = error.response?.data?.message || "Server not responding.";
      toast.error(errorMsg, { id: loadId });
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans">
      
      {/* LEFT PANEL - Seller Focused Vibe */}
      <div className="hidden lg:flex w-1/2 bg-[#020617] text-white relative overflow-hidden flex-col justify-between p-12 transition-all duration-500">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Globe size={22} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-wide">SOURCE<span className="text-blue-400">MART</span> <span className="text-xs text-slate-400 font-normal">for Sellers</span></h1>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-black leading-tight mb-6">
            {isLogin ? (
              <>Grow your B2B <br/><span className="text-blue-400">Business Online.</span></>
            ) : (
              <>Reach Millions of <br/> Buyers <span className="text-blue-400">Globally.</span></>
            )}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            {isLogin 
              ? "Manage your product catalog, respond to RFQs, and track your manufacturing timeline in one place."
              : "Set up your digital storefront, get the Verified Supplier badge, and start receiving bulk orders today."}
          </p>

          {/* Seller Feature Mockups */}
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-sm w-3/4 transform hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="bg-slate-800 p-3 rounded-xl"><TrendingUp size={20} className="text-blue-400"/></div>
              <div>
                <h4 className="text-sm font-bold">Scale Your Sales</h4>
                <p className="text-xs text-slate-400">Access high-intent B2B traffic</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-sm w-3/4 ml-8 transform hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="bg-slate-800 p-3 rounded-xl"><ShieldCheck size={20} className="text-emerald-400"/></div>
              <div>
                <h4 className="text-sm font-bold">Build Trust</h4>
                <p className="text-xs text-slate-400">Get Verified & showcase timelines</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © 2026 SourceMart Seller Central.
        </div>
      </div>

      {/* RIGHT PANEL - Dynamic Form Area */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 my-auto py-8">
          
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {isLogin ? 'Seller Login' : 'Become a Seller'}
            </h2>
            <p className="text-slate-500 text-sm">
              {isLogin ? 'Access your seller dashboard.' : 'Start your journey as a verified supplier.'}
            </p>
          </div>

          {/* ============================== */}
          {/* LOGIN FORM */}
          {/* ============================== */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail size={18} className="text-slate-400" /></div>
                  <input type="email" name="email" placeholder="sales@yourcompany.com" className="w-full bg-[#f4f7fa] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" onChange={handleLoginChange} required />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot Password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock size={18} className="text-slate-400" /></div>
                  <input type="password" name="password" placeholder="••••••••" className="w-full bg-[#f4f7fa] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" onChange={handleLoginChange} required />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors mt-6 shadow-lg shadow-blue-200">
                Sign In to Seller Central <LogIn size={18} />
              </button>
            </form>
          ) : (
            
          /* ============================== */
          /* REGISTRATION FORM (Initial) */
          /* ============================== */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Company / Business Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Building size={18} className="text-slate-400" /></div>
                  <input type="text" name="companyName" placeholder="M/s Sharma Exports" className="w-full bg-[#f4f7fa] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" onChange={handleRegisterChange} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Contact Person Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User size={18} className="text-slate-400" /></div>
                    <input type="text" name="fullName" placeholder="John Doe" className="w-full bg-[#f4f7fa] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" onChange={handleRegisterChange} required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone size={18} className="text-slate-400" /></div>
                    <input type="tel" name="phone" placeholder="+91 98765" className="w-full bg-[#f4f7fa] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" onChange={handleRegisterChange} required />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Business Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail size={18} className="text-slate-400" /></div>
                  <input type="email" name="email" placeholder="sales@company.com" className="w-full bg-[#f4f7fa] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" onChange={handleRegisterChange} required />
                </div>
              </div>

              {/* B2B Specific Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">GSTIN Number <span className="text-slate-400 font-normal">(Optional for now)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><FileText size={18} className="text-slate-400" /></div>
                  <input type="text" name="gstNumber" placeholder="22AAAAA0000A1Z5" className="w-full bg-[#f4f7fa] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none uppercase transition-all" onChange={handleRegisterChange} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock size={18} className="text-slate-400" /></div>
                  <input type="password" name="password" placeholder="••••••••" className="w-full bg-[#f4f7fa] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" onChange={handleRegisterChange} required />
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4">
                Register as Seller <ArrowRight size={18} />
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? (
              <>Don't have a seller account? <button type="button" onClick={() => setIsLogin(false)} className="text-blue-600 font-bold hover:underline outline-none">Sign Up</button></>
            ) : (
              <>Already a registered seller? <button type="button" onClick={() => setIsLogin(true)} className="text-blue-600 font-bold hover:underline outline-none">Sign In</button></>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SellerAuth;