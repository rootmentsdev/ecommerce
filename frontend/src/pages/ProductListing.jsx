import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Card, Badge } from 'react-bootstrap';
import { ArrowLeft, Search, Funnel, People, Palette, Star } from 'react-bootstrap-icons';
import { useNavigate, useLocation } from 'react-router-dom';

// Import images
import demo1 from '../assets/demo1.png';
import demo2 from '../assets/demo2.png';
import demo3 from '../assets/demo3.png';

// Import reusable components
import ProductCard from '../components/common/ProductCard';
import HorizontalScroll from '../components/common/HorizontalScroll';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';
import FilterSidebar from '../components/common/FilterSidebar';
import ModernSearchBar from '../components/common/ModernSearchBar';

// Import constants and utilities
import { APP_CONFIG } from '../constants';

const ProductListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get filter type from URL params or location state
  const filterType = location.state?.filterType || 'all';
  const filterTitle = location.state?.title || 'All Products';
  const isRentalPage = location.state?.isRental || false;
  const isBuyPage = location.state?.isBuy || false;
  const showProducts = location.state?.showProducts || false;

  // Product data with categories and detailed information
  const ALL_PRODUCTS = [
    { 
      id: '507f1f77bcf86cd799439021', 
      name: 'Premium Black Tuxedo - Italian Fit', 
      price: 1200, 
      actualPrice: 13000,
      securityDeposit: 5000,
      image: demo1, 
      category: 'Premium Suits', 
      occasion: 'Formal', 
      size: 'M', 
      type: 'newArrivals',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      fabric: 'Premium Wool Blend',
      color: 'Black',
      style: 'Two-Piece (Blazer + Trousers)',
      occasions: ['Wedding Guest', 'Corporate Events', 'Reception', 'Cocktail Party'],
      inclusions: ['Tuxedo Blazer', 'Formal Trousers', 'Bow Tie', 'Cummerbund'],
      care: 'Dry Clean Only'
    },
    { 
      id: '507f1f77bcf86cd799439022', 
      name: 'Elegant Navy Suit - Classic Fit', 
      price: 1400, 
      actualPrice: 15000,
      securityDeposit: 6000,
      image: demo2, 
      category: 'Premium Suits', 
      occasion: 'Wedding', 
      size: 'L', 
      type: 'newArrivals',
      description: 'A sophisticated navy suit perfect for formal occasions and business meetings.',
      fabric: 'Premium Cotton Blend',
      color: 'Navy Blue',
      style: 'Two-Piece (Blazer + Trousers)',
      occasions: ['Wedding', 'Business Meeting', 'Corporate Events', 'Formal Dinner'],
      inclusions: ['Navy Blazer', 'Matching Trousers', 'Pocket Square', 'Tie'],
      care: 'Dry Clean Only'
    },
    { 
      id: '507f1f77bcf86cd799439023', 
      name: 'Charcoal Grey Suit - Modern Fit', 
      price: 1600, 
      actualPrice: 18000,
      securityDeposit: 7000,
      image: demo3, 
      category: 'Premium Suits', 
      occasion: 'Formal', 
      size: 'XL', 
      type: 'newArrivals',
      description: 'Modern charcoal grey suit with contemporary styling and perfect fit.',
      fabric: 'Premium Wool',
      color: 'Charcoal Grey',
      style: 'Two-Piece (Blazer + Trousers)',
      occasions: ['Formal Events', 'Business', 'Wedding Guest', 'Corporate Functions'],
      inclusions: ['Charcoal Blazer', 'Matching Trousers', 'Tie', 'Cufflinks'],
      care: 'Dry Clean Only'
    },
    { 
      id: '507f1f77bcf86cd799439024', 
      name: 'Traditional Kurta Set - Black', 
      price: 1000, 
      actualPrice: 8000,
      securityDeposit: 3000,
      image: demo1, 
      category: 'Kurta', 
      occasion: 'Wedding', 
      size: 'M', 
      type: 'traditional',
      description: 'Elegant traditional kurta set perfect for weddings and festive occasions.',
      fabric: 'Cotton Silk',
      color: 'Black',
      style: 'Kurta with Pajama',
      occasions: ['Wedding', 'Festival', 'Traditional Events', 'Religious Ceremonies'],
      inclusions: ['Kurta', 'Pajama', 'Dupatta', 'Mojris'],
      care: 'Dry Clean Only'
    },
    { 
      id: '507f1f77bcf86cd799439025', 
      name: 'Indo-Western Fusion', 
      price: 1200, 
      actualPrice: 10000,
      securityDeposit: 4000,
      image: demo2, 
      category: 'Indo-Western', 
      occasion: 'Party', 
      size: 'L', 
      type: 'traditional',
      description: 'Stylish Indo-Western fusion wear combining traditional and modern elements.',
      fabric: 'Silk Blend',
      color: 'Maroon',
      style: 'Fusion Kurta with Trousers',
      occasions: ['Party', 'Cocktail Events', 'Semi-Formal', 'Cultural Events'],
      inclusions: ['Fusion Kurta', 'Formal Trousers', 'Stylish Jacket', 'Accessories'],
      care: 'Dry Clean Only'
    },
    { 
      id: 6, 
      name: 'Executive Formal Wear', 
      price: 1800, 
      actualPrice: 20000,
      securityDeposit: 8000,
      image: demo3, 
      category: 'Formal Wear', 
      occasion: 'Formal', 
      size: 'S', 
      type: 'newArrivals',
      description: 'Professional executive wear for important business meetings and formal events.',
      fabric: 'Premium Wool',
      color: 'Dark Grey',
      style: 'Three-Piece Suit',
      occasions: ['Business Meeting', 'Corporate Events', 'Formal Dinner', 'Executive Functions'],
      inclusions: ['Blazer', 'Trousers', 'Waistcoat', 'Tie', 'Pocket Square'],
      care: 'Dry Clean Only'
    },
    { 
      id: 7, 
      name: 'Royal Sherwani - Gold', 
      price: 2200, 
      actualPrice: 25000,
      securityDeposit: 10000,
      image: demo1, 
      category: 'Sherwani', 
      occasion: 'Wedding', 
      size: 'M', 
      type: 'traditional',
      description: 'Luxurious royal sherwani with intricate gold embroidery for special occasions.',
      fabric: 'Silk with Gold Work',
      color: 'Cream with Gold',
      style: 'Sherwani with Churidar',
      occasions: ['Wedding', 'Royal Events', 'Festival', 'Special Ceremonies'],
      inclusions: ['Sherwani', 'Churidar', 'Dupatta', 'Traditional Shoes'],
      care: 'Dry Clean Only'
    },
    { 
      id: 8, 
      name: 'Designer Silk Tie', 
      price: 500, 
      actualPrice: 3000,
      securityDeposit: 1000,
      image: demo2, 
      category: 'Tie', 
      occasion: 'Formal', 
      size: 'M', 
      type: 'accessories',
      description: 'Premium silk tie with elegant pattern perfect for formal occasions.',
      fabric: 'Pure Silk',
      color: 'Navy with Silver Pattern',
      style: 'Classic Tie',
      occasions: ['Formal Events', 'Business', 'Wedding', 'Corporate Functions'],
      inclusions: ['Silk Tie', 'Tie Box', 'Care Instructions'],
      care: 'Dry Clean Only'
    },
    { 
      id: 9, 
      name: 'Premium Cufflinks Set', 
      price: 300, 
      actualPrice: 2000,
      securityDeposit: 500,
      image: demo3, 
      category: 'Cufflinks', 
      occasion: 'Formal', 
      size: 'M', 
      type: 'accessories',
      description: 'Elegant cufflinks set with sophisticated design for formal wear.',
      fabric: 'Metal with Enamel',
      color: 'Silver with Blue Enamel',
      style: 'Classic Cufflinks',
      occasions: ['Formal Events', 'Business', 'Wedding', 'Corporate Functions'],
      inclusions: ['Pair of Cufflinks', 'Gift Box', 'Care Instructions'],
      care: 'Polish with Soft Cloth'
    },
    { 
      id: 10, 
      name: 'Business Professional Suit', 
      price: 1600, 
      actualPrice: 18000, 
      securityDeposit: 7000, 
      image: demo1, 
      category: 'Premium Suits', 
      occasion: 'Formal', 
      size: 'L', 
      type: 'newArrivals', 
      description: 'Professional business suit designed for corporate environments and formal meetings.', 
      fabric: 'Premium Wool Blend', 
      color: 'Dark Navy', 
      style: 'Two-Piece Suit', 
      occasions: ['Business Meeting', 'Corporate Events', 'Formal Dinner', 'Professional Functions'], 
      inclusions: ['Navy Blazer', 'Matching Trousers', 'Tie', 'Pocket Square'], 
      care: 'Dry Clean Only' 
    },
    // Additional New Arrivals Products
    { 
      id: 21, 
      name: 'Luxury Tuxedo Set', 
      price: 2000, 
      actualPrice: 25000, 
      securityDeposit: 8000, 
      image: demo2, 
      category: 'Premium Suits', 
      occasion: 'Formal', 
      size: 'M', 
      type: 'newArrivals', 
      description: 'Exclusive luxury tuxedo set for the most special occasions and formal events.', 
      fabric: 'Premium Silk Blend', 
      color: 'Midnight Black', 
      style: 'Three-Piece Tuxedo', 
      occasions: ['Gala Events', 'Award Ceremonies', 'Formal Dinners', 'Special Occasions'], 
      inclusions: ['Tuxedo Jacket', 'Formal Trousers', 'Vest', 'Bow Tie', 'Cummerbund'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 22, 
      name: 'Designer Sherwani', 
      price: 1800, 
      actualPrice: 20000, 
      securityDeposit: 7000, 
      image: demo3, 
      category: 'Traditional Wear', 
      occasion: 'Wedding', 
      size: 'L', 
      type: 'newArrivals', 
      description: 'Elegant designer sherwani with intricate embroidery and premium fabric.', 
      fabric: 'Silk with Embroidery', 
      color: 'Royal Blue', 
      style: 'Traditional Sherwani', 
      occasions: ['Wedding Ceremony', 'Reception', 'Festival', 'Special Celebration'], 
      inclusions: ['Sherwani', 'Churidar', 'Dupatta', 'Turban'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 23, 
      name: 'Modern Blazer Set', 
      price: 1600, 
      actualPrice: 18000, 
      securityDeposit: 6000, 
      image: demo1, 
      category: 'Party Wear', 
      occasion: 'Party', 
      size: 'XL', 
      type: 'newArrivals', 
      description: 'Contemporary blazer set perfect for modern parties and social gatherings.', 
      fabric: 'Premium Cotton Blend', 
      color: 'Charcoal Grey', 
      style: 'Modern Blazer', 
      occasions: ['Cocktail Party', 'Social Event', 'Date Night', 'Casual Formal'], 
      inclusions: ['Blazer', 'Trousers', 'Pocket Square'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 24, 
      name: 'Kids Formal Suit', 
      price: 600, 
      actualPrice: 4000, 
      securityDeposit: 2000, 
      image: demo2, 
      category: 'Kids Wear', 
      occasion: 'Formal', 
      size: 'S', 
      type: 'newArrivals', 
      description: 'Adorable formal suit for kids perfect for special occasions and events.', 
      fabric: 'Cotton Blend', 
      color: 'Navy Blue', 
      style: 'Kids Formal Suit', 
      occasions: ['Wedding', 'Formal Event', 'School Function', 'Special Occasion'], 
      inclusions: ['Blazer', 'Trousers', 'Shirt', 'Tie'], 
      care: 'Machine Wash' 
    },
    { 
      id: 25, 
      name: 'Celebration Kurta Set', 
      price: 1400, 
      actualPrice: 15000, 
      securityDeposit: 5000, 
      image: demo3, 
      category: 'Traditional Wear', 
      occasion: 'Celebration', 
      size: 'M', 
      type: 'newArrivals', 
      description: 'Beautiful celebration kurta set with traditional patterns and modern comfort.', 
      fabric: 'Cotton Silk', 
      color: 'Cream with Gold', 
      style: 'Traditional Kurta', 
      occasions: ['Festival', 'Celebration', 'Wedding', 'Cultural Event'], 
      inclusions: ['Kurta', 'Pyjama', 'Dupatta'], 
      care: 'Dry Clean Only' 
    },
    // Suits Category Products
    { 
      id: 11, 
      name: 'Classic Black Suit', 
      price: 1500, 
      actualPrice: 16000, 
      securityDeposit: 6000, 
      image: demo2, 
      category: 'suits', 
      occasion: 'Formal', 
      size: 'M', 
      type: 'rental', 
      description: 'Timeless black suit perfect for formal occasions and business meetings.', 
      fabric: 'Premium Wool', 
      color: 'Black', 
      style: 'Two-Piece Suit', 
      occasions: ['Wedding', 'Business Meeting', 'Formal Dinner'], 
      inclusions: ['Black Blazer', 'Matching Trousers', 'Tie'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 12, 
      name: 'Navy Blue Suit', 
      price: 1400, 
      actualPrice: 15000, 
      securityDeposit: 5500, 
      image: demo3, 
      category: 'suits', 
      occasion: 'Wedding', 
      size: 'L', 
      type: 'rental', 
      description: 'Elegant navy blue suit ideal for weddings and special occasions.', 
      fabric: 'Cotton Blend', 
      color: 'Navy Blue', 
      style: 'Two-Piece Suit', 
      occasions: ['Wedding', 'Party', 'Formal Events'], 
      inclusions: ['Navy Blazer', 'Matching Trousers', 'Pocket Square'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 13, 
      name: 'Charcoal Grey Suit', 
      price: 1600, 
      actualPrice: 17000, 
      securityDeposit: 6500, 
      image: demo1, 
      category: 'suits', 
      occasion: 'Formal', 
      size: 'XL', 
      type: 'rental', 
      description: 'Sophisticated charcoal grey suit for professional and formal events.', 
      fabric: 'Premium Wool', 
      color: 'Charcoal Grey', 
      style: 'Two-Piece Suit', 
      occasions: ['Business Meeting', 'Corporate Events', 'Formal Dinner'], 
      inclusions: ['Charcoal Blazer', 'Matching Trousers', 'Tie', 'Cufflinks'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 25, 
      name: 'Midnight Blue Suit', 
      price: 1700, 
      actualPrice: 18000, 
      securityDeposit: 7000, 
      image: demo2, 
      category: 'suits', 
      occasion: 'Wedding', 
      size: 'M', 
      type: 'rental', 
      description: 'Luxurious midnight blue suit perfect for evening events and special occasions.', 
      fabric: 'Premium Wool Blend', 
      color: 'Midnight Blue', 
      style: 'Two-Piece Suit', 
      occasions: ['Wedding', 'Evening Events', 'Formal Dinner'], 
      inclusions: ['Midnight Blue Blazer', 'Matching Trousers', 'Bow Tie', 'Cummerbund'], 
      care: 'Dry Clean Only' 
    },
    // Kurtas Category Products
    { 
      id: 14, 
      name: 'Traditional White Kurta', 
      price: 800, 
      actualPrice: 6000, 
      securityDeposit: 2000, 
      image: demo2, 
      category: 'kurtas', 
      occasion: 'Wedding', 
      size: 'M', 
      type: 'rental', 
      description: 'Classic white kurta perfect for traditional ceremonies and festivals.', 
      fabric: 'Cotton Silk', 
      color: 'White', 
      style: 'Kurta with Pajama', 
      occasions: ['Wedding', 'Festival', 'Religious Ceremonies'], 
      inclusions: ['White Kurta', 'White Pajama', 'Dupatta'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 15, 
      name: 'Designer Maroon Kurta', 
      price: 1000, 
      actualPrice: 8000, 
      securityDeposit: 3000, 
      image: demo3, 
      category: 'kurtas', 
      occasion: 'Party', 
      size: 'L', 
      type: 'rental', 
      description: 'Stylish maroon kurta with intricate embroidery for special occasions.', 
      fabric: 'Silk Blend', 
      color: 'Maroon', 
      style: 'Kurta with Churidar', 
      occasions: ['Wedding', 'Party', 'Festival'], 
      inclusions: ['Maroon Kurta', 'Churidar', 'Dupatta', 'Mojris'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 16, 
      name: 'Royal Blue Kurta Set', 
      price: 1200, 
      actualPrice: 10000, 
      securityDeposit: 4000, 
      image: demo1, 
      category: 'kurtas', 
      occasion: 'Wedding', 
      size: 'XL', 
      type: 'rental', 
      description: 'Elegant royal blue kurta set with golden embroidery for grand occasions.', 
      fabric: 'Silk with Gold Work', 
      color: 'Royal Blue', 
      style: 'Kurta with Pajama', 
      occasions: ['Wedding', 'Royal Events', 'Special Ceremonies'], 
      inclusions: ['Blue Kurta', 'Matching Pajama', 'Dupatta', 'Traditional Shoes'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 26, 
      name: 'Designer Green Kurta', 
      price: 1100, 
      actualPrice: 9000, 
      securityDeposit: 3500, 
      image: demo3, 
      category: 'kurtas', 
      occasion: 'Party', 
      size: 'L', 
      type: 'rental', 
      description: 'Stylish designer green kurta with modern cuts and contemporary styling.', 
      fabric: 'Cotton Silk Blend', 
      color: 'Forest Green', 
      style: 'Kurta with Churidar', 
      occasions: ['Party', 'Festival', 'Social Events'], 
      inclusions: ['Green Kurta', 'Churidar', 'Dupatta', 'Mojris'], 
      care: 'Dry Clean Only' 
    },
    // Baglas Category Products
    { 
      id: 17, 
      name: 'Traditional Black Bagla', 
      price: 900, 
      actualPrice: 7000, 
      securityDeposit: 2500, 
      image: demo2, 
      category: 'baglas', 
      occasion: 'Wedding', 
      size: 'M', 
      type: 'rental', 
      description: 'Classic black bagla set perfect for traditional wedding ceremonies.', 
      fabric: 'Cotton Silk', 
      color: 'Black', 
      style: 'Bagla with Pajama', 
      occasions: ['Wedding', 'Traditional Events', 'Religious Ceremonies'], 
      inclusions: ['Black Bagla', 'Matching Pajama', 'Dupatta'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 18, 
      name: 'Cream Bagla Set', 
      price: 1100, 
      actualPrice: 9000, 
      securityDeposit: 3500, 
      image: demo3, 
      category: 'baglas', 
      occasion: 'Wedding', 
      size: 'L', 
      type: 'rental', 
      description: 'Elegant cream bagla set with subtle embroidery for special occasions.', 
      fabric: 'Silk Blend', 
      color: 'Cream', 
      style: 'Bagla with Churidar', 
      occasions: ['Wedding', 'Festival', 'Traditional Events'], 
      inclusions: ['Cream Bagla', 'Churidar', 'Dupatta', 'Mojris'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 27, 
      name: 'Royal Maroon Bagla', 
      price: 1200, 
      actualPrice: 10000, 
      securityDeposit: 4000, 
      image: demo1, 
      category: 'baglas', 
      occasion: 'Wedding', 
      size: 'XL', 
      type: 'rental', 
      description: 'Regal maroon bagla with intricate gold work perfect for royal ceremonies.', 
      fabric: 'Silk with Gold Work', 
      color: 'Maroon with Gold', 
      style: 'Bagla with Pajama', 
      occasions: ['Wedding', 'Royal Events', 'Special Ceremonies'], 
      inclusions: ['Maroon Bagla', 'Matching Pajama', 'Dupatta', 'Traditional Shoes'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 28, 
      name: 'Designer Navy Bagla', 
      price: 1000, 
      actualPrice: 8000, 
      securityDeposit: 3000, 
      image: demo2, 
      category: 'baglas', 
      occasion: 'Party', 
      size: 'M', 
      type: 'rental', 
      description: 'Modern navy bagla with contemporary design elements for stylish occasions.', 
      fabric: 'Cotton Silk Blend', 
      color: 'Navy Blue', 
      style: 'Bagla with Churidar', 
      occasions: ['Party', 'Festival', 'Social Events'], 
      inclusions: ['Navy Bagla', 'Churidar', 'Dupatta', 'Mojris'], 
      care: 'Dry Clean Only' 
    },
    // Kids Wear Category Products
    { 
      id: 19, 
      name: 'Kids Royal Sherwani', 
      price: 600, 
      actualPrice: 4000, 
      securityDeposit: 1500, 
      image: demo1, 
      category: 'kids-wear', 
      occasion: 'Wedding', 
      size: 'S', 
      type: 'rental', 
      description: 'Adorable royal sherwani for little princes on special occasions.', 
      fabric: 'Cotton Silk', 
      color: 'Cream with Gold', 
      style: 'Sherwani with Churidar', 
      occasions: ['Wedding', 'Festival', 'Special Events'], 
      inclusions: ['Kids Sherwani', 'Churidar', 'Dupatta'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 20, 
      name: 'Kids Designer Kurta', 
      price: 500, 
      actualPrice: 3500, 
      securityDeposit: 1200, 
      image: demo2, 
      category: 'kids-wear', 
      occasion: 'Party', 
      size: 'M', 
      type: 'rental', 
      description: 'Stylish designer kurta for kids perfect for parties and celebrations.', 
      fabric: 'Cotton Blend', 
      color: 'Blue', 
      style: 'Kurta with Pajama', 
      occasions: ['Party', 'Festival', 'Birthday'], 
      inclusions: ['Kids Kurta', 'Matching Pajama', 'Dupatta'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 29, 
      name: 'Kids Wedding Sherwani', 
      price: 700, 
      actualPrice: 5000, 
      securityDeposit: 1800, 
      image: demo3, 
      category: 'kids-wear', 
      occasion: 'Wedding', 
      size: 'L', 
      type: 'rental', 
      description: 'Elegant wedding sherwani for little grooms on their special day.', 
      fabric: 'Silk Blend', 
      color: 'Cream with Gold', 
      style: 'Sherwani with Churidar', 
      occasions: ['Wedding', 'Special Events', 'Festival'], 
      inclusions: ['Kids Sherwani', 'Churidar', 'Dupatta', 'Traditional Shoes'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 30, 
      name: 'Kids Party Kurta', 
      price: 450, 
      actualPrice: 3000, 
      securityDeposit: 1000, 
      image: demo1, 
      category: 'kids-wear', 
      occasion: 'Party', 
      size: 'S', 
      type: 'rental', 
      description: 'Fun and colorful kurta for kids perfect for birthday parties and festivals.', 
      fabric: 'Cotton', 
      color: 'Red', 
      style: 'Kurta with Pajama', 
      occasions: ['Birthday', 'Party', 'Festival'], 
      inclusions: ['Kids Kurta', 'Matching Pajama', 'Dupatta'], 
      care: 'Dry Clean Only' 
    },
    // Party Wear Category Products
    { 
      id: 21, 
      name: 'Indo-Western Party Suit', 
      price: 1300, 
      actualPrice: 12000, 
      securityDeposit: 4500, 
      image: demo3, 
      category: 'party-wear', 
      occasion: 'Party', 
      size: 'L', 
      type: 'rental', 
      description: 'Trendy Indo-Western fusion suit perfect for parties and social events.', 
      fabric: 'Silk Blend', 
      color: 'Burgundy', 
      style: 'Fusion Suit', 
      occasions: ['Party', 'Cocktail Events', 'Social Gatherings'], 
      inclusions: ['Fusion Blazer', 'Matching Trousers', 'Stylish Shirt'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 22, 
      name: 'Designer Party Blazer', 
      price: 1000, 
      actualPrice: 8000, 
      securityDeposit: 3000, 
      image: demo1, 
      category: 'party-wear', 
      occasion: 'Party', 
      size: 'M', 
      type: 'rental', 
      description: 'Stylish designer blazer perfect for parties and social events.', 
      fabric: 'Cotton Blend', 
      color: 'Navy', 
      style: 'Single Blazer', 
      occasions: ['Party', 'Cocktail Events', 'Social Functions'], 
      inclusions: ['Designer Blazer', 'Styling Tips'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 31, 
      name: 'Trendy Party Jacket', 
      price: 1200, 
      actualPrice: 10000, 
      securityDeposit: 3800, 
      image: demo2, 
      category: 'party-wear', 
      occasion: 'Party', 
      size: 'L', 
      type: 'rental', 
      description: 'Trendy party jacket with modern cuts perfect for social gatherings.', 
      fabric: 'Silk Blend', 
      color: 'Burgundy', 
      style: 'Party Jacket', 
      occasions: ['Party', 'Social Events', 'Cocktail Parties'], 
      inclusions: ['Party Jacket', 'Styling Accessories', 'Care Instructions'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 32, 
      name: 'Fashion Forward Blazer', 
      price: 1400, 
      actualPrice: 12000, 
      securityDeposit: 4500, 
      image: demo3, 
      category: 'party-wear', 
      occasion: 'Party', 
      size: 'XL', 
      type: 'rental', 
      description: 'Fashion-forward blazer with contemporary design for stylish parties.', 
      fabric: 'Premium Cotton', 
      color: 'Charcoal', 
      style: 'Modern Blazer', 
      occasions: ['Party', 'Fashion Events', 'Social Gatherings'], 
      inclusions: ['Fashion Blazer', 'Styling Guide', 'Accessories'], 
      care: 'Dry Clean Only' 
    },
    // Celebration Wear Category Products
    { 
      id: 23, 
      name: 'Wedding Sherwani', 
      price: 2000, 
      actualPrice: 20000, 
      securityDeposit: 8000, 
      image: demo2, 
      category: 'celebration-wear', 
      occasion: 'Wedding', 
      size: 'L', 
      type: 'rental', 
      description: 'Luxurious wedding sherwani with intricate embroidery for the special day.', 
      fabric: 'Silk with Gold Work', 
      color: 'Cream with Gold', 
      style: 'Sherwani with Churidar', 
      occasions: ['Wedding', 'Royal Events', 'Special Ceremonies'], 
      inclusions: ['Wedding Sherwani', 'Churidar', 'Dupatta', 'Traditional Shoes'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 24, 
      name: 'Celebration Kurta Set', 
      price: 1500, 
      actualPrice: 12000, 
      securityDeposit: 5000, 
      image: demo3, 
      category: 'celebration-wear', 
      occasion: 'Wedding', 
      size: 'XL', 
      type: 'rental', 
      description: 'Elegant celebration kurta set perfect for wedding ceremonies and festivals.', 
      fabric: 'Silk Blend', 
      color: 'Maroon with Gold', 
      style: 'Kurta with Pajama', 
      occasions: ['Wedding', 'Festival', 'Celebration'], 
      inclusions: ['Celebration Kurta', 'Matching Pajama', 'Dupatta', 'Accessories'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 33, 
      name: 'Royal Wedding Sherwani', 
      price: 2500, 
      actualPrice: 25000, 
      securityDeposit: 10000, 
      image: demo1, 
      category: 'celebration-wear', 
      occasion: 'Wedding', 
      size: 'L', 
      type: 'rental', 
      description: 'Magnificent royal wedding sherwani with intricate gold embroidery for grand celebrations.', 
      fabric: 'Silk with Heavy Gold Work', 
      color: 'Cream with Gold', 
      style: 'Royal Sherwani with Churidar', 
      occasions: ['Wedding', 'Royal Events', 'Grand Celebrations'], 
      inclusions: ['Royal Sherwani', 'Churidar', 'Dupatta', 'Traditional Shoes', 'Accessories'], 
      care: 'Dry Clean Only' 
    },
    { 
      id: 34, 
      name: 'Festival Celebration Set', 
      price: 1800, 
      actualPrice: 15000, 
      securityDeposit: 6000, 
      image: demo2, 
      category: 'celebration-wear', 
      occasion: 'Wedding', 
      size: 'M', 
      type: 'rental', 
      description: 'Beautiful festival celebration set perfect for weddings and special occasions.', 
      fabric: 'Silk with Embroidery', 
      color: 'Navy with Silver', 
      style: 'Kurta with Pajama', 
      occasions: ['Wedding', 'Festival', 'Special Celebrations'], 
      inclusions: ['Celebration Kurta', 'Matching Pajama', 'Dupatta', 'Traditional Accessories'], 
      care: 'Dry Clean Only' 
    }
  ];

  // Rental Categories as specified
  const RENTAL_CATEGORIES = [
    { id: 1, name: 'Suits', image: demo1, category: 'suits', description: 'Premium formal suits for all occasions' },
    { id: 2, name: 'Kurtas', image: demo2, category: 'kurtas', description: 'Traditional and modern kurta sets' },
    { id: 3, name: 'Baglas', image: demo3, category: 'baglas', description: 'Elegant bagla sets for special events' },
    { id: 4, name: 'Kids Wear', image: demo1, category: 'kids-wear', description: 'Boys ethnic wear for celebrations' },
    { id: 5, name: 'Party Wear', image: demo2, category: 'party-wear', description: 'Stylish party and celebration wear' },
    { id: 6, name: 'Celebration Wear', image: demo3, category: 'celebration-wear', description: 'Special occasion celebration outfits' }
  ];

  // Trending Products for Rental Page
  const TRENDING_PRODUCTS = [
    {
      id: 1,
      name: 'Premium Black Tuxedo',
      price: 1200,
      actualPrice: 15000,
      securityDeposit: 5000,
      image: demo1,
      category: 'Premium Suits',
      occasion: 'Formal',
      size: 'M',
      rating: 4.8,
      reviews: 124,
      description: 'Elegant black tuxedo perfect for formal events and special occasions.',
      fabric: 'Premium Wool Blend',
      color: 'Black',
      style: 'Two-Piece Suit',
      occasions: ['Wedding', 'Formal Dinner', 'Corporate Event'],
      inclusions: ['Tuxedo Jacket', 'Formal Trousers', 'Bow Tie', 'Cummerbund'],
      care: 'Dry Clean Only',
      availability: 'Available',
      rentalPeriod: '3 Days'
    },
    {
      id: 2,
      name: 'Classic Navy Suit',
      price: 1100,
      actualPrice: 14000,
      securityDeposit: 4500,
      image: demo2,
      category: 'Premium Suits',
      occasion: 'Business',
      size: 'L',
      rating: 4.6,
      reviews: 98,
      description: 'Professional navy suit ideal for business meetings and corporate events.',
      fabric: 'Wool Blend',
      color: 'Navy Blue',
      style: 'Business Suit',
      occasions: ['Business Meeting', 'Corporate Event', 'Interview'],
      inclusions: ['Navy Blazer', 'Matching Trousers', 'Tie'],
      care: 'Dry Clean Only',
      availability: 'Available',
      rentalPeriod: '3 Days'
    },
    {
      id: 3,
      name: 'Traditional Kurta Set',
      price: 800,
      actualPrice: 8000,
      securityDeposit: 3000,
      image: demo3,
      category: 'Traditional Wear',
      occasion: 'Traditional',
      size: 'M',
      rating: 4.7,
      reviews: 156,
      description: 'Beautiful traditional kurta set perfect for festivals and celebrations.',
      fabric: 'Cotton Silk',
      color: 'Cream',
      style: 'Traditional Kurta',
      occasions: ['Festival', 'Wedding', 'Celebration'],
      inclusions: ['Kurta', 'Pyjama', 'Dupatta'],
      care: 'Dry Clean Only',
      availability: 'Available',
      rentalPeriod: '2 Days'
    },
    {
      id: 4,
      name: 'Elegant Sherwani',
      price: 1500,
      actualPrice: 18000,
      securityDeposit: 6000,
      image: demo1,
      category: 'Traditional Wear',
      occasion: 'Wedding',
      size: 'L',
      rating: 4.9,
      reviews: 89,
      description: 'Stunning sherwani perfect for wedding ceremonies and special occasions.',
      fabric: 'Silk',
      color: 'Maroon',
      style: 'Sherwani',
      occasions: ['Wedding', 'Reception', 'Special Event'],
      inclusions: ['Sherwani', 'Churidar', 'Dupatta', 'Turban'],
      care: 'Dry Clean Only',
      availability: 'Available',
      rentalPeriod: '3 Days'
    },
    {
      id: 5,
      name: 'Kids Party Wear',
      price: 400,
      actualPrice: 3000,
      securityDeposit: 1500,
      image: demo2,
      category: 'Kids Wear',
      occasion: 'Party',
      size: 'S',
      rating: 4.5,
      reviews: 67,
      description: 'Adorable kids party wear for special celebrations and events.',
      fabric: 'Cotton',
      color: 'Blue',
      style: 'Party Wear',
      occasions: ['Birthday Party', 'Festival', 'Celebration'],
      inclusions: ['Shirt', 'Trousers', 'Belt'],
      care: 'Machine Wash',
      availability: 'Available',
      rentalPeriod: '2 Days'
    },
    {
      id: 6,
      name: 'Celebration Blazer',
      price: 900,
      actualPrice: 10000,
      securityDeposit: 3500,
      image: demo3,
      category: 'Party Wear',
      occasion: 'Party',
      size: 'M',
      rating: 4.4,
      reviews: 78,
      description: 'Stylish blazer perfect for parties and celebrations.',
      fabric: 'Polyester Blend',
      color: 'Charcoal',
      style: 'Party Blazer',
      occasions: ['Party', 'Celebration', 'Social Event'],
      inclusions: ['Blazer', 'Trousers'],
      care: 'Dry Clean Only',
      availability: 'Available',
      rentalPeriod: '2 Days'
    }
  ];

  // Rental Features
  const RENTAL_FEATURES = [
    {
      id: 'bulk-booking',
      title: 'Bulk Booking',
      icon: People,
      description: 'Minimum 4 pieces – Ideal for groups, cousins, or teams who want coordinated dress code',
      features: ['Coordinated Dress Code', 'Group Discounts', 'Squad Styling']
    },
    {
      id: 'theme-setting',
      title: 'Theme Setting',
      icon: Palette,
      description: 'Professional suggestions for wedding or party themes',
      features: ['Wedding Themes', 'Party Themes', 'Color Coordination']
    },
    {
      id: 'dress-consultation',
      title: 'Dress Code Consultation',
      icon: Star,
      description: 'Guidance on picking the right styles for events',
      features: ['Style Guidance', 'Event-Specific Advice', 'Personal Styling']
    }
  ];

  // Buy Features
  const BUY_FEATURES = [
    {
      id: 'theme-setting',
      title: 'Theme Setting',
      icon: Palette,
      description: 'Professional suggestions for wedding or party themes',
      features: ['Wedding Themes', 'Party Themes', 'Color Coordination']
    },
    {
      id: 'dress-consultation',
      title: 'Dress Code Consultation',
      icon: Star,
      description: 'Guidance on picking the right styles for events',
      features: ['Style Guidance', 'Event-Specific Advice', 'Personal Styling']
    },
    {
      id: 'customization',
      title: 'Customization',
      icon: People,
      description: 'Both size customization and product customization available',
      features: ['Size Customization', 'Product Customization', 'Personalized Fitting']
    }
  ];

  // Filter products based on filter type
  const getFilteredProducts = () => {
    let filteredProducts;
    switch (filterType) {
      case 'newArrivals':
        filteredProducts = ALL_PRODUCTS.filter(product => product.type === 'newArrivals');
        break;
      case 'traditional':
        filteredProducts = ALL_PRODUCTS.filter(product => product.category === 'traditional');
        break;
      case 'premium':
        filteredProducts = ALL_PRODUCTS.filter(product => product.category === 'premium');
        break;
      case 'formal':
        filteredProducts = ALL_PRODUCTS.filter(product => product.category === 'formal');
        break;
      case 'sherwani':
        filteredProducts = ALL_PRODUCTS.filter(product => product.category === 'sherwani');
        break;
      case 'kurta':
        filteredProducts = ALL_PRODUCTS.filter(product => product.category === 'kurta');
        break;
      case 'indo-western':
        filteredProducts = ALL_PRODUCTS.filter(product => product.category === 'indo-western');
        break;
      case 'accessories':
        filteredProducts = ALL_PRODUCTS.filter(product => product.category === 'accessories');
        break;
      // Rental categories
      case 'suits':
        filteredProducts = ALL_PRODUCTS.filter(product => product.category === 'suits');
        break;
      case 'kurtas':
        filteredProducts = ALL_PRODUCTS.filter(product => product.category === 'kurtas');
        break;
      case 'baglas':
        filteredProducts = ALL_PRODUCTS.filter(product => product.category === 'baglas');
        break;
      case 'kids-wear':
        filteredProducts = ALL_PRODUCTS.filter(product => product.category === 'kids-wear');
        break;
      case 'party-wear':
        filteredProducts = ALL_PRODUCTS.filter(product => product.category === 'party-wear');
        break;
      case 'celebration-wear':
        filteredProducts = ALL_PRODUCTS.filter(product => product.category === 'celebration-wear');
        break;
      default:
        filteredProducts = ALL_PRODUCTS;
        break;
    }
    
    return filteredProducts;
  };

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    priceRange: [600, 25000],
    categories: [],
    occasions: [],
    sizes: []
  });

  // Update products when filterType changes
  useEffect(() => {
    const filteredProducts = getFilteredProducts();
    setProducts(filteredProducts);
  }, [filterType, location.state]);

  // Event handlers following clean code principles
  const handleBackClick = () => {
    // If we're showing products from a rental or buy category, go back to respective page
    if (showProducts && (isRentalPage || isBuyPage)) {
      navigate('/products', { 
        state: { 
          isRental: isRentalPage,
          isBuy: isBuyPage,
          title: isRentalPage ? 'Rent Now' : 'Buy Now'
        } 
      });
    } else {
      navigate(-1);
    }
  };

  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
    // TODO: Navigate to product detail page
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
    // TODO: Add to cart functionality
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterClick = () => {
    setShowFilterSidebar(true);
  };

  const handleCloseFilterSidebar = () => {
    setShowFilterSidebar(false);
  };

  const handleApplyFilters = (filters) => {
    console.log('Applied Filters:', filters);
    setAppliedFilters(filters);
  };

  const handleShowSideMenu = () => {
    setShowSideMenu(true);
  };

  const handleCloseSideMenu = () => {
    setShowSideMenu(false);
  };

  const handleCategoryClick = (category) => {
    navigate('/products', { 
      state: { 
        filterType: category.category, 
        title: category.name,
        isRental: isRentalPage,
        isBuy: isBuyPage,
        showProducts: true
      } 
    });
  };

  // Filter products based on search term and applied filters
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price filter
    const matchesPrice = product.price >= appliedFilters.priceRange[0] && 
                        product.price <= appliedFilters.priceRange[1];
    
    // Category filter
    const matchesCategory = appliedFilters.categories.length === 0 || 
                           appliedFilters.categories.includes(product.category);
    
    // Occasion filter
    const matchesOccasion = appliedFilters.occasions.length === 0 || 
                           appliedFilters.occasions.includes(product.occasion);
    
    // Size filter
    const matchesSize = appliedFilters.sizes.length === 0 || 
                       appliedFilters.sizes.includes(product.size);
    
    return matchesSearch && matchesPrice && matchesCategory && matchesOccasion && matchesSize;
  });

  // Render methods following single responsibility principle
  const renderTrendingProducts = () => (
    <div className="py-5">
      <Container>
        <Row className="mb-4">
          <Col className="text-center">
            <h2 
              className="h3 fw-bold mb-3"
              style={{
                fontFamily: APP_CONFIG.FONTS.PRIMARY,
                letterSpacing: '-0.02em',
                color: '#000000'
              }}
            >
              Trending Products
            </h2>
            <p 
              className="text-dark"
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                opacity: 0.7
              }}
            >
              Most popular rental items this season
            </p>
          </Col>
        </Row>
        
        <HorizontalScroll>
          {TRENDING_PRODUCTS.map((product) => (
            <div key={product.id} style={{ width: '200px', flexShrink: 0 }}>
              <ProductCard
                product={product}
                onClick={handleProductClick}
              />
            </div>
          ))}
        </HorizontalScroll>
      </Container>
    </div>
  );

  const renderRentalFeatures = () => (
    <div className="bg-light py-5">
      <Container>
        <Row className="mb-4">
          <Col className="text-center">
            <h2 
              className="h3 fw-bold mb-3"
              style={{
                fontFamily: APP_CONFIG.FONTS.PRIMARY,
                letterSpacing: '-0.02em',
                color: '#000000'
              }}
            >
              Rental Features
            </h2>
            <p 
              className="text-dark"
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                opacity: 0.7
              }}
            >
              Special services available with our rental options
            </p>
          </Col>
        </Row>
        
        <Row className="g-4">
          {RENTAL_FEATURES.map((feature) => (
            <Col key={feature.id} xs={12} md={4} className="animate-on-scroll">
              <Card 
                className="border-0 h-100"
                style={{
                  borderRadius: '20px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                }}
              >
                <Card.Body className="p-4 text-center">
                  <div 
                    className="rounded-circle bg-dark d-flex align-items-center justify-content-center mb-4 mx-auto"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #000000, #333333)'
                    }}
                  >
                    <feature.icon size={32} className="text-white" />
                  </div>
                  <h4 
                    className="fw-bold mb-3"
                    style={{
                      fontFamily: APP_CONFIG.FONTS.PRIMARY,
                      color: '#000000'
                    }}
                  >
                    {feature.title}
                  </h4>
                  <p 
                    className="text-dark mb-0"
                    style={{
                      fontFamily: APP_CONFIG.FONTS.SECONDARY,
                      lineHeight: '1.6',
                      opacity: 0.8
                    }}
                  >
                    {feature.description}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );

  const renderBuyFeatures = () => (
    <div className="bg-light py-5">
      <Container>
        <Row className="mb-4">
          <Col className="text-center">
            <h2 
              className="h3 fw-bold mb-3"
              style={{
                fontFamily: APP_CONFIG.FONTS.PRIMARY,
                letterSpacing: '-0.02em',
                color: '#000000'
              }}
            >
              Buy Features
            </h2>
            <p 
              className="text-dark"
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                opacity: 0.7
              }}
            >
              Special services available with our purchase options
            </p>
          </Col>
        </Row>
        
        <Row className="g-4">
          {BUY_FEATURES.map((feature) => (
            <Col key={feature.id} xs={12} md={4} className="animate-on-scroll">
              <Card 
                className="border-0 h-100"
                style={{
                  borderRadius: '20px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                }}
              >
                <Card.Body className="p-4 text-center">
                  <div 
                    className="rounded-circle bg-dark d-flex align-items-center justify-content-center mb-4 mx-auto"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #000000, #333333)'
                    }}
                  >
                    <feature.icon size={32} className="text-white" />
                  </div>
                  <h4 
                    className="fw-bold mb-3"
                    style={{
                      fontFamily: APP_CONFIG.FONTS.PRIMARY,
                      color: '#000000'
                    }}
                  >
                    {feature.title}
                  </h4>
                  <p 
                    className="text-dark mb-0"
                    style={{
                      fontFamily: APP_CONFIG.FONTS.SECONDARY,
                      lineHeight: '1.6',
                      opacity: 0.8
                    }}
                  >
                    {feature.description}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );

  const renderRentalCategories = () => (
    <div className="py-5">
      <Container>
        <Row className="mb-4">
          <Col className="text-center">
            <h2 
              className="h3 fw-bold mb-3"
              style={{
                fontFamily: APP_CONFIG.FONTS.PRIMARY,
                letterSpacing: '-0.02em',
                color: '#000000'
              }}
            >
              Product Categories
            </h2>
            <p 
              className="text-dark"
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                opacity: 0.7
              }}
            >
              Choose from our wide range of men's fashion categories
            </p>
          </Col>
        </Row>
        
        <Row className="g-4">
          {RENTAL_CATEGORIES.map((category) => (
            <Col key={category.id} xs={6} md={4} lg={2} className="animate-on-scroll">
              <Card 
                className="border-0 h-100"
                style={{
                  borderRadius: '20px',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  overflow: 'hidden'
                }}
                onClick={() => handleCategoryClick(category)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.1)';
                }}
              >
                <Card.Body className="p-0">
                  <div 
                    className="position-relative"
                    style={{
                      width: '100%',
                      height: '140px',
                      backgroundImage: `url(${category.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '20px 20px 0 0'
                    }}
                  >
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
                        borderRadius: '20px 20px 0 0'
                      }}
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h6 
                      className="fw-bold mb-2"
                      style={{
                        fontFamily: APP_CONFIG.FONTS.PRIMARY,
                        color: '#000000',
                        fontSize: '15px',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {category.name}
                    </h6>
                    <p 
                      className="text-dark mb-0"
                      style={{
                        fontFamily: APP_CONFIG.FONTS.SECONDARY,
                        fontSize: '12px',
                        opacity: 0.7,
                        lineHeight: '1.4'
                      }}
                    >
                      {category.description}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );

  const renderBuyCategories = () => (
    <div className="py-5">
      <Container>
        <Row className="mb-4">
          <Col className="text-center">
            <h2 
              className="h3 fw-bold mb-3"
              style={{
                fontFamily: APP_CONFIG.FONTS.PRIMARY,
                letterSpacing: '-0.02em',
                color: '#000000'
              }}
            >
              Product Categories
            </h2>
            <p 
              className="text-dark"
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                opacity: 0.7
              }}
            >
              Choose from our wide range of men's fashion categories
            </p>
          </Col>
        </Row>
        
        <Row className="g-4">
          {RENTAL_CATEGORIES.map((category) => (
            <Col key={category.id} xs={6} md={4} lg={2} className="animate-on-scroll">
              <Card 
                className="border-0 h-100"
                style={{
                  borderRadius: '20px',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  overflow: 'hidden'
                }}
                onClick={() => handleCategoryClick(category)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.1)';
                }}
              >
                <Card.Body className="p-0">
                  <div 
                    className="position-relative"
                    style={{
                      width: '100%',
                      height: '140px',
                      backgroundImage: `url(${category.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '20px 20px 0 0'
                    }}
                  >
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
                        borderRadius: '20px 20px 0 0'
                      }}
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h6 
                      className="fw-bold mb-2"
                      style={{
                        fontFamily: APP_CONFIG.FONTS.PRIMARY,
                        color: '#000000',
                        fontSize: '15px',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {category.name}
                    </h6>
                    <p 
                      className="text-dark mb-0"
                      style={{
                        fontFamily: APP_CONFIG.FONTS.SECONDARY,
                        fontSize: '12px',
                        opacity: 0.7,
                        lineHeight: '1.4'
                      }}
                    >
                      {category.description}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );

  const renderPageHeader = () => (
    <Container className="py-3">
      <Row className="align-items-center mb-3">
        <Col xs="auto">
          <Button 
            variant="link" 
            className="p-0 text-dark"
            onClick={handleBackClick}
          >
            <ArrowLeft size={24} />
          </Button>
        </Col>
        <Col>
          <h1 
            className="h4 fw-bold mb-0"
            style={{
              fontFamily: APP_CONFIG.FONTS.PRIMARY,
              letterSpacing: '-0.02em',
              color: '#000000'
            }}
          >
            {isRentalPage ? 'Rent Now' : isBuyPage ? 'Buy Now' : filterTitle}
          </h1>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <ModernSearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onFilterClick={handleFilterClick}
            placeholder="Search products..."
          />
        </Col>
      </Row>
    </Container>
  );

  const renderProductGrid = () => (
    <Container className="py-3">
      <Row className="g-3">
        {filteredProducts.map((product) => (
          <Col key={product.id} xs={6} sm={6} md={4} lg={3}>
            <ProductCard
              product={product}
              onClick={handleProductClick}
              onAddToCart={handleAddToCart}
              showAddToCart={true}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );

  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
      <Header onMenuClick={handleShowSideMenu} />
      <div className="flex-grow-1">
        {renderPageHeader()}
              {(isRentalPage || isBuyPage) && !showProducts ? (
                <>
                  {isRentalPage ? renderRentalFeatures() : renderBuyFeatures()}
                  {isRentalPage ? renderRentalCategories() : renderBuyCategories()}
                </>
              ) : (
          renderProductGrid()
        )}
      </div>
      <Footer />
      <SideMenu 
        show={showSideMenu} 
        handleClose={handleCloseSideMenu} 
      />
      <FilterSidebar 
        show={showFilterSidebar}
        handleClose={handleCloseFilterSidebar}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default ProductListing;
