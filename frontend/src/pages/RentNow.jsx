import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Headphones } from 'react-bootstrap-icons';
import SEOService from '../services/seoService';
import ImageService from '../services/imageService';

// Import hero images (same as HomePage)
import Home1 from '../assets/Home1.jpg';
import Home2 from '../assets/Home2.jpg';
import Home3 from '../assets/Home3.jpg';
import Product1 from '../assets/Product1.png';
import Product2 from '../assets/Product2.png';
import Product3 from '../assets/Product3.png';
import Product4 from '../assets/Product4.png';
import Product5 from '../assets/Product5.png';
import RentImage from '../assets/Rent.jpg';
import Aboutus4 from '../assets/Aboutus4.png';

// Import reusable components
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import Footer from '../components/Footer';
import HorizontalScroll from '../components/common/HorizontalScroll';

const RentNow = () => {
  const navigate = useNavigate();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [rentImages, setRentImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);

  // Initialize SEO for rent page
  useEffect(() => {
    SEOService.initializeRentPageSEO();
  }, []);

  // Fetch rent-specific images
  useEffect(() => {
    const fetchRentImages = async () => {
      try {
        setLoadingImages(true);
        const response = await ImageService.getImagesByCategory('rent');
        if (response.success) {
          setRentImages(response.data.images || []);
          console.log('🎯 RentNow - Fetched rent images:', response.data.images?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching rent images:', error);
        setRentImages([]);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchRentImages();
  }, []);

  // Use same TOP_CATEGORIES as HomePage
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
    navigate(`/products?category=${category.category}`, {
      state: { enquiryType: 'rent' }
    });
  };

  const handleExploreMoreClick = () => {
    console.log('Explore more clicked');
    navigate('/rent-products');
  };

  const handleBrowseDeals = () => {
    navigate('/rent-products');
  };

  const handleEnquireNow = () => {
    navigate('/enquire', {
      state: { enquiryType: 'rent' }
    });
  };

  // Render methods following clean code principles
  const renderHeroSection = () => {
    // Use same hero images as HomePage
    const heroImages = [Home1, Home2, Home3];
    const [activeIndex, setActiveIndex] = useState(0);
    
    return (
      <Container className="px-0">
        {/* Image Carousel Section */}
        <Row className="g-0">
          <Col>
            <Carousel 
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
              indicators={false}
              controls={false}
              interval={3000}
              style={{
                borderRadius: window.innerWidth > 768 ? '20px' : '0',
                overflow: 'hidden',
                maxWidth: window.innerWidth > 768 ? '100%' : '100vw'
              }}
            >
              {heroImages.map((image, index) => (
                <Carousel.Item key={index}>
                  <img 
                    src={image} 
                    alt={`dappr SQUAD Rent Now - Hero Image ${index + 1}`}
                    style={{
                      width: '100%',
                      height: window.innerWidth > 768 ? '400px' : '150vw',
                      objectFit: 'cover',
                      borderRadius: window.innerWidth > 768 ? '20px' : '0'
                    }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
        
        {/* Text and Button Section */}
        <Row className="mt-2">
          <Col className="text-center px-3">
            <h1 
              className="fw-bold mb-3"
              style={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: 'clamp(28px, 8vw, 2.5rem)',
                lineHeight: '1.2',
                color: '#000',
                maxWidth: '500px',
                margin: '0 auto 15px'
              }}
            >
              Rent Premium Fashion
            </h1>
            <p 
              className="mb-4"
              style={{
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontSize: 'clamp(14px, 4vw, 1.1rem)',
                lineHeight: '1.5',
                color: '#666',
                maxWidth: '500px',
                margin: '0 auto 25px'
              }}
            >
              Perfect outfits for your special occasions. Rent premium men's fashion at affordable prices.
            </p>
          </Col>
        </Row>
      </Container>
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
                 fontFamily: 'Poppins',
                 fontWeight: 700,
                 fontSize: 'clamp(22px, 5vw, 2.5rem)',
                 color: '#000',
                 marginBottom: '30px'
               }}
             >
               Rent Now
             </h1>
            
            <div 
              className="mb-4"
              style={{
                maxWidth: '500px',
                margin: '0 auto 30px'
              }}
            >
              <ul 
                className="list-unstyled" 
                style={{ 
                  paddingLeft: '0',
                  textAlign: 'left',
                  display: 'inline-block',
                  width: '100%',
                  maxWidth: '450px'
                }}
              >
                {RENT_NOW_FEATURES.map((feature, index) => (
                  <li 
                    key={index}
                    style={{
                      fontFamily: 'Poppins',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '1.8',
                      color: '#000',
                      marginBottom: '12px',
                      paddingLeft: '0'
                    }}
                  >
                    • {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div 
              className="d-flex justify-content-center align-items-center"
              style={{ marginTop: '30px' }}
            >
               <Button 
                 variant="dark"
                 size="lg"
                 onClick={handleBrowseDeals}
                 className="btn-custom"
                 style={{
                   borderRadius: '50px',
                   padding: '14px 32px',
                   fontSize: '16px',
                   fontFamily: 'Poppins',
                   fontWeight: 600
                 }}
               >
                 Browse the deals
               </Button>
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
               fontFamily: 'Poppins',
               fontWeight: 700,
               letterSpacing: '-0.02em',
               fontSize: 'clamp(18px, 4vw, 24px)'
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
              fontFamily: 'Poppins',
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
              onClick={() => navigate(`/rent-products?category=${category.category}`)}
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
              
               {/* Category Name Overlay */}
               <div 
                 className="position-absolute bottom-0 start-0 end-0 text-center p-3"
                 style={{
                   background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                   borderBottomLeftRadius: '15px',
                   borderBottomRightRadius: '15px'
                 }}
               >
                <h6 className="text-white mb-0 fw-medium">
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
            {/* Top Image Section - How Rent Works */}
            <div className="position-relative mb-4" style={{ marginTop: '40px' }}>
              <img 
                src={RentImage} 
                alt="How Rent Now Works - Premium Men's Fashion Rental"
                className="img-fluid rounded"
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '20px'
                }}
              />
            </div>
            
            {/* Section Title */}
            <div className="text-center mb-4">
              <h2 
                className="h3 fw-bold mb-0"
                style={{
                  fontFamily: 'Poppins',
                  fontWeight: 700,
                  fontSize: 'clamp(22px, 5vw, 2.5rem)',
                  color: '#000'
                }}
              >
                How Rent Now Works
              </h2>
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
                           fontFamily: 'Poppins',
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
                           fontFamily: 'Poppins',
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
                           fontFamily: 'Poppins'
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
        {/* Image Section - Using same image as homepage */}
        <div className="text-center mb-5">
          <img 
            src={Aboutus4} 
            alt="Your Celebration, Your Style"
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
            className="h3 fw-bold mb-3"
            style={{
              fontFamily: 'Poppins',
              fontWeight: 700,
              fontSize: 'clamp(20px, 4.5vw, 2rem)',
              color: '#000'
            }}
          >
            Your Celebration, Your Style The Dappr Way.
          </h2>
          
          <p 
            className="mb-4"
            style={{
              fontFamily: 'Poppins',
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
            onClick={handleEnquireNow}
            className="btn-custom"
            style={{
              borderRadius: '50px !important',
              padding: '12px 30px',
              fontSize: '16px',
              fontFamily: 'Poppins',
              fontWeight: 600
            }}
          >
            Enquire Now
          </Button>
        </div>
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
      <SideMenu show={showSideMenu} handleClose={() => setShowSideMenu(false)} />
      
      <main className="flex-grow-1">
        {renderHeroSection()}
        {renderTopCategoriesSection()}
        {renderRentNowSection()}
        {renderHowRentNowWorksSection()}
        {renderFinalCTASection()}
      </main>
      
      <Footer />
    </div>
  );
};

export default RentNow;
