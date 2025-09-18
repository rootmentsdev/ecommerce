
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthCheck from './components/AuthCheck';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import EnquireNow from './pages/EnquireNow';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminImageManagement from './pages/AdminImageManagement';
import AboutUs from './pages/AboutUs';
import ImageTestPage from './components/ImageTestPage';
import BuyNow from './pages/BuyNow';
import RentNow from './pages/RentNow';
import './App.css';
import './fonts.css';

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <FloatingWhatsAppButton />
      <Routes>
        {/* Home page as base route */}
        <Route path="/" element={
          <PageTransition>
            <HomePage />
          </PageTransition>
        } />
        
        {/* Login page with auth check */}
        <Route path="/login" element={
          <PageTransition>
            <AuthCheck>
              <LoginPage />
            </AuthCheck>
          </PageTransition>
        } />
        
        {/* Protected routes */}
        <Route path="/home" element={
          <PageTransition>
            <HomePage />
          </PageTransition>
        } />
        <Route path="/products" element={
          <PageTransition>
            <ProductListing />
          </PageTransition>
        } />
        <Route path="/product-details" element={
          <PageTransition>
            <ProductDetails />
          </PageTransition>
        } />
        <Route path="/enquire" element={
          <PageTransition>
            <EnquireNow />
          </PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition>
            <AboutUs />
          </PageTransition>
        } />
        <Route path="/buy-now" element={
          <PageTransition>
            <BuyNow />
          </PageTransition>
        } />
        <Route path="/rent-now" element={
          <PageTransition>
            <RentNow />
          </PageTransition>
        } />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={
          <PageTransition>
            <AdminLogin />
          </PageTransition>
        } />
        <Route path="/admin/dashboard" element={
          <PageTransition>
            <AdminDashboard />
          </PageTransition>
        } />
        <Route path="/admin/images" element={
          <PageTransition>
            <AdminImageManagement />
          </PageTransition>
        } />
        <Route path="/test-images" element={
          <PageTransition>
            <ImageTestPage />
          </PageTransition>
        } />
      </Routes>
    </div>
  );
}

export default App;
