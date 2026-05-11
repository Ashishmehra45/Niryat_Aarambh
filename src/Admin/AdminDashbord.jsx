import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import toast from "react-hot-toast";
import {
  LayoutDashboard, Users, UserCheck, Package, ShoppingCart, ShieldCheck,
  MessageSquare, FileText, Settings, Search, Bell, 
  CheckCircle, XCircle, ArrowLeft, Plus, Image as ImageIcon,
  Clock, MapPin, Eye, ChevronRight, CheckCircle2, ShieldAlert,
  TrendingUp, Menu, X, List, Activity, Sparkles, Send, Trash2, ArrowUpRight, LogOut
} from "lucide-react";
import logo from '/niryat_Arambh_Logo.jpg';
import api from "../utils/axiosConfig"; // 🔥 Custom Axios Instance

const AdminDashboard = () => {
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedSeller, setSelectedSeller] = useState(null); 
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ==========================================
  // 🔥 REAL DATA STATES FOR SELLERS & PRODUCTS
  // ==========================================
  const [realSellers, setRealSellers] = useState([]);
  const [realProducts, setRealProducts] = useState([]); // ✅ Naya state Products ke liye
  const [loading, setLoading] = useState(true);

  // Component Mount pe data fetch karenge
  useEffect(() => {
    fetchSellers();
    fetchProducts(); // ✅ Product fetch call
  }, []);

  // ==========================================
  // 📡 API: FETCH ALL SELLERS
  // ==========================================
  const fetchSellers = async () => {
    try {
      const res = await api.get('/admin/sellers');
      setRealSellers(res.data.data);
    } catch (error) {
      console.log("Error loading sellers", error);
      toast.error("Failed to fetch sellers from database.");
    }
  };

  // ==========================================
  // 📡 API: FETCH ALL PRODUCTS (NEW)
  // ==========================================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      // 🔥 Make sure ye route aapke backend mein valid hai (e.g., '/products' ya '/admin/products')
      const res = await api.get('/admin/products'); 
      setRealProducts(res.data.data || res.data); // Jo bhi aapka backend response format ho
    } catch (error) {
      console.log("Error loading products", error);
      toast.error("Failed to fetch products from database.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ✅❌ API: APPROVE / REJECT SELLER
  // ==========================================
  const handleStatusUpdate = async (sellerId, newStatus) => {
    const toastId = toast.loading(`Marking as ${newStatus}...`);
    try {
      const res = await api.put(`/admin/sellers/${sellerId}/status`, { status: newStatus });
      
      setRealSellers(prevSellers => 
        prevSellers.map(seller => 
          seller._id === sellerId ? { ...seller, status: newStatus } : seller
        )
      );

      toast.success(res.data.message || `Seller ${newStatus} successfully!`, { id: toastId });
    } catch (error) {
      console.log(error);
      toast.error("Action failed!", { id: toastId });
    }
  };

  // ==========================================
  // 🚪 SECURE LOGOUT FUNCTION
  // ==========================================
  const handleLogout = async () => {
    const toastId = toast.loading("Terminating session...");
    try {
      await api.post('/admin/logout');
    } catch (error) {
      console.log("Logout API issue", error);
    } finally {
      localStorage.removeItem('adminData');
      toast.success("Logged Out Successfully.", { id: toastId });
      navigate('/admin/login', { replace: true });
    }
  };

  // --- MOCK DATA FOR OTHER TABS ---
  const globalStats = [
    { title: "Total Buyers", value: "24,592", change: "+124 this week", icon: <Users size={22} />, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Active Sellers", value: realSellers.filter(s => s.status === 'approved').length || "0", change: "Live Nodes", icon: <UserCheck size={22} />, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Live Products", value: realProducts.length || "0", change: "Updated now", icon: <Package size={22} />, color: "text-emerald-600", bg: "bg-emerald-50" }, // ✅ Dynamic Products Count
    { title: "Pending RFQs", value: "3,420", change: "Requires Attention", icon: <FileText size={22} />, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const sellerProducts = [
    { id: "PRD-101", name: "Premium Basmati Rice (1121)", price: "₹8,500 / Qtl", stock: "500 Tons", status: "Active", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=150" },
    { id: "PRD-102", name: "Organic Finger Millets", price: "₹4,200 / Qtl", stock: "150 Tons", status: "Active", img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=150" },
    { id: "PRD-103", name: "Toor Dal (Export Quality)", price: "₹9,100 / Qtl", stock: "Low Stock", status: "Warning", img: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&q=80&w=150" },
  ];

  const dummyTimeline = [
    { step: "Order Confirmed", desc: "Advance payment received.", date: "10 Apr, 2026", img: null, completed: true },
    { step: "Raw Material Sourced", desc: "Premium grade collected from farms.", date: "14 Apr, 2026", img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=300", completed: true },
    { step: "Quality Testing", desc: "Lab testing in progress.", date: "Pending", img: null, completed: false },
  ];

  const inquiriesList = [
    { id: "RFQ-901", buyer: "Ashish Mehra (Dubai)", product: "100 Tons Basmati Rice", status: "Open", date: "2 hrs ago" },
    { id: "RFQ-902", buyer: "Global Traders (UK)", product: "5000 Cotton Towels", status: "Assigned", date: "5 hrs ago" },
  ];

  const chatOversight = [
    { id: "C-11", buyer: "Ashish Mehra", seller: "Kisan Export Co.", lastMsg: "Send me the phytosanitary certificate.", time: "10:30 AM" },
    { id: "C-12", buyer: "John Doe", seller: "Jaipur Artifacts", lastMsg: "What is the MOQ for these vases?", time: "Yesterday" },
  ];

  const PremiumCard = ({ children, className = "" }) => (
    <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${className}`}>
      {children}
    </div>
  );

  // --- VIEWS ---

  const OverviewView = () => (
    <div className="animate-in fade-in zoom-in-[0.99] duration-500">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Platform Overview</h2>
          <p className="text-slate-500 mt-2 font-medium">Real-time metrics and system health monitoring.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          System Online
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {globalStats.map((stat, i) => (
          <PremiumCard key={i} className="p-6 md:p-8 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
              {stat.icon}
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.title}</p>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">{stat.value}</h3>
            <p className={`text-xs font-bold flex items-center gap-1 ${stat.title.includes("RFQs") ? "text-amber-500" : "text-emerald-500"}`}>
              <TrendingUp size={14} /> {stat.change}
            </p>
          </PremiumCard>
        ))}
      </div>

      <div className="mt-12">
        
        
       <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Package className="text-indigo-600" /> Recently Added Products
          </h3>
          <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors shadow-sm">
            View All Catalog
          </button>
        </div>

        {/* ✅ REPLACED TABLE WITH MODERN BOX/CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {realProducts.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white border border-slate-200 rounded-[2rem] shadow-sm">
              <Package className="mx-auto text-slate-300 mb-3" size={40} />
              <p className="text-slate-500 font-bold">No products found in the catalog.</p>
            </div>
          ) : (
            realProducts.slice(0, 6).map((prod) => (
              <div 
                key={prod._id} 
                className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 p-2">
                  <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                    <img 
                      src={prod.img || "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600"} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Floating Date Badge */}
                  <div className="absolute top-5 right-5">
                    <span className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black shadow-sm text-slate-600">
                      {new Date(prod.createdAt).toLocaleDateString() || "Recently"}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Title & ID */}
                  <div className="mb-4">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {prod.name}
                      </h4>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-md shrink-0">
                        ID: {prod._id?.slice(-4) || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                      <ShieldCheck size={14} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700 underline decoration-slate-200 underline-offset-2">
                        {prod.seller?.companyName || prod.seller?.fullName || "Verified Seller"}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mt-0.5">
                        Verified Supplier
                      </p>
                    </div>
                  </div>

                  {/* Price & Stock Box */}
                  <div className="bg-[#F8FAFC] p-4 rounded-2xl mb-5 flex justify-between items-center border border-slate-100 mt-auto">
                    <div>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-0.5">Wholesale Price</p>
                      <p className="text-base font-black text-indigo-600">₹{prod.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-0.5">Total Stock</p>
                      <p className="text-sm font-black text-slate-800">{prod.stock}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-white border-2 border-slate-900 text-slate-900 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2">
                    Review Listing <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </div>
  );

  // 🔥 UPDATED SELLERS VIEW WITH REAL API DATA
  const SellersView = () => {
    const pendingSellers = realSellers.filter(s => s.status === 'pending');
    const approvedSellers = realSellers.filter(s => s.status === 'approved');

    const renderSellerTable = (data) => (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Seller Details</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Tax ID (GST)</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 && (
              <tr>
                <td colSpan="4" className="px-8 py-10 text-center text-slate-400 font-bold">No records found.</td>
              </tr>
            )}
            {data.map((seller) => (
              <tr key={seller._id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-5">
                    {seller.img ? (
                      <img src={seller.img} alt={seller.companyName} className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-slate-200 shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-2xl shadow-sm shrink-0">
                        {seller.companyName?.charAt(0).toUpperCase() || "S"}
                      </div>
                    )}
                    <div>
                      <p className="font-black text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{seller.companyName}</p>
                      <p className="text-sm font-medium text-slate-500 mt-1">{seller.fullName} • {seller.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 font-mono text-base font-bold text-slate-700">
                  {seller.gstNumber || 'N/A'}
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
                    seller.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {seller.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end items-center gap-3">
                    {seller.status === 'pending' && (
                      <div className="flex gap-3 mr-2">
                        <button 
                          onClick={() => handleStatusUpdate(seller._id, 'approved')}
                          className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-full transition-colors shadow-sm" title="Approve">
                          <CheckCircle size={20} />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(seller._id, 'rejected')}
                          className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-full transition-colors shadow-sm" title="Reject">
                          <XCircle size={20} />
                        </button>
                      </div>
                    )}
                    <button 
                      onClick={() => { setSelectedSeller(seller); setSelectedProduct(null); }}
                      className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-full text-sm font-black hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md ml-2"
                    >
                      Manage <ChevronRight size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    if (loading) {
      return <div className="text-center py-20 text-slate-500 font-black animate-pulse">Syncing Secure Database...</div>;
    }

    return (
      <div className="animate-in fade-in duration-500">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Seller Management</h2>
          <p className="text-slate-500 mt-2 font-medium">Review applications and manage active exporter accounts.</p>
        </div>
        
        {pendingSellers.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4 px-2">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <ShieldAlert className="text-amber-500" size={24} /> Pending Approvals
              </h3>
              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-amber-200">
                {pendingSellers.length} Pending
              </span>
            </div>
            <PremiumCard className="border-amber-100 shadow-[0_8px_30px_rgb(251,191,36,0.1)]">
              {renderSellerTable(pendingSellers)}
            </PremiumCard>
          </div>
        )}

        {approvedSellers.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4 px-2">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <UserCheck className="text-emerald-500" size={24} /> Active Exporters
              </h3>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-200">
                {approvedSellers.length} Live
              </span>
            </div>
            <PremiumCard>
              {renderSellerTable(approvedSellers)}
            </PremiumCard>
          </div>
        )}
      </div>
    );
  };

  // 🔥 UPDATED SELLER DETAIL VIEW: Connects Add Product Form to Backend
  const SellerDetailView = () => {
    // 1. Local state to hold form inputs
    const [productForm, setProductForm] = useState({
      name: '',
      price: '',
      stock: '',
      category: '',
      hsCode: '',
      unit: '',
      moq: '',
      origin: '',
      description: ''
    });
    
    // 2. Local state to maintain the live inventory list in UI
    // Fetching the seller's specific products from realProducts list
    const filteredSellerProducts = realProducts.filter(p => 
       p.seller === selectedSeller._id || p.seller?._id === selectedSeller._id
    );
    const [liveProducts, setLiveProducts] = useState(filteredSellerProducts.length > 0 ? filteredSellerProducts : sellerProducts);

    // 3. Handle input typing
    const handleProductChange = (e) => {
      setProductForm({ ...productForm, [e.target.name]: e.target.value });
    };

    // 4. Submit to Backend
    const handleAddProduct = async (e) => {
      e.preventDefault();
      
      if (!productForm.name || !productForm.price || !productForm.stock || !productForm.category) {
        return toast.error("Please fill all required product fields!");
      }

      const loadId = toast.loading("Publishing product to catalog...");

      try {
        const payload = {
          name: productForm.name,
          price: Number(productForm.price),
          stock: Number(productForm.stock),
          category: productForm.category,
          description: productForm.description,
          sellerId: selectedSeller._id 
        };

        const res = await api.post('/admin/product', payload);
        
        toast.success(res.data.message || "Product published successfully!", { id: loadId });
        
        setLiveProducts(prev => [res.data.data, ...prev]);
        setRealProducts(prev => [res.data.data, ...prev]); // Global state bhi update kar do
        
        // Reset Form
        setProductForm({ 
          name: '', price: '', stock: '', category: '', hsCode: '', unit: '', moq: '', origin: '', description: ''
        });

      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to publish product.", { id: loadId });
      }
    };

    return (
      <div className="animate-in slide-in-from-right-8 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
          <button onClick={() => setSelectedSeller(null)} className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 shadow-sm transition-all self-start text-slate-600">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 flex flex-wrap items-center gap-3 tracking-tight">
              {selectedSeller.companyName} 
              <span className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100 font-black flex items-center gap-1">
                <Sparkles size={14}/> Admin Override
              </span>
            </h2>
            <p className="text-slate-500 mt-2 font-medium">{selectedSeller.email} • {selectedSeller.phone}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
          {[
            { label: "Listed Products", val: liveProducts.length, icon: <Package size={22}/>, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Volume Sold", val: "0 kg", icon: <ShoppingCart size={22}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Pending Inquiries", val: "0", icon: <MessageSquare size={22}/>, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((m, i) => (
            <PremiumCard key={i} className="p-6 flex items-center gap-5">
              <div className={`p-4 ${m.bg} ${m.color} rounded-2xl`}>{m.icon}</div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">{m.label}</p>
                <p className="text-2xl font-black text-slate-900">{m.val}</p>
              </div>
            </PremiumCard>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
          
        {/* 🔥 FORM WRAPPER AROUND ADD PRODUCT CARD */}
          <PremiumCard className="p-8 h-fit">
            <form onSubmit={handleAddProduct}>
              <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Plus size={20} className="text-blue-600"/> Catalog New Product
                </h3>
              </div>
              
              <div className="space-y-6">
                
                {/* 1. Product Title (name) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Product Title *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={productForm?.name || ""}
                    onChange={handleProductChange}
                    placeholder="e.g. Premium Organic Basmati Rice" 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                  />
                </div>

                {/* 2. Category & Seller ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Category *</label>
                    <input 
                      type="text" 
                      name="category"
                      value={productForm?.category || ""}
                      onChange={handleProductChange}
                      placeholder="e.g. Agri & Food" 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Seller ID *</label>
                    <input 
                      type="text" 
                      name="sellerId"
                      value={selectedSeller._id || ""}
                      disabled // Auto-filled from context
                      placeholder="Enter Seller's MongoDB ID" 
                      required
                      className="w-full bg-slate-200 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-500 cursor-not-allowed outline-none transition-all" 
                    />
                  </div>
                </div>

                {/* 3. Price & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Wholesale Price (₹) *</label>
                    <input 
                      type="number" 
                      name="price"
                      value={productForm?.price || ""}
                      onChange={handleProductChange}
                      placeholder="0.00" 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Total Stock *</label>
                    <input 
                      type="number" 
                      name="stock"
                      value={productForm?.stock || ""}
                      onChange={handleProductChange}
                      placeholder="e.g. 500" 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                    />
                  </div>
                </div>

                {/* 4. Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Product Description *</label>
                  <textarea 
                    name="description"
                    value={productForm?.description || ""}
                    onChange={handleProductChange}
                    rows="4"
                    placeholder="Provide a detailed description of the product..." 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none" 
                  ></textarea>
                </div>

                {/* Submit Trigger inside Form */}
                <button type="submit" className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-md shadow-slate-200 mt-8 flex justify-center items-center gap-2 active:scale-95">
                  Save Product to Database <ArrowUpRight size={18} />
                </button>
                
              </div>
            </form>
          </PremiumCard>

          <PremiumCard className="p-8 flex flex-col h-[650px]">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4 shrink-0">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <List size={20} className="text-indigo-600"/> Live Inventory
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {liveProducts.map((prod) => (
                <div key={prod._id || prod.id} className="bg-white border border-slate-200 p-4 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col">
                  <div className="flex gap-4 mb-4">
                    <img src={prod.img || "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=150"} alt={prod.name} className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-slate-900 leading-tight">{prod.name}</h4>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border shrink-0 ${prod.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                          {prod.status || "Active"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-2">
                        <span className="text-indigo-600 font-bold">₹{prod.price}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>Stock: <span className="text-slate-900 font-bold">{prod.stock}</span></span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedProduct(prod)}
                    className="w-full bg-slate-50 text-indigo-600 border border-slate-200 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                  >
                    <Clock size={16}/> Manage Timeline
                  </button>
                </div>
              ))}
            </div>
          </PremiumCard>
        </div>
      </div>
    );
  };

  const ProductTimelineView = () => (
    <div className="animate-in slide-in-from-bottom-8 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
        <button onClick={() => setSelectedProduct(null)} className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 shadow-sm transition-all self-start text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {selectedProduct.name}
          </h2>
          <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
             Timeline for <span className="text-indigo-600 font-bold">{selectedSeller?.companyName}</span>
          </p>
        </div>
      </div>

      <PremiumCard className="p-8">
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Activity size={20} className="text-indigo-600"/> Traceability Timeline
          </h3>
          <button className="text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
            <Plus size={14}/> Add Milestone
          </button>
        </div>
        
        <div className="relative border-l-2 border-slate-100 ml-4 space-y-10 pb-4">
          {dummyTimeline.map((item, i) => (
            <div key={i} className="relative pl-8">
              <span className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white ${item.completed ? 'bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]' : 'bg-slate-300'}`}></span>
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900">{item.step}</h4>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${item.completed ? 'text-slate-400' : 'text-amber-500'}`}>{item.date}</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">{item.desc}</p>
                {item.img && (
                  <img src={item.img} alt={item.step} className="w-full max-w-sm h-32 object-cover rounded-xl border border-slate-200" />
                )}
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );

  const InquiriesView = () => (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Global Inquiries (RFQs)</h2>
        <p className="text-slate-500 mt-2 font-medium">Monitor and route incoming buyer requirements.</p>
      </div>
      <PremiumCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">RFQ ID & Date</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Buyer</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Requirement</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiriesList.map((rfq, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-black text-sm text-indigo-600">{rfq.id}</p>
                    <p className="text-xs font-medium text-slate-500 mt-1">{rfq.date}</p>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-800 text-sm">{rfq.buyer}</td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-600">{rfq.product}</td>
                  <td className="px-8 py-6">
                    <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">{rfq.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PremiumCard>
    </div>
  );

  const ChatOversightView = () => (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          Message Oversight <ShieldAlert size={28} className="text-rose-500" />
        </h2>
        <p className="text-slate-500 mt-2 font-medium">Read-only access to buyer-seller communications.</p>
      </div>

      <PremiumCard className="flex-1 overflow-hidden flex flex-col md:flex-row shadow-sm">
        {/* Chat List */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50 p-6 overflow-y-auto max-h-[30vh] md:max-h-full">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 px-1">Active Threads</p>
          {chatOversight.map((chat, i) => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl mb-4 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded font-black tracking-widest">{chat.id}</span>
                <span className="text-[10px] text-slate-400 font-bold">{chat.time}</span>
              </div>
              <p className="text-xs font-bold text-slate-500 mb-1">Buyer: <span className="text-slate-900 font-black">{chat.buyer}</span></p>
              <p className="text-xs font-bold text-slate-500 mb-3">Seller: <span className="text-slate-900 font-black">{chat.seller}</span></p>
              <p className="text-sm text-slate-600 truncate italic bg-slate-50 p-2 rounded-lg">"{chat.lastMsg}"</p>
            </div>
          ))}
        </div>

        {/* Chat Reading Pane */}
        <div className="flex-1 bg-white flex flex-col relative min-h-[50vh]">
          <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center relative z-10">
            <h4 className="font-black text-slate-900 text-base">Thread C-11</h4>
            <span className="text-[10px] font-black text-rose-500 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span> Active Monitor
            </span>
          </div>
          
          <div className="p-6 md:p-8 flex-1 overflow-y-auto relative z-10 space-y-6 bg-slate-50/50">
             {/* SENDER (Buyer) - DIFFERENT COLOR */}
             <div className="flex justify-end">
               <div className="max-w-[85%] md:max-w-md bg-indigo-600 border border-indigo-700 text-white p-4 rounded-2xl rounded-tr-sm text-sm shadow-md relative mt-4">
                 <span className="absolute -top-5 right-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Buyer (Ashish)</span>
                 Hello, is the Basmati rice export quality?
               </div>
             </div>
             {/* RECEIVER (Seller) - White Bubble */}
             <div className="flex justify-start mt-6">
               <div className="max-w-[85%] md:max-w-md bg-white border border-slate-200 text-slate-800 p-4 rounded-2xl rounded-tl-sm text-sm shadow-sm relative mt-4">
                 <span className="absolute -top-5 left-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seller (Kisan Export)</span>
                 Yes sir, 1121 grade. Send me the phytosanitary certificate requirement.
               </div>
             </div>
          </div>
          <div className="p-4 bg-slate-100/50 text-center text-xs font-bold text-slate-400 border-t border-slate-100">
            Read-only mode. Admins cannot reply to threads.
          </div>
        </div>
      </PremiumCard>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F4F7FB] font-sans text-slate-900 overflow-hidden">
      
      {/* 🌑 MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* ⚪ LIGHT PREMIUM SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} shadow-2xl lg:shadow-none`}>
        <div className="h-24 flex justify-between items-center px-8 border-b border-slate-100 shrink-0">
          <img src={logo} alt="Logo" className="w-16 h-16 rounded-xl object-contain" />
          <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-1.5 custom-scrollbar">
          <p className="px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Command Center</p>
          {[
            { name: "Overview", icon: <LayoutDashboard size={20} /> },
            { name: "Sellers", icon: <UserCheck size={20} /> },
            { name: "Inquiries", icon: <FileText size={20} /> },
            { name: "Oversight", icon: <Eye size={20} /> },
            { name: "Settings", icon: <Settings size={20} /> },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => { setActiveTab(item.name); setSelectedSeller(null); setSelectedProduct(null); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                activeTab === item.name && !selectedSeller
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>
        
        <div className="p-6 shrink-0 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center font-black text-white shadow-md shrink-0">
               OP
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-black text-slate-900 truncate">System Operator</p>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">Root Access</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 py-3 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-colors"
          >
            <LogOut size={18} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* ⚪ MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto w-full flex flex-col relative z-10">
        
        {/* Header */}
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="font-black text-slate-900 hidden md:block text-xl tracking-tight">{activeTab}</h1>
          </div>
          
          <button className="relative p-3 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm shrink-0 ml-2">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </header>

        {/* View Renderer */}
        <div className="p-6 md:p-10 max-w-[1600px] w-full mx-auto flex-1">
          {selectedProduct ? (
             <ProductTimelineView />
          ) : selectedSeller ? (
             <SellerDetailView />
          ) : (
             <>
               {activeTab === "Overview" && <OverviewView />}
               {activeTab === "Sellers" && <SellersView />}
               {activeTab === "Inquiries" && <InquiriesView />}
               {activeTab === "Oversight" && <ChatOversightView />}
               {activeTab === "Settings" && <div className="text-center mt-20 text-slate-500 font-bold">System Configuration Locked.</div>}
             </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;