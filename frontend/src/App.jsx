
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import EnquireNow from './pages/EnquireNow';
import './App.css';
import './fonts.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/enquire" element={<EnquireNow />} />
      </Routes>
    </div>
  );
}

export default App;
