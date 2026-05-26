import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 🧩 Components Import
import Header from '../components/Header'; 

// 📄 Pages Imports
import BuyerDashboard from '../Buyer/BuyerDashbord';
import SellerDashboard from '../Seller/sellerDashbords';
import BuyerRegistration from '../Buyer/Register';
import SellerRegistration from '../Seller/SellerRegister';
import AdminDashboard from '../Admin/AdminDashbord';
import AdminLogin from '../Admin/Admin_login';
import ChoosePlan from '../pages/ChoosePlan';
import SellerLogin from '../Seller/SellerLogin';

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* =========================================
          GLOBAL HEADER (Har page par dikhega)
      ============================================= */}
      <Header />

      {/* =========================================
          MAIN CONTENT AREA (Routes render honge)
      ============================================= */}
      <div className="flex-grow bg-slate-50">
        <Routes>
          
          {/* 🔓 ALL ROUTES (Bina Protection ke testing ke liye) */}
          <Route path="/" element={<BuyerDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/buyer/register" element={<BuyerRegistration />} />
          <Route path="/seller/register" element={<SellerRegistration />} />
          <Route path="/seller/choose-plan" element={<ChoosePlan />} />
          <Route path="/seller/login" element={<SellerLogin />} />
          


          {/* 🛒 BUYER */}
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />

          {/* 🏢 SELLER */}
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          
          {/* 👑 ADMIN */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
        </Routes>
      </div>
    </div>
  );
}

export default AppRoutes;