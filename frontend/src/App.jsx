
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthCheck from './components/AuthCheck';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import TopBanner from './components/TopBanner';
import ErrorBoundary from './components/ErrorBoundary';
import SEOService from './services/seoService';
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
import Favorites from './pages/Favorites';
import CategoryPage from './pages/CategoryPage';
import BuyNow from './pages/BuyNow';
import RentNow from './pages/RentNow';
import BuyProducts from './pages/BuyProducts';
import RentProducts from './pages/RentProducts';
import './App.css';
import './fonts.css';

function App() {
  // Initialize global SEO
  useEffect(() => {
    SEOService.initializeSEO({
      title: 'dappr SQUAD - Premium Men\'s Fashion & Suit Rental',
      description: 'Premium men\'s fashion for every celebration. Buy, Rent, or Book in Bulk. Perfect outfits for weddings, parties, squads, and more.',
      keywords: 'mens fashion, suit rental, wedding suits, party wear, men\'s clothing, formal wear, tuxedo rental, designer suits',
      type: 'website'
    });
  }, []);

  return (
    <div className="app">
      <TopBanner />
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
            <ErrorBoundary>
              <ProductListing />
            </ErrorBoundary>
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
        <Route path="/favorites" element={
          <PageTransition>
            <Favorites />
          </PageTransition>
        } />
        <Route path="/category/:category" element={
          <PageTransition>
            <CategoryPage />
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
        <Route path="/rent-products" element={
          <PageTransition>
            <ErrorBoundary>
              <RentProducts />
            </ErrorBoundary>
          </PageTransition>
        } />
        <Route path="/buy-products" element={
          <PageTransition>
            <ErrorBoundary>
              <BuyProducts />
            </ErrorBoundary>
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
