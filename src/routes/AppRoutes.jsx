import React from 'react'
import { Routes, Route } from 'react-router-dom'
import BuyerDashboard from '../BuyerDashbord'
import SellerDashboard from '../sellerDashbords'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/BuyerDashboard" element={<BuyerDashboard />} />
        <Route path="/SellerDashboard" element={<SellerDashboard />} />
    </Routes>
  )
}

export default AppRoutes