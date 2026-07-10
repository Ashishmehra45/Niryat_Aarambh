import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Globe
} from "lucide-react"; // 🔥 Social icons yahan se hata diye hain taaki error na aaye
import { useNavigate } from "react-router-dom";
import logo from "../../public/image-removebg-preview.png"; // Tera logo ka path yahan set kar

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#0f172a] text-slate-300 pt-12 pb-6 sm:pt-16 sm:pb-8 font-sans border-t-[4px] border-[#1f5f67]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* 1. Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => navigate("/")}>
              <div className="w-24 h-15 flex items-center justify-center shadow-sm shrink-0">
                <img src={logo} alt="Transparent Trade Exchange Logo" className="w-24 h-24 object-contain" />
              </div>
              <div className="flex flex-col justify-center">
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-[15px] sm:text-[16px] font-black text-white uppercase leading-[1.1] tracking-tight">
                  Transparent<br />Trade Exchange
                </h1>
                <p className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase mt-0.5">
                  By Niryat Aarambh
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              Your trusted global B2B marketplace. Connecting verified exporters and global buyers with complete transparency and supply chain tracking.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="text-white font-bold text-[15px] mb-5 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Browse Products', 'Verified Exporters', 'Pricing Plans'].map((link, idx) => (
                <li key={idx}>
                  <button onClick={() => navigate("/")} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-emerald-400 transition-colors" /> {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Categories */}
          <div>
            <h4 className="text-white font-bold text-[15px] mb-5 uppercase tracking-wider">Top Categories</h4>
            <ul className="space-y-3">
              {['Fresh Vegetables', 'Organic Fruits', 'Spices & Herbs', 'Textiles & Garments', 'Industrial Machinery'].map((link, idx) => (
                <li key={idx}>
                  <button onClick={() => navigate("/")} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-emerald-400 transition-colors" /> {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Contact & Socials */}
          <div>
            <h4 className="text-white font-bold text-[15px] mb-5 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4 mb-6 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#1f5f67] shrink-0 mt-0.5" />
                <span>123 Trade Center, Business District, Mumbai, Maharashtra 400001, India</span>
              </li>
              <li className="flex items-center gap-3 hover:text-emerald-400 transition-colors cursor-pointer">
                <Phone size={18} className="text-[#1f5f67] shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 hover:text-emerald-400 transition-colors cursor-pointer">
                <Mail size={18} className="text-[#1f5f67] shrink-0" />
                <span>support@transparenttrade.com</span>
              </li>
            </ul>

            {/* Social Media Icons (Using direct SVGs to avoid Lucide Export Errors) */}
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/share/1D43ZBKWxK/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all shadow-sm">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
             
              <a href="https://www.instagram.com/niryataarambh?igsh=MW9nd2N3ZmcwdHpxNw==" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#E4405F] hover:text-white transition-all shadow-sm">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.linkedin.com/company/niryat-aarambh/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all shadow-sm">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
             
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Transparent Trade Exchange. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6 font-medium">
            <button className="hover:text-emerald-400 transition-colors">Privacy Policy</button>
            <button className="hover:text-emerald-400 transition-colors">Terms of Service</button>
            <button className="hover:text-emerald-400 transition-colors">Help Center</button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;