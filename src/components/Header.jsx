import React from "react";
import { Menu, Search, ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top Dark Bar (Responsive: Stacks on very small screens, row on sm+) */}
      <div className="bg-[#1e293b] text-slate-300 text-[10px] sm:text-[11px] font-medium px-4 sm:px-6 py-1.5 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <div className="flex gap-4 sm:gap-6">
          <span className="cursor-pointer hover:text-white transition-colors">Why Choose Us?</span>
          <span className="cursor-pointer hover:text-white transition-colors">Help Center</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-800 rounded-full p-0.5">
          <button className="px-3 sm:px-4 py-1 rounded-full bg-slate-600 text-white font-semibold">Buyer</button>
          <button className="px-3 sm:px-4 py-1 rounded-full text-slate-300 hover:text-white font-semibold">Seller</button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2 sm:py-0 sm:h-16 flex flex-col sm:flex-row items-center justify-between border-b gap-3 sm:gap-0">
        
        {/* Top Row for Mobile: Logo + Mobile Actions */}
        <div className="flex w-full sm:w-auto items-center justify-between">
          {/* Logo Area */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
            <Menu className="sm:hidden text-slate-700 mr-1" size={24} />
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-500 rounded flex items-center justify-center text-[6px] sm:text-[7px] text-white font-black text-center leading-tight">
              NIRYAT<br/>AARAMBH
            </div>
            <div>
              <h1 className="text-[13px] sm:text-[14px] font-black text-slate-800 uppercase leading-tight tracking-tight">
                Transparent<br />Trade Exchange
              </h1>
              <p className="text-[8px] text-slate-500 font-bold tracking-widest uppercase mt-[1px]">By Niryat Aarambh</p>
            </div>
          </div>

          {/* Mobile Avatar (Hidden on Desktop) */}
          <div className="flex sm:hidden items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold cursor-pointer">
              AM
            </div>
          </div>
        </div>

        {/* Search Bar (Full width on Mobile, flexible on Desktop) */}
        <div className="w-full sm:flex-1 max-w-2xl sm:mx-6 lg:mx-10 flex border rounded-md overflow-hidden shadow-sm">
          <input 
            className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 text-[13px] sm:text-sm outline-none text-slate-700 placeholder:text-slate-400" 
            placeholder="Search products, suppliers, or HS codes..." 
          />
          <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-4 sm:px-6 flex items-center gap-2 text-sm font-medium transition-colors">
            <Search size={16} /> <span className="hidden xs:inline">Search</span>
          </button>
        </div>

        {/* Right Actions (Hidden on Mobile, visible on sm+) */}
        <div className="hidden sm:flex items-center gap-4 lg:gap-6">
          <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-4 lg:px-5 py-2 rounded text-sm font-semibold transition-colors">
            Get Quote
          </button>
          <div className="flex items-center gap-1 text-[13px] lg:text-sm text-slate-700 cursor-pointer">
            English | INR <ChevronDown size={14} className="text-slate-500" />
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold cursor-pointer">
            AM
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;