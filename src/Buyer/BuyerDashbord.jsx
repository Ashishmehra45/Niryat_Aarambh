import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Menu,
  X,
  ShoppingBag,
  MessageSquare,
  MapPin,
  Star,
  ShieldCheck,
  TrendingUp,
  Clock,
  Package,
  ArrowUpRight,
  Filter,
  FileText,
  UserPlus,
  LogIn,
  ChevronDown,
  CheckCircle2,
  Settings,
  Send,
  Camera,
  UploadCloud,
  User,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "/niryat_Arambh_Logo.jpg";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Marketplace");

  // 🔥 Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔥 Product Detail State
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 🔄 Check Login Status on Mount
  useEffect(() => {
    const token = localStorage.getItem("buyerToken");
    const data = localStorage.getItem("buyerData");

    if (token && data) {
      setIsLoggedIn(true);
      setUser(JSON.parse(data));
    }
  }, []);

  // 🚪 Logout Function
  const handleLogout = () => {
    localStorage.removeItem("buyerToken");
    localStorage.removeItem("buyerData");
    setIsLoggedIn(false);
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/buyer/register ", { state: { showLogin: true } });
  };

  // 🎭 User Initials Generator
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // --- MOCK DATA ---
  const products = [
    {
      id: 100, // 🔥 NAYA TAMATAR PRODUCT ADD KIYA TERE SCREENSHOT KE HISAAB SE
      name: "Maharashtra Hybrid Fresh Green Tomato",
      seller: "Agrilane Private Limited",
      verified: true,
      tiers: [
        { qty: "100-499 kg", price: "₹15/kg" },
        { qty: "500+ kg", price: "₹13/kg" },
      ],
      moq: "1000 kg",
      origin: "Maharashtra, IN",
      rating: "4.5",
      reviews: 210,
      img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 101,
      name: "Organic Finger Millets (Ragi) - Grade A",
      seller: "Kisan Export Co.",
      verified: true,
      tiers: [
        { qty: "100-499 kg", price: "₹60/kg" },
        { qty: "500+ kg", price: "₹45/kg" },
      ],
      moq: "100 kg",
      origin: "Karnataka, IN",
      rating: "4.9",
      reviews: 124,
      img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 102,
      name: "Hand-Woven Pure Pashmina Shawls (Export Quality)",
      seller: "Royal Kashmir Weaves",
      verified: true,
      tiers: [
        { qty: "10-49 pcs", price: "₹15,000/pc" },
        { qty: "50+ pcs", price: "₹12,000/pc" },
      ],
      moq: "10 pcs",
      origin: "Kashmir, IN",
      rating: "5.0",
      reviews: 89,
      img: "https://images.unsplash.com/photo-1528476513691-07e6f563d97f?auto=format&fit=crop&q=80&w=600",
    },
  
  ];

  const myOrders = [
    {
      id: "ORD-98231",
      date: "18 Apr 2026",
      item: "Organic Finger Millets",
      qty: "500 kg",
      amount: "₹22,500",
      status: "In Transit",
      supplier: "Kisan Export Co.",
    },
    {
      id: "ORD-98105",
      date: "12 Apr 2026",
      item: "Assam Black Tea",
      qty: "200 kg",
      amount: "₹2,40,000",
      status: "Processing",
      supplier: "Himalayan Brews",
    },
    {
      id: "ORD-97544",
      date: "01 Mar 2026",
      item: "Cotton Rugs",
      qty: "50 pcs",
      amount: "₹1,25,000",
      status: "Delivered",
      supplier: "Panipat Looms",
    },
  ];

  // --- VIEWS ---

  // 🔥 DETAILED PRODUCT VIEW WITH TIMELINE (TAMATAR SPECIAL)
  const MarketplaceProductDetailView = () => {
    // Dynamic specifications
    const specs = [
      {
        label: "Specialty",
        value: selectedProduct.id === 100 ? "Hybrid" : "Export Quality",
      },
      { label: "State of Origin", value: selectedProduct.origin },
      {
        label: "Color",
        value: selectedProduct.id === 100 ? "Green/Red" : "Natural",
      },
      {
        label: "Packaging Size",
        value:
          selectedProduct.id === 100
            ? "7.0 Kg Cartons"
            : "Standard Export Packs",
      },
      { label: "Availability", value: "Available" },
      { label: "Quality Standard", value: "Grade A (India)" },
    ];

    // 🔥 EXACT TAMATAR WALI TIMELINE (Seed, Germination, Fertilizer, Harvest)
    const timeline = [
      {
        date: "10 Feb",
        title: "Seed Sowing",
        desc: "Sowing hybrid tomato seeds in nursery trays. Batch: TOM-MH-2026-01.",
        img: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=150",
      },
      {
        date: "25 Feb",
        title: "Germination Observed",
        desc: "Uniform germination; 2-3 leaf stage seedlings prepared for potting.",
        img: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=150",
      },
      {
        date: "25 Mar",
        title: "Fertilizer Application",
        desc: "Basal and foliar feeding (NPK + compost), pest scouting done.",
        img: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=150",
      },
      {
        date: "10 Jun",
        title: "Harvesting & Sorting",
        desc: "Tomatoes plucked, harvested and graded into export A-grade cartons, cooled and stocked.",
        img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=150",
      },
    ];

    return (
      <div className="animate-in slide-in-from-right-8 duration-500 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 shadow-sm transition-all text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>
          <p className="text-sm font-bold text-slate-500">
            Marketplace <span className="mx-2 text-slate-300">/</span>{" "}
            {selectedProduct.origin}{" "}
            <span className="mx-2 text-slate-300">/</span>{" "}
            <span className="text-slate-900">{selectedProduct.name}</span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SECTION: DETAILS */}
          <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 p-6 lg:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 mb-4">
                  <img
                    src={selectedProduct.img}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer shrink-0 ${i === 1 ? "border-blue-600 shadow-md" : "border-slate-100 hover:border-slate-300"}`}
                    >
                      <img
                        src={selectedProduct.img}
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                        alt="thumb"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-1/2 flex flex-col">
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight mb-2">
                  {selectedProduct.name}
                </h2>
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                    <Star size={14} className="fill-amber-500" />{" "}
                    {selectedProduct.rating}
                  </span>
                  <span className="text-sm font-bold text-slate-500 underline decoration-slate-200">
                    Sold by: {selectedProduct.seller}
                  </span>
                  {selectedProduct.verified && (
                    <ShieldCheck size={16} className="text-emerald-500 ml-1" />
                  )}
                </div>

                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                  <h3 className="text-3xl font-black text-blue-600">
                    {selectedProduct.tiers[0].price}
                  </h3>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                    Get Best Price
                  </span>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  {specs.map((spec, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0"
                    >
                      <span className="font-bold text-slate-500 w-1/3">
                        {spec.label}
                      </span>
                      <span className="font-black text-slate-800 w-2/3">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <button
                    className="bg-slate-900 text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95"
                    onClick={() =>
                      setSelectedProduct(null) || setActiveTab("Post RFQ")
                    }
                  >
                    Get Latest Price
                  </button>
                  <button
                    className="bg-white text-slate-800 border-2 border-slate-200 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest hover:border-slate-900 transition-all active:scale-95"
                    onClick={() =>
                      setSelectedProduct(null) || setActiveTab("Messages")
                    }
                  >
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION: TIMELINE */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-[2rem] p-6 shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-4">
                <Clock className="text-blue-600" size={20} />
                <h3 className="text-xl font-black text-slate-900">
                  Timeline of this product
                </h3>
              </div>

              <div className="relative border-l-2 border-dashed border-slate-300 ml-4 space-y-8 pb-4 flex-1">
                {timeline.map((item, i) => (
                  <div key={i} className="relative pl-6 group">
                    <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-[3px] border-white bg-blue-500 shadow-sm group-hover:scale-125 transition-transform"></span>

                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          {item.date}
                        </p>
                        <h4 className="text-sm font-black text-slate-900 mb-1 leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MarketplaceView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-[1.5rem] p-3 shadow-md border-2 border-blue-50 gap-4 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 blur-3xl rounded-full opacity-50 pointer-events-none"></div>
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-full sm:w-auto shadow-inner relative z-10">
          <button className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/40 text-white font-black text-sm transition-all flex items-center justify-center gap-2">
            <ShoppingBag size={18} /> Buying Mode
          </button>
          <button className="flex-1 sm:flex-none px-8 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/60 font-bold text-sm transition-all flex items-center justify-center gap-2">
            <Package size={18} /> Selling Mode
          </button>
        </div>
        <div className="hidden lg:flex items-center gap-3 pr-4 relative z-10">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
            Buyer Marketplace Active
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="relative z-10 md:w-2/3">
          <span className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <ShieldCheck size={14} /> Verified Global B2B Platform
          </span>
          <h2 className="text-3xl lg:text-4xl font-black leading-tight mb-4">
            Connect with India's Top Exporters & Manufacturers
          </h2>
          <p className="text-slate-300 text-sm lg:text-base font-medium mb-6">
            Get wholesale pricing, request custom quotes, and trade securely
            across borders.
          </p>

          <div className="flex gap-4 flex-wrap">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/buyer/register"
                  className="bg-blue-600 text-white px-6 py-3.5 rounded-xl font-black text-sm uppercase hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 active:scale-95"
                >
                  Register as Buyer
                </Link>
                <button className="bg-white text-slate-900 px-6 py-3.5 rounded-xl font-black text-sm uppercase hover:bg-slate-100 transition-all shadow-lg shadow-white/10 active:scale-95">
                  Register as Seller
                </button>
              </>
            ) : (
              <button
                className="bg-slate-800 border border-slate-600 text-white px-6 py-3.5 rounded-xl font-black text-sm uppercase hover:bg-slate-700 transition-all active:scale-95"
                onClick={() => setActiveTab("Post RFQ")}
              >
                Post a Requirement
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 w-full md:w-[350px] shadow-xl text-slate-900 z-10 hidden lg:block">
          <h3 className="font-black text-lg mb-4">Tell us what you need</h3>
          <input
            type="text"
            placeholder="Product Name (e.g. Basmati Rice)"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:border-blue-600 outline-none transition-colors"
          />
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Quantity"
              className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-600 outline-none transition-colors"
            />
            <select className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-500 focus:border-blue-600 outline-none cursor-pointer transition-colors">
              <option>Pieces</option>
              <option>Kg</option>
              <option>Tons</option>
            </select>
          </div>
          <button
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-sm hover:bg-blue-600 transition-colors active:scale-95"
            onClick={() => setActiveTab("Post RFQ")}
          >
            Get Quotes
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900">
          Recommended Suppliers
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">
          <Filter size={16} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prod) => (
          <div
            key={prod.id}
            onClick={() => setSelectedProduct(prod)} // 🔥 CLICK OPENS TIMELINE VIEW
            className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col overflow-hidden cursor-pointer"
          >
            <div className="relative h-56 bg-slate-100 overflow-hidden">
              <img
                src={prod.img}
                alt={prod.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {prod.verified && (
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                    Verified Supplier
                  </span>
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h4 className="text-[15px] font-black text-slate-900 leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                {prod.name}
              </h4>
              <p className="text-xs font-bold text-slate-500 underline decoration-slate-200 mb-3">
                {prod.seller}
              </p>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2 border-b border-slate-200 pb-1">
                  <span>Quantity</span>
                  <span>Wholesale Price</span>
                </div>
                {prod.tiers.map((tier, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm font-bold text-slate-700 mb-1 last:mb-0"
                  >
                    <span>{tier.qty}</span>
                    <span className="text-slate-900 font-black">
                      {tier.price}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-5">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {prod.origin}
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <Star size={14} className="fill-amber-500" /> {prod.rating} (
                  {prod.reviews})
                </span>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-3">
                <button
                  className="w-full bg-blue-50 text-blue-700 border border-blue-100 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab("Messages");
                  }}
                >
                  Contact
                </button>
                <button className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-black text-xs uppercase tracking-wider hover:bg-slate-800 transition-all">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MyOrdersView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900">My Orders</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Track your active shipments and past purchases.
          </p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50">
          <FileText size={16} /> Download Invoice
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Order ID & Date
                </th>
                <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Product details
                </th>
                <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Amount
                </th>
                <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Status
                </th>
                <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myOrders.map((order, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5">
                    <p className="font-black text-sm text-blue-600">
                      {order.id}
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      {order.date}
                    </p>
                  </td>
                  <td className="p-5">
                    <p className="font-black text-sm text-slate-800">
                      {order.item}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      Supplier: {order.supplier} • Qty:{" "}
                      <span className="font-bold text-slate-700">
                        {order.qty}
                      </span>
                    </p>
                  </td>
                  <td className="p-5 font-black text-slate-900">
                    {order.amount}
                  </td>
                  <td className="p-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === "Delivered"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : order.status === "In Transit"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}
                    >
                      {order.status === "Delivered" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <Clock size={12} />
                      )}{" "}
                      {order.status}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <button className="text-xs font-black text-blue-600 hover:underline">
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PostRFQView = () => (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900">
          Post Requirement (RFQ)
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Get quotes from verified Indian manufacturers within 24 hours.
        </p>
      </div>
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
              Product Name
            </label>
            <input
              type="text"
              placeholder="e.g. Organic Basmati Rice"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-600 outline-none transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                Quantity Required
              </label>
              <input
                type="number"
                placeholder="e.g. 500"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-600 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                Unit
              </label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:border-blue-600 outline-none transition-colors">
                <option>Kilograms (kg)</option>
                <option>Tons</option>
                <option>Pieces</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
              Detailed Description
            </label>
            <textarea
              rows="4"
              placeholder="Describe your requirement (certifications needed, destination port, etc.)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-600 outline-none transition-colors resize-none"
            ></textarea>
          </div>
          <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Submit RFQ Request
          </button>
        </div>
      </div>
    </div>
  );

  const MessagesView = () => {
    const [activeChat, setActiveChat] = useState(null);
    const chatList = [
      "Kisan Export Co.",
      "Royal Kashmir Weaves",
      "Malabar Spices",
    ];

    return (
      <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-0 md:gap-6 animate-in fade-in duration-500 overflow-hidden">
        <div
          className={`w-full md:w-1/3 bg-white border-b md:border-b-0 md:border border-slate-200 md:rounded-3xl p-4 flex-col shadow-none md:shadow-sm h-full ${activeChat !== null ? "hidden md:flex" : "flex"}`}
        >
          <h3 className="font-black text-xl md:text-lg px-2 mb-4 text-slate-900">
            Messages
          </h3>
          <div className="space-y-2 overflow-y-auto pr-2">
            {chatList.map((name, i) => (
              <div
                key={i}
                onClick={() => setActiveChat(i)}
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${activeChat === i ? "bg-blue-50 border border-blue-100" : "hover:bg-slate-50 border border-transparent"}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-sm text-slate-900">{name}</h4>
                  <span className="text-[10px] font-bold text-slate-400">
                    10:42 AM
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  Yes, we can provide the phytosanitary certificate.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`flex-1 bg-white md:border border-slate-200 md:rounded-3xl flex-col shadow-none md:shadow-sm h-full ${activeChat === null ? "hidden md:flex" : "flex"}`}
        >
          <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10 md:rounded-t-3xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveChat(null)}
                className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h3 className="font-black text-lg text-slate-900">
                  {activeChat !== null ? chatList[activeChat] : "Select a Chat"}
                </h3>
                {activeChat !== null && (
                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified Supplier
                  </p>
                )}
              </div>
            </div>
            {activeChat !== null && (
              <button className="text-xs md:text-sm font-bold text-blue-600 bg-blue-50 px-3 md:px-4 py-2 rounded-lg transition-colors hover:bg-blue-100">
                Profile
              </button>
            )}
          </div>

          <div className="flex-1 bg-slate-50 p-4 md:p-6 overflow-y-auto">
            {activeChat !== null ? (
              <>
                <div className="flex justify-end mb-4">
                  <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-sm text-sm max-w-[85%] md:max-w-md shadow-sm">
                    Hi, what is the minimum order quantity for export?
                  </div>
                </div>
                <div className="flex justify-start mb-4">
                  <div className="bg-white border border-slate-200 text-slate-800 p-3 rounded-2xl rounded-tl-sm text-sm max-w-[85%] md:max-w-md shadow-sm">
                    Hello Ashish! Our MOQ is 100kg. Yes, we provide all
                    certificates.
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-bold">
                Select a conversation to start messaging.
              </div>
            )}
          </div>

          <div className="p-3 md:p-4 bg-white border-t border-slate-100 flex items-center gap-2 md:gap-3 md:rounded-b-3xl">
            <button className="p-2 md:p-3 bg-slate-50 text-slate-500 hover:text-blue-600 rounded-xl transition-colors">
              <UploadCloud size={20} />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              disabled={activeChat === null}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 md:px-4 py-2 md:py-3 text-sm focus:border-blue-600 outline-none text-slate-900 transition-colors disabled:cursor-not-allowed"
            />
            <button
              disabled={activeChat === null}
              className="p-2 md:p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SettingsView = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900">
          Profile & Settings
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Manage your business profile and preferences.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-sm">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-black shadow-lg mb-4 relative">
              {getInitials(user?.fullName || "Guest User")}
              <button className="absolute bottom-0 right-0 p-1.5 bg-white text-slate-900 rounded-full shadow-md border border-slate-200">
                <Camera size={14} />
              </button>
            </div>
            <h3 className="font-black text-lg">
              {user?.fullName || "Guest User"}
            </h3>
            <p className="text-xs font-bold text-slate-500 mb-4">
              Global Partner
            </p>
            <div className="bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest py-2 rounded-lg flex items-center justify-center gap-1">
              <ShieldCheck size={14} /> Verified Buyer
            </div>
          </div>
        </div>
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h3 className="font-black text-xl mb-6 border-b border-slate-100 pb-4">
            Business Details
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.fullName || ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.company || ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={user?.email || ""}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Shipping Address
              </label>
              <input
                type="text"
                defaultValue={user?.address || ""}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none"
              />
            </div>
            <div className="pt-4 flex gap-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-md">
                Save Changes
              </button>
              <button className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-sans text-slate-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} shadow-2xl lg:shadow-none`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          {/* Logo aur Title ko ek sath group kiya (Left Aligned) */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Transparent Trade Logo"
              className="w-11 h-12 rounded-sm  shadow-md"
            />
            <div className="flex flex-col justify-center">
              <h1 className="text-[13px] font-black tracking-tight text-slate-900 leading-tight uppercase">
                <span className="text-blue-600">Transparent</span>
                <br />
                Trade Exchange
              </h1>
              {/* Sub-brand / Powered by tag */}
              <span className="text-[8px] font-black text-slate-600 tracking-[0.2em] uppercase mt-0.5">
                By Niryat Arambh
              </span>
            </div>
          </div>

          {/* Close Button (Right Aligned) */}
          <button
            className="lg:hidden p-2 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          <p className="px-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
            Sourcing Menu
          </p>
          {[
            { name: "Marketplace", icon: <ShoppingBag size={18} /> },
            { name: "My Orders", icon: <Package size={18} /> },
            { name: "Post RFQ", icon: <FileText size={18} /> },
            { name: "Messages", icon: <MessageSquare size={18} /> },
            { name: "Settings", icon: <Settings size={18} /> },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
                setSelectedProduct(null); // 🔥 TAB CHANGE PE PRODUCT DETAIL BAND KARO
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === item.name && !selectedProduct ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {item.icon} {item.name}
            </button>
          ))}

          {/* 🔥 Logout Button in Sidebar */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 mt-8 rounded-xl transition-all font-bold text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </nav>
      </aside>

      {/* OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto w-full flex flex-col relative z-10">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="relative hidden sm:flex w-full max-w-2xl">
              <input
                type="text"
                placeholder="Search products, suppliers, or HS codes..."
                className="w-full bg-white border-2 border-slate-300 rounded-l-xl py-2.5 pl-4 pr-4 text-sm font-medium focus:outline-none focus:border-blue-600 transition-colors"
              />
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-r-xl font-black flex items-center gap-2 hover:bg-blue-700 transition-colors">
                <Search size={18} /> Search
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-4">
            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-bold text-slate-600 hover:text-blue-600 px-4 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/buyer/register"
                  className="flex items-center gap-2 bg-slate-900 text-white text-sm font-black px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-md"
                >
                  <UserPlus size={18} /> Register Free
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <button
                  className="hidden sm:block bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-colors"
                  onClick={() => {
                    setActiveTab("Post RFQ");
                    setSelectedProduct(null);
                  }}
                >
                  Post Requirement
                </button>
                <button className="relative text-slate-500 hover:text-slate-900 transition-colors">
                  <Bell size={22} />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* 👤 Dynamic Profile Dropdown */}
                <div className="relative">
                  <div
                    className="flex items-center gap-2 cursor-pointer border-l border-slate-200 pl-5"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-md">
                      {getInitials(user?.fullName)}
                    </div>
                    <div className="hidden md:block">
                      <p className="text-xs font-black text-slate-900 leading-none">
                        {user?.fullName || "Buyer"}
                      </p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase">
                        Verified
                      </p>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 hidden md:block transition-transform ${showDropdown ? "rotate-180" : ""}`}
                    />
                  </div>

                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <button
                        onClick={() => {
                          setActiveTab("Settings");
                          setSelectedProduct(null);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        My Profile
                      </button>
                      <hr className="my-1 border-slate-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-[1400px] w-full mx-auto flex-1">
          {!isLoggedIn && activeTab === "Marketplace" && !selectedProduct && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Star className="fill-amber-500 text-amber-500" size={24} />
                <div>
                  <p className="font-black text-sm">
                    Unlock Wholesale Pricing & Contact Suppliers Directly!
                  </p>
                  <p className="text-xs font-medium mt-0.5">
                    Join 50,000+ verified buyers on Niryat Arambh.
                  </p>
                </div>
              </div>
              <Link
                to="/buyer/register"
                className="w-full sm:w-auto bg-amber-500 text-white px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest shadow-md hover:bg-amber-600 transition-colors text-center"
              >
                Register For Free
              </Link>
            </div>
          )}

          {/* 🔥 DYNAMIC VIEWS RENDERING */}
          {selectedProduct ? (
            <MarketplaceProductDetailView />
          ) : (
            <>
              {activeTab === "Marketplace" && <MarketplaceView />}
              {activeTab === "My Orders" && <MyOrdersView />}
              {activeTab === "Post RFQ" && <PostRFQView />}
              {activeTab === "Messages" && <MessagesView />}
              {activeTab === "Settings" && <SettingsView />}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default BuyerDashboard;
