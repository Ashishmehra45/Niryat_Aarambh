import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, Package, MessageSquareText, ShieldCheck, 
  Settings, Bell, Search, Menu, X, ArrowLeft, Store, ClipboardList,
  GitCommit, PlusCircle, CheckCircle2, ChevronRight, Mail, Phone, Loader2, ImageIcon
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/axiosConfig";

// ==========================================
// 🧩 COMPONENT 1: SIDEBAR
// ==========================================
const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen, setSubViewState }) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "sellers", label: "Sellers & Products", icon: Store },
    { id: "inquiries", label: "Global Inquiries", icon: MessageSquareText },
    { id: "requirements", label: "Buyer Requirements", icon: ClipboardList },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {isMobileOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] text-slate-300 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center px-6 bg-[#0b1221] border-b border-slate-800 shrink-0">
          <h1 className="text-[15px] font-black text-white uppercase tracking-wider leading-tight">Transparent<br /><span className="text-emerald-400 text-xs">Admin Hub</span></h1>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-2">Main Menu</p>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { 
                  setActiveTab(item.id); 
                  setSubViewState(null); 
                  setIsMobileOpen(false); 
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${isActive ? "bg-[#1f5f67] text-white shadow-md shadow-[#1f5f67]/30" : "hover:bg-slate-800 hover:text-white"}`}
              >
                <item.icon size={18} className={isActive ? "text-emerald-300" : "text-slate-400"} />
                {item.label}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};

// ==========================================
// 🧩 COMPONENT 2: SELLERS & PRODUCTS (DRILL-DOWN)
// ==========================================
const SellersAndProductsView = ({ subViewState, setSubViewState }) => {
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingTimeline, setSavingTimeline] = useState(false);

  // FETCH SELLERS
 // FETCH ALL SELLERS
  // FETCH ALL SELLERS
  useEffect(() => {
    if (!subViewState) {
      setLoading(true);
      
      // 1. Token nikal
      const token = localStorage.getItem("adminToken"); 
      console.log("🔥 Admin Token Sending to Backend:", token); // Console me check kar kya aa raha hai

      // 2. Agar token nahi hai toh API call hi mat kar, direct error de
      if (!token || token === "undefined" || token === "null") {
        console.error("Token missing! You are not logged in as Admin.");
        toast.error("Admin login required!");
        setLoading(false);
        // navigate("/admin/login"); // Tujhe wapas login par bhej dega
        return; 
      }

      // 3. API Call with Token
      api.get("/admin/sellers", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          setSellers(res.data.sellers || []);
        })
        .catch(err => {
          console.error("Fetch sellers error:", err.response?.data || err.message);
          // Agar 401 aaye toh token expire ho gaya hai, usko delete maro
          if (err.response?.status === 401) {
            localStorage.removeItem("adminToken");
            toast.error("Session Expired. Please login again.");
          }
        })
        .finally(() => setLoading(false));
    }
  }, [subViewState]);

  // FETCH PRODUCTS FOR SPECIFIC SELLER
 useEffect(() => {
    if (subViewState?.type === "seller_products") {
      setLoading(true);
      const sellerId = subViewState.data._id;
      
      // 🔥 YAHAN CHANGE KIYA HAI: "token" ki jagah "adminToken"
      const token = localStorage.getItem("adminToken"); 

      // 🔴 API ENDPOINT: Fetch products by seller ID with Authorization Header
      api.get(`/admin/sellers/${sellerId}/products`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          // Agar products mil gaye toh set kardo
          setProducts(res.data.products || []);
        })
        .catch(err => {
          console.error("Fetch seller products error:", err);
          // Agar API fail ho jaye tabhi dummy data dikhega
          setProducts([
            { _id: 101, productName: "Export Quality Red Tomatoes", category: "Vegetables", price: "2.50", unit: "Kg" },
            { _id: 102, productName: "Sun Dried Cherry Tomatoes", category: "Processed Food", price: "8.00", unit: "Kg" },
          ]);
        })
        .finally(() => setLoading(false));
    }
  }, [subViewState]);

  // SAVE TIMELINE
  const handleSaveTimeline = async () => {
    setSavingTimeline(true);
    try {
      // 🔴 API ENDPOINT: Update product timeline
      await api.put(`/admin/products/${selectedProduct._id}/timeline`, {
        // Pass your timeline states here when you build the dynamic timeline builder
        status: "updated" 
      });
      toast.success("Timeline updated successfully!");
      setIsTimelineModalOpen(false);
    } catch (error) {
      toast.error("Failed to update timeline.");
    } finally {
      setSavingTimeline(false);
    }
  };

  // --- SUB-VIEW 2: SELLER'S PRODUCTS ---
  if (subViewState?.type === "seller_products") {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <button onClick={() => setSubViewState(null)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1f5f67] transition-colors mb-6">
          <ArrowLeft size={16} /> Back to All Sellers
        </button>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-800">{subViewState.data.businessName}'s Inventory</h2>
            <p className="text-sm text-slate-500 mt-1">{subViewState.data.businessEmail} • {subViewState.data.businessPhone}</p>
          </div>
          <span className={`px-3 py-1 font-bold uppercase tracking-wider text-[10px] rounded-md ${subViewState.data.verifiedExporter === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {subViewState.data.verifiedExporter || "Pending"}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-2" size={32} /> Loading products...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div key={prod._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                <div className="h-40 bg-slate-100 flex items-center justify-center shrink-0">
                  <Package size={40} className="text-slate-300" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded w-max mb-2 uppercase">{prod.category}</span>
                  <h3 className="font-bold text-slate-800 leading-tight mb-2">{prod.productName}</h3>
                  <p className="text-lg font-black text-slate-900 mb-4">${prod.price} <span className="text-xs font-medium text-slate-500">/{prod.unit}</span></p>
                  
                  <button onClick={() => { setSelectedProduct(prod); setIsTimelineModalOpen(true); }} className="mt-auto w-full bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    <GitCommit size={16} /> Manage Timeline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TIMELINE MODAL */}
        {isTimelineModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><GitCommit size={18} className="text-blue-600"/> Manage Timeline: {selectedProduct?.productName}</h3>
                <button onClick={() => setIsTimelineModalOpen(false)} className="text-slate-400 hover:text-red-500"><X size={20}/></button>
              </div>
              <div className="p-6 bg-slate-50/50">
                {/* Dummy Timeline Input UI */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 items-start shadow-sm">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center shrink-0"><ImageIcon size={20} className="text-slate-400"/></div>
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <input type="text" placeholder="Date (e.g. 15 Mar)" className="w-1/3 px-3 py-2 text-xs border border-slate-200 rounded outline-none focus:border-blue-500" />
                      <input type="text" placeholder="Step Title" className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded outline-none focus:border-blue-500 font-bold" />
                    </div>
                    <textarea placeholder="Description..." rows="2" className="w-full px-3 py-2 text-xs border border-slate-200 rounded outline-none focus:border-blue-500 resize-none"></textarea>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setIsTimelineModalOpen(false)} className="px-5 py-2 text-sm font-bold text-slate-500">Cancel</button>
                <button onClick={handleSaveTimeline} disabled={savingTimeline} className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2">
                  {savingTimeline ? <Loader2 size={16} className="animate-spin"/> : null}
                  Save Timeline
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- SUB-VIEW 1: ALL SELLERS LIST ---
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Registered Sellers</h3>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search sellers..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1f5f67]" />
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-2" size={32} /> Loading Sellers...
        </div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="p-4 font-bold">Company Info</th>
              <th className="p-4 font-bold">Contact Details</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {sellers.map((seller) => (
              <tr key={seller._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-800">{seller.businessName}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{seller.productCount || 0} Products Listed</p>
                </td>
                <td className="p-4">
                  <p className="text-slate-600 text-xs flex items-center gap-1.5 mb-1"><Mail size={12}/> {seller.businessEmail}</p>
                  <p className="text-slate-600 text-xs flex items-center gap-1.5"><Phone size={12}/> {seller.businessPhone}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md ${seller.verifiedExporter === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {seller.verifiedExporter || "Pending"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => setSubViewState({ type: "seller_products", data: seller })}
                    className="px-4 py-2 bg-[#1f5f67] text-white text-xs font-bold rounded-lg hover:bg-[#15464c] transition-colors shadow-sm inline-flex items-center gap-1.5"
                  >
                    View Products <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ==========================================
// 🧩 COMPONENT 3: GLOBAL INQUIRIES
// ==========================================
const GlobalInquiriesView = () => {
 const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken"); // 🔥 Token nikala

    if (!token) {
      toast.error("Admin Login Required");
      setLoading(false);
      return;
    }

    // 🔥 API me Header add kiya
    api.get("/admin/inquiries", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setInquiries(res.data.inquiries || []))
      .catch(err => {
        console.error("Inquiries Error:", err);
        // Fallback Dummy Data agar backend API fail ho
        setInquiries([
          { _id: 1, buyerName: "John Doe (USA)", sellerName: "Agro Exports Pvt Ltd", productName: "Red Tomatoes", quantityRequired: "500", unit: "Kg", createdAt: "2026-02-15", status: "Replied" },
          { _id: 2, buyerName: "Rahul Verma (IND)", sellerName: "Global Spices", productName: "Turmeric Powder", quantityRequired: "1", unit: "Ton", createdAt: "2026-02-14", status: "Unread" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h3 className="font-bold text-slate-800">Global Inquiries Tracker</h3>
          <p className="text-xs text-slate-500 mt-1">See who is contacting whom on the platform.</p>
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-2" size={32} /> Loading Inquiries...
        </div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="p-4 font-bold">Sender (Buyer)</th>
              <th className="p-4 font-bold">Receiver (Seller)</th>
              <th className="p-4 font-bold">Product Requested</th>
              <th className="p-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {inquiries.map((inq) => (
              <tr key={inq._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="p-4 font-bold text-blue-700">{inq.buyerName}</td>
                <td className="p-4 font-bold text-[#1f5f67]">{inq.sellerName}</td>
                <td className="p-4">
                  <p className="font-bold text-slate-800">{inq.productName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Qty: {inq.quantityRequired} {inq.unit}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md ${inq.status === 'Replied' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {inq.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ==========================================
// 🧩 COMPONENT 4: POST REQUIREMENTS VIEW
// ==========================================
const PostRequirementsView = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔴 API ENDPOINT: Fetch all buyer public requirements
    api.get("/admin/requirements")
      .then(res => setRequirements(res.data.requirements || []))
      .catch(err => {
        // Fallback Dummy Data
        setRequirements([
          { _id: 1, buyerName: "Tech Corp", productName: "Organic Cotton", quantity: "10", unit: "Tons", createdAt: "2026-02-16" },
          { _id: 2, buyerName: "FreshMart UK", productName: "Alphonso Mangoes", quantity: "500", unit: "Boxes", createdAt: "2026-02-16" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="animate-spin mb-2" size={32} /> Loading Requirements...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
      {requirements.map((req) => (
        <div key={req._id} className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            {new Date(req.createdAt).toLocaleDateString()}
          </p>
          <h3 className="text-lg font-black text-slate-800 mb-1">{req.productName}</h3>
          <p className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg w-max mb-4">
            Qty Needed: {req.quantity} {req.unit}
          </p>
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">Posted by Buyer:</p>
            <p className="font-bold text-slate-700">{req.buyerName}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ==========================================
// 👑 MAIN LAYOUT: ADMIN DASHBOARD
// ==========================================
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [subViewState, setSubViewState] = useState(null); 

  // Dynamic Content Renderer
  const renderContent = () => {
    switch (activeTab) {
      case "sellers": return <SellersAndProductsView subViewState={subViewState} setSubViewState={setSubViewState} />;
      case "inquiries": return <GlobalInquiriesView />;
      case "requirements": return <PostRequirementsView />;
      case "overview": return (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center animate-in zoom-in-95">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome to Admin Hub</h2>
          <p className="text-slate-500">Select an option from the sidebar to manage the platform.</p>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f7f9] font-sans overflow-hidden">
      <Toaster position="top-right" />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} setSubViewState={setSubViewState} />
      
      <div className="flex-1 flex flex-col w-full">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileOpen(true)} className="lg:hidden text-slate-500"><Menu size={24} /></button>
            <h1 className="text-lg font-bold text-slate-800 capitalize hidden sm:block">{activeTab.replace('-', ' ')}</h1>
          </div>
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none">Super Admin</p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">System Owner</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1f5f67] text-white flex items-center justify-center font-bold shadow-sm">AD</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;