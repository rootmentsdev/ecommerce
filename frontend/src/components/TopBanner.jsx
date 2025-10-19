import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Truck, Star, Gift } from 'react-bootstrap-icons';

const TopBanner = () => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const bannerItems = [
    {
      id: 1,
      icon: <Truck size={16} style={{ color: '#fff' }} />,
      text: 'All Kerala Delivery'
    },
    {
      id: 2,
      icon: <Star size={16} style={{ color: '#ffc107' }} />,
      text: '4.4 Google Ratings'
    },
    {
      id: 3,
      icon: <Gift size={16} style={{ color: '#fff' }} />,
      text: 'Free Shipping Above ₹10,000'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentItemIndex((prevIndex) => (prevIndex + 1) % bannerItems.length);
        setIsTransitioning(false);
      }, 300); // Half of transition duration
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      style={{
        backgroundColor: '#000000', // Black background
        color: '#ffffff', // White text
        padding: '12px 0',
        fontSize: '14px',
        fontFamily: 'Century Gothic',
        fontWeight: 600,
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'relative',
        minHeight: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Container>
        <Row className="align-items-center">
          <Col xs={12} className="text-center">
            <div 
              style={{
                transform: isTransitioning ? 'translateY(-10px)' : 'translateY(0)',
                opacity: isTransitioning ? 0.3 : 1,
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }}
            >
              <span 
                className="me-2"
                style={{
                  transform: isTransitioning ? 'scale(0.8)' : 'scale(1)',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {bannerItems[currentItemIndex].icon}
              </span>
              <span
                style={{
                  transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {bannerItems[currentItemIndex].text}
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TopBanner;
