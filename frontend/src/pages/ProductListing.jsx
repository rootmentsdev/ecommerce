import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { ArrowLeft, Search, Funnel } from 'react-bootstrap-icons';
import { useNavigate, useLocation } from 'react-router-dom';

// Import images
import demo1 from '../assets/demo1.png';
import demo2 from '../assets/demo2.png';
import demo3 from '../assets/demo3.png';

// Import reusable components
import ProductCard from '../components/common/ProductCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';
import FilterSidebar from '../components/common/FilterSidebar';

// Import constants and utilities
import { APP_CONFIG } from '../constants';

const ProductListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get filter type from URL params or location state
  const filterType = location.state?.filterType || 'all';
  const filterTitle = location.state?.title || 'All Products';

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
    }
  ];

  // Filter products based on filter type
  const getFilteredProducts = () => {
    switch (filterType) {
      case 'newArrivals':
        return ALL_PRODUCTS.filter(product => product.type === 'newArrivals');
      case 'traditional':
        return ALL_PRODUCTS.filter(product => product.category === 'traditional');
      case 'premium':
        return ALL_PRODUCTS.filter(product => product.category === 'premium');
      case 'formal':
        return ALL_PRODUCTS.filter(product => product.category === 'formal');
      case 'sherwani':
        return ALL_PRODUCTS.filter(product => product.category === 'sherwani');
      case 'kurta':
        return ALL_PRODUCTS.filter(product => product.category === 'kurta');
      case 'indo-western':
        return ALL_PRODUCTS.filter(product => product.category === 'indo-western');
      case 'accessories':
        return ALL_PRODUCTS.filter(product => product.category === 'accessories');
      default:
        return ALL_PRODUCTS;
    }
  };

  const [products] = useState(getFilteredProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    priceRange: [2100, 8400],
    categories: [],
    occasions: [],
    sizes: []
  });

  // Event handlers following clean code principles
  const handleBackClick = () => {
    navigate(-1);
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
              letterSpacing: '-0.02em'
            }}
          >
            {filterTitle}
          </h1>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <InputGroup>
            <InputGroup.Text 
              className="bg-white border-end-0"
              style={{ borderRadius: '8px 0px 0px 8px' }}
            >
              <Search size={16} className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border-start-0 border-end-0"
              style={{
                borderRadius: '0px',
                fontFamily: APP_CONFIG.FONTS.SECONDARY
              }}
            />
            <Button 
              variant="dark"
              onClick={handleFilterClick}
              style={{ borderRadius: '0px 8px 8px 0px' }}
            >
              <Funnel size={16} className="text-white" />
            </Button>
          </InputGroup>
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
        {renderProductGrid()}
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
