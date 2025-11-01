import React, { useState } from 'react';
import { Container, Row, Col, Collapse, Image } from 'react-bootstrap';
import { ChevronRight, Whatsapp, Facebook, Instagram } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';

const Footer = () => {
  const navigate = useNavigate();
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [policiesOpen, setPoliciesOpen] = useState(false);

  const quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Rent Products', href: '/rent-products' },
    { label: 'Buy Products', href: '/buy-products' },
    { label: 'Favorites', href: '/favorites' },
    // { label: 'Help Center', href: '/help' }, // Coming soon
    // { label: 'Shipping Info', href: '/shipping' }, // Coming soon
    // { label: 'Returns', href: '/returns' }, // Coming soon
  ];

  const policies = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
    { label: 'Shipping Policy', href: '/shipping' }
  ];

  const socialLinks = [
    { icon: Whatsapp, href: '#', label: 'WhatsApp' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ];

  return (
    <footer 
      className="py-4"
      style={{ 
        backgroundColor: '#2c2c2c',
        color: 'white',
        minHeight: '300px',
        fontFamily: 'Poppins, sans-serif',
        width: '100%'
      }}
    >
      <div style={{ padding: '0 20px', margin: '0 auto' }}>
        {/* Logo and Description Section */}
        <Row className="mb-4">
          <Col>
            <div className="mb-3">
              <Image 
                src={Logo} 
                alt="dappr SQUAD Logo"
                style={{
                  height: '40px',
                  width: 'auto'
                }}
              />
            </div>
            <p 
              className="mb-0"
              style={{ 
                fontSize: '0.9rem',
                lineHeight: '1.5',
                maxWidth: '400px',
                color: 'white',
                opacity: 0.8
              }}
            >
              Your premier destination for premium men's fashion. Shop, rent, or book in bulk - we bring style and elegance to every celebration, from weddings to corporate events.
            </p>
          </Col>
        </Row>

        <hr style={{ borderColor: '#555', margin: '1.5rem 0' }} />

        {/* Quick Links Section */}
        <Row className="mb-3">
          <Col>
            <div 
              className="d-flex justify-content-between align-items-center footer-section"
              onClick={() => setQuickLinksOpen(!quickLinksOpen)}
              style={{ cursor: 'pointer' }}
            >
              <span className="fw-medium" style={{ color: 'white' }}>Quick Links</span>
              <ChevronRight 
                size={16} 
                style={{ 
                  transform: quickLinksOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </div>
            
            <Collapse in={quickLinksOpen}>
              <div className="mt-3">
                {quickLinks.map((link, index) => (
                  <div 
                    key={index}
                    className="mb-2 footer-link"
                    style={{ fontSize: '0.9rem', color: 'pink', opacity: 0.8, cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(link.href);
                    }}
                  >
                    {link.label}
                  </div>
                ))}
              </div>
            </Collapse>
          </Col>
        </Row>

        {/* Policies Section */}
        {policies.length > 0 && (
          <>
            <hr style={{ borderColor: '#5555', margin: '1rem 0' }} />
            <Row className="mb-3">
              <Col>
                <div 
                  className="d-flex justify-content-between align-items-center footer-section"
                  onClick={() => setPoliciesOpen(!policiesOpen)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="fw-medium" style={{ color: 'white' }}>Policies</span>
                  <ChevronRight 
                    size={16} 
                    style={{ 
                      transform: policiesOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.6s ease'
                    }}
                  />
                </div>
                
                <Collapse in={policiesOpen}>
                  <div className="mt-3">
                    {policies.map((policy, index) => (
                      <div 
                        key={index}
                        className="mb-2 footer-link"
                        style={{ fontSize: '0.9rem', color: 'white', opacity: 0.8, cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(policy.href);
                        }}
                      >
                        {policy.label}
                      </div>
                    ))}
                  </div>
                </Collapse>
              </Col>
            </Row>
          </>
        )}

        <hr style={{ borderColor: '#555', margin: '1rem 0' }} />

        {/* Bottom Section - Social Media, Copyright */}
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="social-link"
                    aria-label={social.label}
                    style={{ color: 'pink' }}
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          </Col>
          
          <Col md={6} className="text-center text-md-end">
            <p 
              className="mb-0"
              style={{ fontSize: '0.8rem', color: 'blue', opacity: 0.6, lineHeight: '1.5' }}
            >
              © {new Date().getFullYear()} Dappr Squad. All Rights Reserved.<br className="d-md-none" />
              <span className="d-none d-md-inline"> | </span>Premium Men's Fashion
            </p>
          </Col>
        </Row>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          .footer-section {
            transition: all 0.3s ease;
            padding: 8px 0;
            font-family: 'Poppins', sans-serif;
          }
          
          .footer-section:hover {
            color: #ccc !important;
          }
          
          .footer-link {
            transition: all 0.3s ease;
            cursor: pointer;
            padding: 4px 0;
            font-family: 'Poppins', sans-serif;
          }
          
          .footer-link:hover {
            color: white !important;
            opacity: 1 !important;
            transform: translateX(5px);
          }
          
          .social-link {
            color : white;
            background-color: #000;
            border:1 px;
            margin left: 5px;
            transition: all 0.3s ease;
            padding: 8px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          
          .social-link:hover {
            background-color: #000;
            color: white;
            background-color:#ffff;
            transform: scale(1.1);
          }
          
          @media (max-width: 768px) {
            .footer-section:hover,
            .footer-link:hover,
            .social-link:hover {
              transform: none;
            }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
