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
import RentImage from '../assets/Rent.jpg';
import Aboutus4 from '../assets/Aboutus4.png';

import Header from '../components/HeaderClean';
import SideMenu from '../components/SideMenuClean';
import Footer from '../components/FooterClean';
import HorizontalScroll from '../components/common/HorizontalScroll';

const RentNowClean = () => {
  const navigate = useNavigate();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rentImages, setRentImages] = useState([]);

  const heroImages = [Home1, Home2, Home3];

  const TOP_CATEGORIES = [
    { id: 1, name: 'Suits', image: Product1, category: 'suits' },
    { id: 2, name: 'Kurtas', image: Product2, category: 'kurtas' },
    { id: 3, name: 'Bandhgalas', image: Product3, category: 'bandhgalas' },
    { id: 4, name: 'Formal Wear', image: Product4, category: 'formal' },
    { id: 5, name: 'Traditional', image: Product5, category: 'traditional' }
  ];

  const RENT_FEATURES = [
    'Premium Mens rental costing from ₹500',
    'Premium quality garment',
    'Theme setting consultation',
    'Dress code consulting',
    'Flexible rental periods (2 - 5 days, extendable)',
    'Easy return process',
    'Bulk booking option (2+ outfits)',
    'Size & fit customization included'
  ];

  const WORKFLOW_STEPS = [
    { number: 1, title: 'Browse & Choose', description: 'Explore premium outfits from top-categories' },
    { number: 2, title: 'Select Date & Size', description: 'Check availability by event date & size' },
    { number: 3, title: 'Book & Confirm', description: 'Secure your rental for 2 - 5 days.' },
    { number: 4, title: 'Delivery to Your Door', description: 'We deliver ready-to-wear outfits.' },
    { number: 5, title: 'Celebrate in Style', description: 'Look sharp, make memories.' }
  ];

  useEffect(() => {
    SEOService.initializeRentPageSEO();
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
                    alt={`Rent Hero ${index + 1}`} 
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
              <h1 className="fw-bold mb-3 display-4 text-dark">Rent Premium Fashion</h1>
              <p className="mb-4 lead text-muted">Perfect outfits for your special occasions. Rent premium men's fashion at affordable prices.</p>
            </Col>
          </Row>
        </Container>

        {/* Top Categories */}
        <Container className="py-5">
          <Row className="mb-4">
            <Col><h3 className="fw-bold">Top Categories</h3></Col>
            <Col xs="auto"><Button variant="link" onClick={() => navigate('/rent-products')}>Explore more</Button></Col>
          </Row>
          <HorizontalScroll>
            {TOP_CATEGORIES.map((cat) => (
              <div key={cat.id} className="me-3" style={{width: '200px'}}>
                <Card className="border-0 hover-lift" onClick={() => navigate(`/rent-products?category=${cat.category}`)}>
                  <Card.Img variant="top" src={cat.image} className="rounded" style={{height: '250px', objectFit: 'cover'}} />
                  <Card.ImgOverlay className="d-flex align-items-end justify-content-center">
                    <Card.Title className="text-white bg-dark bg-opacity-75 px-3 py-2 rounded">{cat.name}</Card.Title>
                  </Card.ImgOverlay>
                </Card>
              </div>
            ))}
          </HorizontalScroll>
        </Container>

        {/* Rent Now Section */}
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h2 className="fw-bold mb-4 display-5">Rent Now</h2>
              <ul className="list-unstyled text-start mx-auto" style={{maxWidth: '500px'}}>
                {RENT_FEATURES.map((feature, index) => (
                  <li key={index} className="mb-3">• {feature}</li>
                ))}
              </ul>
              <Button 
                variant="dark" 
                size="lg" 
                className="mt-4 px-5" 
                style={{borderRadius: '50px'}}
                onClick={() => navigate('/rent-products')}
              >
                Browse the deals
              </Button>
            </Col>
          </Row>
        </Container>

        {/* How It Works */}
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={10}>
              <Image src={RentImage} fluid rounded className="mb-4 w-100" style={{maxHeight: '400px', objectFit: 'cover'}} />
              <h2 className="fw-bold text-center mb-5 display-5">How Rent Now Works</h2>
              {WORKFLOW_STEPS.map((step) => (
                <Card key={step.number} className="mb-3 border-2 border-dark">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col>
                        <h5 className="fw-bold mb-2">Step {step.number}: {step.title}</h5>
                        <p className="text-muted mb-0">{step.description}</p>
                      </Col>
                      <Col xs="auto">
                        <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '60px', height: '60px', fontSize: '24px'}}>
                          {step.number}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
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

export default RentNowClean;

