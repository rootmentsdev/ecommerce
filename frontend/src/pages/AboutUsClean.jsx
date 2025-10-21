import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SEOService from '../services/seoService';
import Header from '../components/HeaderClean';
import SideMenu from '../components/SideMenuClean';
import Footer from '../components/FooterClean';
import Aboutus1 from '../assets/Aboutus1.png';
import Aboutus2 from '../assets/Aboutus2.png';
import Aboutus3 from '../assets/Aboutus3.png';
import Aboutus4 from '../assets/Aboutus4.png';

const AboutUsClean = () => {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    SEOService.initializeAboutPageSEO();
  }, []);

  const steps = [
    { icon: '🎯', text: ['Browse &', 'Select'] },
    { icon: '🔒', text: ['Choose', 'Rentals'] },
    { icon: '🚚', text: ['Book With', 'Deposit'] },
    { icon: '🔄', text: ['Return &', 'Refund'] }
  ];

  const services = [
    { icon: '👕', title: 'Buy & Rent Option', description: 'Own it forever or wear it for the moment.' },
    { icon: '🎨', title: 'Theme Setting', description: 'Coordinated looks for your big day.' },
    { icon: '✂️', title: 'Dress Code Consultation', description: 'Professional styling advice.' },
    { icon: '📏', title: 'Size Customization', description: 'Outfits tailored just for you.' },
    { icon: '⚙️', title: 'Product Customization', description: 'Personalized looks for unique events.' }
  ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-white">
      <Header onMenuClick={() => setShowSideMenu(true)} />
      <SideMenu show={showSideMenu} handleClose={() => setShowSideMenu(false)} />
      
      <main className="flex-grow-1">
        <Container className="py-4">
          {/* Title */}
          <h1 className="text-center my-4 fw-normal">About Us</h1>

          {/* How it Works */}
          <Row className="justify-content-around mb-4 px-3 g-3">
            {steps.map((step, idx) => (
              <Col key={idx} xs={3} className="text-center">
                <div className="fs-4 mb-2">{step.icon}</div>
                <small className="text-muted d-block" style={{fontSize: '11px', lineHeight: '1.2'}}>
                  {step.text.map((line, i) => <div key={i}>{line}</div>)}
                </small>
              </Col>
            ))}
          </Row>

          {/* Who we are */}
          <div className="px-3 mb-4">
            <Image src={Aboutus1} alt="Who we are" fluid className="rounded-3 mb-3" style={{height: '200px', objectFit: 'cover', width: '100%'}} />
            <p className="text-muted" style={{textAlign: 'justify', fontSize: '14px', lineHeight: '1.4'}}>
              At Dapper Squad, we believe style is better when shared. We are a premium men's fashion platform that helps individuals and squads look their best at weddings, parties, and celebrations. Whether you want to buy, rent, or book for your entire squad, we make fashion simple, stylish, and coordinated.
            </p>
          </div>

          {/* Our Services */}
          <div className="px-3 mb-4">
            <h2 className="text-center mb-3 fw-normal fs-5">Our Services</h2>
            {services.map((service, idx) => (
              <Card key={idx} className="mb-2 border rounded-3">
                <Card.Body className="d-flex align-items-center justify-content-between p-3">
                  <div>
                    <div className="fw-medium mb-1">{service.title}</div>
                    <small className="text-muted">{service.description}</small>
                  </div>
                  <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px', fontSize: '16px', flexShrink: 0}}>
                    {service.icon}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* What we do */}
          <div className="px-3 mb-4">
            <Image src={Aboutus2} alt="What we do" fluid className="rounded-3 mb-3" style={{height: '200px', objectFit: 'cover', width: '100%'}} />
            <ul className="list-unstyled">
              <li className="mb-2 text-muted" style={{fontSize: '14px'}}>• Stylish men's wear for buy & rent.</li>
              <li className="mb-2 text-muted" style={{fontSize: '14px'}}>• Bulk booking solutions for groups, friends, and teams with a minimum of 4 pieces.</li>
              <li className="mb-2 text-muted" style={{fontSize: '14px'}}>• Dress code consultations to help you plan your event looks.</li>
              <li className="mb-2 text-muted" style={{fontSize: '14px'}}>• Customization services to ensure the perfect fit and personalized style.</li>
            </ul>
          </div>

          {/* How We Do It */}
          <div className="px-3 mb-4">
            <Image src={Aboutus3} alt="How We Do It" fluid className="rounded-3 mb-3" style={{height: '200px', objectFit: 'cover', width: '100%'}} />
            <ul className="list-unstyled">
              <li className="mb-2 text-muted" style={{fontSize: '14px'}}>• Easy online browsing and booking.</li>
              <li className="mb-2 text-muted" style={{fontSize: '14px'}}>• Buy or rent based on your need.</li>
              <li className="mb-2 text-muted" style={{fontSize: '14px'}}>• Date & location-based availability check.</li>
              <li className="mb-2 text-muted" style={{fontSize: '14px'}}>• Bulk booking for squads with just a few clicks.</li>
              <li className="mb-2 text-muted" style={{fontSize: '14px'}}>• Phone styling and consultation from fashion experts.</li>
              <li className="mb-2 text-muted" style={{fontSize: '14px'}}>• Customization in size and style for a perfect fit.</li>
            </ul>
          </div>

          {/* Why Choose Us */}
          <div className="px-3 mb-4">
            <h2 className="text-center mb-3 fw-normal fs-5">Why Choose Us</h2>
            <ul className="list-unstyled">
              <li className="mb-2 text-muted" style={{fontSize: '14px'}}>• Buy or Rent - Your choice, your budget.</li>
              <li className="mb-2 text-muted" style={{fontSize: '14px'}}>• Perfect for individuals & groups.</li>
              <li className="mb-2 text-muted" style={{fontSize: '14px'}}>• Personalized styling consultations.</li>
              <li className="mb-2 text-muted" style={{fontSize: '14px'}}>• Hassle-free online booking & availability check.</li>
              <li className="mb-2 text-muted" style={{fontSize: '14px'}}>• Premium quality with customization options.</li>
            </ul>
          </div>

          {/* Your Celebration */}
          <div className="px-3 mb-4">
            <Image src={Aboutus4} alt="Your Celebration" fluid className="rounded-3 mb-3" style={{height: '200px', objectFit: 'cover', width: '100%'}} />
            <p className="text-muted mb-3" style={{textAlign: 'justify', fontSize: '14px'}}>
              Shop, rent, or book in bulk and make every event unforgettable.
            </p>
            <Row className="g-2">
              <Col xs={6}>
                <Button variant="outline-dark" className="w-100 rounded-2" onClick={() => navigate('/rent-products')}>
                  RENT NOW
                </Button>
              </Col>
              <Col xs={6}>
                <Button variant="dark" className="w-100 rounded-2" onClick={() => navigate('/buy-products')}>
                  BUY NOW
                </Button>
              </Col>
            </Row>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUsClean;

