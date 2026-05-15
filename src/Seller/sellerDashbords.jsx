import React, { useState } from "react";
import { 
  LayoutDashboard, Package, MessageSquare, GitCommit, 
  BarChart2, ShieldCheck, Crown, Lock, X, Zap, 
  TrendingUp, Users, Eye, ChevronRight, Check, Menu
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Mini Component for Modal Checkmarks
const CheckCircleIcon = () => (
  <div className="min-w-[20px] h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5">
    <Check size={12} className="stroke-[3]" />
  </div>
);

const SellerDashboard = () => {
  // STATE
  const [currentPlan, setCurrentPlan] = useState("Free"); 
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [attemptedFeature, setAttemptedFeature] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile menu

  // Menu items
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, tiers: ["Free", "Basic", "Premium"] },
    { id: "products", label: "My Products", icon: Package, tiers: ["Free", "Basic", "Premium"] },
    { id: "chat", label: "Direct Buyer Chat", icon: MessageSquare, tiers: ["Basic", "Premium"] },
    { id: "timeline", label: "Supply Chain Timeline", icon: GitCommit, tiers: ["Premium"] },
    { id: "analytics", label: "Visits & Analytics", icon: BarChart2, tiers: ["Premium"] },
    { id: "badge", label: "Verified Badge", icon: ShieldCheck, tiers: ["Premium"] },
  ];

  // Handle Menu Click
  const handleMenuClick = (item) => {
    if (item.tiers.includes(currentPlan)) {
      setActiveTab(item.id); 
      setIsMobileMenuOpen(false); // Close menu on mobile after clicking
    } else {
      setAttemptedFeature(item.label);
      setShowUpgradeModal(true); 
      setIsMobileMenuOpen(false); // Close menu on mobile to show popup clearly
    }
  };

  // Dummy Dashboard Stats
  const stats = [
    { label: "Total Views", value: currentPlan === "Premium" ? "12,450" : "Unlock", icon: Eye, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Active Inquiries", value: currentPlan === "Free" ? "2" : "15", icon: Users, color: "text-green-600", bg: "bg-green-100" },
    { label: "Profile Ranking", value: currentPlan === "Premium" ? "Top 5%" : "Low", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 overflow-hidden font-sans relative">
      <Toaster position="top-right" />

      {/* ================= MOBILE OVERLAY BACKDROP ================= */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ================= SIDEBAR (Responsive) ================= */}
      <div className={`
        fixed inset-y-0 left-0 z-1 w-64 bg-white border-r border-slate-200 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:flex
      `}>
        <div>
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-slate-800">Seller Hub</h2>
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  currentPlan === 'Premium' ? 'bg-blue-100 text-blue-700' : 
                  currentPlan === 'Basic' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {currentPlan} Plan
                </span>
              </div>
            </div>
            {/* Close button for mobile sidebar */}
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-slate-700">
              <X size={24} />
            </button>
          </div>

          <div className="p-4 flex flex-col gap-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isLocked = !item.tiers.includes(currentPlan);
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? "text-white" : isLocked ? "text-slate-400" : "text-slate-500"} />
                    <span className={`text-sm font-semibold ${isLocked && !isActive ? "text-slate-500" : ""}`}>
                      {item.label}
                    </span>
                  </div>
                  {isLocked && <Lock size={14} className="text-slate-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Upgrade Ad in Sidebar (Only shows if not Premium) */}
        {currentPlan !== "Premium" && (
          <div className="p-4 m-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white relative overflow-hidden shadow-lg shrink-0">
            <div className="absolute -top-6 -right-6 text-slate-700/50">
              <Crown size={80} />
            </div>
            <div className="relative z-10">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Crown size={16} className="text-yellow-400" /> Go Premium
              </h4>
              <p className="text-xs text-slate-300 mt-2 mb-4 leading-relaxed">
                Unlock supply chain timelines, direct chat, and highest search visibility.
              </p>
              <button 
                onClick={() => { setAttemptedFeature("All Premium Features"); setShowUpgradeModal(true); setIsMobileMenuOpen(false); }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 overflow-y-auto flex flex-col w-full relative z-0">
        
        {/* Top Navbar Area */}
        <div className="bg-white px-4 md:px-8 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-10 w-full">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-slate-700 p-1 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 capitalize truncate">
              {activeTab.replace("-", " ")}
            </h1>
          </div>
          
          {/* TESTER CONTROLS - Adjusted for mobile */}
          <div className="flex items-center gap-2 md:gap-3 bg-red-50 px-3 py-2 rounded-lg border border-red-200 w-full sm:w-auto overflow-x-auto">
            <span className="text-[10px] md:text-xs font-bold text-red-600 whitespace-nowrap">Dev Test:</span>
            <select 
              className="text-xs md:text-sm bg-white border border-red-200 rounded px-2 py-1 outline-none font-semibold text-slate-700 w-full sm:w-auto"
              value={currentPlan}
              onChange={(e) => {
                setCurrentPlan(e.target.value);
                setActiveTab("dashboard"); 
                toast.success(`Plan changed to ${e.target.value}`);
              }}
            >
              <option value="Free">Free Plan</option>
              <option value="Basic">Basic Plan</option>
              <option value="Premium">Premium Plan</option>
            </select>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                      {stat.value === "Unlock" ? (
                        <div 
                          onClick={() => { setAttemptedFeature(stat.label); setShowUpgradeModal(true); }}
                          className="flex items-center gap-1.5 text-slate-400 text-lg md:text-xl font-bold cursor-pointer hover:text-blue-600 transition-colors"
                        >
                          <Lock size={16} /> Unlock
                        </div>
                      ) : (
                        <h3 className="text-xl md:text-2xl font-black text-slate-800">{stat.value}</h3>
                      )}
                    </div>
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                      <stat.icon size={20} className="md:w-6 md:h-6" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Banner */}
              <div className="bg-blue-600 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between shadow-lg shadow-blue-600/20 gap-4">
                <div className="w-full md:w-2/3">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">Welcome to your Seller Dashboard!</h2>
                  <p className="text-blue-100 text-xs md:text-sm leading-relaxed">
                    Start adding your products to the global exchange. Upgrade to Premium to chat directly with buyers and show your entire supply chain journey.
                  </p>
                </div>
                <button className="w-full md:w-auto bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap text-sm">
                  Add New Product
                </button>
              </div>

            </div>
          )}

          {activeTab !== "dashboard" && (
            <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="md:w-10 md:h-10" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
                {activeTab.toUpperCase()} View
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                You have successfully accessed this feature using your <span className="font-semibold text-slate-700">{currentPlan}</span> plan.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= UPGRADE MODAL POPUP ================= */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-6 text-white relative">
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 rounded-full p-1 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50">
                <Crown size={24} className="text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-1">Upgrade Required</h3>
              <p className="text-slate-300 text-sm">
                You need a higher plan to access <strong className="text-white">{attemptedFeature}</strong>.
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon />
                  <p className="text-xs md:text-sm text-slate-600"><strong className="text-slate-800">Direct Chat:</strong> Negotiate directly with global buyers.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircleIcon />
                  <p className="text-xs md:text-sm text-slate-600"><strong className="text-slate-800">Supply Chain Timeline:</strong> Build trust with detailed process timelines.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircleIcon />
                  <p className="text-xs md:text-sm text-slate-600"><strong className="text-slate-800">Verified Badge:</strong> Stand out in search results.</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    toast.success("Redirecting to Pricing Page...");
                    setShowUpgradeModal(false);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 text-sm md:text-base"
                >
                  View Premium Plans <ChevronRight size={18} />
                </button>
                <button 
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl transition-colors text-sm md:text-base"
                >
                  Maybe Later
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;