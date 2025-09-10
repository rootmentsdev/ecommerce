
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import EnquireNow from './pages/EnquireNow';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AuthService from './services/authService';
import './App.css';
import './fonts.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = () => {
      const authenticated = AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Routes>
        {/* Redirect authenticated users from login to home */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />
          } 
        />
        
        {/* Redirect unauthenticated users from protected routes to login */}
        <Route 
          path="/home" 
          element={
            isAuthenticated ? <HomePage /> : <Navigate to="/" replace />
          } 
        />
        
        {/* Other protected routes */}
        <Route 
          path="/products" 
          element={
            isAuthenticated ? <ProductListing /> : <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/product-details" 
          element={
            isAuthenticated ? <ProductDetails /> : <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/enquire" 
          element={
            isAuthenticated ? <EnquireNow /> : <Navigate to="/" replace />
          } 
        />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
