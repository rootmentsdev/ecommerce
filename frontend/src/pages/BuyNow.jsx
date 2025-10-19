import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Headphones } from 'react-bootstrap-icons';
import SEOService from '../services/seoService';
import ImageService from '../services/imageService';

// Import images
import Home1 from '../assets/Home1.jpg';
import Home2 from '../assets/Home2.jpg';
import Home3 from '../assets/Home3.jpg';
import Product1 from '../assets/Product1.png';
import Product2 from '../assets/Product2.png';
import Product3 from '../assets/Product3.png';
import Product4 from '../assets/Product4.png';
import Product5 from '../assets/Product5.png';
import Aboutus4 from '../assets/Aboutus4.png';

// Import reusable components
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import Footer from '../components/Footer';
import HorizontalScroll from '../components/common/HorizontalScroll';

const BuyNow = () => {
  const navigate = useNavigate();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [buyImages, setBuyImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);

  // Initialize SEO for buy page
  useEffect(() => {
    SEOService.initializeBuyPageSEO();
  }, []);

  // Fetch buy-specific images
  useEffect(() => {
    const fetchBuyImages = async () => {
      try {
        setLoadingImages(true);
        const response = await ImageService.getImagesByCategory('buy');
        if (response.success) {
          setBuyImages(response.data.images || []);
          console.log('🎯 BuyNow - Fetched buy images:', response.data.images?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching buy images:', error);
        setBuyImages([]);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchBuyImages();
  }, []);

  // Always use static category images to show available categories
  const TOP_CATEGORIES = [
    { id: 1, name: 'Suits', image: Product1, category: 'suits' },
    { id: 2, name: 'Kurtas', image: Product2, category: 'kurtas' },
    { id: 3, name: 'Bandhgalas', image: Product3, category: 'bandhgalas' },
    { id: 4, name: 'Formal Wear', image: Product4, category: 'formal' },
    { id: 5, name: 'Traditional', image: Product5, category: 'traditional' }
  ];

  const BUY_NOW_FEATURES = [
    'Premium Mens wear starting from ₹1900',
    'Custom design creation',
    'Personalized theme setting',
    'Expert dress code consulting',
    'Premium quality materials',
    'Lifetime ownership',
    'Full customization options (size, fabric, detailing)',
    'Long-term wardrobe investment'
  ];

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
    navigate(`/products?category=${category.category}`, {
      state: { enquiryType: 'buy' }
    });
  };

  const handleExploreMoreClick = () => {
    console.log('Explore more clicked');
    navigate('/buy-products');
  };

  const handleBrowseProducts = () => {
    navigate('/buy-products');
  };

  const handleEnquireNow = () => {
    navigate('/enquire', {
      state: { enquiryType: 'buy' }
    });
  };

  // Render methods
  const renderHeroSection = () => {
    const heroImages = [Home1, Home2, Home3];
    const [activeIndex, setActiveIndex] = useState(0);
    
    return (
      <div className="py-0">
        <style>
          {`
            /* Desktop styling - make text and images same size */
            @media (min-width: 992px) {
              .hero-carousel-container {
                width: 100% !important;
                max-width: 100% !important;
                height: 400px !important;
                margin: 0 auto !important;
              }
              .hero-carousel {
                width: 100% !important;
                height: 400px !important;
                border-radius: 15px !important;
              }
              .hero-image {
                width: 100% !important;
                height: 400px !important;
                border-radius: 15px !important;
              }
              .hero-text-container {
                margin-top: 0px !important;
                padding-top: 0px !important;
                position: relative !important;
                z-index: 10 !important;
              }
              .hero-title {
                font-size: 2.5rem !important;
                margin-bottom: 1rem !important;
                margin-top: 0 !important;
                position: relative !important;
                z-index: 10 !important;
              }
              .hero-description {
                font-size: 1.1rem !important;
                margin-bottom: 2rem !important;
                position: relative !important;
                z-index: 10 !important;
              }
            }
            
            /* Mobile styling */
            @media (max-width: 768px) {
              .hero-carousel-container {
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              .hero-carousel {
                width: 100% !important;
                height: 150vw !important;
                border-radius: 0 !important;
              }
              .hero-image {
                width: 100% !important;
                height: 150vw !important;
                border-radius: 0 !important;
              }
            }
          `}
        </style>
        <Container>
          {/* Image Carousel Section */}
          <div className="text-center mb-0 position-relative">
             <div 
               className="hero-carousel-container"
               style={{
                 width: '100%',
                 maxWidth: '500px',
                 height: '800px',
                 position: 'relative',
                 margin: '0 auto'
               }}
             >
              <Carousel 
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
                indicators={false}
                controls={false}
                interval={3000}
                className="hero-carousel"
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  width: '100%',
                  height: '100%'
                }}
              >
                {heroImages.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img 
                      src={image} 
                      alt={`dappr SQUAD Premium Men's Fashion - Hero Image ${index + 1}`}
                      className="hero-image"
                      style={{
                        width: '100%',
                        height: '800px',
                        objectFit: 'cover',
                        borderRadius: '20px',
                        opacity: 1
                      }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </div>
          
          {/* Text and Button Section */}
          <div className="text-center hero-text-container" style={{ marginTop: '3px' }}>
            <h1 
              className="fw-bold mb-3 hero-title"
              style={{
                width: 'auto',
                minWidth: '320px',
                height: '29px',
                fontFamily: 'Century Gothic',
                fontWeight: 700,
                fontStyle: 'ExtraBold',
                fontSize: '28px',
                lineHeight: '120%',
                letterSpacing: '0%',
                textAlign: 'center',
                verticalAlign: 'middle',
                opacity: 1,
                color: '#000',
                margin: '0 auto',
                whiteSpace: 'nowrap',
                overflow: 'visible',
                marginTop: '-140px',
              }}
            >
              Buy Premium Fashion
            </h1>
            <p 
              className="fs-5 mb-4 hero-description"
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
              Own premium men's fashion pieces. Buy high-quality suits, kurtas, and traditional wear for your wardrobe.
            </p>
          </div>
        </Container>
      </div>
    );
  };

  const renderBuyNowSection = () => (
    <div className="py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            <h1 
              className="h2 fw-bold mb-4"
              style={{
                fontFamily: 'Century Gothic',
                fontWeight: 700,
                fontSize: '2.5rem',
                color: '#000'
              }}
            >
              Buy Now
            </h1>
            
            <div className="text-start mb-4">
              <ul className="list-unstyled" style={{ paddingLeft: '0' }}>
                {BUY_NOW_FEATURES.map((feature, index) => (
                  <li 
                    key={index}
                    className="mb-2"
                    style={{
                      fontFamily: 'Century Gothic',
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
                onClick={handleBrowseProducts}
                className="btn-custom"
                style={{
                  borderRadius: '50px !important',
                  padding: '12px 30px',
                  fontSize: '16px',
                  fontFamily: 'Century Gothic',
                  fontWeight: 600
                }}
              >
                Browse Products
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
                fontFamily: 'Century Gothic',
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
                fontFamily: 'Century Gothic',
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
                borderRadius: '20px !important',
                padding: '12px 30px',
                fontSize: '16px',
                fontFamily: 'Century Gothic',
                fontWeight: 600
              }}
            >
              Enquire Now
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
      <SideMenu show={showSideMenu} handleClose={() => setShowSideMenu(false)} />
      
      <main className="flex-grow-1">
        <Container fluid className="px-0">
          {renderHeroSection()}
          {renderTopCategoriesSection()}
          {renderBuyNowSection()}
          {renderFinalCTASection()}
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default BuyNow;
