import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, X, ShieldCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import api from "../utils/axiosConfig"; // Apna axios config path check kar lena

const ChoosePlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Registration page se aaya hua sellerId nikal rahe hain
  const sellerId = location.state?.sellerId;

  // Pricing Table Data (Exact image ke hisaab se)
  const pricingFeatures = [
    { name: "Browse products", free: true, basic: true, premium: true },
    { name: "Post buying requirement", free: true, basic: true, premium: true },
    { name: "Seller registration", free: true, basic: true, premium: true },
    { name: "Basic product listing", free: true, basic: true, premium: true },
    { name: "Full product details", free: false, basic: true, premium: true },
    { name: "Direct chat with buyers", free: false, basic: true, premium: true },
    { name: "Product Timeline (Supply Chain)", free: false, basic: false, premium: true },
    { name: "Platform visits & timeline creation", free: false, basic: false, premium: true },
    { name: "Verified Genuine Badge", free: false, basic: false, premium: true },
    { name: "Highest visibility in search results", free: false, basic: false, premium: true },
    { name: "Photos, Videos & Certificates on timeline", free: false, basic: false, premium: true },
  ];

  // API Call to Update Plan
  const handlePlanSelection = async (planName) => {
    if (!sellerId) {
      toast.error("Seller ID missing! Please register first.");
      return navigate("/seller/dashboard"); // Agar direct open kiya toh wapas bhej do
    }

    setLoading(true);
    const loadingToast = toast.loading(`Activating ${planName} Plan...`);

    try {
      await api.put("/sellers/update-plan", { 
        sellerId: sellerId, 
        planName: planName // Backend mein enum ["Free", "Basic", "Premium"] hai
      });
      
      toast.success(`${planName} Plan Activated Successfully!`, { id: loadingToast });
      
      // Thoda delay dekar Dashboard par bhej do
      setTimeout(() => {
        navigate("/seller/dashboard"); 
      }, 1500);

    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update plan.", { id: loadingToast });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 flex items-center justify-center">
      <Toaster position="top-right" />
      
      <div className="max-w-5xl w-full animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">
            Choose Your Subscription Plan
          </h1>
          <p className="text-slate-500">
            Select the best plan to maximize your global export reach.
          </p>
        </div>

        {/* Pricing Table Container */}
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              
              {/* TABLE HEADER */}
              <thead>
                <tr>
                  <th className="p-5 font-semibold text-slate-100 bg-slate-800 border-b border-r border-slate-700 w-[40%] text-lg">
                    Feature
                  </th>
                  <th className="p-5 font-semibold text-slate-100 bg-slate-800 border-b border-r border-slate-700 text-center w-[20%] text-lg">
                    Free
                  </th>
                  <th className="p-5 font-semibold text-slate-100 bg-slate-800 border-b border-r border-slate-700 text-center w-[20%] text-lg">
                    Basic (Paid)
                  </th>
                  <th className="p-5 font-bold text-white bg-blue-600 border-b border-blue-700 text-center w-[20%] text-lg shadow-inner">
                    Premium (Paid)
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY (Features) */}
              <tbody className="text-sm text-slate-700">
                {pricingFeatures.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 border-b border-r border-slate-200 font-medium text-slate-700 group-hover:text-slate-900">
                      {row.name}
                    </td>
                    
                    {/* Free Column */}
                    <td className="p-4 border-b border-r border-slate-200 text-center">
                      {row.free ? <Check size={22} className="text-green-500 mx-auto" /> : <X size={20} className="text-slate-300 mx-auto" />}
                    </td>
                    
                    {/* Basic Column */}
                    <td className="p-4 border-b border-r border-slate-200 text-center bg-slate-50/30">
                      {row.basic ? <Check size={22} className="text-green-500 mx-auto" /> : <X size={20} className="text-slate-300 mx-auto" />}
                    </td>
                    
                    {/* Premium Column (Slightly highlighted background) */}
                    <td className="p-4 border-b border-slate-200 text-center bg-blue-50/40">
                      {row.premium ? <Check size={22} className="text-blue-600 mx-auto" /> : <X size={20} className="text-slate-300 mx-auto" />}
                    </td>
                  </tr>
                ))}

                {/* ACTION BUTTONS ROW */}
                <tr>
                  <td className="p-6 border-r border-slate-200 bg-slate-50 text-right font-medium text-slate-500">
                    Ready to grow your business?
                  </td>
                  
                  {/* Free Action */}
                  <td className="p-6 border-r border-slate-200 text-center align-middle bg-white">
                    <button 
                      type="button" 
                      disabled={loading}
                      onClick={() => handlePlanSelection('Free')}
                      className="w-full py-3 px-4 rounded-lg font-bold text-sm bg-white border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white transition-all shadow-sm disabled:opacity-50"
                    >
                      Continue with Free Trial
                    </button>
                  </td>
                  
                  {/* Basic Action */}
                  <td className="p-6 border-r border-slate-200 text-center align-middle bg-white">
                    <button 
                      type="button"
                      disabled={loading} 
                      onClick={() => handlePlanSelection('Basic')}
                      className="w-full py-3 px-4 rounded-lg font-bold text-sm bg-slate-800 text-white hover:bg-slate-900 transition-all shadow-md disabled:opacity-50"
                    >
                      Choose Basic
                    </button>
                  </td>
                  
                  {/* Premium Action */}
                  <td className="p-6 text-center align-middle bg-blue-50/40">
                    <button 
                      type="button" 
                      disabled={loading}
                      onClick={() => handlePlanSelection('Premium')}
                      className="w-full py-3 px-4 rounded-lg font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transform disabled:opacity-50"
                    >
                      Choose Premium
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ChoosePlan;