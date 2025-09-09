import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Search, Cart, Truck, ArrowClockwise } from 'react-bootstrap-icons';

// Import reusable components
import ProductCard from './common/ProductCard';
import CategoryCard from './common/CategoryCard';
import FeatureIcon from './common/FeatureIcon';
import HorizontalScroll from './common/HorizontalScroll';

// Import constants and utilities
import { APP_CONFIG } from '../constants';

const HomePageContent = () => {
  // Data moved to constants for better maintainability
  const FEATURES = [
    { icon: Search, title: 'Browse & Select' },
    { icon: Cart, title: 'Choose Rentals' },
    { icon: Truck, title: 'Book With Deposit' },
    { icon: ArrowClockwise, title: 'Return & Refund' }
  ];

  const NEW_ARRIVALS = [
    { id: 1, name: 'Formal Suit', price: '₹1400', image: '/src/assets/demo1.png' },
    { id: 2, name: 'Formal Suit', price: '₹1400', image: '/src/assets/demo2.png' },
    { id: 3, name: 'Premium S', price: '₹1400', image: '/src/assets/demo3.png' },
    { id: 4, name: 'Designer Blazer', price: '₹1800', image: '/src/assets/demo1.png' },
    { id: 5, name: 'Evening Wear', price: '₹2200', image: '/src/assets/demo2.png' },
    { id: 6, name: 'Business Suit', price: '₹1600', image: '/src/assets/demo3.png' },
    { id: 7, name: 'Wedding Suit', price: '₹2500', image: '/src/assets/demo1.png' },
    { id: 8, name: 'Casual Blazer', price: '₹1200', image: '/src/assets/demo2.png' }
  ];

  const CATEGORIES = [
    { id: 1, name: 'Premium Suit', image: '/src/assets/demo1.png' },
    { id: 2, name: 'Formal Wear', image: '/src/assets/demo2.png' },
    { id: 3, name: 'Sherwani', image: '/src/assets/demo3.png' },
    { id: 4, name: 'Kurta', image: '/src/assets/demo1.png' },
    { id: 5, name: 'Indo-Wester', image: '/src/assets/demo2.png' },
    { id: 6, name: 'Accessories', image: '/src/assets/demo3.png' }
  ];

  const OCCASIONS = [
    { id: 1, name: 'Wedding', image: '/src/assets/demo1.png' },
    { id: 2, name: 'Party', image: '/src/assets/demo2.png' },
    { id: 3, name: 'Formal', image: '/src/assets/demo3.png' }
  ];

  // Event handlers following clean code principles
  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
    // TODO: Navigate to product detail page
  };

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
    // TODO: Navigate to category page
  };

  const handleOccasionClick = (occasion) => {
    console.log('Occasion clicked:', occasion);
    // TODO: Navigate to occasion page
  };

  const handleViewMoreClick = () => {
    console.log('View more clicked');
    // TODO: Navigate to all products page
  };

  const handleRentNowClick = () => {
    console.log('Rent now clicked');
    // TODO: Navigate to rental page
  };

  // Reusable style objects following clean code principles
  const heroStyles = {
    height: '50vh',
    backgroundImage: 'url(/src/assets/HomePage.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  const heroOverlayStyles = {
    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
  };

  const titleStyles = {
    fontFamily: APP_CONFIG.FONTS.PRIMARY,
    letterSpacing: '-0.03em'
  };

  const subtitleStyles = {
    fontFamily: APP_CONFIG.FONTS.SECONDARY
  };

  const sectionTitleStyles = {
    fontFamily: APP_CONFIG.FONTS.PRIMARY,
    letterSpacing: '-0.02em'
  };

  const buttonStyles = {
    fontFamily: APP_CONFIG.FONTS.SECONDARY,
    fontWeight: '600'
  };

  // Render methods following single responsibility principle
  const renderHeroSection = () => (
    <div className="position-relative" style={heroStyles}>
      <div 
        className="position-absolute bottom-0 start-0 end-0 text-white p-4"
        style={heroOverlayStyles}
      >
        <Container>
          <Row>
            <Col>
              <h1 
                className="display-4 fw-bold mb-2"
                style={titleStyles}
              >
                Rent Your<br />Perfect Look
              </h1>
              <p 
                className="fs-5 mb-3 opacity-90"
                style={subtitleStyles}
              >
                Premium Suits, Ethnic<br />Wear & Accessories fo
              </p>
              <Button 
                variant="light" 
                size="lg"
                className="px-4 py-2 rounded-2"
                style={buttonStyles}
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

  const renderFeaturesSection = () => (
    <Container className="py-5">
      <Row className="justify-content-center">
        {FEATURES.map((feature, index) => (
          <Col key={index} xs={6} md={3} className="text-center mb-4">
            <FeatureIcon 
              icon={feature.icon} 
              title={feature.title} 
            />
          </Col>
        ))}
      </Row>
    </Container>
  );

  const renderNewArrivalsSection = () => (
    <Container className="py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h2 
            className="h3 fw-bold mb-0"
            style={sectionTitleStyles}
          >
            New Arrivals
          </h2>
        </Col>
        <Col xs="auto">
          <Button 
            variant="link" 
            className="p-0 text-decoration-none text-muted"
            style={{ fontFamily: APP_CONFIG.FONTS.SECONDARY }}
            onClick={handleViewMoreClick}
          >
            View More &gt;
          </Button>
        </Col>
      </Row>
      
      <HorizontalScroll>
        {NEW_ARRIVALS.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={handleProductClick}
          />
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
            style={sectionTitleStyles}
          >
            Shop By Category
          </h2>
        </Col>
      </Row>
      
      <Row className="g-3">
        {CATEGORIES.map((category) => (
          <Col key={category.id} xs={4} md={4}>
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
            style={sectionTitleStyles}
          >
            Shop By Occassion
          </h2>
        </Col>
      </Row>
      
      <Row className="g-3">
        {OCCASIONS.map((occasion) => (
          <Col key={occasion.id} xs={4} md={4}>
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