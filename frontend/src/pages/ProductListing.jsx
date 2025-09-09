import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { ArrowLeft, Search, Funnel } from 'react-bootstrap-icons';
import { useNavigate, useLocation } from 'react-router-dom';

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

  // Product data with categories
  const ALL_PRODUCTS = [
    { id: 1, name: 'Premium Suit', price: 1400, image: '/src/assets/demo1.png', category: 'Premium Suits', occasion: 'Formal', size: 'M', type: 'newArrivals' },
    { id: 2, name: 'Premium Suit', price: 1400, image: '/src/assets/demo2.png', category: 'Premium Suits', occasion: 'Wedding', size: 'L', type: 'newArrivals' },
    { id: 3, name: 'Premium Suit', price: 1400, image: '/src/assets/demo3.png', category: 'Premium Suits', occasion: 'Formal', size: 'XL', type: 'newArrivals' },
    { id: 4, name: 'Kurta Set - Black', price: 1400, image: '/src/assets/demo1.png', category: 'Kurta', occasion: 'Wedding', size: 'M', type: 'traditional' },
    { id: 5, name: 'Indo-Western Men', price: 1400, image: '/src/assets/demo2.png', category: 'Indo-Western', occasion: 'Party', size: 'L', type: 'traditional' },
    { id: 6, name: 'Formal Wear', price: 1800, image: '/src/assets/demo3.png', category: 'Formal Wear', occasion: 'Formal', size: 'S', type: 'newArrivals' },
    { id: 7, name: 'Sherwani', price: 2200, image: '/src/assets/demo1.png', category: 'Sherwani', occasion: 'Wedding', size: 'M', type: 'traditional' },
    { id: 8, name: 'Designer Tie', price: 500, image: '/src/assets/demo2.png', category: 'Tie', occasion: 'Formal', size: 'M', type: 'accessories' },
    { id: 9, name: 'Cufflinks', price: 300, image: '/src/assets/demo3.png', category: 'Cufflinks', occasion: 'Formal', size: 'M', type: 'accessories' },
    { id: 10, name: 'Business Suit', price: 1600, image: '/src/assets/demo1.png', category: 'Premium Suits', occasion: 'Formal', size: 'L', type: 'newArrivals' },
    { id: 11, name: 'Designer Blazer', price: 1800, image: '/src/assets/demo2.png', category: 'Premium Suits', occasion: 'Formal', size: 'M', type: 'newArrivals' },
    { id: 12, name: 'Evening Wear', price: 2200, image: '/src/assets/demo3.png', category: 'Premium Suits', occasion: 'Party', size: 'L', type: 'newArrivals' },
    { id: 13, name: 'Wedding Sherwani', price: 2500, image: '/src/assets/demo1.png', category: 'Sherwani', occasion: 'Wedding', size: 'XL', type: 'traditional' },
    { id: 14, name: 'Formal Kurta', price: 1200, image: '/src/assets/demo2.png', category: 'Kurta', occasion: 'Formal', size: 'S', type: 'traditional' },
    { id: 15, name: 'Party Wear', price: 1500, image: '/src/assets/demo3.png', category: 'Indo-Western', occasion: 'Party', size: 'M', type: 'traditional' },
    { id: 16, name: 'Silk Tie', price: 400, image: '/src/assets/demo1.png', category: 'Tie', occasion: 'Formal', size: 'M', type: 'accessories' },
    { id: 17, name: 'Gold Cufflinks', price: 600, image: '/src/assets/demo2.png', category: 'Cufflinks', occasion: 'Formal', size: 'M', type: 'accessories' },
    { id: 18, name: 'Executive Suit', price: 2000, image: '/src/assets/demo3.png', category: 'Premium Suits', occasion: 'Formal', size: 'L', type: 'newArrivals' },
    { id: 19, name: 'Traditional Kurta', price: 1000, image: '/src/assets/demo1.png', category: 'Kurta', occasion: 'Wedding', size: 'XL', type: 'traditional' },
    { id: 20, name: 'Modern Blazer', price: 1900, image: '/src/assets/demo2.png', category: 'Formal Wear', occasion: 'Formal', size: 'M', type: 'newArrivals' }
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
