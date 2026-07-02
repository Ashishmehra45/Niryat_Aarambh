import React, { useState, useEffect } from "react";
import { Menu, Search, ChevronDown, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../public/image-removebg-preview.png"; // Tera logo ka path yahan set kar

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Current URL track karne ke liye
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState("");
  const [activeMode, setActiveMode] = useState("buyer"); // Highlight active tab

  // 1. Highlight tab based on URL
  useEffect(() => {
    if (location.pathname.includes("/seller")) {
      setActiveMode("seller");
    } else {
      setActiveMode("buyer");
    }
  }, [location.pathname]);

  // 2. Check Login Status
  useEffect(() => {
    const token = localStorage.getItem("token"); // Tere screenshot ke hisab se exact key
    const adminData = localStorage.getItem("adminData");
    const buyerData = localStorage.getItem("buyerData");

    if (token || adminData || buyerData) {
      setIsLoggedIn(true);
      const savedName = localStorage.getItem("userName"); 
      
      if (savedName) {
        setUserInitial(savedName.charAt(0).toUpperCase());
      } else if (token) {
        setUserInitial("S");
      } else if (adminData) {
        setUserInitial("A");
      } else if (buyerData) {
        setUserInitial("B");
      } else {
        setUserInitial("U");
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [location.pathname]); // URL change hone par re-check karega

  // --- ROUTING HANDLERS ---
  const handleBuyerClick = () => {
    navigate("/buyer/dashboard"); // Dashboard ya home jahan tu chahe
  };

  const handleSellerClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/seller/dashboard"); // Logged in hai toh dashboard
    } else {
      navigate("/seller/login"); // Nahi hai toh login
    }
  };

  // --- REUSABLE AVATAR/LOGIN BUTTON ---
  const UserProfileSection = () => {
    if (isLoggedIn) {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center text-sm font-black cursor-pointer hover:bg-blue-200 transition-colors shadow-sm">
          {userInitial}
        </div>
      );
    }
    return (
      <button 
        onClick={() => navigate("/seller/login")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold transition-colors text-xs sm:text-sm border border-blue-100"
      >
        <User size={16} />
        <span className="hidden xs:inline">Login</span>
      </button>
    );
  };

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-50">
      
      {/* 1. TOP DARK BAR - MOBILE OPTIMIZED */}
      <div className="bg-[#1e293b] text-slate-300 py-1.5 px-4 sm:px-6 flex justify-center sm:justify-between items-center">
        
        {/* Hidden on mobile to save space, visible on desktop */}
        <div className="hidden sm:flex gap-6 text-[11px] font-medium">
          <span className="cursor-pointer hover:text-white transition-colors">Why Choose Us?</span>
          <span className="cursor-pointer hover:text-white transition-colors">Help Center</span>
        </div>

        {/* Buyer / Seller Smart Toggle */}
        <div className="flex items-center bg-slate-800 rounded-full p-0.5">
          <button 
            onClick={handleBuyerClick}
            className={`px-6 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-300 ${
              activeMode === "buyer" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:text-white"
            }`}
          >
            Buyer
          </button>
          <button 
            onClick={handleSellerClick}
            className={`px-6 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-300 ${
              activeMode === "seller" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:text-white"
            }`}
          >
            Seller
          </button>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row items-center justify-between border-b gap-3 sm:gap-0">
        
        {/* Top Row for Mobile: Logo + Profile */}
        <div className="flex w-full sm:w-auto items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
           
            <img src={logo} alt="Transparent B2B Logo" className="w-26 h-26 ml-4 object-contain rounded-full" />
            <div className="flex flex-col justify-center mt-1">
              <h1 className="text-[14px] sm:text-[15px] font-black text-slate-800 uppercase leading-none tracking-tight">
                Transparent<br />Trade Exchange
              </h1>
              <p className="text-[8px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">By Niryat Aarambh</p>
            </div>
          </div>

          {/* Mobile Profile Icon */}
          <div className="flex sm:hidden items-center">
            <UserProfileSection />
          </div>
        </div>

        {/* Search Bar - Full width on Mobile with top margin, inline on Desktop */}
        <div className="w-full sm:flex-1 max-w-2xl sm:mx-6 lg:mx-10 flex border-2 border-slate-200 focus-within:border-blue-500 rounded-lg overflow-hidden shadow-sm transition-colors mt-1 sm:mt-0">
          <input 
            className="flex-1 px-4 py-2 text-sm outline-none text-slate-700 placeholder:text-slate-400" 
            placeholder="Search products, suppliers, or HS codes..." 
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 flex items-center gap-2 text-sm font-bold transition-colors">
            <Search size={16} /> <span className="hidden xs:inline">Search</span>
          </button>
        </div>

        {/* Right Actions (Desktop Only) */}
        <div className="hidden sm:flex items-center gap-4 lg:gap-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-md shadow-blue-600/20">
            Get Quote
          </button>
          <div className="flex items-center gap-1 text-[13px] font-bold text-slate-600 cursor-pointer hover:text-blue-600 transition-colors">
            EN | INR <ChevronDown size={14} className="text-slate-400" />
          </div>
          
          <UserProfileSection />
        </div>
      </div>
    </div>
  );
};

export default Header;