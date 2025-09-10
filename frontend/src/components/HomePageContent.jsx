import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Search, Cart, Truck, ArrowClockwise } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

// Import reusable components
import ProductCard from './common/ProductCard';
import CategoryCard from './common/CategoryCard';
import HorizontalScroll from './common/HorizontalScroll';

// Import constants and utilities
import { APP_CONFIG } from '../constants';

const HomePageContent = () => {
  const navigate = useNavigate();

  // Data constants following clean code principles
  const FEATURES = [
    { icon: Search, title: 'Browse & Select' },
    { icon: Cart, title: 'Choose Rentals' },
    { icon: Truck, title: 'Book With Deposit' },
    { icon: ArrowClockwise, title: 'Return & Refund' }
  ];

  const NEW_ARRIVALS = [
    { id: '507f1f77bcf86cd799439011', name: 'Formal Suit', price: 1400, image: '/src/assets/demo1.png' },
    { id: '507f1f77bcf86cd799439012', name: 'Formal Suit', price: 1400, image: '/src/assets/demo2.png' },
    { id: '507f1f77bcf86cd799439013', name: 'Premium Suit', price: 1400, image: '/src/assets/demo3.png' },
    { id: '507f1f77bcf86cd799439014', name: 'Designer Blazer', price: 1800, image: '/src/assets/demo1.png' },
    { id: '507f1f77bcf86cd799439015', name: 'Evening Wear', price: 2200, image: '/src/assets/demo2.png' },
    { id: '507f1f77bcf86cd799439016', name: 'Business Suit', price: 1600, image: '/src/assets/demo3.png' },
    { id: '507f1f77bcf86cd799439017', name: 'Premium Suit', price: 1400, image: '/src/assets/demo3.png' },
    { id: '507f1f77bcf86cd799439018', name: 'Premium Suit', price: 1400, image: '/src/assets/demo3.png' },
    { id: '507f1f77bcf86cd799439019', name: 'Premium Suit', price: 1400, image: '/src/assets/demo3.png' }
  ];

  const CATEGORIES = [
    { id: 1, name: 'Premium Suit', image: '/src/assets/demo1.png', category: 'premium' },
    { id: 2, name: 'Formal Wear', image: '/src/assets/demo2.png', category: 'formal' },
    { id: 3, name: 'Sherwani', image: '/src/assets/demo3.png', category: 'sherwani' },
    { id: 4, name: 'Kurta', image: '/src/assets/demo1.png', category: 'kurta' },
    { id: 5, name: 'Indo-Western', image: '/src/assets/demo2.png', category: 'indo-western' },
    { id: 6, name: 'Accessories', image: '/src/assets/demo3.png', category: 'accessories' }
  ];

  const OCCASIONS = [
    { id: 1, name: 'Wedding', image: '/src/assets/demo1.png', category: 'wedding' },
    { id: 2, name: 'Party', image: '/src/assets/demo2.png', category: 'party' },
    { id: 3, name: 'Formal', image: '/src/assets/demo3.png', category: 'formal' }
  ];

  // Event handlers following clean code principles
  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
    navigate('/product-details', { 
      state: { product } 
    });
  };

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
    navigate('/products', { 
      state: { 
        filterType: category.category, 
        title: category.name 
      } 
    });
  };

  const handleOccasionClick = (occasion) => {
    console.log('Occasion clicked:', occasion);
    navigate('/products', { 
      state: { 
        filterType: occasion.category, 
        title: occasion.name 
      } 
    });
  };

  const handleViewMoreClick = () => {
    console.log('View more clicked');
    navigate('/products', { 
      state: { 
        filterType: 'newArrivals', 
        title: 'New Arrivals' 
      } 
    });
  };

  const handleRentNowClick = () => {
    console.log('Rent now clicked');
    // TODO: Navigate to rental page
  };

  // Render methods following single responsibility principle
  const renderHeroSection = () => (
    <div 
      className="position-relative"
      style={{
        height: '50vh',
        backgroundImage: 'url(/src/assets/HomePage.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div 
        className="position-absolute bottom-0 start-0 end-0 text-white p-4"
        style={{
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
        }}
      >
        <Container>
          <Row>
            <Col>
              <h1 
                className="display-4 fw-bold mb-2"
                style={{
                  fontFamily: APP_CONFIG.FONTS.PRIMARY,
                  letterSpacing: '-0.03em'
                }}
              >
                Rent Your<br />Perfect Look
              </h1>
              <p 
                className="fs-5 mb-3 opacity-90"
                style={{
                  fontFamily: APP_CONFIG.FONTS.SECONDARY
                }}
              >
                Premium Suits, Ethnic<br />Wear & Accessories
              </p>
              <Button 
                variant="light" 
                size="lg"
                className="px-4 py-2"
                style={{
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontWeight: '600',
                  borderRadius: '0px',
                  border: 'none'
                }}
                onClick={handleRentNowClick}
              >
                Rent Now
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );

  const renderFeatureBox = (feature, index) => (
    <Col key={index} xs={3} className="px-2">
      <Card 
        className="border-0 h-100"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px 12px 0px 0px',
          minHeight: '120px'
        }}
      >
        <Card.Body className="d-flex flex-column align-items-center justify-content-center p-3">
          <div 
            className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-2"
            style={{
              width: '48px',
              height: '48px'
            }}
          >
            <feature.icon size={20} className="text-dark" />
          </div>
          <small 
            className="text-center fw-medium"
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '12px',
              lineHeight: '1.3'
            }}
          >
            {feature.title}
          </small>
        </Card.Body>
      </Card>
    </Col>
  );

  const renderFeaturesSection = () => (
    <Container className="py-4">
      <Row className="justify-content-center">
        {FEATURES.map((feature, index) => renderFeatureBox(feature, index))}
      </Row>
    </Container>
  );

  const renderNewArrivalsSection = () => (
    <Container className="py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h2 
            className="h3 fw-bold mb-0"
            style={{
              fontFamily: APP_CONFIG.FONTS.PRIMARY,
              letterSpacing: '-0.02em'
            }}
          >
            New Arrivals
          </h2>
        </Col>
        <Col xs="auto">
          <Button 
            variant="link" 
            className="p-0 text-decoration-none text-muted"
            style={{ 
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '14px'
            }}
            onClick={handleViewMoreClick}
          >
            View More &gt;
          </Button>
        </Col>
      </Row>
      
      <HorizontalScroll>
        {NEW_ARRIVALS.map((product) => (
          <div key={product.id} style={{ width: '180px', flexShrink: 0 }}>
            <ProductCard
              product={product}
              onClick={handleProductClick}
            />
          </div>
        ))}
      </HorizontalScroll>
    </Container>
  );

  const renderCategorySection = () => (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 
            className="h3 fw-bold mb-0"
            style={{
              fontFamily: APP_CONFIG.FONTS.PRIMARY,
              letterSpacing: '-0.02em'
            }}
          >
            Shop By Category
          </h2>
        </Col>
      </Row>
      
      <Row className="g-3">
        {CATEGORIES.map((category) => (
          <Col key={category.id} xs={4}>
            <CategoryCard
              category={category}
              onClick={handleCategoryClick}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );

  const renderOccasionSection = () => (
    <Container className="py-4 pb-5">
      <Row className="mb-4">
        <Col>
          <h2 
            className="h3 fw-bold mb-0"
            style={{
              fontFamily: APP_CONFIG.FONTS.PRIMARY,
              letterSpacing: '-0.02em'
            }}
          >
            Shop By Occasion
          </h2>
        </Col>
      </Row>
      
      <Row className="g-3">
        {OCCASIONS.map((occasion) => (
          <Col key={occasion.id} xs={4}>
            <CategoryCard
              category={occasion}
              onClick={handleOccasionClick}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );

  return (
    <div className="bg-white">
      {renderHeroSection()}
      {renderFeaturesSection()}
      {renderNewArrivalsSection()}
      {renderCategorySection()}
      {renderOccasionSection()}
    </div>
  );
};

export default HomePageContent;