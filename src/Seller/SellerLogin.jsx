import React, { useState } from "react";
import { Phone, Lock, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Redirect karne ke liye
import api from "../utils/axiosConfig"; // Tera axios instance

const SellerLogin = () => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

 // STEP 1: ACTUAL Handle Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Sending OTP...");

    try {
      // ✅ ACTUAL BACKEND CALL FOR LOGIN OTP
      const res = await api.post("/sellers/login-send-otp", { businessPhone: phone });
      
      toast.success(res.data.message, { id: toastId });
      setStep(2); // Go to step 2
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to send OTP", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: ACTUAL Handle Verification & Login
  const handleVerifyLogin = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid OTP!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Verifying and Logging in...");

    try {
      // ✅ ACTUAL BACKEND CALL TO VERIFY OTP
      const res = await api.post("/sellers/login", { 
        businessPhone: phone, 
        otp: otp 
      });

      toast.success(res.data.message, { id: toastId });
      
      // 🔥 SABSE ZAROORI UPDATE: Token aur ID dono ko localStorage mein save karo
      localStorage.setItem("sellerToken", res.data.token); 
      localStorage.setItem("sellerId", res.data.seller._id);

      // ✅ Redirect to Dashboard
      navigate("/seller/dashboard");
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Invalid OTP or Login Failed", { id: toastId });
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
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-black mb-1">Seller Hub</h2>
          <p className="text-blue-100 text-sm">Secure Passwordless Login</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          
          {/* STEP 1: PHONE NUMBER INPUT */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-6 animate-in slide-in-from-left-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Business Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-700 font-medium"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
              >
                {loading ? "Sending..." : "Send Secure OTP"} 
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          {/* STEP 2: OTP INPUT */}
          {step === 2 && (
            <form onSubmit={handleVerifyLogin} className="space-y-6 animate-in slide-in-from-right-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Enter 4-Digit OTP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    maxLength="4"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="• • • •"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-700 font-bold tracking-widest text-lg"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  Sent to <strong className="text-slate-700">{phone}</strong>
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                >
                  <ArrowLeft size={16} /> Change Phone Number
                </button>
              </div>
            </form>
          )}

        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Don't have an account? <a href="/seller/register" className="text-blue-600 font-bold hover:underline">Register here</a>
          </p>
        </div>
            
      </div>
    </div>
  );
};

export default SellerLogin;