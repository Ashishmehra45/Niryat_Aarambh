import React, { useState, useEffect } from "react";
import { Search, Star, CheckCircle, ShieldCheck, ChevronDown, Menu, Loader2, Package, Send, PlusCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/axiosConfig"; // Tera axios instance

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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.buyerName || !formData.buyerPhone || !formData.productName || !formData.quantity) {
      toast.error("Please fill in all the required fields.");
      return;
    }
    
    setLoading(true);
    try {
      // Yahan api endpoint apne backend ke hisaab se set kar lena
      // await api.post("/buyers/post-requirement", formData);
      
      // Fake delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Requirement posted successfully! Sellers will contact you shortly.");
      setIsOpen(false);
      setFormData({ buyerName: "", buyerPhone: "", productName: "", quantity: "", unit: "Kg" });
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
              <h3 className="text-[15px] font-bold text-slate-800">Can't find what you need?</h3>
              <p className="text-xs text-slate-500 mt-0.5">Post your specific requirement and let sellers quote you.</p>
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
              <PlusCircle size={18} className="text-blue-600" /> Tell us what you need
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-700"
            >
              Close
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Row 1: Contact Info */}
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                name="buyerName"
                value={formData.buyerName}
                onChange={handleChange}
                placeholder="Your Name / Company Name" 
                className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm text-slate-700 placeholder:text-slate-400"
              />
              <input 
                type="tel" 
                name="buyerPhone"
                value={formData.buyerPhone}
                onChange={handleChange}
                placeholder="Your Phone Number" 
                className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {/* Row 2: Product Info */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-[2]">
                <input 
                  type="text" 
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Product Name (e.g. Organic Tomatoes)" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm text-slate-700 placeholder:text-slate-400"
                />
              </div>
              
              <div className="flex-1 flex gap-2">
                <input 
                  type="number" 
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Quantity" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm text-slate-700 placeholder:text-slate-400"
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
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 min-w-[120px]"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
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

  const filters = [
    "Tomato", "Organic Tomato", "Cherry Tomato", "Sun Dried Tomatoes", "Frozen Tomatoes", "Fresh Vegetables"
  ];

  // --- API CALL TO FETCH ALL PRODUCTS ---
  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const res = await api.get("/buyers/products"); 
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products. Please try again.");
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
          Verified Exporters for <span className="font-normal text-slate-600">tomato</span>
        </h2>
        
        {/* Horizontal scrollable tags for mobile, wrap on desktop */}
        <div className="flex overflow-x-auto sm:flex-wrap gap-2 sm:gap-3 pb-2 sm:pb-0 scrollbar-hide">
          {filters.map((filter, index) => (
            <button 
              key={index}
              className="whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-full border border-slate-200 text-[13px] sm:text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors bg-white shadow-sm"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* POST REQUIREMENT FORM */}
      <PostRequirementForm />

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-2" size={40} />
          <p className="font-semibold">Loading global catalogue...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center">
          <Package size={48} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">No products found</h3>
          <p className="text-sm text-slate-500">Check back later for new inventory.</p>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((prod) => (
            <div 
              key={prod._id} 
              onClick={() => setActiveCard(prod._id)}
              className={`bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                activeCard === prod._id 
                  ? "border-2 border-[#10b981] shadow-md scale-[1.02]" 
                  : "border border-slate-200 hover:border-slate-300 hover:shadow-md"
              }`}
            >
              <div className="p-3 sm:p-4 bg-slate-50">
                {prod.productImage ? (
                   <img 
                   src={prod.productImage} 
                   alt={prod.productName} 
                   className="w-full h-40 sm:h-48 object-cover rounded-md" 
                 />
                ) : (
                  <div className="w-full h-40 sm:h-48 bg-slate-200 rounded-md flex items-center justify-center">
                    <Package size={32} className="text-slate-400" />
                  </div>
                )}
              </div>
              
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 bg-white">
                <h4 className="font-bold text-[13px] sm:text-sm text-slate-800 mt-3 h-10 line-clamp-2 leading-tight">
                  {prod.productName}
                </h4>
                
                <div className="mt-2 sm:mt-3">
                  <p className="text-base sm:text-lg font-black text-slate-900">
                    ${prod.price} <span className="text-xs font-medium text-slate-500">/ {prod.unit}</span>
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                    MOQ: {prod.moq} {prod.moqUnit}
                  </p>
                </div>

                <div className="mt-3 sm:mt-4">
                  <p className="text-[11px] sm:text-xs font-bold text-slate-800">
                    {prod.companyName || "Verified Seller"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="text-yellow-400 fill-yellow-400 sm:w-3 sm:h-3" />
                    ))}
                    <span className="text-[10px] sm:text-[11px] text-slate-600 ml-1">4.5 (12)</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1.5 sm:mt-2 line-clamp-1">
                    Exports To: UK, USA, Australia
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <span className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-bold ${prod.verifiedExporter === 'Verified' ? 'text-emerald-600' : 'text-amber-500'}`}>
                    <CheckCircle size={10} className="sm:w-3 sm:h-3" /> 
                    {prod.verifiedExporter === 'Verified' ? 'Verified Exporter' : 'Pending Verification'}
                  </span>
                  <span className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-bold ${prod.gstVerified === 'Verified' ? 'text-emerald-600' : 'text-amber-500'}`}>
                    <ShieldCheck size={10} className="sm:w-3 sm:h-3" /> 
                    {prod.gstVerified === 'Verified' ? 'GST Verified' : 'GST Pending'}
                  </span>
                </div>

                <button className="w-full mt-4 sm:mt-5 bg-[#1f5f67] hover:bg-[#15464c] text-white py-2 sm:py-2.5 rounded-lg font-bold text-[13px] sm:text-sm transition-colors shadow-md">
                  Contact Supplier
                </button>
              </div>
            </div>
          ))}
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