import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Search, Bag, Shield, ArrowClockwise } from 'react-bootstrap-icons';

// Import images
import Home from '../assets/Newhome.webp';
import Product1 from '../assets/Product1.jpg';
import Product2 from '../assets/Product2.png';
import Product3 from '../assets/Product3.jpg';
import Product4 from '../assets/Product4.jpg';
import Product5 from '../assets/Product5.png';

// Import reusable components
import Footer from './Footer';

// Import constants and utilities
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

  // Initialize SEO for homepage
  useEffect(() => {
    SEOService.initializeHomepageSEO();

    const allProducts = [...PRODUCTS_DATA];
    if (allProducts.length > 0) {
      SEOService.generateProductStructuredData(allProducts);
    }

    SEOService.generateLocalBusinessStructuredData();

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
    SEOService.generateReviewStructuredData(TESTIMONIALS);
  }, []);

  // Fetch images from admin system
  useEffect(() => {
    const fetchImagesByCategory = async () => {
      try {
        setLoadingImages(true);
        
        const savedAdminFavorites = FavoritesService.getAdminFavorites();
        setAdminImageFavorites(new Set(savedAdminFavorites));
        
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
  const handleRentNowClick = () => navigate('/rent-now');
  const handleCategoryClick = (category) => {
    // Convert to lowercase slug for URL
    const categorySlug = category.category.toLowerCase();
    navigate(`/category/${categorySlug}`);
  };
  const handleProductClick = (product) => navigate('/product-details', { state: { product } });

  // Newsletter handler
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterLoading(true);
    
    try {
      if (!NewsletterService.validateEmail(newsletterEmail)) {
        throw new Error('Please enter a valid email address');
      }

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
        setTimeout(() => setNewsletterSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert(error.message || 'Failed to subscribe to newsletter. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  // Render Hero Section
  const renderHeroSection = () => (
    <>
      {/* Desktop Hero - 1024px and above */}
      <Container fluid className="d-none d-lg-block bg-light px-0 position-relative overflow-hidden" style={{ height: '629px' }}>
        <div className="position-relative h-100 mx-auto" style={{ maxWidth: '1440px', paddingLeft: '100px', paddingRight: '100px' }}>
          <div className="position-absolute top-50 translate-middle-y hero-text-desktop" style={{ zIndex: 2, width: '480px', left: '100px' }}>
            <h1 className="display-4 fw-bold mb-4">Dress the Squad in Premium Style</h1>
            <p className="lead text-muted">
              Discover curated outfits for groomsmen - available to rent or buy. Your squad's perfect look starts here.
            </p>
          </div>
          <div className="position-absolute end-0 h-100 hero-image-desktop" style={{ width: '58%', top: '60px' }}>
            <Image src={Home} alt="Premium Men's Fashion" className="w-100 h-100" style={{ objectFit: 'cover' }} />
          </div>
        </div>
      </Container>

      {/* Tablet Hero - 768px to 1023px */}
      <Container fluid className="d-none d-md-block d-lg-none bg-light px-0" style={{ minHeight: '500px' }}>
        <Row className="g-0 h-100">
          <Col md={12} style={{ paddingLeft: '40px', paddingRight: '40px', paddingTop: '48px', paddingBottom: '32px' }}>
            <h1 className="display-5 fw-bold mb-3">Dress the Squad in Premium Style</h1>
            <p className="lead text-muted mb-4">
              Discover curated outfits for groomsmen - available to rent or buy. Your squad's perfect look starts here.
            </p>
          </Col>
          <Col md={12} className="px-0">
            <Image src={Home} alt="Premium Men's Fashion" className="w-100" style={{ height: '350px', objectFit: 'cover' }} />
          </Col>
        </Row>
      </Container>

      {/* Mobile Hero - below 768px */}
      <Container fluid className="d-block d-md-none bg-light px-0" style={{ height: '492px' }}>
        <Row className="g-0 h-100">
          <Col xs={12} className="px-3 pt-4 pb-3">
            <h1 className="display-6 fw-bold mb-3">Dress the Squad in Premium Style</h1>
            <p className="text-muted">
              Discover curated outfits for groomsmen - available to rent or buy. Your squad's perfect look starts here.
            </p>
          </Col>
          <Col xs={12} className="px-0">
            <Image src={Home} alt="Premium Men's Fashion" className="w-100 h-100" style={{ objectFit: 'cover' }} />
          </Col>
        </Row>
      </Container>

      {/* iPad Specific Responsive Styles */}
      <style>
        {`
          /* iPad Pro Landscape (1024px - 1366px) */
          @media (min-width: 1024px) and (max-width: 1366px) {
            .hero-text-desktop {
              width: 420px !important;
              left: 60px !important;
            }
            .hero-text-desktop h1 {
              font-size: 2.5rem !important;
            }
            .hero-text-desktop p {
              font-size: 1rem !important;
            }
            .hero-image-desktop {
              width: 55% !important;
            }
          }

          /* iPad Portrait (768px - 1023px) */
          @media (min-width: 768px) and (max-width: 1023px) {
            .d-md-block.d-lg-none h1 {
              font-size: 2rem !important;
            }
            .d-md-block.d-lg-none p {
              font-size: 0.95rem !important;
            }
          }
        `}
      </style>
    </>
  );

  // Render Feature Icons
  const renderFeatureIcons = () => {
    const features = [
      { Icon: Search, title: 'Browse & Select', desc: 'Explore premium outfits for your squad.' },
      { Icon: Bag, title: 'Choose Rent or Buy', desc: 'Select whether you want to rent or purchase.' },
      { Icon: Shield, title: 'Secure With Deposit', desc: 'For rentals, pay a refundable security deposit.' },
      { Icon: ArrowClockwise, title: 'Return & Refund', desc: 'Return rented items and receive your deposit back.' }
    ];

    return (
      <>
        {/* Desktop */}
        <Container fluid className="d-none d-lg-block bg-white border-bottom py-4 mt-5">
          <div className="mx-auto" style={{ maxWidth: '1440px', paddingLeft: '100px', paddingRight: '100px' }}>
            <Row className="g-4">
              {features.map((feature, idx) => (
                <Col key={idx} lg={3} className="text-center">
                  <feature.Icon size={24} className="text-secondary mb-3" />
                  <h6 className="fw-bold small mb-2">{feature.title}</h6>
                  <p className="text-muted small mb-0">{feature.desc}</p>
                </Col>
              ))}
            </Row>
          </div>
        </Container>

        {/* Mobile */}
        <Container fluid className="d-block d-lg-none bg-white py-5">
          <Container className="px-2">
            {features.map((feature, idx) => (
              <div key={idx}>
                <Row className="align-items-start py-4">
                  <Col xs="auto">
                    <feature.Icon size={32} className="text-secondary" />
                  </Col>
                  <Col>
                    <h6 className="fw-bold mb-2">{feature.title}</h6>
                    <p className="text-muted small mb-0">{feature.desc}</p>
                  </Col>
                </Row>
                {idx < features.length - 1 && <hr className="my-0" />}
              </div>
            ))}
          </Container>
        </Container>
      </>
    );
  };

  // Render Trending Section
  const renderTrendingSection = () => {
    const trendingProducts = [
      {
        id: 1, image: Product1, title: 'Vintage Kurta Set', category: 'WEDDING COLLECTION',
        rentPrice: '1,299', buyPrice: '4,999', originalPrice: '5,999',
        badge: 'BESTSELLER', discount: '36% OFF', rating: 4.7, reviews: '1.3K'
      },
      {
        id: 2, image: Product2, title: 'Olive Indo-Western Set', category: 'SANGEET COLLECTION',
        rentPrice: '1,899', buyPrice: '6,499', originalPrice: '8,999',
        badge: 'BESTSELLER', discount: '51% OFF', rating: 4.8, reviews: '1.1K'
      },
      {
        id: 3, image: Product3, title: 'Black Tuxedo Set', category: 'RECEPTION WEAR',
        rentPrice: '2,499', buyPrice: '8,999', originalPrice: '12,999',
        badge: 'NEW', discount: '51% OFF', rating: 4.8, reviews: '129'
      },
      {
        id: 4, image: Product4, title: 'Maroon Classic Bandhgala', category: 'TRADITIONAL WEAR',
        rentPrice: '1,799', buyPrice: '6,999', originalPrice: '9,999',
        badge: 'BESTSELLER', discount: '28% OFF', rating: 4.8, reviews: '226'
      }
    ];

    return (
      <>
        {/* Desktop - 1024px and above */}
        <Container fluid className="d-none d-lg-block bg-white py-5">
          <div className="mx-auto" style={{ maxWidth: '1440px', paddingLeft: '100px', paddingRight: '100px' }}>
            <div className="mb-5">
              <h2 className="fw-bold text-uppercase mb-2" style={{ fontSize: '2.5rem', letterSpacing: '1px' }}>
                Trending This Season
              </h2>
              <div style={{ width: '80px', height: '4px', backgroundColor: '#000', marginTop: '12px' }}></div>
            </div>
            <Row className="g-4">
              {trendingProducts.map((product) => (
                <Col key={product.id} lg={3} md={6}>
                  <div className="cursor-pointer h-100 d-flex flex-column" onClick={() => handleProductClick(product)}>
                    <div className="position-relative bg-light" style={{ aspectRatio: '1/1' }}>
                      <Image src={product.image} alt={product.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                      <span className={`position-absolute top-0 start-0 m-3 badge ${product.badge === 'NEW' ? 'bg-success' : 'bg-warning'} text-white`}>
                        {product.badge}
                      </span>
                      <span className="position-absolute bottom-0 start-0 m-3 badge bg-secondary">{product.discount}</span>
                    </div>
                    <div className="py-3 d-flex flex-column flex-grow-1">
                      <p className="text-muted small mb-1">{product.category}</p>
                      <h6 className="fw-bold mb-2" style={{ minHeight: '48px' }}>{product.title}</h6>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="text-warning">★</span>
                        <span className="fw-bold small">{product.rating}</span>
                        <span className="text-muted">|</span>
                        <span className="text-primary small">({product.reviews} Reviews)</span>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="text-muted small">Buy:</span>
                          <span className="fw-bold">₹{product.buyPrice}</span>
                          <span className="text-muted text-decoration-line-through small">₹{product.originalPrice}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-muted small">Rent:</span>
                          <span className="fw-bold text-warning">₹{product.rentPrice}</span>
                        </div>
                      </div>
                      <Button variant="dark" className="w-100 rounded-0 fw-bold mt-auto">ADD TO CART</Button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
            <div className="text-center mt-5">
              <Button variant="outline-dark" className="rounded-0 px-5" onClick={() => navigate('/products')}>
                VIEW ALL
              </Button>
            </div>
          </div>
        </Container>

        {/* Tablet - 768px to 1023px */}
        <Container fluid className="d-none d-md-block d-lg-none bg-white py-5">
          <div className="mx-auto" style={{ paddingLeft: '40px', paddingRight: '40px' }}>
            <div className="mb-4">
              <h2 className="fw-bold text-uppercase mb-2" style={{ fontSize: '2rem', letterSpacing: '1px' }}>
                Trending This Season
              </h2>
              <div style={{ width: '60px', height: '3px', backgroundColor: '#000', marginTop: '10px' }}></div>
            </div>
            <Row className="g-3">
              {trendingProducts.map((product) => (
                <Col key={product.id} md={6}>
                  <div className="cursor-pointer h-100 d-flex flex-column" onClick={() => handleProductClick(product)}>
                    <div className="position-relative bg-light" style={{ aspectRatio: '1/1' }}>
                      <Image src={product.image} alt={product.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                      <span className={`position-absolute top-0 start-0 m-2 badge ${product.badge === 'NEW' ? 'bg-success' : 'bg-warning'} text-white`}>
                        {product.badge}
                      </span>
                      <span className="position-absolute bottom-0 start-0 m-2 badge bg-secondary">{product.discount}</span>
                    </div>
                    <div className="py-3 d-flex flex-column flex-grow-1">
                      <p className="text-muted small mb-1">{product.category}</p>
                      <h6 className="fw-bold mb-2" style={{ minHeight: '48px' }}>{product.title}</h6>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="text-warning">★</span>
                        <span className="fw-bold small">{product.rating}</span>
                        <span className="text-muted">|</span>
                        <span className="text-primary small">({product.reviews} Reviews)</span>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="text-muted small">Buy:</span>
                          <span className="fw-bold">₹{product.buyPrice}</span>
                          <span className="text-muted text-decoration-line-through small">₹{product.originalPrice}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-muted small">Rent:</span>
                          <span className="fw-bold text-warning">₹{product.rentPrice}</span>
                        </div>
                      </div>
                      <Button variant="dark" className="w-100 rounded-0 fw-bold mt-auto" size="sm">ADD TO CART</Button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
            <div className="text-center mt-4">
              <Button variant="outline-dark" className="rounded-0 px-5" onClick={() => navigate('/products')}>
                VIEW ALL
              </Button>
            </div>
          </div>
        </Container>

        {/* Mobile - below 768px */}
        <Container fluid className="d-block d-md-none bg-white py-4">
          <Container className="px-2">
            <div className="mb-4">
              <h3 className="fw-bold text-uppercase mb-2" style={{ fontSize: '1.5rem', letterSpacing: '0.5px' }}>
                Trending This Season
              </h3>
              <div style={{ width: '50px', height: '3px', backgroundColor: '#000', marginTop: '8px' }}></div>
            </div>
            <div className="d-flex gap-3 overflow-auto pb-3">
              {trendingProducts.map((product) => (
                <div key={product.id} style={{ minWidth: '280px' }} onClick={() => handleProductClick(product)}>
                  <div className="position-relative bg-light" style={{ aspectRatio: '1/1' }}>
                    <Image src={product.image} alt={product.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    <span className={`position-absolute top-0 start-0 m-2 badge ${product.badge === 'NEW' ? 'bg-success' : 'bg-warning'}`}>
                      {product.badge}
                    </span>
                    <span className="position-absolute bottom-0 start-0 m-2 badge bg-secondary">{product.discount}</span>
                  </div>
                  <div className="py-3">
                    <p className="text-muted small mb-1">{product.category}</p>
                    <h6 className="fw-bold mb-2">{product.title}</h6>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="text-warning">★</span>
                      <span className="fw-bold small">{product.rating}</span>
                      <span className="text-muted">|</span>
                      <span className="text-primary small">({product.reviews})</span>
                    </div>
                    <div className="mb-2">
                      <div className="small mb-1">Buy: <span className="fw-bold">₹{product.buyPrice}</span></div>
                      <div className="small">Rent: <span className="fw-bold text-warning">₹{product.rentPrice}</span></div>
                    </div>
                    <Button variant="dark" size="sm" className="w-100 rounded-0">ADD TO CART</Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline-dark" className="w-100 rounded-0 mt-3" onClick={() => navigate('/products')}>
              VIEW ALL
            </Button>
          </Container>
        </Container>
      </>
    );
  };

  // Render Promotional Banner
  const renderPromotionalBanner = () => (
    <>
      {/* Desktop - 1024px and above */}
      <Container fluid className="d-none d-lg-block bg-light py-5">
        <Container style={{ maxWidth: '1440px', paddingLeft: '100px', paddingRight: '100px' }} className="text-center py-5">
          <p className="text-muted mb-3 text-uppercase" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
            Limited-Time Offer:
          </p>
          <h2 className="display-4 fw-bold mb-4">
            Get 10% OFF <span className="text-muted">on First Rental</span>
          </h2>
          <p className="lead text-muted mb-0">
            Rent more. Save more. Dress the entire squad for less.
          </p>
        </Container>
      </Container>

      {/* Tablet - 768px to 1023px */}
      <Container fluid className="d-none d-md-block d-lg-none bg-light py-5">
        <Container style={{ paddingLeft: '40px', paddingRight: '40px' }} className="text-center py-4">
          <p className="text-muted mb-3 text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
            Limited-Time Offer:
          </p>
          <h2 className="display-5 fw-bold mb-3">
            Get 10% OFF <span className="text-muted">on First Rental</span>
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
            Rent more. Save more. Dress the entire squad for less.
          </p>
        </Container>
      </Container>

      {/* Mobile - below 768px */}
      <Container fluid className="d-block d-md-none bg-light py-5">
        <Container className="text-center px-2 py-3">
          <p className="text-muted mb-2 text-uppercase small" style={{ letterSpacing: '0.5px' }}>
            Limited-Time Offer:
          </p>
          <h3 className="fw-bold mb-3" style={{ fontSize: '1.75rem', lineHeight: '1.2' }}>
            Get 10% OFF <span className="text-muted d-block mt-2">on First Rental</span>
          </h3>
          <p className="text-muted mb-0 small">
            Rent more. Save more. Dress the entire squad for less.
          </p>
        </Container>
      </Container>
    </>
  );

  // Render Info Section
  const renderInfoSection = () => (
    <>
      {/* Desktop */}
      <Container fluid className="d-none d-lg-block bg-white py-4 border-top border-bottom">
        <Container style={{ maxWidth: '1440px', paddingLeft: '100px', paddingRight: '100px' }}>
          <Row className="text-center g-4">
            <Col lg={4}>
              <h6 className="fw-bold mb-2">Free Shipping</h6>
              <p className="text-muted small mb-0">On orders above ₹10,000</p>
            </Col>
            <Col lg={4}>
              <h6 className="fw-bold mb-2">Flexible Rental</h6>
              <p className="text-muted small mb-0">Rent for 3-7 days</p>
            </Col>
            <Col lg={4}>
              <h6 className="fw-bold mb-2">Easy Returns</h6>
              <p className="text-muted small mb-0">Hassle-free return process</p>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Tablet */}
      <Container fluid className="d-none d-md-block d-lg-none bg-white py-4 border-top border-bottom">
        <Container style={{ paddingLeft: '40px', paddingRight: '40px' }}>
          <Row className="text-center g-3">
            <Col md={4}>
              <h6 className="fw-bold mb-2 small">Free Shipping</h6>
              <p className="text-muted small mb-0">Orders above ₹10,000</p>
            </Col>
            <Col md={4}>
              <h6 className="fw-bold mb-2 small">Flexible Rental</h6>
              <p className="text-muted small mb-0">Rent for 3-7 days</p>
            </Col>
            <Col md={4}>
              <h6 className="fw-bold mb-2 small">Easy Returns</h6>
              <p className="text-muted small mb-0">Hassle-free returns</p>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Mobile */}
      <Container fluid className="d-block d-md-none bg-white py-3 border-top border-bottom">
        <Container className="px-2">
          <Row className="text-center g-3">
            <Col xs={4}>
              <h6 className="fw-bold mb-1" style={{ fontSize: '0.75rem' }}>Free Shipping</h6>
              <p className="text-muted mb-0" style={{ fontSize: '0.65rem' }}>Above ₹10K</p>
            </Col>
            <Col xs={4}>
              <h6 className="fw-bold mb-1" style={{ fontSize: '0.75rem' }}>Flexible Rental</h6>
              <p className="text-muted mb-0" style={{ fontSize: '0.65rem' }}>3-7 days</p>
            </Col>
            <Col xs={4}>
              <h6 className="fw-bold mb-1" style={{ fontSize: '0.75rem' }}>Easy Returns</h6>
              <p className="text-muted mb-0" style={{ fontSize: '0.65rem' }}>Hassle-free</p>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );

  // Render Luxury Categories
  const renderLuxuryCategories = () => {
    const categories = [
      { id: 1, name: 'LUXURY SUITS', image: Product1, category: 'suits' },
      { id: 2, name: 'PREMIUM KURTAS', image: Product2, category: 'kurtas' },
      { id: 3, name: 'DESIGNER BANDHGALAS', image: Product3, category: 'bandhgalas' },
      { id: 4, name: 'FORMAL WEAR', image: Product4, category: 'formal' },
      { id: 5, name: 'TRADITIONAL SETS', image: Product5, category: 'traditional' }
    ];

    return (
      <>
        {/* Desktop - 1024px and above */}
        <Container fluid className="d-none d-lg-block bg-light py-4">
          <Container style={{ maxWidth: '1440px', paddingLeft: '100px', paddingRight: '100px' }} className="py-4">
            <div className="mb-5">
              <h2 className="fw-bold text-uppercase mb-2" style={{ fontSize: '2.5rem', letterSpacing: '2px' }}>
                Categories
              </h2>
              <div style={{ width: '80px', height: '4px', backgroundColor: '#000', marginTop: '12px' }}></div>
            </div>
            <Row className="g-4 justify-content-center">
              {categories.map((cat) => (
                <Col key={cat.id} lg={2} className="text-center">
                  <div className="cursor-pointer" onClick={() => handleCategoryClick(cat)}>
                    <div className="mb-3 overflow-hidden">
                      <Image 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-100" 
                        style={{ height: '250px', objectFit: 'cover' }} 
                      />
                    </div>
                    <h6 className="fw-bold small text-uppercase">{cat.name}</h6>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </Container>

        {/* Tablet - 768px to 1023px */}
        <Container fluid className="d-none d-md-block d-lg-none bg-light py-4">
          <Container style={{ paddingLeft: '40px', paddingRight: '40px' }} className="py-3">
            <div className="mb-4">
              <h2 className="fw-bold text-uppercase mb-2" style={{ fontSize: '2rem', letterSpacing: '2px' }}>
                Categories
              </h2>
              <div style={{ width: '60px', height: '3px', backgroundColor: '#000', marginTop: '10px' }}></div>
            </div>
            <Row className="g-3 justify-content-center">
              {categories.map((cat) => (
                <Col key={cat.id} md={4} sm={6} className="text-center">
                  <div className="cursor-pointer" onClick={() => handleCategoryClick(cat)}>
                    <div className="mb-2 overflow-hidden">
                      <Image 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-100" 
                        style={{ height: '200px', objectFit: 'cover' }} 
                      />
                    </div>
                    <h6 className="fw-bold small text-uppercase">{cat.name}</h6>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </Container>

        {/* Mobile - below 768px */}
        <Container fluid className="d-block d-md-none bg-white py-4">
          <Container fluid className="px-2">
            <div className="mb-4">
              <h3 className="fw-bold text-uppercase mb-2" style={{ fontSize: '1.5rem', letterSpacing: '1px' }}>
                Categories
              </h3>
              <div style={{ width: '50px', height: '3px', backgroundColor: '#000', marginTop: '8px' }}></div>
            </div>
            <Row className="g-4">
              {categories.map((cat) => (
                <Col key={cat.id} xs={6}>
                  <div className="cursor-pointer" onClick={() => handleCategoryClick(cat)}>
                    <div className="mb-2 overflow-hidden rounded">
                      <Image 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-100" 
                        style={{ aspectRatio: '1/1', objectFit: 'cover' }} 
                      />
                    </div>
                    <p className="text-center small fw-bold mb-0 text-uppercase" style={{ fontSize: '0.65rem', lineHeight: '1.3' }}>
                      {cat.name}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </Container>
      </>
    );
  };

  // Render Rental Message
  const renderRentalMessage = () => (
    <>
      {/* Desktop - 1024px and above */}
      <Container fluid className="d-none d-lg-block bg-dark text-white py-5">
        <Container style={{ maxWidth: '1440px', paddingLeft: '100px', paddingRight: '100px' }} className="py-5">
          <Row>
            <Col lg={8}>
              <h1 className="display-3 fw-bold mb-4 text-uppercase" style={{ lineHeight: '1.1' }}>
                Love It. Rent It.<br />Wear It. Return It.
              </h1>
              <p className="lead mb-5" style={{ fontSize: '1.1rem' }}>
                Discover rental-only outfits designed for the groom's squad. Choose from curated styles, 
                reserve with ease, and enjoy hassle-free returns after the event.
              </p>
              <Button variant="light" size="lg" className="rounded-0 px-5 fw-bold text-uppercase" onClick={handleRentNowClick}>
                Browse Collection
              </Button>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Tablet - 768px to 1023px */}
      <Container fluid className="d-none d-md-block d-lg-none bg-dark text-white py-5">
        <Container style={{ paddingLeft: '40px', paddingRight: '40px' }} className="py-4">
          <Row>
            <Col md={10}>
              <h2 className="display-5 fw-bold mb-4 text-uppercase" style={{ lineHeight: '1.2' }}>
                Love It. Rent It.<br />Wear It. Return It.
              </h2>
              <p className="mb-4" style={{ fontSize: '1rem' }}>
                Discover rental-only outfits designed for the groom's squad. Choose from curated styles, 
                reserve with ease, and enjoy hassle-free returns after the event.
              </p>
              <Button variant="light" className="rounded-0 px-4 fw-bold text-uppercase" onClick={handleRentNowClick}>
                Browse Collection
              </Button>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Mobile - below 768px */}
      <Container fluid className="d-block d-md-none bg-dark text-white py-5">
        <Container className="px-2 py-3">
          <h3 className="fw-bold mb-3 text-uppercase" style={{ fontSize: '1.5rem', lineHeight: '1.3' }}>
            Love It. Rent It.<br />Wear It. Return It.
          </h3>
          <p className="mb-4 small">
            Discover rental-only outfits designed for the groom's squad. Choose from curated styles, 
            reserve with ease, and enjoy hassle-free returns after the event.
          </p>
          <Button variant="light" size="sm" className="rounded-0 px-4 fw-bold text-uppercase w-100" onClick={handleRentNowClick}>
            Browse Collection
          </Button>
        </Container>
      </Container>
    </>
  );

  return (
    <div>
      {renderHeroSection()}
      {/* Feature Icons - Hidden on mobile, shown on desktop/tablet */}
      <div className="d-none d-lg-block">
        {renderFeatureIcons()}
      </div>
      {renderTrendingSection()}
      {renderPromotionalBanner()}
      {renderLuxuryCategories()}
      {renderRentalMessage()}
      {/* Feature Icons - Shown only on mobile, above footer */}
      <div className="d-block d-lg-none">
        {renderFeatureIcons()}
      </div>
      <Footer />
    </div>
  );
};

export default HomePageContent;
