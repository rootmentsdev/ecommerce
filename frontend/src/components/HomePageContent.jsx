import React from 'react';
import { Container, Row, Col, Button, Card, Image } from 'react-bootstrap';
import { Search, Cart, Truck, ArrowClockwise } from 'react-bootstrap-icons';

const HomePageContent = () => {
  // Feature data
  const features = [
    { icon: Search, title: 'Browse & Select' },
    { icon: Cart, title: 'Choose Rentals' },
    { icon: Truck, title: 'Book With Deposit' },
    { icon: ArrowClockwise, title: 'Return & Refund' }
  ];

  // Product data
  const newArrivals = [
    { id: 1, name: 'Formal Suit', price: '₹1400', image: '/src/assets/demo1.png' },
    { id: 2, name: 'Formal Suit', price: '₹1400', image: '/src/assets/demo2.png' },
    { id: 3, name: 'Premium S', price: '₹1400', image: '/src/assets/demo3.png' },
    { id: 4, name: 'Designer Blazer', price: '₹1800', image: '/src/assets/demo1.png' },
    { id: 5, name: 'Evening Wear', price: '₹2200', image: '/src/assets/demo2.png' },
    { id: 6, name: 'Business Suit', price: '₹1600', image: '/src/assets/demo3.png' },
    { id: 7, name: 'Wedding Suit', price: '₹2500', image: '/src/assets/demo1.png' },
    { id: 8, name: 'Casual Blazer', price: '₹1200', image: '/src/assets/demo2.png' }
  ];

  // Category data
  const categories = [
    { id: 1, name: 'Premium Suit', image: '/src/assets/demo1.png' },
    { id: 2, name: 'Formal Wear', image: '/src/assets/demo2.png' },
    { id: 3, name: 'Sherwani', image: '/src/assets/demo3.png' },
    { id: 4, name: 'Kurta', image: '/src/assets/demo1.png' },
    { id: 5, name: 'Indo-Wester', image: '/src/assets/demo2.png' },
    { id: 6, name: 'Accessories', image: '/src/assets/demo3.png' }
  ];

  // Occasion data
  const occasions = [
    { id: 1, name: 'Wedding', image: '/src/assets/demo1.png' },
    { id: 2, name: 'Party', image: '/src/assets/demo2.png' },
    { id: 3, name: 'Formal', image: '/src/assets/demo3.png' }
  ];

  return (
    <div className="bg-white">
      <style>
        {`
          .horizontal-scroll::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      {/* Hero Section */}
      <div 
        className="position-relative"
        style={{ 
          height: '50vh',
          backgroundImage: 'url(/src/assets/HomePage.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div 
          className="position-absolute bottom-0 start-0 end-0 text-white p-4"
          style={{
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
          }}
        >
          <Container>
            <Row>
              <Col>
                <h1 
                  className="display-4 fw-bold mb-2"
                  style={{ 
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: '-0.03em'
                  }}
                >
                  Rent Your<br />Perfect Look
                </h1>
                <p 
                  className="fs-5 mb-3 opacity-90"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Premium Suits, Ethnic<br />Wear & Accessories fo
                </p>
                <Button 
                  variant="light" 
                  size="lg"
                  className="px-4 py-2 rounded-2"
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: '600'
                  }}
                >
                  Rent Now
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <Row className="justify-content-center">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Col key={index} xs={6} md={3} className="text-center mb-4">
                <div 
                  className="d-flex flex-column align-items-center"
                  style={{ maxWidth: '120px', margin: '0 auto' }}
                >
                  <div 
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-2"
                    style={{ width: '48px', height: '48px' }}
                  >
                    <IconComponent size={20} className="text-dark" />
                  </div>
                  <small 
                    className="text-center fw-medium"
                    style={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '12px',
                      lineHeight: '1.3'
                    }}
                  >
                    {feature.title}
                  </small>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>

      {/* New Arrivals Section */}
      <Container className="py-4">
        <Row className="align-items-center mb-4">
          <Col>
            <h2 
              className="h3 fw-bold mb-0"
              style={{ 
                fontFamily: "'Playfair Display', serif",
                letterSpacing: '-0.02em'
              }}
            >
              New Arrivals
            </h2>
          </Col>
          <Col xs="auto">
            <Button 
              variant="link" 
              className="p-0 text-decoration-none text-muted"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              View More &gt;
            </Button>
          </Col>
        </Row>
        
        <div 
          className="d-flex overflow-auto pb-3 horizontal-scroll"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            gap: '16px'
          }}
        >
          {newArrivals.map((product) => (
            <div key={product.id} style={{ width: '220px', flexShrink: 0 }}>
              <Card className="border-0 shadow-sm h-100" style={{ height: '320px' }}>
                <div className="position-relative" style={{ height: '220px' }}>
                  <Card.Img 
                    variant="top" 
                    src={product.image}
                    style={{ 
                      height: '100%', 
                      width: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px 8px 0 0'
                    }}
                  />
                </div>
                <Card.Body className="p-3 d-flex flex-column justify-content-between" style={{ height: '100px' }}>
                  <Card.Title 
                    className="h6 mb-2"
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: '600',
                      fontSize: '14px',
                      lineHeight: '1.3',
                      height: '36px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {product.name}
                  </Card.Title>
                  <Card.Text 
                    className="h5 mb-0 fw-bold"
                    style={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: '700',
                      fontSize: '16px',
                      color: '#000'
                    }}
                  >
                    {product.price}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </Container>

      {/* Shop By Category Section */}
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 
              className="h3 fw-bold mb-0"
              style={{ 
                fontFamily: "'Playfair Display', serif",
                letterSpacing: '-0.02em'
              }}
            >
              Shop By Category
            </h2>
          </Col>
        </Row>
        
        <Row className="g-3">
          {categories.map((category) => (
            <Col key={category.id} xs={4} md={4}>
              <Card 
                className="border-0 shadow-sm position-relative overflow-hidden"
                style={{ aspectRatio: '1' }}
              >
                <Card.Img 
                  src={category.image}
                  style={{ 
                    height: '100%', 
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                  }}
                />
                <div 
                  className="position-absolute bottom-0 start-0 end-0 text-white p-3"
                  style={{
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                  }}
                >
                  <Card.Text 
                    className="mb-0 fw-semibold"
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: '600'
                    }}
                  >
                    {category.name}
                  </Card.Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Shop By Occasion Section */}
      <Container className="py-4 pb-5">
        <Row className="mb-4">
          <Col>
            <h2 
              className="h3 fw-bold mb-0"
              style={{ 
                fontFamily: "'Playfair Display', serif",
                letterSpacing: '-0.02em'
              }}
            >
              Shop By Occassion
            </h2>
          </Col>
        </Row>
        
        <Row className="g-3">
          {occasions.map((occasion) => (
            <Col key={occasion.id} xs={4} md={4}>
              <Card 
                className="border-0 shadow-sm position-relative overflow-hidden"
                style={{ aspectRatio: '1' }}
              >
                <Card.Img 
                  src={occasion.image}
                  style={{ 
                    height: '100%', 
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                  }}
                />
                <div 
                  className="position-absolute bottom-0 start-0 end-0 text-white p-3"
                  style={{
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                  }}
                >
                  <Card.Text 
                    className="mb-0 fw-semibold"
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: '600'
                    }}
                  >
                    {occasion.name}
                  </Card.Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default HomePageContent;