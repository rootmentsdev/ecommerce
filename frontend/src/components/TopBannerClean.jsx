import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Truck, Star, Gift } from 'react-bootstrap-icons';

const TopBannerClean = () => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const bannerItems = [
    { id: 1, icon: <Truck size={16} />, text: 'All Kerala Delivery' },
    { id: 2, icon: <Star size={16} className="text-warning" />, text: '4.4 Google Ratings' },
    { id: 3, icon: <Gift size={16} />, text: 'Free Shipping Above ₹10,000' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentItemIndex((prevIndex) => (prevIndex + 1) % bannerItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-dark text-white py-3 border-bottom border-secondary">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} className="text-center">
            <div className="d-flex align-items-center justify-content-center">
              <span className="me-2">{bannerItems[currentItemIndex].icon}</span>
              <span className="fw-semibold">{bannerItems[currentItemIndex].text}</span>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TopBannerClean;

