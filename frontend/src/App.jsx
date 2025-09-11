
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthCheck from './components/AuthCheck';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import EnquireNow from './pages/EnquireNow';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';
import './fonts.css';

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Routes>
        {/* Home page as base route */}
        <Route path="/" element={<HomePage />} />
        
        {/* Login page with auth check */}
        <Route path="/login" element={
          <AuthCheck>
            <LoginPage />
          </AuthCheck>
        } />
        
        {/* Protected routes */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/enquire" element={<EnquireNow />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
