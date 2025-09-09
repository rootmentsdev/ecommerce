import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { ArrowLeft, Search, Funnel } from 'react-bootstrap-icons';
import { useNavigate, useLocation } from 'react-router-dom';

// Import reusable components
import ProductCard from '../components/common/ProductCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
    { id: 1, name: 'Premium Suit', price: 1400, image: '/src/assets/demo1.png', category: 'premium', type: 'newArrivals' },
    { id: 2, name: 'Premium Suit', price: 1400, image: '/src/assets/demo2.png', category: 'premium', type: 'newArrivals' },
    { id: 3, name: 'Premium Suit', price: 1400, image: '/src/assets/demo3.png', category: 'premium', type: 'newArrivals' },
    { id: 4, name: 'Kurta Set - Black', price: 1400, image: '/src/assets/demo1.png', category: 'traditional', type: 'traditional' },
    { id: 5, name: 'Indo-Western Men', price: 1400, image: '/src/assets/demo2.png', category: 'traditional', type: 'traditional' },
    { id: 6, name: 'Premium Suit', price: 1400, image: '/src/assets/demo3.png', category: 'premium', type: 'newArrivals' },
    { id: 7, name: 'Premium Suit', price: 1400, image: '/src/assets/demo1.png', category: 'premium', type: 'newArrivals' },
    { id: 8, name: 'Premium Suit', price: 1400, image: '/src/assets/demo2.png', category: 'premium', type: 'newArrivals' }
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
    console.log('Filter clicked');
    // TODO: Open filter modal
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Header />
      <div className="flex-grow-1">
        {renderPageHeader()}
        {renderProductGrid()}
      </div>
      <Footer />
    </div>
  );
};

export default ProductListing;
