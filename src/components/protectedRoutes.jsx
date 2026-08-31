import React from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ role, children }) => {
  
  // // 1. ADMIN PROTECTION
  // if (role === 'superadmin') {
  //   const adminToken = localStorage.getItem('adminToken'); // Token check karo
  //   if (!adminToken) {
  //     toast.error("Unauthorized! Admin access required.");
  //     return <Navigate to="/admin/login" replace />;
  //   }
  //   return children;
  // }

  // 2. SELLER PROTECTION
  if (role === 'seller') {
    const sellerToken = localStorage.getItem('sellerToken'); 
    if (!sellerToken) {
      // toast trigger karo (useEffect ke bina)
      toast.error("Please login to access Seller Hub.");
      return <Navigate to="/seller/login" replace />;
    }
    return children;
  }

  // 3. BUYER PROTECTION
  if (role === 'buyer') {
    const buyerData = localStorage.getItem('buyerData'); 
    if (!buyerData) {
      toast.error("Please login to continue as a buyer.");
      return <Navigate to="/buyer/login" replace />; 
    }
    return children;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;