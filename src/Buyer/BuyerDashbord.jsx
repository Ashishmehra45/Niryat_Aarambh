import React, { useState, useEffect } from "react";
import {
  Search,
  Star,
  CheckCircle,
  ShieldCheck,
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
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/axiosConfig";

// --- POST REQUIREMENT COMPONENT (UNCHANGED) ---
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
      // API call (Assuming 'api' is an Axios instance)
      const response = await api.post('/buyers/post-requirements', formData);

      // Axios automatically parses JSON, you don't need response.json()
      // You can access your backend message via response.data.message
      toast.success(response.data.message || "Requirement posted successfully! Sellers will contact you shortly.");
      
      setIsOpen(false);
      setFormData({
        buyerName: "",
        buyerPhone: "",
        productName: "",
        quantity: "",
        unit: "Kg",
      });
    } catch (error) {
      // Axios puts backend error responses inside error.response.data
      const errorMessage = error.response?.data?.message || error.message || "Failed to post requirement.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden transition-all duration-300">
      {!isOpen ? (
        <div
          onClick={() => setIsOpen(true)}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-blue-50/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
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
          <button className="hidden sm:block px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
            Post Requirement
          </button>
        </div>
      ) : (
        <div className="p-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
              <PlusCircle size={18} className="text-blue-600" /> Tell us what
              you need
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-700"
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
                className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-700"
              />
              <input
                type="tel"
                name="buyerPhone"
                value={formData.buyerPhone}
                onChange={handleChange}
                placeholder="Your Phone Number"
                className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-700"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-700"
                />
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Quantity"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-700"
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

// --- MAIN CONTENT COMPONENT ---
const ExporterListing = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals States
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 🔥 INQUIRY MODAL STATE & FORM DATA
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

  const filters = [
    "Tomato",
    "Organic Tomato",
    "Cherry Tomato",
    "Sun Dried Tomatoes",
    "Frozen Tomatoes",
    "Fresh Vegetables",
  ];

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
      // Backend API call
      await api.post("/buyers/inquiries", {
        ...inquiryData,
        productId: selectedProduct._id,
        sellerId: selectedProduct.sellerId, // Product se seller ID uthayi
      });

      toast.success("Inquiry sent directly to the seller!");
      setIsInquiryModalOpen(false); // Modal close
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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Toaster position="top-right" />

      {/* Title & Filters */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">
          Verified Exporters for{" "}
          <span className="font-normal text-slate-600">tomato</span>
        </h2>
        <div className="flex overflow-x-auto sm:flex-wrap gap-2 sm:gap-3 pb-2 sm:pb-0 scrollbar-hide">
          {filters.map((filter, index) => (
            <button
              key={index}
              className="whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-full border border-slate-200 text-[13px] sm:text-sm text-slate-600 hover:border-[#1f5f67] hover:text-[#1f5f67] transition-colors bg-white shadow-sm"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <PostRequirementForm />

      {/* Products Grid Loading / Empty States */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-2" size={40} />
          <p className="font-semibold">Loading global catalogue...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center">
          <Package size={48} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">
            No products found
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((prod) => (
            <div
              key={prod._id}
              onClick={() => setSelectedProduct(prod)}
              className={`bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-200 flex flex-col ${
                activeCard === prod._id
                  ? "border-2 border-[#10b981] shadow-md scale-[1.02]"
                  : "border border-slate-200 hover:border-slate-300 hover:shadow-md"
              }`}
            >
              <div className="h-48 overflow-hidden bg-slate-50 relative shrink-0 p-3">
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

              <div className="px-4 pb-4 bg-white flex-1 flex flex-col">
                <h4 className="font-bold text-[13px] sm:text-sm text-slate-800 mt-2 h-10 line-clamp-2 leading-tight">
                  {prod.productName}
                </h4>
                <div className="mt-2">
                  <p className="text-base sm:text-lg font-black text-slate-900">
                    ${prod.price}{" "}
                    <span className="text-xs font-medium text-slate-500">
                      / {prod.unit}
                    </span>
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                    MOQ: {prod.moq} {prod.moqUnit}
                  </p>
                </div>
                <div className="mt-auto pt-3">
                  <p className="text-[11px] sm:text-xs font-bold text-slate-800">
                    {prod.companyName || "Verified Seller"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className="text-yellow-400 fill-yellow-400"
                      />
                    ))}
                    <span className="text-[10px] text-slate-600 ml-1">4.5</span>
                  </div>
                </div>
                {/* Clicking button also opens Modal via parent div click */}
                <button className="w-full mt-4 bg-[#1f5f67] hover:bg-[#15464c] text-white py-2 rounded-lg font-bold text-sm transition-colors shadow-md">
                  View Details & Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. PRODUCT DETAILS MODAL */}
      {/* ========================================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
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
                  {/* Fake Thumbnails */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div
                        key={num}
                        className={`w-16 h-16 shrink-0 border-2 rounded cursor-pointer p-0.5 ${num === 1 ? "border-[#1f5f67]" : "border-slate-200 hover:border-slate-300"}`}
                      >
                        <img
                          src={selectedProduct.productImage}
                          className="w-full h-full object-cover rounded-sm"
                          alt="thumb"
                        />
                      </div>
                    ))}
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
                    <div className="grid grid-cols-2">
                      <span className="text-slate-500 uppercase text-[11px] font-bold tracking-wider mt-1">
                        QUALITY
                      </span>
                      <span className="text-slate-800 font-medium">
                        Export Grade (A-Class)
                      </span>
                    </div>
                  </div>

                  {/* 🔥 Single Big Action Button inside Details Column */}
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

                {/* Timeline Column */}
                <div className="lg:col-span-3">
                  <div className="border-[2px] border-dashed border-slate-400 bg-[#f4f7f9] rounded-xl p-4 sm:p-5 h-full flex flex-col">
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-[#2d515a] flex items-center gap-2 mb-4 border-b border-slate-200/70 pb-3 shrink-0">
                      <Clock size={18} className="text-[#589c7c]" /> Timeline of
                      this product
                    </h3>

                    {/* 🔥 SCROLLABLE TIMELINE CONTAINER */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[380px]">
                      {selectedProduct.productTimeline &&
                      selectedProduct.productTimeline.length > 0 ? (
                        <div className="relative border-l-[2px] border-[#589c7c]/50 ml-1.5 space-y-6 pb-2">
                          {selectedProduct.productTimeline.map((step, idx) => (
                            <div key={idx} className="relative pl-5">
                              <div className="absolute w-[10px] h-[10px] bg-[#589c7c] rounded-full -left-[6px] top-1.5"></div>
                              <div className="flex gap-3 items-start">
                                {step.timelineImage ? (
                                  <img
                                    src={step.timelineImage}
                                    alt="step"
                                    className="w-[80px] h-[80px] rounded-lg object-cover border border-slate-200 shrink-0 shadow-sm bg-white"
                                  />
                                ) : (
                                  <div className="w-[80px] h-[80px] rounded-lg bg-slate-200 shrink-0 flex items-center justify-center">
                                    <Clock
                                      size={20}
                                      className="text-slate-400"
                                    />
                                  </div>
                                )}
                                <div className="flex flex-col justify-start pt-0.5">
                                  <p className="text-[13px] font-semibold text-slate-700 leading-none">
                                    {step.date}
                                  </p>
                                  <p className="text-[14px] font-bold text-slate-900 leading-tight mt-1.5">
                                    {step.title}
                                  </p>
                                  <p className="text-[11.5px] text-slate-600 leading-[1.4] mt-1.5 pr-1 break-words">
                                    {step.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-[12px] text-slate-400 py-10">
                          No lifecycle timeline added.
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200 shrink-0">
                      <button
                        onClick={() => setIsInquiryModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 bg-white border-[1.5px] border-slate-300 hover:border-[#1f5f67] text-[#1f5f67] py-2.5 rounded-lg text-[14px] font-bold shadow-sm transition-all"
                      >
                        <Send size={16} className="-rotate-45 mb-1" /> Contact
                        Supplier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. INQUIRY FORM MODAL (Top Layer: z-[110]) */}
      {/* ========================================================= */}
      {isInquiryModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300">
            {/* Header */}
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

            {/* Product Snippet */}
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

            {/* Form */}
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
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f5f67] outline-none text-sm text-slate-700 bg-slate-50 focus:bg-white transition-colors"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f5f67] outline-none text-sm text-slate-700 bg-slate-50 focus:bg-white transition-colors"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f5f67] outline-none text-sm text-slate-700 bg-slate-50 focus:bg-white transition-colors"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f5f67] outline-none text-sm text-slate-700 bg-slate-50 focus:bg-white transition-colors"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f5f67] outline-none text-sm text-slate-700 bg-slate-50 focus:bg-white transition-colors"
                    >
                      <option value="Kg">Kg</option>
                      <option value="Ton">Ton</option>
                      <option value="Pieces">Pieces</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Message / Details
                  </label>
                  <textarea
                    name="message"
                    value={inquiryData.message}
                    onChange={handleInquiryChange}
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1f5f67] outline-none text-sm text-slate-700 bg-slate-50 focus:bg-white transition-colors resize-none"
                    placeholder="Let the seller know about your exact requirements, delivery location, etc."
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
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans">
      <ExporterListing />
    </div>
  );
};

export default App;
