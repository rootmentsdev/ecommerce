import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Carousel, Image, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SEOService from '../services/seoService';
import ImageService from '../services/imageService';

import Home1 from '../assets/Home1.jpg';
import Home2 from '../assets/Home2.jpg';
import Home3 from '../assets/Home3.jpg';
import Product1 from '../assets/Product1.png';
import Product2 from '../assets/Product2.png';
import Product3 from '../assets/Product3.png';
import Product4 from '../assets/Product4.png';
import Product5 from '../assets/Product5.png';
import Aboutus4 from '../assets/Aboutus4.png';

import Header from '../components/HeaderClean';
import SideMenu from '../components/SideMenuClean';
import Footer from '../components/FooterClean';
import HorizontalScroll from '../components/common/HorizontalScroll';

const BuyNowClean = () => {
  const navigate = useNavigate();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [buyImages, setBuyImages] = useState([]);

  const heroImages = [Home1, Home2, Home3];

  const TOP_CATEGORIES = [
    { id: 1, name: 'Suits', image: Product1, category: 'suits' },
    { id: 2, name: 'Kurtas', image: Product2, category: 'kurtas' },
    { id: 3, name: 'Bandhgalas', image: Product3, category: 'bandhgalas' },
    { id: 4, name: 'Formal Wear', image: Product4, category: 'formal' },
    { id: 5, name: 'Traditional', image: Product5, category: 'traditional' }
  ];

  const BUY_FEATURES = [
    'Premium Mens wear starting from ₹1900',
    'Custom design creation',
    'Personalized theme setting',
    'Expert dress code consulting',
    'Premium quality materials',
    'Lifetime ownership',
    'Full customization options (size, fabric, detailing)',
    'Long-term wardrobe investment'
  ];

  useEffect(() => {
    SEOService.initializeBuyPageSEO();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header onMenuClick={() => setShowSideMenu(true)} />
      <SideMenu show={showSideMenu} handleClose={() => setShowSideMenu(false)} />
      
      <main className="flex-grow-1">
        {/* Hero Section */}
        <Container fluid className="px-0">
          <Row className="g-0">
            <Col>
              <Carousel activeIndex={activeIndex} onSelect={setActiveIndex} indicators={false} controls={false} interval={3000} className="rounded-3 overflow-hidden">
              {heroImages.map((image, index) => (
                <Carousel.Item key={index}>
                  <Image 
                    src={image} 
                    alt={`Buy Hero ${index + 1}`} 
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
              <h1 className="fw-bold mb-3 display-4 text-dark">Buy Premium Fashion</h1>
              <p className="mb-4 lead text-muted">Own premium men's fashion pieces. Buy high-quality suits, kurtas, and traditional wear for your wardrobe.</p>
            </Col>
          </Row>
        </Container>

        {/* Top Categories */}
        <Container className="py-5">
          <Row className="mb-4">
            <Col><h3 className="fw-bold">Top Categories</h3></Col>
            <Col xs="auto"><Button variant="link" onClick={() => navigate('/buy-products')}>Explore more</Button></Col>
          </Row>
          <HorizontalScroll>
            {TOP_CATEGORIES.map((cat) => (
              <div key={cat.id} className="me-3" style={{width: '200px'}}>
                <Card className="border-0 hover-lift" onClick={() => navigate(`/buy-products?category=${cat.category}`)}>
                  <Card.Img variant="top" src={cat.image} className="rounded" style={{height: '250px', objectFit: 'cover'}} />
                  <Card.ImgOverlay className="d-flex align-items-end justify-content-center">
                    <Card.Title className="text-white bg-dark bg-opacity-75 px-3 py-2 rounded">{cat.name}</Card.Title>
                  </Card.ImgOverlay>
                </Card>
              </div>
            ))}
          </HorizontalScroll>
        </Container>

        {/* Buy Now Section */}
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h2 className="fw-bold mb-4 display-5">Buy Now</h2>
              <ul className="list-unstyled text-start mx-auto" style={{maxWidth: '500px'}}>
                {BUY_FEATURES.map((feature, index) => (
                  <li key={index} className="mb-3">• {feature}</li>
                ))}
              </ul>
              <Button 
                variant="dark" 
                size="lg" 
                className="mt-4 px-5"
                style={{borderRadius: '50px'}}
                onClick={() => navigate('/buy-products')}
              >
                Browse Products
              </Button>
            </Col>
          </Row>
        </Container>

        {/* Final CTA */}
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={10} className="text-center">
              <Image src={Aboutus4} fluid rounded className="mb-4" style={{maxWidth: '800px', height: '400px', objectFit: 'cover'}} />
              <h3 className="fw-bold mb-3 display-6">Your Celebration, Your Style The Dappr Way.</h3>
              <p className="text-muted mb-4 lead">Shop, rent, or book in bulk and make every event unforgettable.</p>
              <Button 
                variant="outline-dark" 
                size="lg" 
                className="px-5"
                style={{borderRadius: '50px'}}
                onClick={() => navigate('/enquire')}
              >
                Enquire Now
              </Button>
            </Col>
          </Row>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default BuyNowClean;

