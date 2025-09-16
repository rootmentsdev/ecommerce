import React, { useState } from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Headphones } from 'react-bootstrap-icons';

// Import images
import Home1 from '../assets/Home1.png';
import Home2 from '../assets/Home2.png';
import Home3 from '../assets/Home3.png';
import Product1 from '../assets/Product1.png';
import Product2 from '../assets/Product2.png';
import Product3 from '../assets/Product3.png';
import Product4 from '../assets/Product4.png';
import Product5 from '../assets/Product5.png';
import Aboutus4 from '../assets/Aboutus4.png';
import Rent from '../assets/Rent.png';

// Import reusable components
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import Footer from '../components/Footer';
import HorizontalScroll from '../components/common/HorizontalScroll';

const RentNow = () => {
  const navigate = useNavigate();
  const [showSideMenu, setShowSideMenu] = useState(false);

  // Data constants following clean code principles
  const TOP_CATEGORIES = [
    { id: 1, name: 'Suits', image: Product1, category: 'suits' },
    { id: 2, name: 'Kurtas', image: Product2, category: 'kurtas' },
    { id: 3, name: 'Bandhgalas', image: Product3, category: 'bandhgalas' },
    { id: 4, name: 'Formal Wear', image: Product4, category: 'formal' },
    { id: 5, name: 'Traditional', image: Product5, category: 'traditional' }
  ];

  const RENT_NOW_FEATURES = [
    'Premium Mens rental costing from ₹500',
    'Premium quality garment',
    'Theme setting consultation',
    'Dress code consulting',
    'Flexible rental periods (2 - 5 days, extendable)',
    'Easy return process',
    'Bulk booking option (2+ outfits)',
    'Size & fit customization included'
  ];

  const RENT_WORKFLOW_STEPS = [
    {
      number: 1,
      title: 'Browse & Choose',
      description: 'Explore premium outfits from top-categories'
    },
    {
      number: 2,
      title: 'Select Date & Size',
      description: 'Check availability by event date & size'
    },
    {
      number: 3,
      title: 'Book & Confirm',
      description: 'Secure your rental for 2 - 5 days.'
    },
    {
      number: 4,
      title: 'Delivery to Your Door',
      description: 'We deliver ready-to-wear outfits.'
    },
    {
      number: 5,
      title: 'Celebrate in Style',
      description: 'Look sharp, make memories.'
    }
  ];

  // Event handlers
  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
    navigate(`/products?category=${category.category}`);
  };

  const handleExploreMoreClick = () => {
    console.log('Explore more clicked');
    navigate('/products');
  };

  const handleBrowseDeals = () => {
    navigate('/products');
  };

  const handleRentNow = () => {
    navigate('/products');
  };

  // Render methods following clean code principles
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
              
              {/* Navigation Arrow */}
              <div 
                className="position-absolute"
                style={{
                  bottom: '20px',
                  right: '20px',
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#000',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
                onClick={handleNextImage}
              >
                <ChevronRight 
                  size={20} 
                  color="white"
                />
              </div>
             </div>
          </div>
        </Container>
      </div>
    );
  };

  const renderRentNowSection = () => (
    <div className="py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
             <h1 
               className="h2 fw-bold mb-4"
               style={{
                 fontFamily: 'Stoshi',
                 fontWeight: 700,
                 fontSize: '2.5rem',
                 color: '#000'
               }}
             >
               Rent Now
             </h1>
            
            <div className="text-start mb-4">
              <ul className="list-unstyled" style={{ paddingLeft: '0' }}>
                {RENT_NOW_FEATURES.map((feature, index) => (
                  <li 
                    key={index}
                    className="mb-2"
                     style={{
                       fontFamily: 'Stoshi',
                       fontWeight: 400,
                       fontSize: '16px',
                       lineHeight: '1.6',
                       color: '#000',
                       marginTop: '7px'
                     }}
                  >
                    • {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="d-flex justify-content-center align-items-center gap-3">
               <Button 
                 variant="dark"
                 size="lg"
                 onClick={handleBrowseDeals}
                 className="btn-custom"
                 style={{
                   borderRadius: '50px !important',
                   padding: '12px 30px',
                   fontSize: '16px',
                   fontFamily: 'Stoshi',
                   fontWeight: 600
                 }}
               >
                 Browse the deals
               </Button>
              
              <div 
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#000',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Headphones 
                  size={20} 
                  color="white"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );

  const renderTopCategoriesSection = () => (
    <Container className="py-5">
      <Row className="align-items-center mb-4">
        <Col>
           <h2 
             className="h3 fw-bold mb-0"
             style={{
               fontFamily: 'Stoshi',
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
              fontFamily: 'Stoshi',
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
                     fontFamily: 'Stoshi',
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

  const renderHowRentNowWorksSection = () => (
    <div className="py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            {/* Top Image Section */}
            <div className="position-relative mb-4">
              <img 
                src={Rent} 
                alt="How Rent Now Works"
                className="img-fluid"
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '15px'
                }}
              />
              
              {/* Overlapping Heading */}
              <div 
                className="position-absolute"
                style={{
                  bottom: '20px',
                  left: '20px',
                  backgroundColor: 'transparent',
                  padding: '0',
                  zIndex: 10
                }}
              >
                 <h2 
                   className="h3 fw-bold mb-0"
                   style={{
                     fontFamily: 'Stoshi',
                     fontWeight: 700,
                     fontSize: '2.5rem',
                     color: '#000',
                     textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
                   }}
                 >
                   How Rent Now Works
                 </h2>
              </div>
            </div>
            
            {/* Steps Section */}
            <div className="mt-5">
              {RENT_WORKFLOW_STEPS.map((step, index) => (
                <div 
                  key={step.number} 
                  className="mb-3"
                  style={{
                    backgroundColor: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '20px',
                    border: '2px solid #000',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <Row className="align-items-center">
                    <Col>
                      <h4 
                        className="h5 fw-bold mb-1"
                         style={{
                           fontFamily: 'Stoshi',
                           fontWeight: 700,
                           fontSize: '18px',
                           color: '#000'
                         }}
                      >
                        Step {step.number}: {step.title}
                      </h4>
                      <p 
                        className="mb-0"
                         style={{
                           fontFamily: 'Stoshi',
                           fontWeight: 400,
                           fontSize: '16px',
                           color: '#666',
                           lineHeight: '1.5'
                         }}
                      >
                        {step.description}
                      </p>
                    </Col>
                    <Col xs="auto">
                      <div 
                        style={{
                          width: '60px',
                          height: '60px',
                          backgroundColor: '#000',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                           fontSize: '24px',
                           fontWeight: 'bold',
                           fontFamily: 'Stoshi'
                        }}
                      >
                        {step.number}
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );

  const renderFinalCTASection = () => (
    <div className="py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            {/* Image Section */}
            <div className="mb-4">
              <img 
                src={Aboutus4} 
                alt="Celebration"
                className="img-fluid"
                style={{
                  width: '100%',
                  maxWidth: '800px',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '15px'
                }}
              />
            </div>
            
            {/* Text Content */}
             <h2 
               className="h3 fw-bold mb-3"
               style={{
                 fontFamily: 'Stoshi',
                 fontWeight: 700,
                 fontSize: '2rem',
                 color: '#000'
               }}
             >
               Your Celebration, Your Style The Dappr Way.
             </h2>
            
            <p 
              className="mb-4"
              style={{
                fontFamily: 'Stoshi',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              Shop, rent, or book in bulk and make every event unforgettable.
            </p>
            
            <Button 
              variant="outline-dark"
              size="lg"
              onClick={handleRentNow}
              className="btn-custom"
               style={{
                 borderRadius: '50px !important',
                 padding: '12px 30px',
                 fontSize: '16px',
                 fontFamily: 'Stoshi',
                 fontWeight: 600
               }}
            >
              Rent Now
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );

  return (
    <div className="d-flex flex-column min-vh-100">
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
      <Header onMenuClick={() => setShowSideMenu(true)} />
      <SideMenu show={showSideMenu} onHide={() => setShowSideMenu(false)} />
      
      <main className="flex-grow-1">
        <Container fluid className="px-0">
          {renderHeroSection()}
          {renderRentNowSection()}
          {renderTopCategoriesSection()}
          {renderHowRentNowWorksSection()}
          {renderFinalCTASection()}
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default RentNow;
