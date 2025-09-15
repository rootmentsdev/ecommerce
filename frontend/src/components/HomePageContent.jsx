import React, { useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { 
  Search, Cart, Truck, ArrowClockwise, 
  People, Palette, Scissors, Calendar,
  Star, Award, Heart
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

// Import images
import demo1 from '../assets/demo1.png';
import demo2 from '../assets/demo2.png';
import demo3 from '../assets/demo3.png';
import HomePageImage from '../assets/HomePage.png';

// Import reusable components
import ProductCard from './common/ProductCard';
import CategoryCard from './common/CategoryCard';
import HorizontalScroll from './common/HorizontalScroll';

// Import constants and utilities
import { APP_CONFIG } from '../constants';

const HomePageContent = () => {
  const navigate = useNavigate();
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);

  // Simple animation effect
  useEffect(() => {
    // Add a simple fade-in effect after component mounts
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Data constants following clean code principles
  const FEATURES = [
    { icon: Search, title: 'Browse & Select' },
    { icon: Cart, title: 'Choose Rentals' },
    { icon: Truck, title: 'Book With Deposit' },
    { icon: ArrowClockwise, title: 'Return & Refund' }
  ];

  const ABOUT_SECTIONS = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Heart,
      content: 'Dappr Squad is an E-commerce rental and purchase platform focusing on premium men\'s fashion for celebrations, weddings, parties, and special occasions. The platform combines buying and renting options with bulk booking features to cater not only to individuals but also to teams, families, and groups (squads). It is designed to provide a seamless shopping and renting experience, with support for customization, consultations, and theme-based styling — making it more than just an e-commerce store.',
      color: 'dark'
    },
    {
      id: 'who-we-are',
      title: 'Who We Are',
      icon: People,
      content: 'Dappr Squad is a premium men\'s fashion brand that specializes in both rental and retail clothing solutions for modern-day celebrations. We focus on making fashion accessible, stylish, and coordinated for individuals and groups, while keeping affordability and flexibility at the core.',
      color: 'dark'
    },
    {
      id: 'what-we-do',
      title: 'What We Do',
      icon: Star,
      content: 'We provide stylish men\'s clothing for purchase and rent, offer bulk booking services for squads (friends, cousins, teammates, colleagues) for weddings, parties, and themed celebrations. We deliver personalized styling services including theme setting, dress code consultations, size customization, and product customization.',
      color: 'dark'
    },
    {
      id: 'how-we-do',
      title: 'How We Do It',
      icon: Award,
      content: 'Through an easy-to-use online platform, customers can browse collections, customize their look, and choose between renting or buying. We offer minimum bulk booking (4 pieces) to support squads and groups, enable location- and date-based availability check for rentals, and provide after-booking services such as managing alterations, support, and possible extensions. A customer-first approach, where convenience, quality, and customization come together.',
      color: 'dark'
    }
  ];

  const SERVICES = [
    {
      id: 'buy-rent',
      title: 'Buy & Rent Options',
      icon: Cart,
      description: 'Customers can choose to buy outfits permanently or rent them for short-term use',
      features: ['Custom Design Available', 'Theme Setting', 'Dress Code Consultation'],
      type: 'buy'
    },
    {
      id: 'bulk-booking',
      title: 'Bulk Booking',
      icon: People,
      description: 'Minimum 4 pieces - Ideal for groups, cousins, or teams who want coordinated dress code',
      features: ['Coordinated Dress Code', 'Group Discounts', 'Squad Styling'],
      type: 'bulk'
    },
    {
      id: 'theme-setting',
      title: 'Theme Setting',
      icon: Palette,
      description: 'Professional suggestions for wedding or party themes',
      features: ['Wedding Themes', 'Party Themes', 'Color Coordination'],
      type: 'theme'
    }
  ];

  const NEW_ARRIVALS = [
    { id: '507f1f77bcf86cd799439011', name: 'Formal Suit', price: 1400, image: demo1 },
    { id: '507f1f77bcf86cd799439012', name: 'Designer Kurta', price: 1200, image: demo2 },
    { id: '507f1f77bcf86cd799439013', name: 'Premium Sherwani', price: 1800, image: demo3 },
    { id: '507f1f77bcf86cd799439014', name: 'Designer Blazer', price: 1600, image: demo1 },
    { id: '507f1f77bcf86cd799439015', name: 'Evening Wear', price: 2200, image: demo2 },
    { id: '507f1f77bcf86cd799439016', name: 'Business Suit', price: 1500, image: demo3 },
    { id: '507f1f77bcf86cd799439017', name: 'Party Wear', price: 1300, image: demo1 },
    { id: '507f1f77bcf86cd799439018', name: 'Celebration Wear', price: 1700, image: demo2 },
    { id: '507f1f77bcf86cd799439019', name: 'Kids Ethnic', price: 800, image: demo3 }
  ];

  const CATEGORIES = [
    { id: 1, name: 'Suits', image: demo1, category: 'suits' },
    { id: 2, name: 'Kurtas', image: demo2, category: 'kurtas' },
    { id: 3, name: 'Sherwanis', image: demo3, category: 'sherwanis' },
    { id: 4, name: 'Baglas', image: demo1, category: 'baglas' },
    { id: 5, name: 'Kids Wear', image: demo2, category: 'kids-wear' },
    { id: 6, name: 'Party Wear', image: demo3, category: 'party-wear' }
  ];

  const OCCASIONS = [
    { id: 1, name: 'Wedding', image: demo1, category: 'wedding' },
    { id: 2, name: 'Party', image: demo2, category: 'party' },
    { id: 3, name: 'Celebration', image: demo3, category: 'celebration' }
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
    navigate('/products', { 
      state: { 
        isRental: true,
        title: 'Rent Now'
      } 
    });
  };

  const handleBuyNowClick = () => {
    console.log('Buy now clicked');
    navigate('/products', { 
      state: { 
        isBuy: true,
        title: 'Buy Now'
      } 
    });
  };

  // Render methods following single responsibility principle
  const renderHeroSection = () => (
    <div 
      className="position-relative"
      style={{
        height: '60vh',
        backgroundImage: `url(${HomePageImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div 
        className="position-absolute top-0 start-0 end-0 bottom-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)'
        }}
      />
      <div 
        className="position-absolute bottom-0 start-0 end-0 text-white p-4"
        style={{
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <div className="animate-on-scroll">
                <h1 
                  className="display-3 fw-bold mb-3"
                  style={{
                    fontFamily: APP_CONFIG.FONTS.PRIMARY,
                    letterSpacing: '-0.03em',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  Welcome to<br />
                  <span className="text-white">Dappr Squad</span>
                </h1>
                <p 
                  className="fs-4 mb-4 opacity-90"
                  style={{
                    fontFamily: APP_CONFIG.FONTS.SECONDARY,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  Premium Men's Fashion for Every Celebration
                </p>
                <p 
                  className="fs-5 mb-4 opacity-85"
                  style={{
                    fontFamily: APP_CONFIG.FONTS.SECONDARY,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  Rent or Buy • Custom Design • Squad Styling • Theme Setting
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Button 
                    variant="dark" 
                    size="lg"
                    className="px-4 py-3 fw-bold"
                    style={{
                      fontFamily: APP_CONFIG.FONTS.SECONDARY,
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                    }}
                    onClick={handleRentNowClick}
                  >
                    Rent Now
                  </Button>
                  <Button 
                    variant="outline-light" 
                    size="lg"
                    className="px-4 py-3 fw-bold"
                    style={{
                      fontFamily: APP_CONFIG.FONTS.SECONDARY,
                      borderRadius: '8px',
                      border: '2px solid white'
                    }}
                    onClick={handleBuyNowClick}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );

  const renderFeatureBox = (feature, index) => (
    <Col key={index} xs={6} md={3} className="px-2">
      <Card 
        className="border-0 h-100 animate-on-scroll"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          minHeight: '140px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          transform: 'translateY(20px)',
          opacity: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }}
      >
        <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
          <div 
            className="rounded-circle bg-dark d-flex align-items-center justify-content-center mb-3"
            style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #000000, #333333)'
            }}
          >
            <feature.icon size={24} className="text-white" />
          </div>
          <h6 
            className="text-center fw-bold mb-0"
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '14px',
              lineHeight: '1.3'
            }}
          >
            {feature.title}
          </h6>
        </Card.Body>
      </Card>
    </Col>
  );

  const renderFeaturesSection = () => (
    <Container className="py-5">
      <Row className="justify-content-center">
        {FEATURES.map((feature, index) => renderFeatureBox(feature, index))}
      </Row>
    </Container>
  );

  const renderAboutSection = () => (
    <div className="bg-light py-5" ref={aboutRef}>
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <h2 
              className="display-5 fw-bold mb-3 animate-on-scroll"
              style={{
                fontFamily: APP_CONFIG.FONTS.PRIMARY,
                letterSpacing: '-0.02em',
                color: '#000000'
              }}
            >
              About Dappr Squad
            </h2>
            <p 
              className="fs-5 text-dark animate-on-scroll"
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                maxWidth: '600px',
                margin: '0 auto',
                opacity: 0.7
              }}
            >
              Your trusted partner for premium men's fashion solutions
            </p>
          </Col>
        </Row>
        
        <Row className="g-4">
          {ABOUT_SECTIONS.map((section, index) => (
            <Col key={section.id} xs={12} md={6} lg={3} className="animate-on-scroll">
              <Card 
                className="border-0 h-100 animate-on-scroll"
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
                    <section.icon size={32} className="text-white" />
                  </div>
                  <h4 
                    className="fw-bold mb-3"
                    style={{
                      fontFamily: APP_CONFIG.FONTS.PRIMARY,
                      color: '#000000'
                    }}
                  >
                    {section.title}
                  </h4>
                  <p 
                    className="text-dark"
                    style={{
                      fontFamily: APP_CONFIG.FONTS.SECONDARY,
                      lineHeight: '1.6',
                      opacity: 0.8
                    }}
                  >
                    {section.content}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );

  const renderServicesSection = () => (
    <div className="py-5" ref={servicesRef}>
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <h2 
              className="display-5 fw-bold mb-3 animate-on-scroll"
              style={{
                fontFamily: APP_CONFIG.FONTS.PRIMARY,
                letterSpacing: '-0.02em',
                color: '#000000'
              }}
            >
              Our Services
            </h2>
            <p 
              className="fs-5 text-dark animate-on-scroll"
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                maxWidth: '700px',
                margin: '0 auto',
                opacity: 0.7
              }}
            >
              Comprehensive fashion solutions tailored to your needs
            </p>
          </Col>
        </Row>
        
        <Row className="g-4 justify-content-center">
          {SERVICES.map((service, index) => (
            <Col key={service.id} xs={12} md={6} lg={4} className="animate-on-scroll">
              <Card 
                className="border-0 h-100 animate-on-scroll"
                style={{
                  borderRadius: '20px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                }}
              >
                <Card.Body className="p-4">
                  <div className="d-flex align-items-start mb-3">
                    <div 
                      className="rounded-circle bg-dark d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: '60px',
                        height: '60px',
                        flexShrink: 0,
                        background: 'linear-gradient(135deg, #000000, #333333)'
                      }}
                    >
                      <service.icon size={24} className="text-white" />
                    </div>
                    <div className="flex-grow-1">
                      <h5 
                        className="fw-bold mb-2"
                        style={{
                          fontFamily: APP_CONFIG.FONTS.PRIMARY,
                          color: '#000000'
                        }}
                      >
                        {service.title}
                      </h5>
                      <p 
                        className="text-dark mb-3"
                        style={{
                          fontFamily: APP_CONFIG.FONTS.SECONDARY,
                          fontSize: '14px',
                          lineHeight: '1.5',
                          opacity: 0.8
                        }}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );

  const renderNewArrivalsSection = () => (
    <div className="bg-light py-5">
      <Container>
        <Row className="align-items-center mb-4">
          <Col>
            <h2 
              className="h2 fw-bold mb-0 animate-on-scroll"
              style={{
                fontFamily: APP_CONFIG.FONTS.PRIMARY,
                letterSpacing: '-0.02em',
                color: '#000000'
              }}
            >
              New Arrivals
            </h2>
            <p 
              className="text-dark mt-2 animate-on-scroll"
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                opacity: 0.7
              }}
            >
              Latest additions to our premium collection
            </p>
          </Col>
          <Col xs="auto">
            <Button 
              variant="outline-dark" 
              className="px-4 py-2 fw-bold"
              style={{ 
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                borderRadius: '8px',
                border: '2px solid #000000'
              }}
              onClick={handleViewMoreClick}
            >
              View All
            </Button>
          </Col>
        </Row>
        
        <HorizontalScroll>
          {NEW_ARRIVALS.map((product) => (
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

  const renderCategorySection = () => (
    <div className="py-5">
      <Container>
        <Row className="mb-4">
          <Col className="text-center">
            <h2 
              className="h2 fw-bold mb-3 animate-on-scroll"
              style={{
                fontFamily: APP_CONFIG.FONTS.PRIMARY,
                letterSpacing: '-0.02em',
                color: '#000000'
              }}
            >
              Shop By Category
            </h2>
            <p 
              className="text-dark animate-on-scroll"
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                maxWidth: '500px',
                margin: '0 auto',
                opacity: 0.7
              }}
            >
              Explore our diverse range of premium men's fashion
            </p>
          </Col>
        </Row>
        
        <Row className="g-4">
          {CATEGORIES.map((category, index) => (
            <Col key={category.id} xs={6} md={4} lg={2} className="animate-on-scroll">
              <CategoryCard
                category={category}
                onClick={handleCategoryClick}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );

  const renderOccasionSection = () => (
    <div className="bg-light py-5">
      <Container>
        <Row className="mb-4">
          <Col className="text-center">
            <h2 
              className="h2 fw-bold mb-3 animate-on-scroll"
              style={{
                fontFamily: APP_CONFIG.FONTS.PRIMARY,
                letterSpacing: '-0.02em',
                color: '#000000'
              }}
            >
              Shop By Occasion
            </h2>
            <p 
              className="text-dark animate-on-scroll"
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                maxWidth: '500px',
                margin: '0 auto',
                opacity: 0.7
              }}
            >
              Perfect outfits for every special moment
            </p>
          </Col>
        </Row>
        
        <Row className="g-4 justify-content-center">
          {OCCASIONS.map((occasion) => (
            <Col key={occasion.id} xs={12} sm={6} md={4} className="animate-on-scroll">
              <CategoryCard
                category={occasion}
                onClick={handleOccasionClick}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );

  return (
    <div className="bg-white">
      <style jsx>{`
        .animate-on-scroll {
          transition: all 0.6s ease;
          opacity: 1;
          transform: translateY(0);
        }
        
        .animate-on-scroll:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
        }
        
        @media (max-width: 768px) {
          .display-3 {
            font-size: 2.5rem !important;
          }
          .display-5 {
            font-size: 2rem !important;
          }
        }
      `}</style>
      
      {renderHeroSection()}
      {renderFeaturesSection()}
      {renderAboutSection()}
      {renderServicesSection()}
      {renderNewArrivalsSection()}
      {renderCategorySection()}
      {renderOccasionSection()}
    </div>
  );
};

export default HomePageContent;