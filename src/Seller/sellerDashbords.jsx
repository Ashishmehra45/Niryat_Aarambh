import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ImageIcon,
  Edit2,
  Trash2,
  Package,
  MessageSquare,
  CheckCircle2,
  GitCommit,
  BarChart2,
  ShieldCheck,
  X,
  Users,
  Eye,
  Menu,
  PlusCircle,
  UploadCloud,
  TrendingUp,
  LogOut,
  Loader2,
  MapPin,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";

const SellerDashboard = () => {
  const navigate = useNavigate();

  const [editingProductId, setEditingProductId] = useState(null); // 🔥 Ye missing tha!

  // Edit button click handler
  const handleEditProduct = (product) => {
    setEditingProductId(product._id);

    // Basic Data bharna
    setProductData({
      productName: product.productName,
      category: product.category,
      price: product.price,
      unit: product.unit,
      moq: product.moq,
      moqUnit: product.moqUnit,
      description: product.description,
    });

    // Main Image Preview
    setProductImagePreview(product.productImage);
    setProductImage(null); // Nayi file upload tak null rahega

    // Timeline Data bharna (Agar DB me hai toh)
    if (product.productTimeline && product.productTimeline.length > 0) {
      const formattedTimeline = product.productTimeline.map((step) => ({
        date: step.date,
        title: step.title,
        description: step.description,
        image: null,
        preview: step.timelineImage || null, // DB wali image ka url
      }));
      setTimelineEvents(formattedTimeline);
    } else {
      // Agar empty hai toh default empty step
      setTimelineEvents([
        { date: "", title: "", description: "", image: null, preview: null },
      ]);
    }

    // Modal Open karo
    setIsAddModalOpen(true);
  };

  // Handle Add Product Button (Reset modal states)
  const handleAddNewProductClick = () => {
    setEditingProductId(null);
    setProductData({
      productName: "",
      category: "",
      price: "",
      unit: "",
      moq: "",
      moqUnit: "",
      description: "",
    });
    setProductImagePreview(null);
    setProductImage(null);
    setTimelineEvents([
      { date: "", title: "", description: "", image: null, preview: null },
    ]);
    setIsAddModalOpen(true);
  };

  // Image Preview States
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState([
    { date: "", title: "", description: "", image: null, preview: null },
  ]);

  // Timeline Handlers
  const handleTimelineChange = (index, field, value) => {
    const newTimeline = [...timelineEvents];
    newTimeline[index][field] = value;
    setTimelineEvents(newTimeline);
  };
  const handleTimelineImageChange = (index, file) => {
    if (file) {
      const newTimeline = [...timelineEvents];
      newTimeline[index].image = file;
      newTimeline[index].preview = URL.createObjectURL(file);
      setTimelineEvents(newTimeline);
    }
  };
  const addTimelineEvent = () =>
    setTimelineEvents([
      ...timelineEvents,
      { date: "", title: "", description: "", image: null, preview: null },
    ]);
  const removeTimelineEvent = (index) => {
    if (timelineEvents.length > 1)
      setTimelineEvents(timelineEvents.filter((_, i) => i !== index));
  };

  // --- STATE ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPlan] = useState("Free");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Products Data State
  const [loading, setLoading] = useState(false);
  const [myProducts, setMyProducts] = useState([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);

  const [productData, setProductData] = useState({
    productName: "",
    category: "",
    price: "",
    unit: "",
    moq: "",
    moqUnit: "",
    description: "",
  });
  const [productImage, setProductImage] = useState(null);

  // --- MENU ITEMS (Tera Original) ---
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      tiers: ["Free", "Basic", "Premium"],
    },
    {
      id: "products",
      label: "My Products",
      icon: Package,
      tiers: ["Free", "Basic", "Premium"],
    },
    {
      id: "chat",
      label: "Direct Buyer Chat",
      icon: MessageSquare,
      tiers: ["Basic", "Premium"],
    },
    {
      id: "timeline",
      label: "Supply Chain Timeline",
      icon: GitCommit,
      tiers: ["Premium"],
    },
    {
      id: "analytics",
      label: "Visits & Analytics",
      icon: BarChart2,
      tiers: ["Premium"],
    },
    {
      id: "badge",
      label: "Verified Badge",
      icon: ShieldCheck,
      tiers: ["Premium"],
    },
  ];
  // --- HANDLERS ---
  const handleMenuClick = (item) => {
    if (item.tiers.includes(currentPlan)) {
      setActiveTab(item.id);
      setIsMobileMenuOpen(false);
    } else {
      toast.error(`Upgrade to unlock ${item.label}`);
    }
  };

  // --- FETCH PRODUCTS LOGIC ---
  useEffect(() => {
    if (activeTab === "products") {
      fetchMyProducts();
    }
  }, [activeTab]);

  // Frontend API Call
  const fetchMyProducts = async () => {
    setFetchingProducts(true);
    try {
      // Axios interceptor ab apne aap 'Authorization: Bearer <token>' bhej dega
      const res = await api.get("/sellers/my-products");
      setMyProducts(res.data.products || []);
    } catch (error) {
      // Agar error 401 hai, toh toast mat dikhao kyunki interceptor redirect kar raha hai
      if (error.response && error.response.status !== 401) {
        toast.error(error.response?.data?.error || "Failed to load products");
      }
    } finally {
      setFetchingProducts(false);
    }
  };

  // --- LOGOUT LOGIC ---
  const handleLogout = async () => {
    try {
      // 1. Sabse pehle localStorage saaf karo (Frontend Cleanup First)
      // Isse garantee ho jayegi ki chahe backend chale ya na chale, token pakka udeyga
      localStorage.removeItem("sellerToken");
      localStorage.removeItem("sellerId");
      localStorage.removeItem("sellerData");

      // 2. Ab Backend api hit karo
      await api.post("/sellers/logout");

      // 3. Success Message
      toast.success("Logged out successfully!");
    } catch (error) {
      console.warn("Backend logout failed, but local session cleared.");
      // Chahe error bhi aaye, message success ka hi do kyunki token delete ho chuka hai
      toast.success("Logged out successfully!");
    } finally {
      // 4. Sabse end mein navigate karo
      setTimeout(() => {
        // window.location.href use karna zyada safe hai logout ke time
        // kyunki ye page ko hard refresh kar deta hai, jisse purani state clear ho jati hai
        window.location.href = "/seller/login";
      }, 500);
    }
  };

  // --- ADD PRODUCT LOGIC ---
  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    // Naya product banate waqt image zaroori hai, par Edit me purani image chalegi
    if (!productImage && !editingProductId) {
      return toast.error("Please upload a product image!");
    }

    setLoading(true);

    const formData = new FormData();
    // ID bhejna optional hai agar backend req.user.id use kar raha hai, par safe side ke liye bhej rahe hain
    formData.append("sellerId", localStorage.getItem("sellerId"));

    // 1. Basic Product Data append
    Object.keys(productData).forEach((key) =>
      formData.append(key, productData[key]),
    );

    // 2. Main Product Image (Agar nayi upload ki hai)
    if (productImage) {
      formData.append("productImage", productImage);
    }

    // 3. 🔥 Timeline Text Data (Stringify karke)
    const cleanTimelineData = timelineEvents.map((event) => ({
      date: event.date,
      title: event.title,
      description: event.description,
    }));
    formData.append("timelineData", JSON.stringify(cleanTimelineData));

    // 4. 🔥 Timeline Images (Loop chala kar dynamically append karna)
    timelineEvents.forEach((event, index) => {
      // Agar is specific step ke liye koi nayi image upload hui hai
      if (event.image) {
        formData.append(`timelineImage_${index}`, event.image);
      }
    });

    try {
      // Check karo ki Naya product ban raha hai ya Edit ho raha hai
      if (editingProductId) {
        // 🔄 UPDATE PRODUCT API
        // Endpoint apne backend ke hisaab se check kar lena (e.g., /sellers/update-product/:id)
        await api.put(`/sellers/update-product/${editingProductId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product timeline & details updated!");
      } else {
        // 🆕 CREATE PRODUCT API (Tera original route)
        await api.post("/sellers/add-product", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added successfully!");
      }

      // Successful hone ke baad Modal close aur Form Reset
      setIsAddModalOpen(false);
      setEditingProductId(null); // Edit state reset
      setProductImage(null);
      setProductImagePreview(null); // Preview bhi reset
      setProductData({
        productName: "",
        category: "",
        price: "",
        unit: "",
        moq: "",
        moqUnit: "",
        description: "",
      });
      // Timeline ko bhi initial ek khali step pe reset kar do
      setTimelineEvents([
        { date: "", title: "", description: "", image: null, preview: null },
      ]);

      // Reload list after adding/updating
      if (activeTab === "products") fetchMyProducts();
    } catch (error) {
      // Agar 401 aaye toh interceptor sambhal lega, baaki errors yahan dikhenge
      if (error.response && error.response.status !== 401) {
        toast.error(error.response?.data?.error || "Failed to save product");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) =>
    setProductData({ ...productData, [e.target.name]: e.target.value });
  // --- MAIN PRODUCT IMAGE HANDLER ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file); // File backend ke liye save ho rahi hai
      setProductImagePreview(URL.createObjectURL(file)); // Image ka preview UI par dikhane ke liye
    }
  };

  // Stats for Dashboard Tab
  const stats = [
    {
      label: "Total Views",
      value: "Unlock",
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Active Inquiries",
      value: "2",
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Profile Ranking",
      value: "Low",
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 overflow-hidden font-sans relative">
      <Toaster position="top-right" />

      {/* MOBILE BACKDROP */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800">Seller Hub</h2>
          </div>

          <div className="p-4 flex flex-col gap-1 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <Icon size={18} />{" "}
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* LOGOUT BUTTON AT BOTTOM */}
          <div className="p-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all"
            >
              <LogOut size={18} /> <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="bg-white px-8 py-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-bold capitalize">
            {activeTab.replace("-", " ")}
          </h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-600"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="p-8 max-w-6xl mx-auto">
          {/* TAB 1: DASHBOARD (Original UI retained) */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-hover hover:shadow-md"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        {stat.label}
                      </p>
                      <h3 className="text-2xl font-black text-slate-800">
                        {stat.value}
                      </h3>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center`}
                    >
                      <stat.icon size={24} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg shadow-blue-600/20 gap-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome!</h2>
                  <p className="text-blue-100 text-sm">
                    Start adding products to the global exchange.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-white text-blue-600 font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <PlusCircle size={18} /> Add New Product
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MY PRODUCTS (NEW PREMIUM UI) */}
          {/* TAB 2: MY PRODUCTS (NEW PREMIUM UI) */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">
                  Your Catalogue
                </h2>
                <button
                  onClick={handleAddNewProductClick}
                  className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 hover:shadow-lg transition-all text-sm shadow-blue-600/20"
                >
                  <PlusCircle size={16} /> Add Product
                </button>
              </div>

              {fetchingProducts ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                  <Loader2
                    className="animate-spin mb-3 text-blue-500"
                    size={36}
                  />
                  <p className="font-semibold text-sm tracking-wide uppercase">
                    Loading your catalogue...
                  </p>
                </div>
              ) : myProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center flex flex-col items-center shadow-sm">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5">
                    <Package size={36} className="text-slate-400" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">
                    No products found
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 max-w-sm">
                    You haven't added any products to your global exchange yet.
                    Start listing to reach international buyers.
                  </p>
                  <button
                    onClick={handleAddNewProductClick}
                    className="bg-blue-50 text-blue-600 font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-100 transition-colors"
                  >
                    <PlusCircle size={18} /> Add Your First Product
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col h-full"
                    >
                      {/* Product Image Area */}
                      <div className="h-48 overflow-hidden bg-slate-100 relative shrink-0">
                        {product.productImage ? (
                          <img
                            src={product.productImage}
                            alt={product.productName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package size={40} className="text-slate-300" />
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md shadow-sm ${product.verifiedExporter === "Verified" ? "bg-green-500 text-white" : "bg-amber-400 text-white"}`}
                          >
                            {product.verifiedExporter === "Verified"
                              ? "Verified"
                              : "Pending"}
                          </span>
                          {product.productTimeline &&
                            product.productTimeline.length > 0 && (
                              <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md bg-blue-600 text-white shadow-sm flex items-center gap-1">
                                <GitCommit size={10} />{" "}
                                {product.productTimeline.length} Steps
                              </span>
                            )}
                        </div>
                      </div>

                      {/* Product Details Area */}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="mb-auto">
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-3 inline-block uppercase tracking-wider">
                            {product.category}
                          </span>
                          <h3 className="text-lg font-black text-slate-800 line-clamp-2 leading-tight mb-3">
                            {product.productName}
                          </h3>
                          <p className="text-2xl font-black text-slate-800 mb-4">
                            ${product.price}{" "}
                            <span className="text-sm font-medium text-slate-500">
                              /{product.unit}
                            </span>
                          </p>

                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 grid grid-cols-2 gap-3 text-sm mb-5">
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                                Min. Order
                              </p>
                              <p className="font-bold text-slate-700">
                                {product.moq} {product.moqUnit}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                                Company
                              </p>
                              <p className="font-bold text-slate-700 truncate">
                                {product.companyName || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* ACTION BUTTONS (Edit & Delete) */}
                        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="col-span-3 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                          >
                            <Edit2 size={16} /> Edit Timeline & Details
                          </button>
                          <button
                            onClick={() => {
                              /* Tera delete logic yahan aayega */
                            }}
                            className="col-span-1 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white py-2.5 rounded-xl transition-colors flex items-center justify-center"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PREMIUM ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-white/20">
            {/* --- MODAL HEADER --- */}
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white z-10">
              <div>
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Package size={24} className="text-blue-600" /> Add New
                  Product
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Fill in the product details and build its lifecycle timeline.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2.5 rounded-full transition-all bg-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* --- SCROLLABLE CONTENT (2 COLUMNS) --- */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 sm:p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* ================= COLUMN 1: PRODUCT DETAILS ================= */}
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                    Basic Information
                  </h4>

                  {/* MAIN IMAGE UPLOAD (WITH PREVIEW) */}
                  <div className="relative w-full h-56 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-center overflow-hidden group cursor-pointer shadow-sm">
                    {productImagePreview ? (
                      <>
                        <img
                          src={productImagePreview}
                          alt="Product Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm">
                          <UploadCloud size={24} className="text-white mb-2" />
                          <span className="text-sm font-bold text-white tracking-wide">
                            Change Image
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-500 transition-colors">
                        <div className="w-16 h-16 bg-slate-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center mb-3 transition-colors">
                          <ImageIcon size={28} />
                        </div>
                        <p className="text-sm font-bold text-slate-700">
                          Upload Product Image
                        </p>
                        <p className="text-xs mt-1">High quality, up to 5MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                  </div>

                  {/* TERA PURANA FORM LOGIC (Unchanged, just styled better) */}
                  <form className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        {
                          label: "Product Name",
                          name: "productName",
                          type: "text",
                          placeholder: "e.g. Fresh Green Tomato",
                        },
                        { label: "Category", name: "category", type: "select" },
                        {
                          label: "Price (USD)",
                          name: "price",
                          type: "number",
                          placeholder: "0.00",
                        },
                        {
                          label: "Unit",
                          name: "unit",
                          type: "text",
                          placeholder: "e.g. Kg",
                        },
                        {
                          label: "Min. Order (MOQ)",
                          name: "moq",
                          type: "number",
                          placeholder: "100",
                        },
                        {
                          label: "MOQ Unit",
                          name: "moqUnit",
                          type: "text",
                          placeholder: "e.g. Ton",
                        },
                      ].map((field) => (
                        <div key={field.name} className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            {field.label}
                          </label>
                          {field.type === "select" ? (
                            <select
                              name={field.name}
                              value={productData[field.name]}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm shadow-sm"
                            >
                              <option value="">Select Category</option>
                              <option value="Agriculture">Agriculture</option>
                              <option value="Textiles">Textiles</option>
                              <option value="Machinery">Machinery</option>
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              name={field.name}
                              value={productData[field.name]}
                              onChange={handleInputChange}
                              placeholder={field.placeholder}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm shadow-sm placeholder:text-slate-300"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Product Description
                      </label>
                      <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your product's quality, origin, and unique selling points..."
                        rows="4"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm resize-none shadow-sm placeholder:text-slate-300"
                      ></textarea>
                    </div>
                  </form>
                </div>

                {/* ================= COLUMN 2: TIMELINE BUILDER ================= */}
                <div className="space-y-6 flex flex-col h-full">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2 shrink-0">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <GitCommit size={14} className="text-blue-500" />{" "}
                      Lifecycle Timeline
                    </h4>
                    <button
                      type="button"
                      onClick={addTimelineEvent}
                      className="text-xs font-bold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <PlusCircle size={14} /> Add Step
                    </button>
                  </div>

                  {/* Timeline Items Container */}
                  <div className="space-y-4 overflow-y-auto pr-2 pb-4 custom-scrollbar flex-1">
                    {timelineEvents.map((event, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-2xl border border-slate-200 relative group shadow-sm hover:shadow-md transition-shadow flex gap-4"
                      >
                        {/* Delete Step Button */}
                        {timelineEvents.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTimelineEvent(index)}
                            className="absolute -top-2.5 -right-2.5 bg-white border border-slate-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-full p-1.5 shadow-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}

                        {/* TIMELINE IMAGE UPLOAD (WITH PREVIEW) */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 flex items-center justify-center shrink-0 cursor-pointer relative overflow-hidden group/img transition-all">
                          {event.preview ? (
                            <>
                              <img
                                src={event.preview}
                                alt="Timeline Step"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[1px]">
                                <UploadCloud size={16} className="text-white" />
                              </div>
                            </>
                          ) : (
                            // ✅ CORRECTED CODE (Ise replace kar de)
                            <div className="flex flex-col items-center text-slate-400 group-hover/img:text-blue-500 transition-colors">
                              <ImageIcon size={20} className="mb-1" />
                              <span className="text-[9px] font-bold uppercase tracking-wider">
                                Photo
                              </span>
                            </div>
                          )}
                          <input
                            type="file"
                            onChange={(e) =>
                              handleTimelineImageChange(
                                index,
                                e.target.files[0],
                              )
                            }
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                          />
                        </div>

                        {/* TIMELINE INPUT FIELDS */}
                        <div className="flex-1 flex flex-col gap-2.5">
                          <div className="flex gap-2.5">
                            <input
                              type="text"
                              placeholder="Date (e.g. 10 Feb)"
                              value={event.date}
                              onChange={(e) =>
                                handleTimelineChange(
                                  index,
                                  "date",
                                  e.target.value,
                                )
                              }
                              className="w-1/3 px-3 py-2 text-xs border border-slate-200 bg-slate-50 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                            />
                            <input
                              type="text"
                              placeholder="Step Title (e.g. Seed Sowing)"
                              value={event.title}
                              onChange={(e) =>
                                handleTimelineChange(
                                  index,
                                  "title",
                                  e.target.value,
                                )
                              }
                              className="flex-1 px-3 py-2 text-xs border border-slate-200 bg-slate-50 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                            />
                          </div>
                          <textarea
                            placeholder="Detail what happens in this step... (e.g. Uniform germination observed)"
                            value={event.description}
                            onChange={(e) =>
                              handleTimelineChange(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            rows="2"
                            className="w-full h-full px-3 py-2 text-xs border border-slate-200 bg-slate-50 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none text-slate-600 placeholder:text-slate-400 leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* --- MODAL FOOTER --- */}
            <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-3 z-10">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProduct}
                disabled={loading}
                className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                {loading ? "Publishing..." : "Publish Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
