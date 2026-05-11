import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  ArrowUpRight,
  Plus,
  Edit2,
  Trash2,
  Menu,
  X,
  MessageSquare,
  LogOut,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  UploadCloud,
  Send,
  FileText
} from "lucide-react";
import toast from "react-hot-toast";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // 🟢 Real Seller Auth States
  const [seller, setSeller] = useState(null);

  // --- 🔥 Fetch Seller Data on Load ---
  useEffect(() => {
    const token = localStorage.getItem('sellerToken');
    const data = localStorage.getItem('sellerData');

    if (token && data) {
      setSeller(JSON.parse(data));
    } else {
      toast.error("Please login to access Seller Central");
      navigate('/seller/register'); 
    }
  }, [navigate]);

  // --- 🚪 Logout Logic ---
  const handleLogout = () => {
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerData');
    toast.success("Logged out from Seller Central!");
    navigate('/seller/register', { state: { showLogin: true } }); 
  };

  // --- 🎭 Avatar Initials ---
  const getInitials = (name) => {
    if (!name) return "S";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  // --- MOCK DATA ---
  const stats = [
    { title: "Total Exports", value: "₹4,50,000", change: "+12.5%", icon: <BarChart3 size={20} /> },
    { title: "Active Orders", value: "24", change: "+3 today", icon: <Package size={20} /> },
    { title: "Buyer Inquiries", value: "156", change: "+18%", icon: <Users size={20} /> },
    { title: "Store Rating", value: "4.8/5", change: "Top 5%", icon: <ArrowUpRight size={20} /> },
  ];

  const productList = [
    { id: 1, name: "Organic Millets", category: "Food & Agri", price: "₹4,500", stock: "120 Units", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300", status: "In Stock" },
    { id: 2, name: "Cotton Fabric", category: "Textiles", price: "₹56,000", stock: "45 Rolls", img: "https://images.unsplash.com/photo-1528476513691-07e6f563d97f?auto=format&fit=crop&q=80&w=300", status: "In Stock" },
    { id: 3, name: "Blue Pottery", category: "Home Decor", price: "₹8,200", stock: "12 Pcs", img: "https://images.unsplash.com/photo-1565193999202-5093a0c27fe4?auto=format&fit=crop&q=80&w=300", status: "Low Stock" },
  ];

  // --- VIEWS ---
  const OverviewView = () => (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">Vyaapaar Overview</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Export catalog and business metrics.</p>
        </div>
        <button className="w-full sm:w-auto bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-blue-600 transition-all">
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">{stat.icon}</div>
              <span className="text-emerald-500 text-[10px] font-black bg-emerald-50 px-2.5 py-1 rounded-full">{stat.change}</span>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{stat.title}</p>
            <p className="text-xl lg:text-2xl font-black text-slate-800 mt-0.5">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-lg lg:text-xl text-slate-800">Product Catalog</h3>
          <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">View All</button>
        </div>
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="min-w-[600px] px-4 pb-4">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <th className="px-6 py-2">Details</th><th className="px-6 py-2">Price</th><th className="px-6 py-2">Stock</th><th className="px-6 py-2">Status</th><th className="px-6 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((product) => (
                  <tr key={product.id} className="bg-white hover:bg-slate-50/80 transition-all group">
                    <td className="px-6 py-4 rounded-l-2xl border-y border-l border-slate-50">
                      <div className="flex items-center gap-5">
                        <div className="relative shrink-0">
                          <img src={product.img} alt={product.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5"></div>
                        </div>
                        <div className="max-w-[150px] lg:max-w-none">
                          <p className="font-bold text-base text-slate-800 leading-tight mb-1">{product.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold">ID: #00{product.id}</span>
                            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">Verified</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-y border-slate-50">
                      <p className="font-black text-slate-900"><span className="text-xs font-medium text-slate-400 mr-1 italic">Price:</span>{product.price}</p>
                    </td>
                    <td className="px-6 py-4 border-y border-slate-50">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-700">{product.stock}</span>
                        <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${product.status === "Low Stock" ? "bg-orange-400 w-1/3" : "bg-emerald-400 w-full"}`}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-y border-slate-50">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm ${product.status === "Low Stock" ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>{product.status}</span>
                    </td>
                    <td className="px-6 py-4 rounded-r-2xl border-y border-r border-slate-50 text-center">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-xl border border-transparent hover:border-slate-100 transition-all"><Edit2 size={16} /></button>
                        <button className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-sm rounded-xl border border-transparent hover:border-slate-100 transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const InquiriesView = () => (
    <div className="animate-in fade-in duration-500">
       <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-slate-200">
          <FileText className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-xl font-black text-slate-900">RFQ & Inquiries</h3>
          <p className="text-slate-500">Bulk order requests and quotes from buyers will appear here...</p>
       </div>
    </div>
  );

  // 🔥 NEW MESSAGES VIEW ADDED HERE
  const MessagesView = () => {
    const [activeChat, setActiveChat] = useState(null);
    const chatList = ["Global Traders LLC", "Amit Kumar (Retailer)", "Metro Supermarts"];

    return (
      <div className="h-[calc(100vh-180px)] flex flex-col md:flex-row gap-0 md:gap-6 animate-in fade-in duration-500 overflow-hidden">
         {/* 1. Sidebar - Chat List */}
         <div className={`w-full md:w-1/3 bg-white border-b md:border-b-0 md:border border-slate-200 md:rounded-3xl p-4 flex-col shadow-none md:shadow-sm h-full ${activeChat !== null ? 'hidden md:flex' : 'flex'}`}>
            <h3 className="font-black text-xl md:text-lg px-2 mb-4 text-slate-900">Buyer Messages</h3>
            <div className="space-y-2 overflow-y-auto pr-2">
               {chatList.map((name, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveChat(i)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${activeChat === i ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50 border border-transparent'}`}
                  >
                     <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-sm text-slate-900 truncate">{name}</h4>
                        <span className="text-[10px] font-bold text-slate-400 shrink-0">11:30 AM</span>
                     </div>
                     <p className="text-xs text-slate-500 truncate">Are you able to ship this to Dubai by next week?</p>
                  </div>
               ))}
            </div>
         </div>

         {/* 2. Main Chat Area */}
         <div className={`flex-1 bg-white md:border border-slate-200 md:rounded-3xl flex-col shadow-none md:shadow-sm h-full ${activeChat === null ? 'hidden md:flex' : 'flex'}`}>
            {/* Chat Header */}
            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10 md:rounded-t-3xl">
               <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button 
                    onClick={() => setActiveChat(null)}
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
                  >
                     <ArrowLeft size={20} />
                  </button>
                  <div>
                     <h3 className="font-black text-lg text-slate-900">{activeChat !== null ? chatList[activeChat] : "Select a Buyer"}</h3>
                     <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                       <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Online
                     </p>
                  </div>
               </div>
               <button className="text-xs md:text-sm font-bold text-blue-600 bg-blue-50 px-3 md:px-4 py-2 rounded-lg transition-colors hover:bg-blue-100">View RFQ</button>
            </div>
            
            {/* Chat Body */}
            <div className="flex-1 bg-slate-50 p-4 md:p-6 overflow-y-auto">
               <div className="flex justify-start mb-4">
                 <div className="bg-white border border-slate-200 text-slate-800 p-3 rounded-2xl rounded-tl-sm text-sm max-w-[85%] md:max-w-md shadow-sm">
                   Hi, I saw your Organic Millets listing. Are you able to ship this to Dubai by next week?
                 </div>
               </div>
               <div className="flex justify-end mb-4">
                 <div className="bg-slate-900 text-white p-3 rounded-2xl rounded-tr-sm text-sm max-w-[85%] md:max-w-md shadow-sm">
                   Hello! Yes, we have active export licenses for UAE. If you confirm the order today, we can dispatch it within 48 hours.
                 </div>
               </div>
            </div>
            
            {/* Chat Input */}
            <div className="p-3 md:p-4 bg-white border-t border-slate-100 flex items-center gap-2 md:gap-3 md:rounded-b-3xl">
               <button className="p-2 md:p-3 bg-slate-50 text-slate-500 hover:text-blue-600 rounded-xl transition-colors">
                 <UploadCloud size={20}/>
               </button>
               <input 
                 type="text" 
                 placeholder="Type your reply to the buyer..." 
                 className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 md:px-4 py-2 md:py-3 text-sm focus:border-blue-600 outline-none text-slate-900 transition-colors"
               />
               <button className="p-2 md:p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95">
                 <Send size={20}/>
               </button>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-8 flex justify-between items-center border-b border-slate-50">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic tracking-tighter">
            Niryat Arambh
          </h1>
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <p className="px-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Seller Menu</p>
          {[
            { name: "Overview", icon: <LayoutDashboard size={20} /> },
            { name: "Products", icon: <Package size={20} /> },
            { name: "Orders", icon: <ShoppingCart size={20} /> },
            { name: "Inquiries", icon: <FileText size={20} /> }, // For RFQs
            { name: "Messages", icon: <MessageSquare size={20} /> }, // 🔥 For Live Chat
            { name: "Analytics", icon: <BarChart3 size={20} /> },
            { name: "Settings", icon: <Settings size={20} /> },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => { setActiveTab(item.name); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                activeTab === item.name
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
          
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-600 hover:bg-red-50 font-bold text-sm transition-all mt-8">
             <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto w-full">
        
        {/* HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 bg-slate-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block w-64 lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search inventory..." className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            {/* Status Badge (Based on real data) */}
            {seller?.status === 'pending' && (
               <span className="hidden sm:inline-flex bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                 Pending Approval
               </span>
            )}
            {seller?.status === 'approved' && (
               <span className="hidden sm:inline-flex bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                 Live Verified
               </span>
            )}

            <button className="p-2 text-slate-400 hover:text-blue-600 relative">
              <Bell size={22} />
              <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* 👤 Dynamic Profile Header */}
            <div className="relative border-l border-slate-200 pl-4 sm:pl-5">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setShowDropdown(!showDropdown)}>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-800 leading-none group-hover:text-blue-600 transition-colors">
                    {seller?.fullName || "Seller"}
                  </p>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">
                    {seller?.companyName || "Partner"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-md">
                  {getInitials(seller?.companyName || seller?.fullName)}
                </div>
                <ChevronDown size={14} className={`text-slate-400 hidden md:block transition-transform ${showDropdown ? 'rotate-180' : ''}`}/>
              </div>

              {/* Profile Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-4 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-slate-50 mb-2">
                    <p className="text-xs font-black text-slate-900">{seller?.companyName}</p>
                    <p className="text-[10px] font-bold text-slate-400 truncate">{seller?.email}</p>
                  </div>
                  <button onClick={() => {setActiveTab("Settings"); setShowDropdown(false);}} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium">Store Settings</button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT AREA */}
        <div className="p-4 lg:p-10 max-w-7xl mx-auto">
           {/* If seller is pending, show alert */}
           {seller?.status === 'pending' && (
             <div className="bg-orange-50 border border-orange-200 text-orange-800 px-6 py-4 rounded-2xl mb-8 flex items-center justify-between">
                <div>
                   <p className="font-black text-sm text-orange-900">Your account is under review.</p>
                   <p className="text-xs mt-0.5">You can add products, but they won't be visible to buyers until an admin approves your profile.</p>
                </div>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider hidden sm:block" onClick={() => setActiveTab("Settings")}>Complete Profile</button>
             </div>
           )}

           {activeTab === "Overview" && <OverviewView />}
           {activeTab === "Inquiries" && <InquiriesView />}
           {activeTab === "Messages" && <MessagesView />} 
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;