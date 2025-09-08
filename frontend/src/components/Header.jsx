import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { List, Search, Bag } from 'react-bootstrap-icons';

const Header = ({ onMenuClick }) => {
  return (
    <>
      <style>
        {`
          .header-btn {
            transition: all 0.3s ease;
            border-radius: 8px;
            padding: 8px 12px;
            -webkit-tap-highlight-color: transparent;
          }
          
          .header-btn:hover,
          .header-btn:active,
          .header-btn:focus {
            background-color: #000 !important;
            color: white !important;
            transform: scale(1.05);
          }
          
          .header-logo {
            transition: all 0.3s ease;
            padding: 8px 16px;
            border-radius: 8px;
            -webkit-tap-highlight-color: transparent;
          }
          
          .header-logo:hover,
          .header-logo:active,
          .header-logo:focus {
            background-color: #000 !important;
            color: white !important;
            transform: scale(1.02);
          }
          
          .cart-badge {
            transition: all 0.3s ease;
          }
          
          .header-btn:hover .cart-badge,
          .header-btn:active .cart-badge,
          .header-btn:focus .cart-badge {
            background-color: white !important;
            color: #000 !important;
          }
          
          /* Mobile-specific touch effects */
          @media (hover: none) and (pointer: coarse) {
            .header-btn:active {
              background-color: #000 !important;
              color: white !important;
              transform: scale(1.05);
            }
            
            .header-logo:active {
              background-color: #000 !important;
              color: white !important;
              transform: scale(1.02);
            }
            
            .header-btn:active .cart-badge {
              background-color: white !important;
              color: #000 !important;
            }
          }
        `}
      </style>
      <Navbar 
        bg="white" 
        expand="lg" 
        className="shadow-sm border-bottom"
        style={{ 
          backgroundColor: 'white',
          borderBottom: '1px solid #e9ecef'
        }}
      >
      <Container fluid className="px-4">
        {/* Hamburger Menu Icon */}
        <button
          onClick={onMenuClick}
          className="btn btn-link me-3 header-btn"
          style={{ 
            border: 'none',
            background: 'none',
            color: '#333'
          }}
        >
          <List size={24} />
        </button>

        {/* Logo - Centered */}
        <Navbar.Brand 
          href="/" 
          className="mx-auto fw-bold header-logo"
          style={{ 
            color: '#333',
            fontSize: '1.5rem',
            letterSpacing: '0.5px'
          }}
        >
          Logo
        </Navbar.Brand>

        {/* Right side icons */}
        <div className="d-flex align-items-center">
          {/* Search Icon */}
          <button
            className="btn btn-link me-3 header-btn"
            style={{ 
              border: 'none',
              background: 'none',
              color: '#333'
            }}
          >
            <Search size={24} />
          </button>

          {/* Shopping Bag Icon */}
          <button
            className="btn btn-link header-btn position-relative"
            style={{ 
              border: 'none',
              background: 'none',
              color: '#333'
            }}
          >
            <Bag size={24} />
            {/* Cart items indicator */}
            <span 
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-badge"
              style={{ fontSize: '0.6rem' }}
            >
              2
            </span>
          </button>
        </div>
      </Container>
    </Navbar>
    </>
  );
};

export default Header;
