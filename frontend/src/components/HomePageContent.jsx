import React, { useState } from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Search, Cart, Truck, ArrowClockwise, ChevronRight } from 'react-bootstrap-icons';

// Import images
import Home1 from '../assets/Home1.png';
import Home2 from '../assets/Home2.png';
import Home3 from '../assets/Home3.png';
import Aboutus4 from '../assets/Aboutus4.png';
import Who from '../assets/Who.png';
import How from '../assets/How.png';
import What from '../assets/What.png';
import Product1 from '../assets/Product1.png';
import Product2 from '../assets/Product2.png';
import Product3 from '../assets/Product3.png';
import Product4 from '../assets/Product4.png';
import Product5 from '../assets/Product5.png';

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

  const TOP_CATEGORIES = [
    { id: 1, name: 'Suits', image: Product1, category: 'suits' },
    { id: 2, name: 'Kurtas', image: Product2, category: 'kurtas' },
    { id: 3, name: 'Bandhgalas', image: Product3, category: 'bandhgalas' },
    { id: 4, name: 'Formal Wear', image: Product4, category: 'formal' },
    { id: 5, name: 'Traditional', image: Product5, category: 'traditional' }
  ];

  const SERVICES = [
    { 
      icon: '👕', 
      title: 'Buy & Rent Option', 
      description: 'Own it forever or wear it for the moment.' 
    },
    { 
      icon: '🎨', 
      title: 'Theme Setting', 
      description: 'Coordinated looks for your big day.' 
    },
    { 
      icon: '✂️', 
      title: 'Dress Code Consultation', 
      description: 'Professional styling services.' 
    },
    { 
      icon: '📏', 
      title: 'Size Customization', 
      description: 'Outfits tailored just for you.' 
    },
    { 
      icon: '⚙️', 
      title: 'Product Customization', 
      description: 'Personalized looks for unique events.' 
    }
  ];

  // Event handlers
  const handleRentNowClick = () => {
    console.log('Rent now clicked');
    navigate('/rent-now');
  };

  const handleShopNowClick = () => {
    console.log('Shop now clicked');
    navigate('/buy-now');
  };

  const handleStartShoppingClick = () => {
    console.log('Start shopping clicked');
    navigate('/buy-now');
  };

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
    navigate(`/products?category=${category.category}`);
  };

  const handleExploreMoreClick = () => {
    console.log('Explore more clicked');
    navigate('/products');
  };

  // Render methods
  const renderHeroSection = () => {
    const heroImages = [Home1, Home2, Home3];
    const [activeIndex, setActiveIndex] = useState(0);
    
    const handleNextImage = () => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    };
    
    return (
      <div className="py-2">
        <Container>
          {/* Image Carousel Section */}
          <div className="text-center mb-5 position-relative d-flex justify-content-center">
             <div 
               style={{
                 width: '380px',
                 height: '480px',
                 position: 'relative'
               }}
             >
              <Carousel 
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
                indicators={false}
                controls={false}
                interval={null}
                style={{
                  borderRadius: '36.73px',
                  overflow: 'hidden'
                }}
              >
                {heroImages.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img 
                      src={image} 
                      alt={`Hero ${index + 1}`}
                      style={{
                        width: '380px',
                        height: '480px',
                        objectFit: 'cover',
                        borderRadius: '36.73px',
                        opacity: 1
                      }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
              
              {/* Navigation Icon */}
              <div 
                className="position-absolute"
                onClick={handleNextImage}
                style={{
                  bottom: '15px',
                  right: '-5px',
                  width: '35px',
                  height: '35px',
                  backgroundColor: '#000',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronRight 
                  size={16} 
                  color="white"
                />
              </div>
            </div>
          </div>
          
          {/* Text and Button Section */}
          <div className="text-center">
            <h1 
              className="fw-bold mb-3"
                style={{
                width: '343px',
                height: '29px',
                fontFamily: 'Century Gothic',
                fontWeight: 700,
                fontStyle: 'Bold',
                fontSize: '24px',
                lineHeight: '120%',
                letterSpacing: '0%',
                textAlign: 'center',
                verticalAlign: 'middle',
                opacity: 1,
                color: '#000',
                margin: '0 auto'
              }}
            >
              Style Together, Shine Together
              </h1>
              <p 
              className="fs-5 mb-4"
                style={{
                fontFamily: 'Century Gothic',
                fontWeight: 400,
                lineHeight: '1.4',
                fontSize: '1.1rem',
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              Premium men's fashion for every celebration Buy, Rent, or Book in Bulk. Perfect outfits for weddings, parties, squads, and more.
            </p>
            <div className="d-flex gap-3 justify-content-center mb-5">
                <Button 
                  variant="outline-dark" 
                  size="lg"
                  className="px-4 py-3 btn-custom"
                  style={{
                    fontFamily: 'Century Gothic',
                    fontWeight: 600,
                    borderRadius: '20px !important',
                    border: '2px solid #000',
                    backgroundColor: 'transparent',
                    fontSize: '1rem',
                    color: '#000'
                  }}
                  onClick={handleRentNowClick}
              >
                Rent Now
              </Button>
              <Button 
                variant="dark" 
                size="lg"
                className="px-4 py-3 btn-custom"
                style={{
                  fontFamily: 'Century Gothic',
                  fontWeight: 600,
                  borderRadius: '20px !important',
                  backgroundColor: '#000',
                  border: 'none',
                  fontSize: '1rem'
                }}
                onClick={handleShopNowClick}
              >
                Buy Now
              </Button>
            </div>
            
            {/* Feature Icons Section */}
            <div className="d-flex justify-content-center gap-4">
              {FEATURES.map((feature, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="rounded-circle bg-dark d-flex align-items-center justify-content-center mx-auto mb-2"
            style={{
                      width: '50px',
                      height: '50px'
            }}
          >
                    <feature.icon size={20} className="text-white" />
          </div>
                  <h6 
                    className="fw-medium mb-0"
            style={{
                      fontFamily: 'Century Gothic',
                      fontWeight: 400,
              fontSize: '12px',
                      color: '#000'
            }}
          >
            {feature.title}
                  </h6>
                </div>
              ))}
            </div>
          </div>
        </Container>
    </div>
  );
  };

  const renderFeatureIconsSection = () => null;

  const renderTopCategoriesSection = () => (
    <Container className="py-5">
      <Row className="align-items-center mb-4">
        <Col>
          <h2 
            className="h3 fw-bold mb-0"
            style={{
              fontFamily: 'Century Gothic',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            Top Categories
          </h2>
        </Col>
        <Col xs="auto">
          <Button 
            variant="link" 
            className="p-0 text-decoration-none text-muted"
            style={{ 
              fontFamily: 'Century Gothic',
              fontWeight: 400,
              fontSize: '14px'
            }}
            onClick={handleExploreMoreClick}
          >
            Explore more
          </Button>
        </Col>
      </Row>
      
      <HorizontalScroll>
        {TOP_CATEGORIES.map((category) => (
          <div key={category.id} style={{ width: '200px', flexShrink: 0 }}>
            <div 
              className="position-relative"
              style={{ cursor: 'pointer' }}
              onClick={() => handleCategoryClick(category)}
            >
              <img 
                src={category.image} 
                alt={category.name}
                className="img-fluid"
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '15px'
                }}
              />
              
              {/* Navigation Arrow */}
              <div 
                className="position-absolute"
                style={{
                  bottom: '15px',
                  right: '15px',
                  width: '30px',
                  height: '30px',
                  backgroundColor: '#000',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronRight 
                  size={14} 
                  color="white"
                />
              </div>
              
              {/* Category Name Overlay */}
              <div 
                className="position-absolute bottom-0 start-0 end-0 text-center p-3"
                style={{
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  borderBottomLeftRadius: '15px',
                  borderBottomRightRadius: '15px'
                }}
              >
                <h6 
                  className="text-white mb-0 fw-medium"
                  style={{
                    fontFamily: 'Century Gothic',
                    fontWeight: 400
                  }}
                >
                  {category.name}
                </h6>
              </div>
            </div>
          </div>
        ))}
      </HorizontalScroll>
    </Container>
  );

  const renderWhoWeAreSection = () => (
    <div className="py-5">
      <Container>
        <Row className="align-items-center">
          <Col lg={6}>
            <div className="position-relative">
               <img 
                 src={Who} 
                 alt="Who we are"
                 className="img-fluid rounded"
                 style={{
                   width: '100%',
                   height: '300px',
                   objectFit: 'cover',
                   borderRadius: '15px'
                 }}
               />
              <div 
                className="position-absolute"
                style={{
                  backgroundColor: 'transparent',
                  width: '180px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bottom: '10px',
                  left: '10px'
                }}
              >
                <h3 
                  className="mb-0"
                  style={{
                    fontFamily: 'Century Gothic',
                    fontWeight: 700,
                    fontSize: '22px',
                    lineHeight: '120%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: 'black',
                    opacity: 1,
                    margin: 0
                  }}
                >
                  Who we are.
                </h3>
              </div>
            </div>
          </Col>
          <Col lg={6} className="ps-lg-5">
            <p 
              className="fs-5 lh-lg"
              style={{
                fontFamily: 'Century Gothic',
                fontWeight: 400,
                color: '#666'
              }}
            >
              At Dapper Squad, we believe style is within all men's reach. We are a premium men's fashion platform, that helps individuals and squads look their best at weddings, parties, and celebrations, whether you want to buy, rent, or book for your entire squad, we make fashion simple, stylish and convenient.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );

  const renderOurServicesSection = () => (
    <div className="py-5 bg-white">
      <Container>
        <h2 
          className="h2 fw-bold mb-5 text-center"
            style={{
            fontFamily: 'Century Gothic',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontSize: '24px',
            color: '#000'
          }}
        >
          Our Services
          </h2>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <div className="d-flex flex-column align-items-center" style={{ gap: '10px' }}>
              {SERVICES.map((service, index) => (
                <div 
                  key={index}
                  className="bg-white d-flex align-items-center"
                  style={{
                    width: '300px',
                    height: '60px',
                    paddingTop: '10px',
                    paddingRight: '20px',
                    paddingBottom: '10px',
                    paddingLeft: '20px',
                    borderRadius: '20px',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: '#e9ecef',
                    opacity: 1,
                    position: 'relative'
                  }}
                >
                  <div className="flex-grow-1">
                    <h5 
                      className="fw-bold mb-1"
                      style={{
                        fontFamily: 'Century Gothic',
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#000',
                        marginBottom: '2px',
                        lineHeight: '1.2'
                      }}
                    >
                      {service.title}
                    </h5>
                    <p 
                      className="text-muted mb-0"
                      style={{
                        fontFamily: 'Century Gothic',
                        fontWeight: 400,
                        fontSize: '11px',
                        color: '#666',
                        lineHeight: '1.3'
                      }}
                    >
                      {service.description}
                    </p>
                  </div>
                  <div 
                    className="rounded-circle bg-dark d-flex align-items-center justify-content-center position-absolute"
                    style={{
                      width: '35px',
                      height: '35px',
                      right: '-17px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 10
                    }}
                  >
                    <span className="text-white fs-6">{service.icon}</span>
                  </div>
                </div>
              ))}
            </div>
        </Col>
      </Row>
      </Container>
    </div>
  );

  const renderWhatWeDoSection = () => (
    <div className="py-5">
      <Container>
        <Row className="align-items-center">
          <Col lg={6}>
            <div className="position-relative">
               <img 
                 src={What} 
                 alt="What we do"
                 className="img-fluid rounded"
                 style={{
                   width: '100%',
                   height: '300px',
                   objectFit: 'cover',
                   borderRadius: '15px'
                 }}
               />
              <div 
                className="position-absolute bottom-0 end-0 m-3"
                style={{
                  backgroundColor: 'transparent',
                  width: '142px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <h3 
                  className="mb-0"
                  style={{
                    fontFamily: 'Century Gothic',
                    fontWeight: 700,
                    fontSize: '22px',
                    lineHeight: '120%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: 'black',
                    opacity: 1,
                    margin: 0
                  }}
                >
                  What we do.
                </h3>
              </div>
            </div>
          </Col>
          <Col lg={6} className="ps-lg-5 ">
            <ul 
              className="list-unstyled"
              style={{
                fontFamily: 'Century Gothic',
                fontWeight: 400,
                color: '#666',
                lineHeight: '1.6',
                fontSize: '14px',
                marginTop:'7px'
                
              }}
            >
              <li className="mb-2">• Stylish outfits, wear for buy & rent.</li>
              <li className="mb-2">• Bulk booking solutions for seasons, friends, and teams with customized options.</li>
              <li className="mb-2">• Dress code consultation to help you plan your event looks.</li>
              <li className="mb-2">• Customization services to ensure the perfect fit and personalized style.</li>
            </ul>
          </Col>
      </Row>
    </Container>
    </div>
  );

  const renderHowWeDoItSection = () => (
    <div className="py-5 bg-light">
      <Container>
        <Row className="align-items-center">
          <Col lg={6}>
            <div className="position-relative">
               <img 
                 src={How} 
                 alt="How We Do It"
                 className="img-fluid rounded"
                 style={{
                   width: '100%',
                   height: '300px',
                   objectFit: 'cover',
                   borderRadius: '15px'
                 }}
               />
              <div 
                className="position-absolute bottom-0 start-0 m-3"
                style={{
                  backgroundColor: 'transparent',
                  width: '142px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <h3 
                  className="mb-0"
                  style={{
                    fontFamily: 'Century Gothic',
                    fontWeight: 700,
                    fontSize: '22px',
                    lineHeight: '120%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: 'black',
                    opacity: 1,
                    margin: 0
                  }}
                >
                  How we do.
                </h3>
              </div>
            </div>
          </Col>
          <Col lg={6} className="ps-lg-5">
            <ul 
              className="list-unstyled"
            style={{
                fontFamily: 'Century Gothic',
                fontWeight: 400,
                color: '#666',
                lineHeight: '1.6',
                fontSize: '14px',
                marginTop:'7px'
                
              }}
            >
              <li className="mb-2">• Easy online ordering and booking.</li>
              <li className="mb-2">• Buy or rent based on your need.</li>
              <li className="mb-2">• Date & location-based availability check.</li>
              <li className="mb-2">• Bulk booking for squads with just a few clicks.</li>
              <li className="mb-2">• Theme setting and consultation from fashion experts.</li>
              <li className="mb-2">• Customization in size and style for a perfect fit.</li>
            </ul>
        </Col>
      </Row>
      </Container>
    </div>
  );

  const renderWhyChooseUsSection = () => (
    <div className="py-5">
      <Container>
        <h2 
          className="h2 fw-bold mb-4"
          style={{
            fontFamily: 'Century Gothic',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            textAlign: 'left'
          }}
        >
          Why Choose Us
        </h2>
        <Row>
          <Col lg={8}>
            <ul 
              className="list-unstyled"
              style={{
                fontFamily: 'Century Gothic',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '1.6',
                textAlign: 'left'
              }}
            >
              <li className="mb-2">• Buy or Rent! Your choice, your budget.</li>
              <li className="mb-2">• Perfect for individuals & groups.</li>
              <li className="mb-2">• Expert-driven styling consultations.</li>
              <li className="mb-2">• Hassle-free online booking & availability check.</li>
              <li className="mb-2">• Premium quality with customization options.</li>
            </ul>
          </Col>
      </Row>
    </Container>
    </div>
  );

  const renderFinalCTASection = () => (
    <div className="py-5">
      <Container>
        {/* Image Section */}
        <div className="text-center mb-5">
          <img 
            src={Aboutus4} 
            alt="Final CTA"
            className="img-fluid rounded"
            style={{
              width: '100%',
              maxWidth: '800px',
              height: '400px',
              objectFit: 'cover',
              borderRadius: '15px'
            }}
          />
        </div>
        
        {/* Text and Button Section */}
        <div className="text-center">
          <h2 
            className="display-4 fw-bold mb-4"
            style={{
              fontFamily: 'Century Gothic',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              fontSize: '2.5rem',
              color: '#000'
            }}
          >
            Your Celebration, Your Style The Dapper Way.
          </h2>
          <p 
            className="fs-4 mb-4"
            style={{
              fontFamily: 'Century Gothic',
              fontWeight: 400,
              lineHeight: '1.4',
              fontSize: '1.1rem',
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Shop, rent, or book in bulk and make every event unforgettable.
          </p>
          <div className="d-flex gap-3 justify-content-center">
              <Button 
                variant="outline-dark" 
                size="lg"
                className="px-4 py-3 btn-custom"
                style={{
                  fontFamily: 'Century Gothic',
                  fontWeight: 600,
                  borderRadius: '20px !important',
                  border: '2px solid #000',
                  backgroundColor: 'transparent',
                  fontSize: '1rem',
                  color: '#000'
                }}
              onClick={handleRentNowClick}
            >
              Rent Now
            </Button>
            <Button 
              variant="dark" 
              size="lg"
              className="px-4 py-3 btn-custom"
              style={{
                fontFamily: 'Century Gothic',
                fontWeight: 600,
                borderRadius: '20px !important',
                backgroundColor: '#000',
                border: 'none',
                fontSize: '1rem'
              }}
              onClick={handleStartShoppingClick}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );

  return (
    <div className="bg-white">
      <style>
        {`
          .btn-custom {
            border-radius: 50px !important;
          }
          .btn-custom:hover {
            border-radius: 50px !important;
          }
          .btn-custom:focus {
            border-radius: 50px !important;
          }
        `}
      </style>
      {renderHeroSection()}
      {renderFeatureIconsSection()}
      {renderTopCategoriesSection()}
      {renderWhoWeAreSection()}
      {renderOurServicesSection()}
      {renderWhatWeDoSection()}
      {renderHowWeDoItSection()}
      {renderWhyChooseUsSection()}
      {renderFinalCTASection()}
    </div>
  );
};

export default HomePageContent;