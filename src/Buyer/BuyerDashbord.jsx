import React, { useState } from "react";
import { Search, Star, CheckCircle, ShieldCheck, ChevronDown, Menu } from "lucide-react";



// --- MAIN CONTENT COMPONENT ---
const ExporterListing = () => {
  const [activeCard, setActiveCard] = useState(100);

  const filters = [
    "Tomato", "Organic Tomato", "Cherry Tomato", "Sun Dried Tomatoes", "Frozen Tomatoes", "Fresh Vegetables"
  ];

  const products = [
    {
      id: 100,
      name: "Maharashtra Hybrid Fresh Green Tomato",
      seller: "Agrilane Private Limited",
      price: "13",
      moq: "1000",
      rating: "4.6",
      reviews: "12",
      exportsTo: "UK, USA, Australia...",
      img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 101,
      name: "A Grade Fresh Hybrid Tomato",
      seller: "AL Izma Exports",
      price: "48",
      moq: "100",
      rating: "4.5",
      reviews: "11",
      exportsTo: "UK, USA, Australia...",
      img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
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

      {/* Product Grid (Responsive: 1 col on mobile, 2 on tablet, 4 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map(prod => (
          <div 
            key={prod.id} 
            onClick={() => setActiveCard(prod.id)}
            className={`bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
              activeCard === prod.id 
                ? "border-2 border-[#10b981] shadow-md" 
                : "border border-slate-200 hover:border-slate-300 hover:shadow-md"
            }`}
          >
            <div className="p-3 sm:p-4">
              <img 
                src={prod.img} 
                alt={prod.name} 
                className="w-full h-40 sm:h-48 object-cover rounded-md" 
              />
            </div>
            
            <div className="px-4 sm:px-5 pb-4 sm:pb-5">
              <h4 className="font-bold text-[13px] sm:text-sm text-slate-800 h-10 line-clamp-2 leading-tight">
                {prod.name}
              </h4>
              
              <div className="mt-2 sm:mt-3">
                <p className="text-base sm:text-lg font-black text-slate-900">₹ {prod.price} / Kg</p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">MOQ: {prod.moq} Kg</p>
              </div>

              <div className="mt-3 sm:mt-4">
                <p className="text-[11px] sm:text-xs font-bold text-slate-800">{prod.seller}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className="text-yellow-400 fill-yellow-400 sm:w-3 sm:h-3" />
                  ))}
                  <span className="text-[10px] sm:text-[11px] text-slate-600 ml-1">{prod.rating} ({prod.reviews})</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1.5 sm:mt-2">Exports To: {prod.exportsTo}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-orange-500">
                  <CheckCircle size={10} className="sm:w-3 sm:h-3" /> Verified Exporter
                </span>
                <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-emerald-600">
                  <ShieldCheck size={10} className="sm:w-3 sm:h-3" /> GST Verified
                </span>
              </div>

              <button className="w-full mt-4 sm:mt-5 bg-[#1f5f67] hover:bg-[#15464c] text-white py-2 sm:py-2.5 rounded font-semibold text-[13px] sm:text-sm transition-colors">
                Get Latest Price
              </button>
            </div>
          </div>
        ))}
      </div>
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