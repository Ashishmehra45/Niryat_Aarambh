
import React, { useState } from 'react';
import { Mail, Lock, User, Building, Phone, ArrowRight, ShieldCheck, Box, PackageSearch, MapPin, LogIn } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const BuyerAuth = () => {
  const navigate = useNavigate();
  // Toggle between Login and Registration
  const [isLogin, setIsLogin] = useState(false);

  // Registration State
  const [formData, setFormData] = useState({
    fullName: '', company: '', email: '', phone: '', address: '', password: ''
  });

  // Login State
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
  
  // 🔥 Loading state ke saath toast chalu hoga
  const loadId = toast.loading("Creating your account...");
  
  try {
    const response = await axios.post('http://localhost:5000/api/buyers/register', formData,{withCredentials: true});

    if (response.status === 201) {
      // Success toast: loadId wale ko hi update kar dega
      toast.success("Registration Successful! Please Login.", { id: loadId }); 
      setIsLogin(true); 
    } 
  } catch (error) {
    console.error("API call failed:", error);
    const errorMsg = error.response?.data?.message || "Something went wrong!";
    
    // Error toast
    toast.error(errorMsg, { id: loadId });
  }
};

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  
  const loadId = toast.loading("Verifying credentials...");
  
  try {
    const response = await axios.post('http://localhost:5000/api/buyers/login', loginData, {withCredentials: true});

    if (response.status === 200) {
      localStorage.setItem('buyerToken', response.data.token);
      localStorage.setItem('buyerData', JSON.stringify(response.data.buyer));

      toast.success("Welcome back! Login successful.", { id: loadId });
      navigate('/buyer/dashboard');
      
      // Yahan redirect logic dal dena dashboard ke liye
    }
  } catch (error) {
    console.error("Login failed:", error);
    const errorMsg = error.response?.data?.message || "Server not responding. Try again later.";
    
    toast.error(errorMsg, { id: loadId });
  }
};

  return (
    <div className="min-h-screen flex w-full font-sans">
      
      {/* LEFT PANEL - Dark Branding & Product Vibe (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#0a1128] text-white relative overflow-hidden flex-col justify-between p-12 transition-all duration-500">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <PackageSearch size={22} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-wide">SOURCE<span className="text-emerald-400">MART</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">B2B Marketplace</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-black leading-tight mb-6">
            {isLogin ? (
              <>Welcome back to <br/><span className="text-emerald-400">SourceMart.</span></>
            ) : (
              <>Source high-quality <br/> products directly from <br/><span className="text-emerald-400">Verified Suppliers.</span></>
            )}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            {isLogin 
              ? "Access your dashboard to track orders, manage inquiries, and discover new wholesale products."
              : "Join thousands of buyers getting wholesale pricing, secure transactions, and seamless product sourcing tracking."}
          </p>

          <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-sm w-3/4 transform hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="bg-slate-800 p-3 rounded-xl"><Box size={20} className="text-emerald-400"/></div>
              <div>
                <h4 className="text-sm font-bold">Premium Basmati Rice</h4>
                <p className="text-xs text-slate-400">Min. Order: 100 Tons</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-sm w-3/4 ml-8 transform hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="bg-slate-800 p-3 rounded-xl"><ShieldCheck size={20} className="text-blue-400"/></div>
              <div>
                <h4 className="text-sm font-bold">Verified Manufacturers</h4>
                <p className="text-xs text-slate-400">100% Quality Assured</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © 2026 SourceMart Platform. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL - Dynamic Form Area */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 sm:p-12 relative">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Dynamic Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {isLogin ? 'Sign In to Account' : 'Create Buyer Account'}
            </h2>
            <p className="text-slate-500 text-sm">
              {isLogin ? 'Enter your credentials to access your dashboard.' : 'Enter your details to start sourcing products.'}
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
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-400" />
                  </div>
                  <input 
                    type="email" name="email" placeholder="john@company.com" 
                    className="w-full bg-[#f4f7fa] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                    onChange={handleLoginChange} required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">Forgot Password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input 
                    type="password" name="password" placeholder="••••••••" 
                    className="w-full bg-[#f4f7fa] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                    onChange={handleLoginChange} required
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors mt-6">
                Sign In <LogIn size={18} />
              </button>
            </form>
          ) : (
            
          /* ============================== */
          /* REGISTRATION FORM */
          /* ============================== */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <input 
                    type="text" name="fullName" placeholder="John Doe" 
                    className="w-full bg-[#f4f7fa] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                    onChange={handleRegisterChange} required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Company Name <span className="text-slate-400 font-normal">(Optional)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building size={18} className="text-slate-400" />
                  </div>
                  <input 
                    type="text" name="company" placeholder="e.g. Acme Traders" 
                    className="w-full bg-[#f4f7fa] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                    onChange={handleRegisterChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-400" />
                    </div>
                    <input 
                      type="email" name="email" placeholder="john@company.com" 
                      className="w-full bg-[#f4f7fa] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                      onChange={handleRegisterChange} required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone size={18} className="text-slate-400" />
                    </div>
                    <input 
                      type="tel" name="phone" placeholder="+91 98765" 
                      className="w-full bg-[#f4f7fa] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                      onChange={handleRegisterChange} required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Delivery Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-slate-400" />
                  </div>
                  <input 
                    type="text" name="address" placeholder="123 Business Park, City, Pincode" 
                    className="w-full bg-[#f4f7fa] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                    onChange={handleRegisterChange} required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input 
                    type="password" name="password" placeholder="••••••••" 
                    className="w-full bg-[#f4f7fa] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                    onChange={handleRegisterChange} required
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4">
                Sign Up as Buyer <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* Dynamic Footer Link */}
          <div className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button type="button" onClick={() => setIsLogin(false)} className="text-emerald-600 font-bold hover:underline outline-none">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => setIsLogin(true)} className="text-emerald-600 font-bold hover:underline outline-none">
                  Sign In
                </button>
              </>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default BuyerAuth;