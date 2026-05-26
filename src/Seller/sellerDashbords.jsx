import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
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
    if (!productImage) return toast.error("Please upload an image!");
    setLoading(true);

    const formData = new FormData();
    // ID bhejna optional hai agar backend req.user.id use kar raha hai, par safe side ke liye bhej rahe hain
    formData.append("sellerId", localStorage.getItem("sellerId")); 
    
    Object.keys(productData).forEach((key) =>
      formData.append(key, productData[key]),
    );
    formData.append("productImage", productImage);

    try {
      // Axios interceptor isme bhi token add kar dega automatically
      await api.post("/sellers/add-product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      toast.success("Product added successfully!");
      setIsAddModalOpen(false);
      setProductImage(null);
      setProductData({
        productName: "",
        category: "",
        price: "",
        unit: "",
        moq: "",
        moqUnit: "",
        description: "",
      });
      
      if (activeTab === "products") fetchMyProducts(); // Reload list after adding
    } catch (error) {
      // Agar 401 aaye toh interceptor sambhal lega, baaki errors yahan dikhenge
      if (error.response && error.response.status !== 401) {
        toast.error(error.response?.data?.error || "Failed to add product");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) =>
    setProductData({ ...productData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => {
    if (e.target.files) setProductImage(e.target.files[0]);
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
          {activeTab === "products" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">
                  Your Catalogue
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 text-sm shadow-md"
                >
                  <PlusCircle size={16} /> Add Product
                </button>
              </div>

              {fetchingProducts ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 className="animate-spin mb-2" size={32} />
                  <p>Loading your products...</p>
                </div>
              ) : myProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center">
                  <Package size={48} className="text-slate-300 mb-4" />
                  <h3 className="text-lg font-bold text-slate-700 mb-1">
                    No products found
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    You haven't added any products to your global exchange yet.
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-50 text-blue-600 font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-100 transition-colors"
                  >
                    <PlusCircle size={18} /> Add Your First Product
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                    >
                      <div className="h-48 overflow-hidden bg-slate-100 relative">
                        {product.productImage ? (
                          <img
                            src={product.productImage}
                            alt={product.productName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package size={40} className="text-slate-300" />
                          </div>
                        )}
                        <span
                          className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${product.verifiedExporter === "Verified" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          {product.verifiedExporter === "Verified"
                            ? "Verified"
                            : "Pending"}
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mb-2 inline-block">
                              {product.category}
                            </span>
                            <h3 className="text-lg font-black text-slate-800 line-clamp-1">
                              {product.productName}
                            </h3>
                          </div>
                        </div>
                        <p className="text-2xl font-black text-slate-800 mb-4">
                          ${product.price}{" "}
                          <span className="text-sm font-medium text-slate-500">
                            /{product.unit}
                          </span>
                        </p>

                        <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">
                              Min. Order
                            </p>
                            <p className="font-semibold text-slate-700">
                              {product.moq} {product.moqUnit}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">
                              Company
                            </p>
                            <p className="font-semibold text-slate-700 truncate">
                              {product.companyName || "N/A"}
                            </p>
                          </div>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800">
                Add New Product
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <form className="space-y-6">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all relative group">
                  <UploadCloud
                    size={40}
                    className="text-blue-500 mb-3 group-hover:scale-110 transition-transform"
                  />
                  <p className="text-sm font-semibold text-slate-700">
                    {productImage ? productImage.name : "Upload Product Image"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

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
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <select
                          name={field.name}
                          value={productData[field.name]}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm bg-white"
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
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your product quality, origins, or unique selling points..."
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm resize-none"
                  ></textarea>
                </div>
              </form>
            </div>

            <div className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProduct}
                disabled={loading}
                className="px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all text-sm flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : null}
                {loading ? "Submitting..." : "Submit Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
