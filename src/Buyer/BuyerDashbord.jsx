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
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/axiosConfig"; // Tera axios instance

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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(
        "Requirement posted successfully! Sellers will contact you shortly.",
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
      toast.error("Failed to post requirement.");
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

  // Modal ke liye state
  const [selectedProduct, setSelectedProduct] = useState(null);

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
              onClick={() => setSelectedProduct(prod)} // Card click pe bhi modal khulega
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
                <button className="w-full mt-4 bg-[#1f5f67] hover:bg-[#15464c] text-white py-2 rounded-lg font-bold text-sm transition-colors shadow-md">
                  Contact Supplier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* 🔥 PREMIUM DETAILED MODAL (EXACTLY LIKE YOUR PHOTO) 🔥 */}
      {/* ========================================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[1200px] max-h-[95vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 bg-white border border-slate-200 shadow-sm p-2 rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <X size={20} />
            </button>

            {/* Breadcrumb Top Bar */}
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 text-xs text-slate-500 truncate pr-16">
              Home {">"} {selectedProduct.category} {">"}{" "}
              <span className="font-bold text-slate-700">
                {selectedProduct.productName}
              </span>
            </div>

            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                {/* ---------- COLUMN 1: Image Gallery (Span 4) ---------- */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="w-full aspect-square border border-slate-200 rounded-lg p-1 bg-white shadow-sm overflow-hidden">
                    <img
                      src={selectedProduct.productImage}
                      alt={selectedProduct.productName}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  {/* Thumbnails */}
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

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-sm font-bold text-slate-700 mb-3">
                      Get products similar to {selectedProduct.productName}
                    </p>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                      {/* Mock similar products */}
                      {[1, 2, 3].map((n) => (
                        <img
                          key={n}
                          src={selectedProduct.productImage}
                          className="w-16 h-12 object-cover rounded opacity-70 hover:opacity-100 cursor-pointer"
                          alt="similar"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* ---------- COLUMN 2: Product Details Table (Span 5) ---------- */}
                <div className="lg:col-span-5">
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
                    <button className="text-blue-600 text-sm font-bold hover:underline mb-1 tracking-wide">
                      Get Best Price
                    </button>
                  </div>

                  {/* Clean Specs Table */}
                  <div className="space-y-3.5 text-[13px] border-b border-slate-200 pb-8 mb-6">
                    <div className="grid grid-cols-2">
                      <span className="text-slate-500">Specialty</span>
                      <span className="text-slate-800 font-medium">
                        Hybrid / {selectedProduct.category}
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
                        Available in Stock
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

                  <div className="flex gap-3">
                    <button className="flex-1 bg-[#1f5f67] hover:bg-[#15464c] text-white py-3 rounded font-bold transition-colors shadow-sm">
                      Get Latest Price
                    </button>
                    <button className="flex-1 border-2 border-[#1f5f67] text-[#1f5f67] hover:bg-[#f2f7f7] py-3 rounded font-bold transition-colors">
                      Send Email
                    </button>
                  </div>
                </div>

               {/* ---------- COLUMN 3: TIMELINE (Span 3) - EXACT PHOTO MATCH ---------- */}
                <div className="lg:col-span-3">
                  {/* Outer Dashed Container (Prominent border and light bg just like the image) */}
                  <div className="border-[2px] border-dashed border-slate-400 bg-[#f4f7f9] rounded-xl p-4 sm:p-5 h-full flex flex-col">
                    
                    {/* Header */}
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-[#2d515a] flex items-center gap-2 mb-6 border-b border-slate-200/70 pb-3">
                      <Clock size={18} className="text-[#589c7c]" /> Timeline of this product
                    </h3>

                    {/* Timeline Container */}
                    <div className="flex-1">
                      {selectedProduct.productTimeline && selectedProduct.productTimeline.length > 0 ? (
                        /* The Vertical Line */
                        <div className="relative border-l-[2px] border-[#589c7c]/50 ml-1.5 space-y-6 sm:space-y-7 pb-2">
                          {selectedProduct.productTimeline.map((step, idx) => (
                            <div key={idx} className="relative pl-5 sm:pl-6">
                              
                              {/* The Sharp Green Dot positioned exactly on the line */}
                              <div className="absolute w-[10px] h-[10px] bg-[#589c7c] rounded-full -left-[6px] top-1.5"></div>

                              {/* Flex Layout: Image Left, Text Right (Responsive) */}
                              <div className="flex gap-3 sm:gap-4 items-start">
                                
                                {/* Step Image (Larger & Responsive as requested) */}
                                {step.timelineImage ? (
                                  <img
                                    src={step.timelineImage}
                                    alt="step"
                                    className="w-[80px] h-[80px] sm:w-[92px] sm:h-[92px] rounded-lg object-cover border border-slate-200 shrink-0 shadow-sm bg-white"
                                  />
                                ) : (
                                  <div className="w-[80px] h-[80px] sm:w-[92px] sm:h-[92px] rounded-lg bg-slate-200 shrink-0 flex items-center justify-center border border-slate-300">
                                    <Clock size={20} className="text-slate-400" />
                                  </div>
                                )}

                                {/* Step Text Container (Exact hierarchy: Date -> Title -> Desc) */}
                                <div className="flex flex-col justify-start pt-0.5">
                                  {/* Date */}
                                  <p className="text-[13px] sm:text-[14px] font-semibold text-slate-700 leading-none">
                                    {step.date}
                                  </p>
                                  
                                  {/* Title (Sub-heading - Bold & Dark) */}
                                  <p className="text-[14px] sm:text-[15px] font-bold text-slate-900 leading-tight mt-1.5">
                                    {step.title}
                                  </p>
                                  
                                  {/* Description (With year or any text you add) */}
                                  <p className="text-[11.5px] sm:text-[12.5px] text-slate-600 leading-[1.4] mt-1.5 pr-1 break-words">
                                    {step.description}
                                  </p>
                                </div>

                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-slate-400">
                          <GitCommit size={24} className="mx-auto mb-2 opacity-30" />
                          <p className="text-[12px] font-medium">No lifecycle timeline added.</p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Button (With Paper Plane Icon) */}
                    <div className="mt-6 pt-5">
                      <button className="w-full flex items-center justify-center gap-2 bg-white border-[1.5px] border-slate-300 hover:border-[#1f5f67] text-[#1f5f67] py-2.5 rounded-lg text-[14px] font-bold shadow-sm transition-all">
                        <Send size={16} className="-rotate-45 mb-1" /> Contact Supplier
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- APP WRAPPER ---
const App = () => {
  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans">
      <ExporterListing />
    </div>
  );
};

export default App;
