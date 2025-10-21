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

  // Use same TOP_CATEGORIES as HomePage
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
    // Use same hero images as HomePage
    const heroImages = [Home1, Home2, Home3];
    const [activeIndex, setActiveIndex] = useState(0);
    
    return (
      <div className="py-0">
        <style>
          {`
            /* Mobile layout fixes */
            body {
              overflow-x: hidden !important;
            }
            
            .container, .container-fluid {
              max-width: 100% !important;
              overflow-x: hidden !important;
            }
            
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
                margin: 0 0 15px 0 !important;
              }
              .hero-carousel {
                width: 100% !important;
                height: 140vw !important;
                border-radius: 0 !important;
              }
              .hero-image {
                width: 100% !important;
                height: 140vw !important;
                border-radius: 0 !important;
              }
              
              .hero-text-container {
                margin-top: -200px !important;
                padding: 0 15px !important;
              
              }
              
              .hero-title {
                margin-top: 0 !important;
                margin-bottom: 10px !important;
                font-size: 20px !important;
              }
              
              .hero-description {
                margin-bottom: 15px !important;
                padding: 0 10px !important;
              }
              
              /* Prevent horizontal scrolling on mobile */
              .horizontal-scroll {
                overflow-x: auto !important;
                overflow-y: hidden !important;
                -webkit-overflow-scrolling: touch !important;
              }
              
              /* Ensure containers don't exceed viewport */
              .container {
                padding-left: 15px !important;
                padding-right: 15px !important;
                max-width: 100% !important;
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
                      alt={`dappr SQUAD Buy Now - Hero Image ${index + 1}`}
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
          <div className="text-center hero-text-container" style={{ marginTop: '0' }}>
            <h1 
              className="fw-bold hero-title"
              style={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: '20px',
                lineHeight: '1.3',
                textAlign: 'center',
                color: '#000',
                margin: '0 auto 10px',
                maxWidth: '380px'
              }}
            >
              Buy Premium Fashion
            </h1>
            <p 
              className="hero-description"
              style={{
                fontFamily: 'Poppins',
                fontWeight: 400,
                lineHeight: '1.5',
                fontSize: '14px',
                color: '#666',
                maxWidth: '380px',
                margin: '0 auto 15px',
                padding: '0 15px'
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
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: '2.5rem',
                color: '#000',
                marginBottom: '30px'
              }}
            >
              Buy Now
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
                {BUY_NOW_FEATURES.map((feature, index) => (
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
                onClick={handleBrowseProducts}
                className="btn-custom"
                style={{
                  borderRadius: '50px',
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontFamily: 'Poppins',
                  fontWeight: 600
                }}
              >
                Browse Products
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
              onClick={() => navigate(`/buy-products?category=${category.category}`)}
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
              fontSize: '2rem',
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
              borderRadius: '50px',
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
        {renderBuyNowSection()}
        {renderFinalCTASection()}
      </main>
      
      <Footer />
    </div>
  );
};

export default BuyNow;
