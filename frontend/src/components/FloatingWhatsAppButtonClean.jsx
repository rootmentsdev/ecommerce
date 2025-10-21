import React, { useState, useEffect } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { Whatsapp } from 'react-bootstrap-icons';
import { useLocation } from 'react-router-dom';

const FloatingWhatsAppButtonClean = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (location.pathname === '/product-details' || location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = '+1234567890';
    const message = 'Hello! I would like to know more about your services.';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="position-fixed bottom-0 end-0 p-3 d-flex flex-column align-items-center gap-2" style={{zIndex: 1000}}>
      <Badge bg="danger" className="rounded-pill px-3 py-2 shadow-sm">
        <small className="fw-semibold">Enquire Now</small>
      </Badge>
      <Button
        variant="success"
        className="rounded-circle shadow p-3"
        onClick={handleWhatsAppClick}
        style={{width: '60px', height: '60px'}}
      >
        <Whatsapp size={30} />
      </Button>
    </div>
  );
};

export default FloatingWhatsAppButtonClean;

