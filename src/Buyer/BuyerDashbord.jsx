import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Star,
  CheckCircle,
  ShieldCheck,
  CheckCircle2,
  Store,
  ChevronDown,
  Menu,
  Loader2,
  Package,
  Send,
  PlusCircle,
  Clock,
  X,
  Navigation,
  MessageSquareText,
  TrendingUp,
  MapPin,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/axiosConfig";

// --- POST REQUIREMENT COMPONENT ---
const PostRequirementForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerPhone: "",
    productName: "",
    quantity: "",
    unit: "Kg",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.buyerName ||
      !formData.buyerPhone ||
      !formData.productName ||
      !formData.quantity
    ) {
      toast.error("Please fill in all the required fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/buyers/post-requirements", formData);
      toast.success(
        response.data.message || "Requirement posted successfully!",
      );
      setIsOpen(false);
      setFormData({
        buyerName: "",
        buyerPhone: "",
        productName: "",
        quantity: "",
        unit: "Kg",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to post requirement.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
      {!isOpen ? (
        <div
          onClick={() => setIsOpen(true)}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-blue-50/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-inner">
              <PlusCircle size={20} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-800">
                Can't find what you need?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Post your specific requirement and let sellers quote you.
              </p>
            </div>
          </div>
          <button className="hidden sm:block px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
            Post Requirement
          </button>
        </div>
      ) : (
        <div className="p-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-4">
            <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
              <PlusCircle size={18} className="text-blue-600" /> Tell us what
              you need
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-red-500 bg-slate-50 px-3 py-1.5 rounded-md"
            >
              Close
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                name="buyerName"
                value={formData.buyerName}
                onChange={handleChange}
                placeholder="Your Name / Company Name"
                className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-700 bg-slate-50 focus:bg-white"
              />
              <input
                type="tel"
                name="buyerPhone"
                value={formData.buyerPhone}
                onChange={handleChange}
                placeholder="Your Phone Number"
                className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-700 bg-slate-50 focus:bg-white"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-[2]">
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Product Name (e.g. Organic Tomatoes)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-700 bg-slate-50 focus:bg-white"
                />
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Quantity"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-700 bg-slate-50 focus:bg-white"
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-24 px-2 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm bg-slate-50 text-slate-700"
                >
                  <option value="Kg">Kg</option>
                  <option value="Ton">Ton</option>
                  <option value="Pieces">Pcs</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-w-[120px]"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                {loading ? "Posting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// --- MAIN MARKETPLACE COMPONENT ---
const MarketplaceHome = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modals States
  const [selectedProduct, setSelectedProduct] = useState(null);

  // INQUIRY MODAL STATE & FORM DATA
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    quantityRequired: "",
    unit: "Kg",
    message: "",
  });

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const res = await api.get("/buyers/products");
      setProducts(res.data.products || []);
    } catch (error) {
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  // DYNAMIC CATEGORIES
  const categories = useMemo(() => {
    const allCats = products.map((p) => p.category).filter(Boolean);
    return ["All", ...new Set(allCats)];
  }, [products]);

  // SEARCH & CATEGORY FILTER LOGIC
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Inquiry Form Handlers
  const handleInquiryChange = (e) =>
    setInquiryData({ ...inquiryData, [e.target.name]: e.target.value });

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (
      !inquiryData.buyerName ||
      !inquiryData.buyerEmail ||
      !inquiryData.buyerPhone ||
      !inquiryData.message
    ) {
      return toast.error("Please fill all required fields");
    }
    setSubmittingInquiry(true);
    try {
      await api.post("/buyers/inquiries", {
        ...inquiryData,
        productId: selectedProduct._id,
        sellerId: selectedProduct.sellerId,
      });

      toast.success("Inquiry sent directly to the seller!");
      setIsInquiryModalOpen(false);
      setInquiryData({
        buyerName: "",
        buyerEmail: "",
        buyerPhone: "",
        quantityRequired: "",
        unit: "Kg",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send inquiry. Try again.");
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] font-sans pb-20 min-h-screen">
      <Toaster position="top-right" />

      {/* 👑 HERO SECTION (Premium IndiaMART Style) */}
      <div className="bg-[#0f172a] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        ></div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14 sm:py-20 relative z-10 text-center">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            India's Premium B2B{" "}
            <span className="text-blue-500">Marketplace</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-2xl mx-auto font-medium">
            Connecting global buyers with verified sellers. Transparent trade,
            complete trust.
          </p>

          <div className="max-w-3xl mx-auto flex items-center bg-white rounded-xl p-1.5 shadow-xl focus-within:ring-4 focus-within:ring-blue-500/30 transition-all">
            <div className="pl-4 pr-2 text-slate-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, suppliers, or categories..."
              className="flex-1 w-full bg-transparent border-none outline-none text-slate-800 px-2 py-3 sm:py-3.5 text-sm sm:text-base placeholder:text-slate-400"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg font-bold text-sm sm:text-base transition-colors">
              Search
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-slate-300 text-xs font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-400" /> Verified
              Exporters
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp size={16} className="text-blue-400" /> Direct
              Wholesale
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-amber-400" /> Safe Trading
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8">
        {/* 🏷️ DYNAMIC CATEGORIES */}
        {!loading && categories.length > 1 && (
          <div className="mb-8">
            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm font-bold transition-all shadow-sm ${
                    selectedCategory === cat
                      ? "border-blue-600 bg-blue-600 text-white shadow-blue-600/20"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        <PostRequirementForm />

        {/* 📦 PRODUCT GRID */}
        <div className="mb-5">
          <h2 className="text-xl font-black text-slate-800">
            {selectedCategory === "All"
              ? searchQuery
                ? "Search Results"
                : "Trending on Platform"
              : `${selectedCategory} Products`}
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-3 text-blue-500" size={40} />
            <p className="font-bold text-sm">Loading Catalogue...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center flex flex-col items-center shadow-sm">
            <Package size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-black text-slate-700 mb-1">
              No products found
            </h3>
            <p className="text-sm text-slate-500">
              Try adjusting your search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((prod) => (
              <div
                key={prod._id}
                onClick={() => setSelectedProduct(prod)}
                className="bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col group border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* 1. IMAGE & TOP BADGES SECTION */}
                <div className="h-48 overflow-hidden bg-slate-50 relative shrink-0 p-3">
                  <span className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                    {prod.category}
                  </span>

                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
                    {prod.verifiedExporter === "Verified" && (
                      <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                        <ShieldCheck size={10} /> Exporter
                      </span>
                    )}
                    {prod.gstVerified === "Verified" && (
                      <span className="bg-blue-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                        <CheckCircle2 size={10} /> GST Verified
                      </span>
                    )}
                  </div>

                  {prod.productImage ? (
                    <img
                      src={prod.productImage}
                      alt={prod.productName}
                      className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 rounded-md flex items-center justify-center">
                      <Package size={32} className="text-slate-400" />
                    </div>
                  )}
                </div>

                {/* 2. CONTENT SECTION */}
                <div className="px-4 pb-4 bg-white flex-1 flex flex-col pt-3">
                  <h4
                    className="font-black text-[14px] text-slate-800 line-clamp-1 leading-tight group-hover:text-blue-600 transition-colors"
                    title={prod.productName}
                  >
                    {prod.productName}
                  </h4>

                  <div className="mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <p className="text-xl font-black text-[#1f5f67] leading-none">
                      ${prod.price}{" "}
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        / {prod.unit}
                      </span>
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[10px] font-bold text-slate-600">
                        MOQ:{" "}
                        <span className="text-slate-800">
                          {prod.moq} {prod.moqUnit}
                        </span>
                      </p>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${prod.status !== "inactive" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                      >
                        {prod.status !== "inactive"
                          ? prod.stock > 0
                            ? `In Stock (${prod.stock})`
                            : "In Stock"
                          : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5 truncate">
                      <Store size={12} className="text-blue-600 shrink-0" />{" "}
                      {prod.companyName}
                    </p>
                  </div>

                  <button className="w-full mt-3 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* 1. PRODUCT DETAILS MODAL (FULL TIMELINE RESTORED) */}
        {/* ========================================================= */}
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[1200px] max-h-[95vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 bg-white border border-slate-200 shadow-sm p-2 rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <X size={20} />
              </button>

              <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 text-xs text-slate-500 truncate pr-16">
                Home {">"} {selectedProduct.category} {">"}{" "}
                <span className="font-bold text-slate-700">
                  {selectedProduct.productName}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                  {/* Image Gallery */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="w-full aspect-square border border-slate-200 rounded-lg p-1 bg-white shadow-sm overflow-hidden">
                      <img
                        src={selectedProduct.productImage}
                        alt={selectedProduct.productName}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </div>

                  {/* Details Column */}
                  <div className="lg:col-span-5 flex flex-col">
                    <h1 className="text-2xl font-bold text-slate-800 leading-tight mb-2 pr-4">
                      {selectedProduct.productName}
                    </h1>
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-2xl font-black text-slate-900">
                        ${selectedProduct.price}{" "}
                        <span className="text-lg font-medium text-slate-500">
                          / {selectedProduct.unit}
                        </span>
                      </span>
                    </div>

                    <div className="space-y-3.5 text-[13px] border-b border-slate-200 pb-8 mb-6">
                      <div className="grid grid-cols-2">
                        <span className="text-slate-500">Specialty</span>
                        <span className="text-slate-800 font-medium">
                          {selectedProduct.category}
                        </span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-slate-500">State Of Origin</span>
                        <span className="text-slate-800 font-medium">
                          Maharashtra, India
                        </span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-slate-500">Packaging Size</span>
                        <span className="text-slate-800 font-medium">
                          10 Kg Box
                        </span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-slate-500">Availability</span>
                        <span className="text-emerald-600 font-bold">
                          In Stock
                        </span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-slate-500">Minimum Order</span>
                        <span className="text-slate-800 font-medium">
                          {selectedProduct.moq} {selectedProduct.moqUnit}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <button
                        onClick={() => setIsInquiryModalOpen(true)}
                        className="w-full bg-[#1f5f67] hover:bg-[#15464c] text-white py-3.5 rounded-lg font-bold transition-colors shadow-sm flex items-center justify-center gap-2 text-[15px]"
                      >
                        <Send size={18} className="-rotate-45 mb-1" /> Contact
                        Supplier
                      </button>
                    </div>
                  </div>

                  {/* 🔥 TIMELINE COLUMN (FULLY RESTORED) */}
                  <div className="lg:col-span-3">
                    <div className="border-[2px] border-dashed border-slate-300 bg-[#f4f7f9] rounded-xl p-4 sm:p-5 h-full flex flex-col">
                      <h3 className="text-[15px] sm:text-[16px] font-bold text-[#2d515a] flex items-center gap-2 mb-4 border-b border-slate-200/70 pb-3 shrink-0">
                        <Clock size={18} className="text-[#589c7c]" /> Product
                        Timeline
                      </h3>

                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[380px]">
                        {selectedProduct.productTimeline &&
                        selectedProduct.productTimeline.length > 0 ? (
                          <div className="relative border-l-[2px] border-[#589c7c]/50 ml-1.5 space-y-6 pb-2">
                            {selectedProduct.productTimeline.map(
                              (step, idx) => (
                                <div key={idx} className="relative pl-5">
                                  <div className="absolute w-[10px] h-[10px] bg-[#589c7c] rounded-full -left-[6px] top-1.5"></div>
                                  <div className="flex gap-3 items-start">
                                    {step.timelineImage ? (
                                      <img
                                        src={step.timelineImage}
                                        alt="step"
                                        className="w-[70px] h-[70px] rounded-lg object-cover border border-slate-200 shrink-0 shadow-sm bg-white"
                                      />
                                    ) : (
                                      <div className="w-[70px] h-[70px] rounded-lg bg-slate-200 shrink-0 flex items-center justify-center">
                                        <Clock
                                          size={20}
                                          className="text-slate-400"
                                        />
                                      </div>
                                    )}
                                    <div className="flex flex-col justify-start pt-0.5">
                                      <p className="text-[12px] font-semibold text-slate-700 leading-none">
                                        {step.date}
                                      </p>
                                      <p className="text-[13px] font-bold text-slate-900 leading-tight mt-1">
                                        {step.title}
                                      </p>
                                      <p className="text-[11px] text-slate-600 leading-[1.4] mt-1 pr-1 break-words">
                                        {step.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        ) : (
                          <p className="text-center text-[12px] text-slate-400 py-10">
                            No lifecycle timeline added by seller.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. INQUIRY FORM MODAL (Top Layer: z-[110]) RESTORED */}
        {/* ========================================================= */}
        {isInquiryModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300">
              <div className="px-6 py-4 bg-[#1f5f67] flex justify-between items-center text-white">
                <h3 className="font-bold flex items-center gap-2 text-lg">
                  <MessageSquareText size={20} /> Contact Seller
                </h3>
                <button
                  onClick={() => setIsInquiryModalOpen(false)}
                  className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-slate-50 p-4 flex gap-4 items-center border-b border-slate-200">
                <img
                  src={selectedProduct.productImage}
                  className="w-12 h-12 rounded object-cover border border-slate-200"
                  alt="thumb"
                />
                <div>
                  <p className="text-xs text-slate-500 font-medium">
                    Inquiring about:
                  </p>
                  <p className="text-sm font-bold text-slate-800 line-clamp-1">
                    {selectedProduct.productName}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="buyerName"
                      value={inquiryData.buyerName}
                      onChange={handleInquiryChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f5f67] outline-none text-sm bg-slate-50 focus:bg-white transition-colors"
                      placeholder="Company or Full Name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Email
                      </label>
                      <input
                        type="email"
                        name="buyerEmail"
                        value={inquiryData.buyerEmail}
                        onChange={handleInquiryChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f5f67] outline-none text-sm bg-slate-50 focus:bg-white transition-colors"
                        placeholder="Email Address"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="buyerPhone"
                        value={inquiryData.buyerPhone}
                        onChange={handleInquiryChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f5f67] outline-none text-sm bg-slate-50 focus:bg-white transition-colors"
                        placeholder="+1..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-[2] space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Quantity Required
                      </label>
                      <input
                        type="number"
                        name="quantityRequired"
                        value={inquiryData.quantityRequired}
                        onChange={handleInquiryChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f5f67] outline-none text-sm bg-slate-50 focus:bg-white transition-colors"
                        placeholder="E.g. 500"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Unit
                      </label>
                      <select
                        name="unit"
                        value={inquiryData.unit}
                        onChange={handleInquiryChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f5f67] outline-none text-sm bg-slate-50 focus:bg-white transition-colors"
                      >
                        <option value="Kg">Kg</option>
                        <option value="Ton">Ton</option>
                        <option value="Pieces">Pieces</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={inquiryData.message}
                      onChange={handleInquiryChange}
                      rows="3"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f5f67] outline-none text-sm bg-slate-50 focus:bg-white transition-colors resize-none"
                      placeholder="Let the seller know about your exact requirements..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="w-full mt-2 bg-[#1f5f67] hover:bg-[#15464c] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-[#1f5f67]/20 transition-all flex justify-center items-center gap-2"
                  >
                    {submittingInquiry ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} className="-rotate-45 mb-1" />
                    )}
                    {submittingInquiry
                      ? "Sending Inquiry..."
                      : "Send Inquiry Now"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return <MarketplaceHome />;
}
