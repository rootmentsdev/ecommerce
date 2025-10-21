import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Carousel, Card, Image, Form, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Search, Cart, Truck, ArrowClockwise, Heart, HeartFill } from 'react-bootstrap-icons';

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
import HorizontalScroll from './common/HorizontalScroll';

// Import services
import { PRODUCTS_DATA } from '../data/products';
import ImageService from '../services/imageService';
import FavoritesService from '../services/favoritesService';
import SEOService from '../services/seoService';
import NewsletterService from '../services/newsletterService';

const HomePageContentClean = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [adminImageFavorites, setAdminImageFavorites] = useState(new Set());
  const [featuredImages, setFeaturedImages] = useState([]);
  const [topCategoriesImages, setTopCategoriesImages] = useState([]);

  const FEATURES = [
    { icon: Search, title: 'Browse & Select' },
    { icon: Cart, title: 'Choose Rentals' },
    { icon: Truck, title: 'Book With Deposit' },
    { icon: ArrowClockwise, title: 'Return & Refund' }
  ];

  const TESTIMONIALS = [
    { id: 1, name: 'Rajesh Kumar', location: 'Mumbai', rating: 5, text: 'Perfect fit and excellent quality!' },
    { id: 2, name: 'Amit Singh', location: 'Delhi', rating: 5, text: 'Great service and fast delivery.' },
    { id: 3, name: 'Vikram Patel', location: 'Bangalore', rating: 5, text: 'Professional service and premium quality.' }
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

  const FEATURED_PRODUCTS = PRODUCTS_DATA.slice(0, 6);
  const heroImages = [Home, Home1, Home2, Home3];

  useEffect(() => {
    SEOService.initializeHomepageSEO();
    const savedFavorites = FavoritesService.getAdminFavorites();
    setAdminImageFavorites(new Set(savedFavorites));
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterLoading(true);
    try {
      await NewsletterService.subscribe(newsletterEmail);
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 5000);
    } catch (error) {
      console.error(error);
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Container fluid className="px-0">
        <Row className="g-0">
          <Col>
            <Carousel 
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
              indicators={false}
              controls={false}
              interval={3000}
              className="rounded-3 overflow-hidden"
            >
              {heroImages.map((image, index) => (
                <Carousel.Item key={index}>
                  <Image 
                    src={image} 
                    alt={`Hero ${index + 1}`} 
                    fluid 
                    className="w-100"
                    style={{
                      height: window.innerWidth > 768 ? '400px' : '150vw',
                      objectFit: 'cover'
                    }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
        
        <Row className="mt-3">
          <Col className="text-center px-3">
            <h1 className="fw-bold mb-3 display-4 text-dark">Style Together, Shine Together</h1>
            <p className="mb-4 lead text-muted">Premium men's fashion for every celebration.</p>
            
            <div className="d-flex gap-2 justify-content-center mb-4">
              <Button 
                variant="outline-dark" 
                className="px-4" 
                style={{borderRadius: '50px'}}
                onClick={() => navigate('/rent-now')}
              >
                Rent Now
              </Button>
              <Button 
                variant="dark" 
                className="px-4"
                style={{borderRadius: '50px'}}
                onClick={() => navigate('/buy-now')}
              >
                Buy Now
              </Button>
            </div>
            
            <Row className="justify-content-center g-3 mb-4">
              {FEATURES.map((feature, index) => (
                <Col key={index} xs="auto" className="text-center">
                  <div 
                    className="bg-dark d-flex align-items-center justify-content-center mx-auto mb-2"
                    style={{width: '40px', height: '40px', borderRadius: '50%'}}
                  >
                    <feature.icon size={16} className="text-white" />
                  </div>
                  <small className="d-block text-dark">{feature.title}</small>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Top Categories */}
      <Container className="py-5">
        <Row className="mb-4">
          <Col><h3 className="fw-bold">Top Categories</h3></Col>
          <Col xs="auto"><Button variant="link" onClick={() => navigate('/products')}>Explore more</Button></Col>
        </Row>
        <HorizontalScroll>
          {TOP_CATEGORIES.map((cat) => (
            <div key={cat.id} className="me-3" style={{minWidth: '200px'}}>
              <Card 
                className="border-0 shadow-sm" 
                onClick={() => navigate(`/products?category=${cat.category}`)}
                style={{cursor: 'pointer', transition: 'transform 0.2s'}}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Card.Img variant="top" src={cat.image} className="rounded" />
                <Card.Body className="text-center">
                  <Card.Title className="h6">{cat.name}</Card.Title>
                </Card.Body>
              </Card>
            </div>
          ))}
        </HorizontalScroll>
      </Container>

      {/* Featured Products */}
      <Container className="py-5">
        <Row className="mb-4">
          <Col><h3 className="fw-bold">Featured Products</h3></Col>
        </Row>
        <HorizontalScroll>
          {FEATURED_PRODUCTS.map((product) => (
            <div key={product.id} className="me-3" style={{minWidth: '200px'}}>
              <Card 
                className="border-0 shadow-sm"
                style={{cursor: 'pointer', transition: 'transform 0.2s'}}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Card.Img variant="top" src={product.image} />
                <Card.Body>
                  <Card.Title className="h6">{product.name}</Card.Title>
                  <Card.Text className="text-primary fw-bold">₹{product.price}</Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </HorizontalScroll>
      </Container>

      {/* Stats */}
      <Container className="py-5">
        <Row className="g-4">
          {STATS.map((stat, index) => (
            <Col key={index} xs={6} md={3}>
              <Card 
                className="text-center border-0 bg-light"
                style={{transition: 'transform 0.3s'}}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Card.Body>
                  <h2 className="fw-bold">{stat.number}</h2>
                  <small className="text-muted">{stat.label}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Testimonials */}
      <Container className="py-5">
        <h3 className="fw-bold text-center mb-5">What Our Customers Say</h3>
        <Row className="g-4">
          {TESTIMONIALS.map((test) => (
            <Col key={test.id} md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <div className="mb-3">{'⭐'.repeat(test.rating)}</div>
                  <Card.Text className="fst-italic">"{test.text}"</Card.Text>
                  <div className="mt-3">
                    <strong className="d-block">{test.name}</strong>
                    <small className="text-muted">{test.location}</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Final CTA */}
      <Container className="py-5">
        <Row className="mb-5">
          <Col className="text-center">
            <Image src={Aboutus4} fluid rounded className="mb-4" />
            <h3 className="fw-bold mb-3">Your Celebration, Your Style The Dapper Way.</h3>
            <p className="text-muted mb-4">Shop, rent, or book in bulk and make every event unforgettable.</p>
            <div className="d-flex gap-2 justify-content-center">
              <Button variant="outline-dark" style={{borderRadius: '50px'}} onClick={() => navigate('/rent-now')}>Rent Now</Button>
              <Button variant="dark" style={{borderRadius: '50px'}} onClick={() => navigate('/buy-now')}>Buy Now</Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Newsletter */}
      <div className="bg-dark text-white py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} className="text-center">
              <h3 className="fw-bold mb-4">Stay in the Loop</h3>
              <p className="text-white-50 mb-4">Subscribe to get updates on new arrivals and special offers</p>
              <Form onSubmit={handleNewsletterSubmit}>
                <Form.Group className="d-flex gap-2">
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    style={{borderRadius: '50px', padding: '12px 24px'}}
                    required
                  />
                  <Button 
                    type="submit" 
                    variant="light" 
                    style={{borderRadius: '50px', padding: '12px 24px'}}
                    disabled={newsletterLoading}
                  >
                    {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </Form.Group>
              </Form>
              {newsletterSuccess && (
                <div className="alert alert-success mt-3">Successfully subscribed!</div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HomePageContentClean;

