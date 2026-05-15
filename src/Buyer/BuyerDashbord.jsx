import React, { useState } from "react";
// Sabhi icons ko sahi se import kiya gaya hai (FacebookIcon etc. nahi balki Facebook)
import {
  Search, Bell, ShoppingBag, MessageSquare, MapPin,
  Star, ShieldCheck, Clock, Package, ArrowUpRight, Filter,
  FileText, UserPlus, LogIn, ChevronDown, CheckCircle2,
  Settings, Send, UploadCloud, ArrowLeft, LogOut,
  TrendingUp, Store, Menu, Activity, Info, Navigation,
  Facebook, Twitter, Linkedin, Instagram, Mail, Phone
} from "lucide-react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

// --- MAIN COMPONENT ---
const UniversalPortalContent = () => {
  const navigate = useNavigate();
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeRole, setActiveRole] = useState("BUYER");

  const products = [
    {
      id: 100,
      name: "Maharashtra Hybrid Fresh Green Tomato",
      seller: "Agrilane Private Limited",
      price: "₹ 13 / Kg",
      moq: "1000 Kg",
      img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600",
      specs: [
        { label: "Specialty", value: "Hybrid" },
        { label: "Origin", value: "Maharashtra" },
        { label: "Color", value: "Green" },
        { label: "Type", value: "Carton" },
      ],
      timeline: [
        { date: "10 Feb", title: "Seed sowing", desc: "Sowing seeds in trays." },
        { date: "10 Jun", title: "Harvesting", desc: "Harvested and graded." },
      ]
    },
    {
      id: 101,
      name: "A Grade Fresh Hybrid Tomato",
      seller: "AL Izma Exports",
      price: "₹ 48 / Kg",
      moq: "100 Kg",
      img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    }
  ];

  const MegaHeader = () => (
    <div className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="bg-[#1e293b] text-slate-300 text-[11px] font-bold px-6 py-2 flex justify-between items-center">
        <div className="flex gap-4"><span>Why Choose Us?</span><span>Help Center</span></div>
        <div className="flex bg-slate-800 rounded-full p-0.5">
          <button onClick={() => setActiveRole("BUYER")} className={`px-4 py-1 rounded-full ${activeRole === "BUYER" ? "bg-slate-600 text-white" : ""}`}>Buyer</button>
          <button onClick={() => setActiveRole("SELLER")} className={`px-4 py-1 rounded-full ${activeRole === "SELLER" ? "bg-emerald-600 text-white" : ""}`}>Seller</button>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedProduct(null)}>
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">TT</div>
          <h1 className="text-sm font-black text-slate-800 uppercase leading-tight">Transparent<br/>Trade Exchange</h1>
        </div>
        <div className="flex-1 max-w-xl mx-10 hidden md:flex border rounded-md overflow-hidden">
          <input className="flex-1 px-4 py-2 text-sm outline-none" placeholder="Search..." />
          <button className="bg-blue-600 text-white px-6"><Search size={16}/></button>
        </div>
        <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold">AM</div>
      </div>
    </div>
  );

  const PostQuerySection = () => (
    <div className="w-full bg-gradient-to-r from-slate-900 to-blue-900 py-10 px-8 rounded-2xl mb-12 text-white shadow-xl relative overflow-hidden">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><UploadCloud className="text-blue-400" /> Tell us what you need</h2>
      <p className="text-slate-300 mb-6 text-sm">Get immediate quotes from verified exporters.</p>
      <div className="flex flex-col md:flex-row gap-4 max-w-4xl relative z-10">
        <input className="flex-[2] bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm" placeholder="Product name..." />
        <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-bold transition-all">Post Requirement</button>
      </div>
      <Send size={150} className="absolute -right-10 -bottom-10 opacity-10 -rotate-12" />
    </div>
  );

  const Footer = () => (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 mt-20">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12">
        <div>
          <h3 className="text-white font-bold mb-4">TRANSPARENT TRADE</h3>
          <div className="flex gap-4 mt-4">
            <Facebook size={20} className="hover:text-white cursor-pointer" />
            <Twitter size={20} className="hover:text-white cursor-pointer" />
            <Linkedin size={20} className="hover:text-white cursor-pointer" />
          </div>
        </div>
        <div><h4 className="text-white font-bold mb-4">Contact</h4><p className="text-sm">support@trade.com</p></div>
      </div>
      <p className="text-center pt-8 text-xs">© 2026 Niryat Aarambh.</p>
    </footer>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MegaHeader />
      <main className="max-w-[1400px] mx-auto px-6 py-10">
        {!selectedProduct && <PostQuerySection />}
        {selectedProduct ? (
          <div>
            <button onClick={() => setSelectedProduct(null)} className="flex items-center gap-2 text-blue-600 mb-6 font-bold"><ArrowLeft size={16}/> Back</button>
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="bg-white p-6 rounded-xl border flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <img src={selectedProduct.img} className="rounded-lg w-full object-cover" />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                    <p className="text-3xl font-black text-blue-600 my-4">{selectedProduct.price}</p>
                    <button className="w-full bg-[#1d5c63] text-white py-3 rounded-lg">Get Price</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(prod => (
              <div key={prod.id} onClick={() => setSelectedProduct(prod)} className="bg-white border rounded-xl overflow-hidden hover:shadow-xl cursor-pointer">
                <img src={prod.img} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h4 className="font-bold text-sm h-10 line-clamp-2">{prod.name}</h4>
                  <p className="text-xl font-bold mt-2">{prod.price}</p>
                  <button className="w-full mt-4 bg-[#1d5c63] text-white py-2 rounded-lg text-xs">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

// --- WRAPPER TO PREVENT ROUTER ERRORS ---
const UniversalPortal = () => {
  return (
    <BrowserRouter>
      <Toaster />
      <UniversalPortalContent />
    </BrowserRouter>
  );
};

export default UniversalPortal;
// ```</BrowserRouter>