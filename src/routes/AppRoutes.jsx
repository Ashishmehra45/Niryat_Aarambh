import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 🧩 Components Import
import Header from '../components/Header'; 
import ProtectedRoute from '../components/protectedRoutes'; // 🔥 Yahan path check kar lena ki ProtectedRoute kahan hai

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
          
          {/* 🔓 PUBLIC ROUTES (Bina Protection ke) */}
          <Route path="/" element={<BuyerDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/buyer/register" element={<BuyerRegistration />} />
          <Route path="/seller/register" element={<SellerRegistration />} />
          <Route path="/seller/choose-plan" element={<ChoosePlan />} />
          <Route path="/seller/login" element={<SellerLogin />} />

          {/* 🛒 BUYER (Ise bhi baad me protect kar sakte ho) */}
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />

          {/* 🏢 SELLER (🔥 SECURED WITH PROTECTED ROUTE) */}
          <Route 
            path="/seller/dashboard" 
            element={
              <ProtectedRoute role="seller">
                <SellerDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* 👑 ADMIN (🔥 SECURED) */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute role="superadmin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
        </Routes>
      </div>
    </div>
  );
}

export default AppRoutes;