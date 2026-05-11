import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 📄 Pages Imports
import BuyerDashboard from '../Buyer/BuyerDashbord';
import SellerDashboard from '../Seller/sellerDashbords';
import BuyerRegistration from '../Buyer/Register';
import SellerRegistration from '../Seller/SellerRegister';
import AdminDashboard from '../Admin/AdminDashbord';
import AdminLogin from '../Admin/Admin_login';

// 🛡️ Security Wrapper Import (Path check kar lena apne folder structure ke hisab se)
import ProtectedRoute from '../components/protectedRoutes'; 

function AppRoutes() {
  return (
    <Routes>
      {/* =========================================
          🔓 PUBLIC ROUTES (Bina Login Ke Access)
      ============================================= */}
      <Route path="/" element={<BuyerDashboard />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/buyer/register" element={<BuyerRegistration />} />
      <Route path="/seller/register" element={<SellerRegistration />} />

      {/* =========================================
          🔒 PROTECTED ROUTES (Login Ke Baad Access)
      ============================================= */}
      
      {/* 🛒 BUYER */}
      <Route 
        path="/buyer/dashboard" 
        element={
          <ProtectedRoute role="buyer">
            <BuyerDashboard />
          </ProtectedRoute>
        } 
      />

      {/* 🏢 SELLER */}
      <Route 
        path="/seller/dashboard" 
        element={
          <ProtectedRoute role="seller">
            <SellerDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* 👑 ADMIN */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute role="superadmin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
    </Routes>
  );
}

export default AppRoutes;