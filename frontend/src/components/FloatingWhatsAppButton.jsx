import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Whatsapp } from 'react-bootstrap-icons';
import { useLocation } from 'react-router-dom';

const FloatingWhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 100px
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide WhatsApp button on Product Details page and Admin pages
  if (location.pathname === '/product-details' || location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleWhatsAppClick = () => {
    // Replace with your actual WhatsApp number
    const phoneNumber = '+1234567890'; // Replace with actual number
    const message = 'Hello! I would like to know more about your services.';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div 
      className="position-fixed"
      style={{
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {/* Enquire Now Text */}
      <div
        style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#dc3545',
          backgroundColor: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          animation: 'heartbeat 1.5s ease-in-out infinite',
          whiteSpace: 'nowrap'
        }}
      >
        Enquire Now
      </div>

      {/* WhatsApp Button */}
      <Button
        variant="success"
        className="whatsapp-button"
        onClick={handleWhatsAppClick}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50% !important',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          border: 'none !important',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 2s infinite'
        }}
      >
        <Whatsapp size={30} />
      </Button>
      
      <style>
        {`
          .whatsapp-button {
            border-radius: 50% !important;
            border: none !important;
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(37, 211, 102, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
            }
          }
          
          @keyframes heartbeat {
            0% {
              transform: scale(1);
            }
            14% {
              transform: scale(1.1);
            }
            28% {
              transform: scale(1);
            }
            42% {
              transform: scale(1.1);
            }
            70% {
              transform: scale(1);
            }
          }
          
          @media (max-width: 768px) {
            .position-fixed {
              bottom: 15px !important;
              right: 15px !important;
            }
            
            .position-fixed button {
              width: 50px !important;
              height: 50px !important;
            }
            
            .position-fixed div:first-child {
              font-size: 10px !important;
              padding: 3px 6px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default FloatingWhatsAppButton;
