import React, { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { GeoAlt, Truck, Clock, Phone } from 'react-bootstrap-icons';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/common/Breadcrumb';

/**
 * City-specific Landing Page Component
 * Optimized for Local SEO in Kerala cities
 */
const CityLandingPage = () => {
  const { city } = useParams();
  const navigate = useNavigate();
  const [showSideMenu, setShowSideMenu] = useState(false);

  // City data for Kerala
  const cityData = {
    kochi: {
      name: 'Kochi',
      displayName: 'Kochi (Cochin)',
      description: 'Kerala\'s commercial capital',
      popularAreas: ['MG Road', 'Fort Kochi', 'Edappally', 'Kakkanad', 'Marine Drive'],
      keywords: 'suits in Kochi, Kochi wedding suits, formal wear Kochi, mens fashion Kochi',
      image: '/assets/Product1.png'
    },
    thrissur: {
      name: 'Thrissur',
      displayName: 'Thrissur',
      description: 'Cultural capital of Kerala',
      popularAreas: ['Swaraj Round', 'East Fort', 'Vadakkumnathan Temple Area', 'Shornur Road'],
      keywords: 'suits in Thrissur, Thrissur wedding suits, formal wear Thrissur, mens fashion Thrissur',
      image: '/assets/Product2.png'
    },
    kozhikode: {
      name: 'Kozhikode',
      displayName: 'Kozhikode (Calicut)',
      description: 'Historic port city',
      popularAreas: ['SM Street', 'Beach Road', 'Mavoor Road', 'Hilite City'],
      keywords: 'suits in Kozhikode, Calicut wedding suits, formal wear Kozhikode, mens fashion Kozhikode',
      image: '/assets/Product3.png'
    },
    trivandrum: {
      name: 'Trivandrum',
      displayName: 'Thiruvananthapuram',
      description: 'Capital city of Kerala',
      popularAreas: ['MG Road', 'Statue', 'Pattom', 'Kazhakootam', 'Technopark'],
      keywords: 'suits in Trivandrum, Trivandrum wedding suits, formal wear Trivandrum, mens fashion Trivandrum',
      image: '/assets/Product4.png'
    },
    kannur: {
      name: 'Kannur',
      displayName: 'Kannur',
      description: 'Land of looms and lores',
      popularAreas: ['Fort Road', 'Baby Beach', 'Thalassery', 'Payyambalam'],
      keywords: 'suits in Kannur, Kannur wedding suits, formal wear Kannur, mens fashion Kannur',
      image: '/assets/Product5.png'
    }
  };

  const currentCity = cityData[city?.toLowerCase()] || cityData.kochi;

  // Features
  const features = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: `Free doorstep delivery across ${currentCity.name}`
    },
    {
      icon: Clock,
      title: 'Quick Service',
      description: 'Same-day or next-day delivery available'
    },
    {
      icon: GeoAlt,
      title: 'Local Presence',
      description: `Serving ${currentCity.popularAreas[0]} and surrounding areas`
    },
    {
      icon: Phone,
      title: '24/7 Support',
      description: 'Customer support available anytime'
    }
  ];

  // SEO structured data for local business
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': `Dappr Squad - ${currentCity.name}`,
    'description': `Premium men's suits and formal wear in ${currentCity.name}, Kerala`,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': currentCity.name,
      'addressRegion': 'Kerala',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '9.9312',
      'longitude': '76.2673'
    },
    'url': `https://ecommerce-pi-six-17.vercel.app/${city}`,
    'telephone': '+91-XXXXXXXXXX',
    'priceRange': '₹₹',
    'openingHours': 'Mo-Su 09:00-21:00',
    'paymentAccepted': 'Cash, Credit Card, UPI, Net Banking',
    'currenciesAccepted': 'INR',
    'areaServed': {
      '@type': 'City',
      'name': currentCity.name
    }
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: currentCity.name, url: `/${city}` }
  ];

  return (
    <>
      <SEOHead
        title={`Men's Suits ${currentCity.name} - Buy & Rent | Dappr Squad`}
        description={`Shop premium men's suits in ${currentCity.name}, Kerala. Wedding suits, formal wear, and designer outfits with free delivery across ${currentCity.popularAreas.join(', ')}. Rent or buy today!`}
        keywords={`${currentCity.keywords}, men's suits ${currentCity.name}, buy suits ${currentCity.name}, wedding attire ${currentCity.name}, mens fashion Kerala`}
        url={`/${city}`}
        image={currentCity.image}
        structuredData={localBusinessSchema}
        breadcrumbs={breadcrumbs}
      />

      <div className="min-vh-100" style={{ backgroundColor: '#fff' }}>
        <Header onMenuClick={() => setShowSideMenu(true)} />
        <SideMenu show={showSideMenu} handleClose={() => setShowSideMenu(false)} />

        <Container className="py-4">
          {/* Breadcrumbs */}
          <Breadcrumb items={breadcrumbs} />

          {/* Hero Section */}
          <div className="text-center py-5">
            <h1 
              style={{
                fontFamily: 'Century Gothic',
                fontWeight: 700,
                fontSize: '2.5rem',
                color: '#000',
                marginBottom: '1rem'
              }}
            >
              Premium Men's Suits in {currentCity.displayName}
            </h1>
            <p 
              style={{
                fontFamily: 'Century Gothic',
                fontSize: '1.1rem',
                color: '#666',
                maxWidth: '800px',
                margin: '0 auto 2rem'
              }}
            >
              Discover Kerala's finest collection of men's formal wear in {currentCity.name}. 
              Perfect for weddings, corporate events, and special occasions with free delivery 
              across {currentCity.popularAreas.join(', ')}.
            </p>

            <div className="d-flex gap-3 justify-content-center mb-4">
              <Button 
                variant="dark" 
                size="lg"
                onClick={() => navigate('/buy-now')}
                style={{
                  fontFamily: 'Century Gothic',
                  borderRadius: '25px',
                  padding: '0.75rem 2rem'
                }}
              >
                Shop Now
              </Button>
              <Button 
                variant="outline-dark" 
                size="lg"
                onClick={() => navigate('/rent-now')}
                style={{
                  fontFamily: 'Century Gothic',
                  borderRadius: '25px',
                  padding: '0.75rem 2rem'
                }}
              >
                Rent Now
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <Row className="g-4 mb-5">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Col key={index} md={6} lg={3}>
                  <Card className="h-100 border-0 shadow-sm text-center p-4">
                    <div className="mb-3">
                      <IconComponent size={40} />
                    </div>
                    <h5 
                      style={{
                        fontFamily: 'Century Gothic',
                        fontWeight: 600,
                        marginBottom: '0.5rem'
                      }}
                    >
                      {feature.title}
                    </h5>
                    <p 
                      style={{
                        fontFamily: 'Century Gothic',
                        color: '#666',
                        fontSize: '0.9rem',
                        marginBottom: 0
                      }}
                    >
                      {feature.description}
                    </p>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Service Areas Section */}
          <div className="py-5 bg-light rounded">
            <h2 
              className="text-center mb-4"
              style={{
                fontFamily: 'Century Gothic',
                fontWeight: 700,
                color: '#000'
              }}
            >
              We Deliver Across {currentCity.name}
            </h2>
            <div className="text-center">
              <p style={{ fontFamily: 'Century Gothic', fontSize: '1.1rem', color: '#666' }}>
                {currentCity.popularAreas.join(' • ')}
              </p>
              <p style={{ fontFamily: 'Century Gothic', color: '#999', fontSize: '0.9rem' }}>
                ...and many more areas in {currentCity.name}
              </p>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="py-5">
            <h2 
              className="text-center mb-4"
              style={{
                fontFamily: 'Century Gothic',
                fontWeight: 700,
                color: '#000'
              }}
            >
              Why Choose Dappr Squad in {currentCity.name}?
            </h2>
            <Row className="g-4">
              <Col md={4}>
                <h5 style={{ fontFamily: 'Century Gothic', fontWeight: 600 }}>Premium Quality</h5>
                <p style={{ fontFamily: 'Century Gothic', color: '#666' }}>
                  Handpicked collection of premium suits and formal wear designed for Kerala's climate and occasions.
                </p>
              </Col>
              <Col md={4}>
                <h5 style={{ fontFamily: 'Century Gothic', fontWeight: 600 }}>Affordable Pricing</h5>
                <p style={{ fontFamily: 'Century Gothic', color: '#666' }}>
                  Competitive prices with flexible rental and purchase options to suit every budget.
                </p>
              </Col>
              <Col md={4}>
                <h5 style={{ fontFamily: 'Century Gothic', fontWeight: 600 }}>Perfect Fit</h5>
                <p style={{ fontFamily: 'Century Gothic', color: '#666' }}>
                  Expert fitting guidance and alterations to ensure you look your absolute best.
                </p>
              </Col>
            </Row>
          </div>

          {/* CTA Section */}
          <div className="text-center py-5">
            <h2 
              style={{
                fontFamily: 'Century Gothic',
                fontWeight: 700,
                color: '#000',
                marginBottom: '1rem'
              }}
            >
              Ready to Look Your Best?
            </h2>
            <p 
              style={{
                fontFamily: 'Century Gothic',
                fontSize: '1.1rem',
                color: '#666',
                marginBottom: '2rem'
              }}
            >
              Explore our collection and find the perfect outfit for your special occasion
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Button 
                variant="dark" 
                size="lg"
                onClick={() => navigate('/products')}
                style={{
                  fontFamily: 'Century Gothic',
                  borderRadius: '25px',
                  padding: '0.75rem 2rem'
                }}
              >
                View All Products
              </Button>
            </div>
          </div>
        </Container>

        <Footer />
      </div>
    </>
  );
};

export default CityLandingPage;

