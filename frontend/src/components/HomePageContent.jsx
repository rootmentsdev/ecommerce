import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Carousel, Card, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Search, Cart, Truck, ArrowClockwise, ChevronRight, Heart, HeartFill } from 'react-bootstrap-icons';

// Import images
import Home from '../assets/Home.jpg';
import Home1 from '../assets/Home1.jpg';
import Home2 from '../assets/Home2.jpg';
import Home3 from '../assets/Home3.jpg';
import Aboutus4 from '../assets/Aboutus4.png';
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
import { PRODUCTS_DATA } from '../data/products';
import ImageService from '../services/imageService';
import FavoritesService from '../services/favoritesService';
import SEOService from '../services/seoService';
import NewsletterService from '../services/newsletterService';

const HomePageContent = () => {
  const navigate = useNavigate();

  // State for admin images
  const [topCategoriesImages, setTopCategoriesImages] = useState([]);
  const [featuredImages, setFeaturedImages] = useState([]);
  const [trendingImages, setTrendingImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [adminImageFavorites, setAdminImageFavorites] = useState(new Set());

  // State for e-commerce features
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Data constants following clean code principles
  const FEATURES = [
    { icon: Search, title: 'Browse & Select' },
    { icon: Cart, title: 'Choose Rentals' },
    { icon: Truck, title: 'Book With Deposit' },
    { icon: ArrowClockwise, title: 'Return & Refund' }
  ];

  // E-commerce data
  const TESTIMONIALS = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      location: 'Mumbai',
      rating: 5,
      text: 'Perfect fit and excellent quality. Made my wedding day even more special!',
      image: 'https://via.placeholder.com/80x80/8B4513/FFFFFF?text=RK'
    },
    {
      id: 2,
      name: 'Amit Singh',
      location: 'Delhi',
      rating: 5,
      text: 'Great service and fast delivery. The suit was exactly as shown in the picture.',
      image: 'https://via.placeholder.com/80x80/8B4513/FFFFFF?text=AS'
    },
    {
      id: 3,
      name: 'Vikram Patel',
      location: 'Bangalore',
      rating: 5,
      text: 'Professional service and premium quality. Highly recommended for special occasions.',
      image: 'https://via.placeholder.com/80x80/8B4513/FFFFFF?text=VP'
    }
  ];


  const STATS = [
    { number: '500+', label: 'Happy Customers' },
    { number: '1000+', label: 'Suits Delivered' },
    { number: '15+', label: 'Cities Covered' },
    { number: '99%', label: 'Customer Satisfaction' }
  ];

  const TOP_CATEGORIES = [
    { id: 1, name: 'Suits', image: Product1, category: 'suits' },
    { id: 2, name: 'Kurtas', image: Product2, category: 'kurtas' },
    { id: 3, name: 'Bandhgalas', image: Product3, category: 'bandhgalas' },
    { id: 4, name: 'Formal Wear', image: Product4, category: 'formal' },
    { id: 5, name: 'Traditional', image: Product5, category: 'traditional' }
  ];

  // Featured products - showcasing best products from each category
  const FEATURED_PRODUCTS = [
    PRODUCTS_DATA.find(p => p.id === 1), // Classic Navy Suit
    PRODUCTS_DATA.find(p => p.id === 4), // Traditional White Kurta
    PRODUCTS_DATA.find(p => p.id === 7), // Classic Bandhgala
    PRODUCTS_DATA.find(p => p.id === 10), // Business Blazer
    PRODUCTS_DATA.find(p => p.id === 13), // Sherwani Set
    PRODUCTS_DATA.find(p => p.id === 2), // Charcoal Business Suit
  ].filter(Boolean);

    // Initialize SEO for homepage
    useEffect(() => {
      SEOService.initializeHomepageSEO();

      // Generate product structured data if we have products
      const allProducts = [...PRODUCTS_DATA];
      if (allProducts.length > 0) {
        SEOService.generateProductStructuredData(allProducts);
      }

      // Generate local business structured data
      SEOService.generateLocalBusinessStructuredData();

      // Generate FAQ structured data
      const faqs = [
        {
          question: "What types of men's fashion do you offer?",
          answer: "We offer premium men's fashion including suits, kurtas, bandhgalas, formal wear, and traditional clothing for all occasions."
        },
        {
          question: "Do you offer rental services?",
          answer: "Yes, we provide both rental and purchase options for all our premium men's fashion items."
        },
        {
          question: "What is your delivery area?",
          answer: "We deliver across all Kerala with free shipping above ₹10,000."
        },
        {
          question: "How can I book in bulk?",
          answer: "Contact us directly to discuss bulk booking options for events, weddings, and special occasions."
        }
      ];
      SEOService.generateFAQStructuredData(faqs);

      // Generate review structured data
      SEOService.generateReviewStructuredData(TESTIMONIALS);
    }, []);

  // Fetch images from admin system based on categories
  useEffect(() => {
    const fetchImagesByCategory = async () => {
      try {
        setLoadingImages(true);
        
        // Load saved admin image favorites from localStorage
        const savedAdminFavorites = FavoritesService.getAdminFavorites();
        setAdminImageFavorites(new Set(savedAdminFavorites));
        
        // Fetch images for different categories
        const [topCategoriesResponse, featuredResponse, trendingResponse] = await Promise.all([
          ImageService.getImagesByCategory('topCategories'),
          ImageService.getImagesByCategory('featured'),
          ImageService.getImagesByCategory('trending')
        ]);

        if (topCategoriesResponse.success) {
          setTopCategoriesImages(topCategoriesResponse.data.images || []);
        }
        
        if (featuredResponse.success) {
          setFeaturedImages(featuredResponse.data.images || []);
        }
        
        if (trendingResponse.success) {
          setTrendingImages(trendingResponse.data.images || []);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchImagesByCategory();
  }, []);

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


  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
    navigate('/product-details', { state: { product } });
  };

  // Handle admin image favorite toggle
  const handleAdminImageFavorite = (imageId, e) => {
    e.stopPropagation();
    
    // Find the image object to toggle
    const allImages = [...topCategoriesImages, ...featuredImages, ...trendingImages];
    const image = allImages.find(img => img._id === imageId);
    
    if (image) {
      // Use centralized favorites service
      const newFavoriteStatus = FavoritesService.toggleFavorite(image);
      
      // Update component state
      setAdminImageFavorites(prev => {
        const newFavorites = new Set(prev);
        if (newFavoriteStatus) {
          newFavorites.add(imageId);
        } else {
          newFavorites.delete(imageId);
        }
        return newFavorites;
      });
    }
  };

  // Newsletter handler
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterLoading(true);
    
    try {
      // Validate email
      if (!NewsletterService.validateEmail(newsletterEmail)) {
        throw new Error('Please enter a valid email address');
      }

      // Subscribe to newsletter via API
      const response = await NewsletterService.subscribe(
        NewsletterService.formatEmail(newsletterEmail),
        {
          fashionUpdates: true,
          exclusiveOffers: true,
          newProducts: true,
          styleTips: true
        },
        'homepage'
      );

      if (response.success) {
        setNewsletterSuccess(true);
        setNewsletterEmail('');
        
        // Reset success message after 5 seconds
        setTimeout(() => setNewsletterSuccess(false), 5000);
        
        console.log('✅ Newsletter subscription successful:', response.message);
      }
    } catch (error) {
      console.error('❌ Newsletter subscription error:', error);
      // You could add error state handling here if needed
      alert(error.message || 'Failed to subscribe to newsletter. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };


  // Render methods
  const renderHeroSection = () => {
    const heroImages = [Home, Home1, Home2, Home3];
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
              
              /* Desktop section titles */
              .section-title {
                font-size: 2.5rem !important;
                margin-bottom: 2rem !important;
              }
              
              /* Desktop product/category cards */
              .desktop-card {
                width: 280px !important;
                height: 350px !important;
                margin: 0 15px !important;
              }
              
              .desktop-card img {
                width: 100% !important;
                height: 240px !important;
                object-fit: cover !important;
              }
              
              .desktop-card-title {
                font-size: 1.1rem !important;
                margin-bottom: 0.5rem !important;
              }
              
              .desktop-card-price {
                font-size: 1.2rem !important;
                font-weight: 700 !important;
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
              
              /* Reduce gap and increase text size on mobile */
              .hero-text-container {
                margin-top: 15px !important;
                padding: 0 20px !important;
              }
              
              .hero-title {
                font-size: 24px !important;
                line-height: 1.3 !important;
                margin-bottom: 12px !important;
              }
              
              .hero-description {
                font-size: 15px !important;
                line-height: 1.5 !important;
                margin-bottom: 20px !important;
              }
              
              .hero-buttons {
                margin-bottom: 25px !important;
              }
              
              .hero-buttons .btn {
                font-size: 15px !important;
                padding: 11px 26px !important;
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
                    <Image 
                      src={image} 
                      alt={`dappr SQUAD Premium Men's Fashion - Hero Image ${index + 1}`}
                      fluid
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
          <div className="text-center hero-text-container" style={{ marginTop: '20px', padding: '0 20px' }}>
            <h1 
              className="fw-bold mb-3 hero-title"
                style={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: '34px',
                lineHeight: '1.3',
                textAlign: 'center',
                color: '#000',
                margin: '0 auto 15px',
                maxWidth: '380px',
                marginTop: '-150px',
              }}
            >
              Style Together, Shine Together
              </h1>
              <p 
              className="mb-4 hero-description"
                style={{
                fontFamily: 'Poppins',
                fontWeight: 400,
                lineHeight: '1.5',
                fontSize: '16px',
                color: '#666',
                maxWidth: '380px',
                margin: '0 auto 25px'
              }}
            >
              Premium men's fashion for every celebration. Buy, Rent, or Book in Bulk. Perfect outfits for weddings, parties, squads, and more.
            </p>
            <div className="d-flex gap-2 justify-content-center mb-4 hero-buttons">
                <Button 
                  variant="outline-dark" 
                  size="md"
                  className="btn-custom"
                  style={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    borderRadius: '20px',
                    border: '2px solid #000',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    color: '#000',
                    padding: '10px 24px'
                  }}
                  onClick={handleRentNowClick}
              >
                Rent Now
              </Button>
              <Button 
                variant="dark" 
                size="md"
                className="btn-custom"
                style={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  borderRadius: '20px',
                  backgroundColor: '#000',
                  border: 'none',
                  fontSize: '14px',
                  padding: '10px 24px'
                }}
                onClick={handleShopNowClick}
              >
                Buy Now
              </Button>
            </div>
            
            {/* Feature Icons Section */}
            <div className="d-flex justify-content-center gap-3">
              {FEATURES.map((feature, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="rounded-circle bg-dark d-flex align-items-center justify-content-center mx-auto mb-2"
            style={{
                      width: '40px',
                      height: '40px'
            }}
          >
                    <feature.icon size={16} className="text-white" />
          </div>
                  <h6 
                    className="fw-medium mb-0"
            style={{
                      fontFamily: 'Poppins',
                      fontWeight: 400,
              fontSize: '10px',
                      color: '#000',
                      lineHeight: '1.3'
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

  // Render testimonials section
  const renderTestimonialsSection = () => (
    <Container className="py-5">
      <Row className="text-center mb-5">
        <Col>
          <h2 
            style={{
              fontFamily: 'Poppins',
              fontWeight: 700,
              fontSize: '2rem',
              color: '#000',
              marginBottom: '1rem'
            }}
          >
            What Our Customers Say
          </h2>
          <p 
            style={{ 
              fontFamily: 'Poppins',
              fontWeight: 400,
              fontSize: '1.1rem',
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </Col>
      </Row>
      
      <Row className="g-4">
        {TESTIMONIALS.map((testimonial) => (
          <Col key={testimonial.id} md={4}>
            <Card 
              className="h-100 border-0 shadow-sm"
              style={{ borderRadius: '15px' }}
            >
              <Card.Body className="p-4 text-center">
                <div className="mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} style={{ color: '#ffc107', fontSize: '1.2rem' }}>★</span>
                  ))}
                </div>
                <Card.Text 
                style={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: '1rem',
                    color: '#333',
                    fontStyle: 'italic',
                    marginBottom: '1.5rem',
                    lineHeight: '1.6'
                  }}
                >
                  "{testimonial.text}"
                </Card.Text>
                <div className="d-flex align-items-center justify-content-center">
                  <Image 
                    src={testimonial.image}
                    roundedCircle
                    style={{ width: '50px', height: '50px', marginRight: '1rem' }}
                  />
                  <div>
                    <h6 
                style={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: '#000',
                        margin: 0
                      }}
                    >
                      {testimonial.name}
                    </h6>
                    <small 
                      style={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        color: '#666'
                      }}
                    >
                      {testimonial.location}
                    </small>
              </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );

  // Render stats section
  const renderStatsSection = () => (
    <div style={{ backgroundColor: '#ffffff', padding: '30px 0' }}>
      <Container>
        <Row className="text-center g-2">
          {STATS.map((stat, index) => (
            <Col key={index} xs={6} sm={6} md={6} lg={6} style={{ marginBottom: '12px' }}>
              <div 
                style={{
                  padding: '20px 10px',
                  borderRadius: '14px',
                  backgroundColor: '#f8f9fa',
                  transition: 'all 0.3s ease',
                  border: '1px solid #e9ecef',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '110px'
                }}
                className="stat-card"
              >
                <h3 
                  style={{
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                    fontSize: '32px',
                    color: '#000',
                    marginBottom: '6px',
                    lineHeight: '1'
                  }}
                >
                  {stat.number}
                </h3>
                <p 
                  style={{
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: '12px',
                    color: '#666',
                    margin: 0,
                    lineHeight: '1.3',
                    textAlign: 'center'
                  }}
                >
                  {stat.label}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
      
      <style>
        {`
          .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            background-color: #fff;
          }
        `}
      </style>
    </div>
  );


  // Render newsletter section
  const renderNewsletterSection = () => (
    <div className="py-5 bg-dark">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={6} className="text-center">
            <h3 className="text-white mb-4 fw-bold" style={{ fontSize: '2rem', fontFamily: 'Poppins' }}>
              Stay in the Loop
            </h3>
            <p className="text-white-50 mb-5" style={{ fontSize: '1rem', fontFamily: 'Poppins', opacity: 0.8 }}>
              Subscribe to get updates on new arrivals and special offers
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="mb-3">
              <div className="newsletter-form-container">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={newsletterLoading}
                  className="form-control newsletter-input"
                />
                <Button
                  type="submit"
                  disabled={newsletterLoading || !newsletterEmail.trim()}
                  className="newsletter-subscribe-btn"
                >
                  {newsletterLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </div>
            </form>
            
            {newsletterSuccess && (
              <div className="newsletter-success-message">
                ✓ Successfully subscribed! Welcome to dappr SQUAD!
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );

  const renderFeaturedProductsSection = () => {
    // Use admin images if available, otherwise fallback to static products
    const productsToShow = featuredImages.length > 0 
      ? featuredImages.slice(0, 6) // Limit to 6 products
      : FEATURED_PRODUCTS;

    return (
    <Container className="py-5">
      <Row className="align-items-center mb-4">
        <Col>
          <h3 
            className="h3 fw-bold mb-0"
                  style={{
                    fontFamily: 'Poppins',
                    fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            Featured Products
                </h3>
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
              View all products
          </Button>
          </Col>
      </Row>
      
      <HorizontalScroll>
          {productsToShow.map((product) => {
            // Handle both admin images and static products
            const isAdminImage = product.imageUrl;
            const imageSrc = isAdminImage ? product.imageUrl : product.image;
            const title = isAdminImage ? product.title : product.name;
            const price = isAdminImage ? (product.price || product.rentalPrice) : product.price;
            
            return (
              <div key={isAdminImage ? product._id : product.id} style={{ width: '200px', flexShrink: 0 }}>
            <div 
              className="position-relative"
                  style={{ 
                    cursor: 'pointer',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onClick={() => {
                    if (isAdminImage) {
                      handleProductClick({
                        id: product._id,
                        name: product.title,
                        image: product.imageUrl,
                        price: product.price || 0,
                        rentalPrice: product.rentalPrice || 0
                      });
                    } else {
                      handleProductClick(product);
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
            >
               <Image 
                    src={imageSrc} 
                    alt={title}
                 fluid
                 style={{
                   width: '100%',
                  height: '250px',
                      objectFit: 'cover'
                 }}
               />
                  
                  {/* Love Button */}
                  {isAdminImage && (
              <div 
                      className="position-absolute"
                style={{
                        top: '10px',
                        right: '10px',
                        width: '35px',
                        height: '35px',
                        backgroundColor: adminImageFavorites.has(product._id) ? 'rgba(220, 53, 69, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={(e) => handleAdminImageFavorite(product._id, e)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = adminImageFavorites.has(product._id) ? 'rgba(220, 53, 69, 0.2)' : 'rgba(255, 255, 255, 1)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = adminImageFavorites.has(product._id) ? 'rgba(220, 53, 69, 0.1)' : 'rgba(255, 255, 255, 0.9)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {adminImageFavorites.has(product._id) ? (
                        <HeartFill size={18} color="#dc3545" />
                      ) : (
                        <Heart size={18} color="#000" />
                      )}
                    </div>
                  )}
              
                  {/* Product Name and Price Overlay */}
              <div 
                className="position-absolute bottom-0 start-0 end-0 text-center p-3"
                style={{
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  borderBottomLeftRadius: '15px',
                  borderBottomRightRadius: '15px'
                }}
              >
                <h6 
                      className="text-white mb-1 fw-bold"
                  style={{
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                        fontSize: '14px',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                      {title}
                </h6>
                    <p 
                      className="text-white mb-0"
                      style={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '12px',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      ₹{price}
                    </p>
              </div>
            </div>
          </div>
            );
          })}
        </HorizontalScroll>
      </Container>
    );
  };

  const renderTopCategoriesSection = () => {
    // Use admin images if available, otherwise fallback to static categories
    const categoriesToShow = topCategoriesImages.length > 0 
      ? topCategoriesImages.slice(0, 5) // Limit to 5 categories
      : TOP_CATEGORIES;

    return (
    <Container className="py-5">
      <Row className="align-items-center mb-4">
        <Col>
          <h3 
            className="h3 fw-bold mb-0"
                  style={{
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                    letterSpacing: '-0.02em'
                  }}
                >
                  Top Categories
                </h3>
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
        {categoriesToShow.map((item, index) => {
          // Handle both admin images and static categories
          const isAdminImage = item.imageUrl;
          const imageSrc = isAdminImage ? item.imageUrl : item.image;
          const title = isAdminImage ? item.title : item.name;
          const category = isAdminImage ? item.category : item.category;
          
          return (
            <div key={isAdminImage ? item._id : item.id} style={{ width: '200px', flexShrink: 0 }}>
            <div 
              className="position-relative"
                  style={{
                    cursor: 'pointer',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onClick={() => {
                    if (isAdminImage) {
                      handleProductClick({
                        id: item._id,
                        name: item.title,
                        image: item.imageUrl,
                        price: item.price || 0,
                        rentalPrice: item.rentalPrice || 0
                      });
                    } else {
                      handleCategoryClick(item);
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
            >
               <Image 
                    src={imageSrc} 
                    alt={title}
                 fluid
                 style={{
                   width: '100%',
                  height: '250px',
                      objectFit: 'cover'
                 }}
               />
              
              {/* Love Button */}
              {isAdminImage && (
              <div 
                  className="position-absolute"
                style={{
                    top: '10px',
                    right: '10px',
                    width: '35px',
                    height: '35px',
                    backgroundColor: adminImageFavorites.has(item._id) ? 'rgba(220, 53, 69, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={(e) => handleAdminImageFavorite(item._id, e)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = adminImageFavorites.has(item._id) ? 'rgba(220, 53, 69, 0.2)' : 'rgba(255, 255, 255, 1)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = adminImageFavorites.has(item._id) ? 'rgba(220, 53, 69, 0.1)' : 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {adminImageFavorites.has(item._id) ? (
                    <HeartFill size={18} color="#dc3545" />
                  ) : (
                    <Heart size={18} color="#000" />
                  )}
              </div>
              )}
              
              {/* Category Name Overlay */}
              <div 
                className="position-absolute bottom-0 start-0 end-0 text-center p-3"
                style={{
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  borderBottomLeftRadius: '15px',
                  borderBottomRightRadius: '15px'
                }}
              >
                <h6 
                      className="text-white mb-0 fw-bold"
          style={{
            fontFamily: 'Poppins',
            fontWeight: 700,
                        fontSize: '14px',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      {title}
                    </h6>
                    {isAdminImage && item.price && (
                    <p 
                        className="text-white mb-0"
              style={{
                fontFamily: 'Poppins',
                          fontWeight: 600,
                          fontSize: '12px',
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                        }}
                      >
                        ₹{item.price}
                      </p>
                    )}
                  </div>
                </div>
    </div>
  );
          })}
        </HorizontalScroll>
      </Container>
    );
  };






  const renderFinalCTASection = () => (
    <div className="py-5">
      <Container>
        {/* Image Section */}
        <div className="text-center mb-5">
          <Image 
            src={Aboutus4} 
            alt="Final CTA"
            fluid
            rounded
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
          <h3 
            className="display-4 fw-bold mb-4"
            style={{
              fontFamily: 'Poppins',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              fontSize: '2.5rem',
              color: '#000'
            }}
          >
            Your Celebration, Your Style The Dapper Way.
          </h3>
          <p 
            className="fs-4 mb-4"
            style={{
              fontFamily: 'Poppins',
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
                  fontFamily: 'Poppins',
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
                fontFamily: 'Poppins',
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
          
          /* Newsletter Form Container */
          .newsletter-form-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
            width: 100%;
            max-width: 380px;
            margin: 0 auto;
            padding: 0 10px;
          }
          
          /* Newsletter Input */
          .newsletter-input {
            width: 100%;
            border-radius: 50px;
            padding: 18px 28px;
            border: none;
            background-color: #ffffff;
            font-size: 16px;
            font-family: 'Poppins', sans-serif;
            color: #000;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }
          
          .newsletter-input::placeholder {
            color: #aaa;
            font-weight: 400;
          }
          
          .newsletter-input:focus {
            outline: none;
            box-shadow: 0 4px 16px rgba(255, 255, 255, 0.2);
            background-color: #ffffff;
          }
          
          .newsletter-input:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          /* Newsletter Subscribe Button - Force Black Color */
          .newsletter-subscribe-btn {
            width: 100% !important;
            border-radius: 50px !important;
            padding: 18px 28px !important;
            background-color: #000 !important;
            color: #fff !important;
            border: none !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            font-family: 'Poppins', sans-serif !important;
            transition: all 0.3s ease !important;
            position: relative;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
          }
          
          .newsletter-subscribe-btn:hover:not(:disabled) {
            background-color: #222 !important;
            color: #fff !important;
            border: none !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4) !important;
          }
          
          .newsletter-subscribe-btn:focus:not(:disabled),
          .newsletter-subscribe-btn:focus-visible:not(:disabled) {
            background-color: #000 !important;
            color: #fff !important;
            border: none !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 0.2rem rgba(0, 0, 0, 0.3) !important;
          }
          
          .newsletter-subscribe-btn:active:not(:disabled) {
            background-color: #111 !important;
            color: #fff !important;
            border: none !important;
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
          }
          
          .newsletter-subscribe-btn:disabled {
            background-color: #000 !important;
            color: #fff !important;
            opacity: 0.5 !important;
            cursor: not-allowed !important;
          }
          
          /* Newsletter Success Message */
          .newsletter-success-message {
            background-color: rgba(255, 255, 255, 0.95);
            color: #000;
            border: none;
            border-radius: 50px;
            padding: 18px 28px;
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
            font-size: 15px;
            text-align: center;
            max-width: 420px;
            margin: 0 auto;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            animation: slideInUp 0.4s ease-out;
          }
          
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Keep vertical layout on all screens for consistency */
          @media (min-width: 769px) {
            .newsletter-form-container {
              max-width: 420px;
              gap: 20px;
            }
            
            .newsletter-success-message {
              max-width: 420px;
            }
          }
        `}
      </style>
      {renderHeroSection()}
      {renderFeatureIconsSection()}
      {renderTopCategoriesSection()}
      {renderFeaturedProductsSection()}
      {renderStatsSection()}
      {renderFinalCTASection()}
      {renderNewsletterSection()}
    </div>
  );
};

export default HomePageContent;