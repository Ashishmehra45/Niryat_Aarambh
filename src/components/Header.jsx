import React, { useState, useEffect, useRef } from "react";
import { Menu, Search, ChevronDown, User, Loader2, Package, Store } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../public/image-removebg-preview.png"; // Tera logo ka path
import api from "../utils/axiosConfig"; // API calls ke liye

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState("");
  const [activeMode, setActiveMode] = useState("buyer");

  // 🔥 SEARCH STATES
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null); // Click outside detect karne ke liye

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
    const token = localStorage.getItem("token"); 
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
  }, [location.pathname]); 

  // 🔥 3. AUTO-SUGGESTION FETCH LOGIC (With Debouncing)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsSearching(true);
        try {
          // 🔴 API ENDPOINT: Real backend connect hone par ye chalega
          const res = await api.get(`/search/suggestions?q=${query}`);
          setSuggestions(res.data.suggestions || []);
        } catch (error) {
          // Fallback Dummy Suggestions (Testing ke liye)
          const dummyData = [
            { _id: 1, name: "Export Quality Red Tomatoes", type: "product", category: "Vegetables" },
            { _id: 2, name: "Agro Exports Pvt Ltd", type: "seller", category: "Company" },
            { _id: 3, name: "Organic Cotton", type: "product", category: "Textiles" },
            { _id: 4, name: "Alphonso Mangoes", type: "product", category: "Fruits" },
            { _id: 5, name: "Sun Dried Tomatoes", type: "product", category: "Processed Food" },
          ];
          // Local filter logic dummy data ke liye
          const filtered = dummyData.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase())
          );
          setSuggestions(filtered);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms ka delay taaki type karte hi API spam na ho

    return () => clearTimeout(timer);
  }, [query]);

  // 🔥 4. CLICK OUTSIDE LOGIC (Suggestions close karne ke liye)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- ROUTING HANDLERS ---
  const handleBuyerClick = () => navigate("/buyer/dashboard");
  const handleSellerClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/seller/dashboard");
    } else {
      navigate("/seller/login");
    }
  };

  // 🔥 HANDLE FULL SEARCH SUBMIT
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query)}`); // Search page pe bhejega
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
        <div className="hidden sm:flex gap-6 text-[11px] font-medium">
          <span className="cursor-pointer hover:text-white transition-colors">Why Choose Us?</span>
          <span className="cursor-pointer hover:text-white transition-colors">Help Center</span>
        </div>
        <div className="flex items-center bg-slate-800 rounded-full p-0.5">
          <button onClick={handleBuyerClick} className={`px-6 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-300 ${activeMode === "buyer" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:text-white"}`}>Buyer</button>
          <button onClick={handleSellerClick} className={`px-6 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-300 ${activeMode === "seller" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:text-white"}`}>Seller</button>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row items-center justify-between border-b gap-3 sm:gap-0">
        
        {/* Logo Area */}
        <div className="flex w-full sm:w-auto items-center justify-between px-4 sm:px-0 py-2">
          <div className="flex items-center  cursor-pointer select-none" onClick={() => navigate("/")}>
            <img src={logo} alt="Transparent B2B Logo" className="w-20 h-20 object-contain rounded-full " />
           
          </div>
         
        </div>

        {/* 🔥 SMART SEARCH BAR */}
        <div ref={searchRef} className="relative w-full sm:flex-1 max-w-2xl sm:mx-6 lg:mx-10 mt-1 sm:mt-0">
          <form onSubmit={handleSearchSubmit} className="flex border-2 border-slate-200 focus-within:border-blue-500 rounded-lg overflow-hidden shadow-sm transition-colors relative z-20 bg-white">
            <input 
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="flex-1 px-4 py-2 text-sm outline-none text-slate-700 placeholder:text-slate-400" 
              placeholder="Search products, suppliers, or categories..." 
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 flex items-center gap-2 text-sm font-bold transition-colors">
              {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} 
              <span className="hidden xs:inline">Search</span>
            </button>
          </form>

          {/* 🔥 AUTO-SUGGESTIONS DROPDOWN */}
          {showSuggestions && query.trim().length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-[100] max-h-80 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200">
              
              {isSearching ? (
                <div className="p-6 text-center text-sm font-medium text-slate-500 flex justify-center items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-blue-500" /> Searching directory...
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="py-2">
                  {suggestions.map((item) => (
                    <li 
                      key={item._id} 
                      onClick={() => {
                        setQuery(item.name);
                        setShowSuggestions(false);
                        navigate(item.type === 'product' ? `/product/${item._id}` : `/seller/${item._id}`);
                      }}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors border-b border-slate-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          {item.type === 'product' ? <Package size={14} className="text-slate-500" /> : <Store size={14} className="text-slate-500" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{item.name}</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{item.category}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${item.type === 'product' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {item.type}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center">
                  <Search size={24} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-bold text-slate-700">No results found</p>
                  <p className="text-xs text-slate-500 mt-1">Try adjusting your search terms</p>
                </div>
              )}
            </div>
          )}
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