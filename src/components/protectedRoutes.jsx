import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ role, children }) => {
  
  // ==========================================
  // 1. ADMIN ROUTE PROTECTION
  // ==========================================
  if (role === 'superadmin') {
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    
    if (!adminData || (adminData.role !== 'superadmin' && adminData.role !== 'manager')) {
      // useEffect use karte hain taaki render block na ho aur warning na aaye
      useEffect(() => { toast.error("Unauthorized! Admin access required."); }, []);
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  }

  // ==========================================
  // 2. SELLER ROUTE PROTECTION
  // ==========================================
  if (role === 'seller') {
    // 🔥 UPDATE: Yahan ab sellerData ki jagah sellerToken check karenge
    const sellerToken = localStorage.getItem('sellerToken'); 
    
    if (!sellerToken) {
      useEffect(() => { toast.error("Please login to access Seller Hub."); }, []);
      return <Navigate to="/seller/login" replace />;
    }
    return children;
  }

  // ==========================================
  // 3. BUYER ROUTE PROTECTION
  // ==========================================
  if (role === 'buyer') {
    // Agar buyer ke liye bhi token banaya hai toh 'buyerToken' check kar lena, warna data theek hai
    const buyerData = localStorage.getItem('buyerData'); 
    
    if (!buyerData) {
      useEffect(() => { toast.error("Please login to continue as a buyer."); }, []);
      return <Navigate to="/buyer/login" replace />; 
    }
    return children;
  }

  // Fallback agar koi galat role pass ho jaye
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;