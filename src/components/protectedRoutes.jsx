import React from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ role, children }) => {
  
if (role === 'admin') {
  const adminData = JSON.parse(localStorage.getItem('adminData'));
  
  
  if (!adminData || (adminData.role !== 'superadmin' && adminData.role !== 'manager')) {
    toast.error("Unauthorized! Root access required.");
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}


  if (role === 'seller') {
    const sellerData = localStorage.getItem('sellerData');
    if (!sellerData) {
      toast.error("Please login to access Seller Central.");
      return <Navigate to="/seller/login" replace />; // Tera jo bhi seller login route ho wo daal dena
    }
    return children;
  }


  if (role === 'buyer') {
    const buyerData = localStorage.getItem('buyerData');
    if (!buyerData) {
      toast.error("Please login to continue.");
      return <Navigate to="/login" replace />; // Buyer ka normal login route
    }
    return children;
  }

  
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;