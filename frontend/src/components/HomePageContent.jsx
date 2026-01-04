import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Carousel, Card, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Search, Cart, Truck, ArrowClockwise, ChevronRight, Heart, HeartFill, Bag, Shield } from 'react-bootstrap-icons';

// Import images
import Home from '../assets/Newhome.webp';
import Home1 from '../assets/Home1.jpg';
import Home2 from '../assets/Home2.jpg';
import Home3 from '../assets/Home3.jpg';
import Aboutus4 from '../assets/Aboutus4.png';
import Product1 from '../assets/Product1.jpg';
import Product2 from '../assets/Product2.png';
import Product3 from '../assets/Product3.jpg';
import Product4 from '../assets/Product4.jpg';
import Product5 from '../assets/Product5.png';

// Import reusable components
import ProductCard from './common/ProductCard';
import CategoryCard from './common/CategoryCard';
import HorizontalScroll from './common/HorizontalScroll';
import Footer from './Footer';

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
    PRODUCTS_DATA.find(p => p.id === 4), // Traditional Kurta
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
    return (
      <Container 
        fluid 
        className="px-0 d-none d-lg-block" 
        style={{ 
          backgroundColor: '#ececec', 
          position: 'relative', 
          height: '629px',
          overflow: 'hidden'
        }}
      >
        {/* Desktop Layout - Absolute positioning for exact placement */}
        <div className="hero-desktop-container" style={{ position: 'relative', width: '100%', height: '100%', maxWidth: '1440px', margin: '0 auto', padding: '0 100px' }}>
          {/* Text Content - With 268px margin top */}
          <div 
            className="hero-text-content"
            style={{ 
              position: 'absolute',
              top: '268px',
              left: '100px',
              width: '480px',
              zIndex: 2
            }}
          >
            <h1 
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 600,
                fontSize: '52px',
                lineHeight: '115%',
                letterSpacing: '-0.5px',
                color: '#0a0a0a',
                margin: 0,
                marginBottom: '24px'
              }}
            >
              Dress the Squad in Premium Style
            </h1>
            <p 
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '160%',
                color: '#5a5a5a',
                margin: 0,
                maxWidth: '420px'
              }}
            >
              Discover curated outfits for groomsmen - available to rent or buy. Your squad's perfect look starts here.
            </p>
          </div>
          
          {/* Image - Right side with margin top */}
          <div
            className="hero-image-container"
            style={{
              position: 'absolute',
              top: '60px',
              right: 0,
              width: '58%',
              height: 'calc(100% - 60px)',
              borderRadius: '0 0 0 20px',
              overflow: 'hidden',
              boxShadow: '-10px 10px 40px rgba(0, 0, 0, 0.08)'
            }}
          >
            <Image 
              src={Home} 
              alt="Premium Men's Fashion - Dress the Squad"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center left',
                display: 'block'
              }}
            />
          </div>
        </div>
      </Container>
    );
  };

  const renderHeroSectionMobile = () => {
    return (
      <Container 
        fluid 
        className="px-0 d-block d-lg-none" 
        style={{ 
          backgroundColor: '#ececec',
          height: '492px',
          overflow: 'hidden'
        }}
      >
        <Row className="g-0" style={{ height: '100%' }}>
          {/* Text Content - Mobile */}
          <Col xs={12} className="px-4 pt-4 pb-3">
            <h1 
              className="mb-3"
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(28px, 8vw, 36px)',
                lineHeight: '120%',
                letterSpacing: '-0.5px',
                color: '#0a0a0a'
              }}
            >
              Dress the Squad in Premium Style
            </h1>
            <p 
              className="mb-0"
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(13px, 3.5vw, 15px)',
                lineHeight: '150%',
                color: '#5a5a5a'
              }}
            >
              Discover curated outfits for groomsmen - available to rent or buy. Your squad's perfect look starts here.
            </p>
          </Col>
          
          {/* Image - Mobile */}
          <Col xs={12} className="px-0">
            <Image 
              src={Home} 
              alt="Premium Men's Fashion - Dress the Squad"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block'
              }}
            />
          </Col>
        </Row>
      </Container>
    );
  };

  const renderFeatureIconsSection = () => {
    const features = [
      {
        IconComponent: Search,
        title: 'Browse & Select',
        description: 'Explore premium outfits for your squad.'
      },
      {
        IconComponent: Bag,
        title: 'Choose Rent or Buy',
        description: 'Select whether you want to rent or purchase.'
      },
      {
        IconComponent: Shield,
        title: 'Secure With Deposit',
        description: 'For rentals, pay a refundable security deposit.'
      },
      {
        IconComponent: ArrowClockwise,
        title: 'Return & Refund',
        description: 'Return rented items and receive your deposit back.'
      }
    ];

    return (
      <>
        {/* Desktop Layout - Horizontal */}
        <Container 
          fluid 
          className="d-none d-lg-block"
          style={{ 
            backgroundColor: '#fff',
            height: '115px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            marginTop: '40px',
            paddingLeft: '100px',
            paddingRight: '100px'
          }}
        >
          <div style={{ width: '100%', maxWidth: '1240px', margin: '0' }}>
            <Row className="g-4">
              {features.map((feature, index) => (
                <Col key={index} lg={3}>
                  <div 
                    className="text-center"
                    style={{
                      padding: '0 15px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <div 
                      style={{
                        marginBottom: '12px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <feature.IconComponent 
                        size={24} 
                        style={{ 
                          color: '#4a4a4a',
                          strokeWidth: 1.5
                        }} 
                      />
                    </div>
                    <div
                      style={{
                        width: '263.25px',
                        height: '59px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <h5 
                        style={{
                          fontFamily: 'Bricolage Grotesque, sans-serif',
                          fontWeight: 600,
                          fontSize: '12px',
                          color: '#0a0a0a',
                          margin: 0
                        }}
                      >
                        {feature.title}
                      </h5>
                      <p 
                        style={{
                          fontFamily: 'Bricolage Grotesque, sans-serif',
                          fontWeight: 400,
                          fontSize: '10px',
                          color: '#666',
                          margin: 0,
                          lineHeight: '1.4'
                        }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Container>

        {/* Mobile Layout - Vertical with icon on left */}
        <Container 
          fluid 
          className="d-block d-lg-none"
          style={{ 
            backgroundColor: '#fff',
            padding: '40px 0',
            marginTop: '0'
          }}
        >
          <Container>
            {features.map((feature, index) => (
              <div key={index}>
                <Row 
                  className="align-items-start"
                  style={{
                    padding: '24px 0'
                  }}
                >
                  <Col xs="auto" style={{ paddingRight: '20px' }}>
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <feature.IconComponent 
                        size={32} 
                        style={{ 
                          color: '#4a4a4a',
                          strokeWidth: 1.5
                        }} 
                      />
                    </div>
                  </Col>
                  <Col>
                    <h5 
                      style={{
                        fontFamily: 'Bricolage Grotesque, sans-serif',
                        fontWeight: 600,
                        fontSize: '16px',
                        color: '#0a0a0a',
                        marginBottom: '6px',
                        lineHeight: '1.3'
                      }}
                    >
                      {feature.title}
                    </h5>
                    <p 
                      style={{
                        fontFamily: 'Bricolage Grotesque, sans-serif',
                        fontWeight: 400,
                        fontSize: '13px',
                        color: '#999',
                        margin: 0,
                        lineHeight: '1.5'
                      }}
                    >
                      {feature.description}
                    </p>
                  </Col>
                </Row>
                {index < features.length - 1 && (
                  <hr 
                    style={{
                      border: 'none',
                      borderTop: '1px solid #e8e8e8',
                      margin: 0
                    }}
                  />
                )}
              </div>
            ))}
          </Container>
        </Container>
      </>
    );
  };

  // Render Trending This Season section
  const renderTrendingSection = () => {
    const trendingProducts = [
      {
        id: 1,
        image: Product1,
        title: 'Vintage Kurta Set',
        category: 'WEDDING COLLECTION',
        rentPrice: '1,299',
        buyPrice: '4,999',
        originalPrice: '5,999',
        badge: 'BESTSELLER',
        discount: '36% OFF',
        rating: 4.7,
        reviews: '1.3K'
      },
      {
        id: 2,
        image: Product2,
        title: 'Olive Indo-Western Set',
        category: 'SANGEET COLLECTION',
        rentPrice: '1,899',
        buyPrice: '6,499',
        originalPrice: '8,999',
        badge: 'BESTSELLER',
        discount: '51% OFF',
        rating: 4.8,
        reviews: '1.1K'
      },
      {
        id: 3,
        image: Product3,
        title: 'Black Tuxedo Set',
        category: 'RECEPTION WEAR',
        rentPrice: '2,499',
        buyPrice: '8,999',
        originalPrice: '12,999',
        badge: 'NEW',
        discount: '51% OFF',
        rating: 4.8,
        reviews: '129'
      },
      {
        id: 4,
        image: Product4,
        title: 'Maroon Classic Bandhgala',
        category: 'TRADITIONAL WEAR',
        rentPrice: '1,799',
        buyPrice: '6,999',
        originalPrice: '9,999',
        badge: 'BESTSELLER',
        discount: '28% OFF',
        rating: 4.8,
        reviews: '226'
      }
    ];

    const ProductCard = ({ product }) => (
      <div
        style={{
          backgroundColor: '#fff',
          cursor: 'pointer',
          minWidth: '280px',
          maxWidth: '280px'
        }}
        onClick={() => handleProductClick(product)}
      >
        {/* Image Container - Square */}
        <div style={{ position: 'relative', backgroundColor: '#f5f5f5', width: '100%', aspectRatio: '1/1' }}>
          <Image
            src={product.image}
            alt={product.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          
          {/* Badge */}
          {product.badge && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                backgroundColor: product.badge === 'NEW' ? '#4CAF50' : '#c9a050',
                color: '#fff',
                padding: '6px 12px',
                fontSize: '10px',
                fontWeight: 700,
                fontFamily: 'Bricolage Grotesque, sans-serif',
                letterSpacing: '0.5px'
              }}
            >
              {product.badge}
            </div>
          )}

          {/* Discount Badge */}
          {product.discount && (
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                backgroundColor: '#d4a574',
                color: '#fff',
                padding: '6px 12px',
                fontSize: '10px',
                fontWeight: 700,
                fontFamily: 'Bricolage Grotesque, sans-serif'
              }}
            >
              {product.discount}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ padding: '16px 0' }}>
          {/* Category */}
          <p
            style={{
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontWeight: 400,
              fontSize: '11px',
              color: '#888',
              marginBottom: '6px',
              letterSpacing: '0.5px'
            }}
          >
            {product.category}
          </p>
          
          {/* Title */}
          <h5
            style={{
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              color: '#0a0a0a',
              marginBottom: '8px',
              lineHeight: '1.3'
            }}
          >
            {product.title}
          </h5>
          
          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span style={{ color: '#f5a623', fontSize: '14px' }}>★</span>
            <span
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#0a0a0a'
              }}
            >
              {product.rating}
            </span>
            <span style={{ color: '#ccc' }}>|</span>
            <span
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 400,
                fontSize: '12px',
                color: '#4a90d9'
              }}
            >
              ({product.reviews} Reviews)
            </span>
          </div>
          
          {/* Price */}
          <div style={{ marginBottom: '16px' }}>
            {/* Buy Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontWeight: 400,
                  fontSize: '12px',
                  color: '#666'
                }}
              >
                Buy:
              </span>
              <span
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#0a0a0a'
                }}
              >
                ₹{product.buyPrice}
              </span>
              <span
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontWeight: 400,
                  fontSize: '12px',
                  color: '#999',
                  textDecoration: 'line-through'
                }}
              >
                ₹{product.originalPrice}
              </span>
            </div>
            
            {/* Rent Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontWeight: 400,
                  fontSize: '12px',
                  color: '#666'
                }}
              >
                Rent:
              </span>
              <span
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#d4a574'
                }}
              >
                ₹{product.rentPrice}
              </span>
            </div>
          </div>
          
          {/* Add to Cart Button - Black */}
          <Button
            variant="dark"
            style={{
              width: '100%',
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              padding: '14px',
              borderRadius: '0',
              backgroundColor: '#0a0a0a',
              border: 'none',
              letterSpacing: '0.5px'
            }}
          >
            ADD TO CART
          </Button>
        </div>
      </div>
    );

    return (
      <>
        {/* Desktop Layout */}
        <Container fluid className="d-none d-lg-block trending-section" style={{ backgroundColor: '#fff', paddingTop: '60px', paddingBottom: '60px' }}>
          <div className="trending-container" style={{ paddingLeft: '100px', paddingRight: '100px', maxWidth: '1440px', margin: '0 auto' }}>
            {/* Section Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <h2
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontWeight: 600,
                  fontSize: '28px',
                  color: '#0a0a0a',
                  margin: 0
                }}
              >
                Trending This Season
              </h2>
            </div>

            {/* Product Cards - Desktop Grid */}
            <Row className="g-4 trending-grid">
              {trendingProducts.map((product) => (
                <Col key={product.id} lg={3} md={6}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>

            {/* View All Button */}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Button
                variant="outline-dark"
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: '14px 60px',
                  borderRadius: '0',
                  border: '1px solid #0a0a0a',
                  letterSpacing: '0.5px'
                }}
                onClick={() => navigate('/products')}
              >
                VIEW ALL
              </Button>
            </div>
          </div>
        </Container>

        {/* Mobile Layout - Horizontal Scroll */}
        <Container fluid className="d-block d-lg-none" style={{ backgroundColor: '#fff', paddingTop: '10px', paddingBottom: '40px' }}>
          {/* Section Header */}
          <div style={{ paddingLeft: '20px', paddingRight: '20px', marginBottom: '24px' }}>
            <h2
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 600,
                fontSize: '22px',
                color: '#0a0a0a',
                margin: 0
              }}
            >
              Trending This Season
            </h2>
          </div>

          {/* Horizontal Scroll Container */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              paddingLeft: '20px',
              paddingRight: '20px',
              paddingBottom: '16px',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {trendingProducts.map((product) => (
              <div key={product.id} style={{ scrollSnapAlign: 'start' }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div style={{ textAlign: 'center', marginTop: '24px', paddingLeft: '20px', paddingRight: '20px' }}>
            <Button
              variant="outline-dark"
              style={{
                width: '100%',
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                padding: '14px',
                borderRadius: '0',
                border: '1px solid #0a0a0a',
                letterSpacing: '0.5px'
              }}
              onClick={() => navigate('/products')}
            >
              VIEW ALL
            </Button>
          </div>
        </Container>
      </>
    );
  };

  // Render testimonials section
  const renderTestimonialsSection = () => (
    <Container className="py-5">
      <Row className="text-center mb-5">
        <Col>
          <h2 
            style={{
              fontFamily: 'Poppins',
              fontWeight: 700,
              fontSize: 'clamp(20px, 4.5vw, 2rem)',
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

  // Render promotional banner section
  const renderPromotionalBanner = () => (
    <>
      {/* Desktop Layout */}
      <Container fluid className="d-none d-lg-block" style={{ backgroundColor: '#f5f5f5', paddingTop: '60px', paddingBottom: '60px' }}>
        <div style={{ paddingLeft: '100px', paddingRight: '100px', maxWidth: '1440px', margin: '0 auto' }}>
          <div 
            style={{
              backgroundColor: 'transparent',
              borderRadius: '15px',
              padding: '60px 80px',
              textAlign: 'center'
            }}
          >
            <h4
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 500,
                fontSize: '18px',
                color: '#666',
                marginBottom: '16px',
                letterSpacing: '0.5px'
              }}
            >
              Limited-Time Offer:
            </h4>
            <h2
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 700,
                fontSize: '48px',
                color: '#0a0a0a',
                marginBottom: '20px',
                lineHeight: '1.1'
              }}
            >
              Get 10% OFF <span style={{ color: '#666' }}>on First Rental</span>
            </h2>
            <p
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 400,
                fontSize: '18px',
                color: '#666',
                margin: 0,
                maxWidth: '500px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              Rent more. Save more. Dress the entire squad for less.
            </p>
          </div>
        </div>
      </Container>

      {/* Mobile Layout */}
      <Container fluid className="d-block d-lg-none" style={{ backgroundColor: '#f5f5f5', paddingTop: '40px', paddingBottom: '40px' }}>
        <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <div 
            style={{
              backgroundColor: 'transparent',
              borderRadius: '15px',
              padding: '40px 30px',
              textAlign: 'center'
            }}
          >
            <h4
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                color: '#666',
                marginBottom: '12px',
                letterSpacing: '0.5px'
              }}
            >
              Limited-Time Offer:
            </h4>
            <h2
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 700,
                fontSize: '28px',
                color: '#0a0a0a',
                marginBottom: '16px',
                lineHeight: '1.2'
              }}
            >
              Get 10% OFF <br />
              <span style={{ color: '#666' }}>on First Rental</span>
            </h2>
            <p
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                color: '#666',
                margin: 0,
                lineHeight: '1.4'
              }}
            >
              Rent more. Save more. Dress the entire squad for less.
            </p>
          </div>
        </div>
      </Container>
    </>
  );

  // Render luxury categories section
  const renderLuxuryCategoriesSection = () => {
    const luxuryCategories = [
      {
        id: 1,
        name: 'LUXURY SUITS',
        image: Product1,
        category: 'suits'
      },
      {
        id: 2,
        name: 'PREMIUM KURTAS',
        image: Product2,
        category: 'kurtas'
      },
      {
        id: 3,
        name: 'DESIGNER BANDHGALAS',
        image: Product3,
        category: 'bandhgalas'
      },
      {
        id: 4,
        name: 'FORMAL WEAR',
        image: Product4,
        category: 'formal'
      },
      {
        id: 5,
        name: 'TRADITIONAL SETS',
        image: Product5,
        category: 'traditional'
      }
    ];

    return (
      <>
        {/* Desktop Layout */}
        <Container fluid className="d-none d-md-block luxury-categories-section" style={{ backgroundColor: '#f5f5f5', paddingTop: '80px', paddingBottom: '80px' }}>
          <div className="luxury-categories-container" style={{ paddingLeft: '100px', paddingRight: '100px', maxWidth: '1440px', margin: '0 auto' }}>
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2
                className="luxury-categories-title"
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontWeight: 600,
                  fontSize: '32px',
                  color: '#0a0a0a',
                  letterSpacing: '2px',
                  margin: 0
                }}
              >
                LUXURY CATEGORIES
              </h2>
            </div>

            {/* Categories Grid */}
            <Row className="g-3 g-lg-4 justify-content-center luxury-categories-grid">
              {luxuryCategories.map((category) => (
                <Col key={category.id} xl={2} lg={2} md={4} sm={4} xs={6} className="luxury-category-col">
                  <div
                    className="luxury-category-item"
                    style={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'transform 0.3s ease'
                    }}
                    onClick={() => handleCategoryClick(category)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Category Image Container */}
                    <div
                      className="luxury-category-image-wrapper"
                      style={{
                        backgroundColor: 'transparent',
                        borderRadius: '0',
                        padding: '10px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'visible'
                      }}
                    >
                      <Image
                        src={category.image}
                        alt={category.name}
                        className="luxury-category-image"
                        style={{
                          width: '100%',
                          maxWidth: '320px',
                          height: '250px',
                          objectFit: 'cover',
                          borderRadius: '0',
                          opacity: 1
                        }}
                      />
                    </div>
                    
                    {/* Category Name */}
                    <h5
                      className="luxury-category-name"
                      style={{
                        fontFamily: 'Bricolage Grotesque, sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        color: '#0a0a0a',
                        letterSpacing: '1px',
                        margin: 0,
                        textTransform: 'uppercase'
                      }}
                    >
                      {category.name}
                    </h5>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Container>

        {/* Mobile Layout */}
        <Container fluid className="d-block d-md-none" style={{ backgroundColor: '#f5f5f5', paddingTop: '50px', paddingBottom: '50px' }}>
          <Container>
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontWeight: 600,
                  fontSize: '24px',
                  color: '#0a0a0a',
                  letterSpacing: '1.5px',
                  margin: 0
                }}
              >
                LUXURY CATEGORIES
              </h2>
            </div>

            {/* Categories Grid - Mobile - 2x2 + 1 centered */}
            <div>
              {/* First 4 categories in 2x2 grid using flexbox */}
              <div 
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '15px',
                  marginBottom: '20px'
                }}
              >
                {luxuryCategories.slice(0, 4).map((category, index) => (
                  <div
                    key={category.id}
                    style={{
                      width: 'calc(50% - 7.5px)',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {/* Category Image Container */}
                    <div
                      style={{
                        backgroundColor: 'transparent',
                        borderRadius: '0',
                        padding: '0',
                        marginBottom: '15px',
                        aspectRatio: '1/1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        width: '100%'
                      }}
                    >
                      <Image
                        src={category.image}
                        alt={category.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '0',
                          opacity: 1
                        }}
                      />
                    </div>
                    
                    {/* Category Name */}
                    <h6
                      style={{
                        fontFamily: 'Bricolage Grotesque, sans-serif',
                        fontWeight: 500,
                        fontSize: '11px',
                        color: '#0a0a0a',
                        letterSpacing: '0.8px',
                        margin: 0,
                        textTransform: 'uppercase',
                        lineHeight: '1.3'
                      }}
                    >
                      {category.name}
                    </h6>
                  </div>
                ))}
              </div>
              
              {/* 5th category centered below */}
              {luxuryCategories.length > 4 && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: 'calc(50% - 7.5px)',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                    onClick={() => handleCategoryClick(luxuryCategories[4])}
                  >
                    {/* Category Image Container */}
                    <div
                      style={{
                        backgroundColor: 'transparent',
                        borderRadius: '0',
                        padding: '0',
                        marginBottom: '15px',
                        aspectRatio: '1/1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        width: '100%'
                      }}
                    >
                      <Image
                        src={luxuryCategories[4].image}
                        alt={luxuryCategories[4].name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '0',
                          opacity: 1
                        }}
                      />
                    </div>
                    
                    {/* Category Name */}
                    <h6
                      style={{
                        fontFamily: 'Bricolage Grotesque, sans-serif',
                        fontWeight: 500,
                        fontSize: '11px',
                        color: '#0a0a0a',
                        letterSpacing: '0.8px',
                        margin: 0,
                        textTransform: 'uppercase',
                        lineHeight: '1.3'
                      }}
                    >
                      {luxuryCategories[4].name}
                    </h6>
                  </div>
                </div>
              )}
            </div>
          </Container>
        </Container>
      </>
    );
  };

  // Render rental message section
  const renderRentalMessageSection = () => (
    <>
      {/* Desktop Layout */}
      <Container fluid className="d-none d-lg-block" style={{ backgroundColor: '#0a0a0a', paddingTop: '100px', paddingBottom: '100px' }}>
        <div style={{ paddingLeft: '100px', paddingRight: '100px', maxWidth: '1440px', margin: '0 auto' }}>
          <Row className="justify-content-start">
            <Col lg={8}>
              {/* Main Heading */}
              <h1
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontWeight: 700,
                  fontSize: '64px',
                  color: '#ffffff',
                  lineHeight: '1.1',
                  marginBottom: '40px',
                  letterSpacing: '-1px'
                }}
              >
                LOVE IT. RENT IT.<br />
                WEAR IT. RETURN IT.
              </h1>
              
              {/* Description */}
              <p
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontWeight: 400,
                  fontSize: '20px',
                  color: '#cccccc',
                  lineHeight: '1.6',
                  marginBottom: '50px',
                  maxWidth: '600px'
                }}
              >
                Discover rental-only outfits designed for the groom's squad. Choose from curated styles, reserve with ease, and enjoy hassle-free returns after the event.
              </p>
              
              {/* Browse Collection Button */}
              <Button
                variant="light"
                size="lg"
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  backgroundColor: '#ffffff',
                  color: '#0a0a0a',
                  border: 'none',
                  borderRadius: '0',
                  padding: '18px 50px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
                onClick={handleRentNowClick}
              >
                Browse Collection
              </Button>
            </Col>
          </Row>
        </div>
      </Container>

      {/* Mobile Layout */}
      <Container fluid className="d-block d-lg-none" style={{ backgroundColor: '#0a0a0a', paddingTop: '60px', paddingBottom: '60px' }}>
        <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          {/* Main Heading */}
          <h1
            style={{
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontWeight: 700,
              fontSize: '36px',
              color: '#ffffff',
              lineHeight: '1.2',
              marginBottom: '30px',
              letterSpacing: '-0.5px',
              textAlign: 'center'
            }}
          >
            LOVE IT. RENT IT.<br />
            WEAR IT. RETURN IT.
          </h1>
          
          {/* Description */}
          <p
            style={{
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontWeight: 400,
              fontSize: '16px',
              color: '#cccccc',
              lineHeight: '1.5',
              marginBottom: '40px',
              textAlign: 'center'
            }}
          >
            Discover rental-only outfits designed for the groom's squad. Choose from curated styles, reserve with ease, and enjoy hassle-free returns after the event.
          </p>
          
          {/* Browse Collection Button */}
          <div style={{ textAlign: 'center' }}>
            <Button
              variant="light"
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                backgroundColor: '#ffffff',
                color: '#0a0a0a',
                border: 'none',
                borderRadius: '0',
                padding: '16px 40px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
              onClick={handleRentNowClick}
            >
              Browse Collection
            </Button>
          </div>
        </div>
      </Container>
    </>
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

  return (
    <div>
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
          
          /* ============================================
             COMPREHENSIVE RESPONSIVE STYLES
             All screen sizes from 320px to 2560px+
          ============================================ */
          
          /* Extra Large Desktop (1920px+) */
          @media (min-width: 1920px) {
            .hero-desktop-container {
              padding: 0 150px !important;
            }
            .hero-text-content {
              left: 150px !important;
              width: 550px !important;
            }
            .hero-text-content h1 {
              font-size: 58px !important;
            }
            .trending-section .trending-container {
              padding-left: 150px !important;
              padding-right: 150px !important;
            }
          }
          
          /* Large Desktop (1440px - 1919px) */
          @media (min-width: 1440px) and (max-width: 1919px) {
            .hero-desktop-container {
              padding: 0 100px !important;
            }
            .hero-text-content {
              left: 100px !important;
              width: 480px !important;
            }
          }
          
          /* Medium Desktop (1200px - 1439px) */
          @media (min-width: 1200px) and (max-width: 1439px) {
            .hero-desktop-container {
              padding: 0 80px !important;
            }
            .hero-text-content {
              left: 80px !important;
              width: 450px !important;
              top: 240px !important;
            }
            .hero-text-content h1 {
              font-size: 46px !important;
            }
            .trending-section .trending-container {
              padding-left: 80px !important;
              padding-right: 80px !important;
            }
          }
          
          /* Small Desktop / Large Tablet Landscape (1024px - 1199px) */
          @media (min-width: 1024px) and (max-width: 1199px) {
            .hero-desktop-container {
              padding: 0 50px !important;
            }
            .hero-text-content {
              left: 50px !important;
              width: 400px !important;
              top: 200px !important;
            }
            .hero-text-content h1 {
              font-size: 40px !important;
              margin-bottom: 16px !important;
            }
            .hero-text-content p {
              font-size: 14px !important;
            }
            .hero-image-container {
              width: 55% !important;
            }
            .trending-section .trending-container {
              padding-left: 50px !important;
              padding-right: 50px !important;
            }
          }
          
          /* iPad Pro / Tablet Landscape (992px - 1023px) */
          @media (min-width: 992px) and (max-width: 1023px) {
            .hero-desktop-container {
              padding: 0 40px !important;
            }
            .hero-text-content {
              left: 40px !important;
              width: 360px !important;
              top: 180px !important;
            }
            .hero-text-content h1 {
              font-size: 36px !important;
              margin-bottom: 14px !important;
            }
            .hero-text-content p {
              font-size: 13px !important;
              max-width: 340px !important;
            }
            .hero-image-container {
              width: 52% !important;
            }
            .trending-section .trending-container {
              padding-left: 40px !important;
              padding-right: 40px !important;
            }
          }
          
          /* Tablet Portrait (768px - 991px) - Show mobile hero */
          @media (min-width: 768px) and (max-width: 991px) {
            .trending-section .trending-container {
              padding-left: 30px !important;
              padding-right: 30px !important;
            }
          }
          
          /* Small Tablet (600px - 767px) */
          @media (min-width: 600px) and (max-width: 767px) {
            .trending-section .trending-container {
              padding-left: 24px !important;
              padding-right: 24px !important;
            }
          }
          
          /* ============================================
             LUXURY CATEGORIES RESPONSIVE STYLES
          ============================================ */
          
          /* Large Desktop (1440px+) */
          @media (min-width: 1440px) {
            .luxury-categories-container {
              padding-left: 100px !important;
              padding-right: 100px !important;
            }
            .luxury-category-image {
              height: 250px !important;
            }
          }
          
          /* Medium Desktop (1200px - 1439px) */
          @media (min-width: 1200px) and (max-width: 1439px) {
            .luxury-categories-container {
              padding-left: 60px !important;
              padding-right: 60px !important;
            }
            .luxury-category-image {
              height: 220px !important;
            }
          }
          
          /* Small Desktop / iPad Pro Landscape (1024px - 1199px) */
          @media (min-width: 1024px) and (max-width: 1199px) {
            .luxury-categories-container {
              padding-left: 40px !important;
              padding-right: 40px !important;
            }
            .luxury-category-image {
              height: 180px !important;
            }
            .luxury-category-name {
              font-size: 12px !important;
            }
          }
          
          /* iPad Landscape (992px - 1023px) */
          @media (min-width: 992px) and (max-width: 1023px) {
            .luxury-categories-container {
              padding-left: 30px !important;
              padding-right: 30px !important;
            }
            .luxury-category-image {
              height: 160px !important;
            }
            .luxury-category-name {
              font-size: 11px !important;
            }
            .luxury-categories-title {
              font-size: 26px !important;
            }
          }
          
          /* iPad Portrait (768px - 991px) */
          @media (min-width: 768px) and (max-width: 991px) {
            .luxury-categories-section {
              padding-top: 50px !important;
              padding-bottom: 50px !important;
            }
            .luxury-categories-container {
              padding-left: 24px !important;
              padding-right: 24px !important;
            }
            .luxury-category-image {
              height: 150px !important;
            }
            .luxury-category-name {
              font-size: 10px !important;
              letter-spacing: 0.5px !important;
            }
            .luxury-categories-title {
              font-size: 24px !important;
              margin-bottom: 40px !important;
            }
            .luxury-category-image-wrapper {
              padding: 5px !important;
              margin-bottom: 12px !important;
            }
          }
          
          /* Large Mobile (480px - 599px) */
          @media (min-width: 480px) and (max-width: 599px) {
            .newsletter-form-container {
              max-width: 100% !important;
              padding: 0 16px !important;
            }
          }
          
          /* Mobile (320px - 479px) */
          @media (min-width: 320px) and (max-width: 479px) {
            .newsletter-form-container {
              max-width: 100% !important;
              padding: 0 12px !important;
            }
            .newsletter-input {
              padding: 14px 20px !important;
              font-size: 14px !important;
            }
            .newsletter-subscribe-btn {
              padding: 14px 20px !important;
              font-size: 14px !important;
            }
          }
          
          /* Extra Small Mobile (<320px) */
          @media (max-width: 319px) {
            .newsletter-form-container {
              padding: 0 8px !important;
            }
            .newsletter-input {
              padding: 12px 16px !important;
              font-size: 13px !important;
            }
            .newsletter-subscribe-btn {
              padding: 12px 16px !important;
              font-size: 13px !important;
            }
          }
        `}
      </style>
      {renderHeroSection()}
      {renderHeroSectionMobile()}
      {renderFeatureIconsSection()}
      {renderTrendingSection()}
      {renderPromotionalBanner()}
      {renderLuxuryCategoriesSection()}
      {renderRentalMessageSection()}
      <Footer />
    </div>
  );
};

export default HomePageContent;