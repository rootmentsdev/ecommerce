import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { List, Search, Bag } from 'react-bootstrap-icons';
import { APP_CONFIG } from '../constants';

const Header = ({ onMenuClick }) => {
  // Event handlers following clean code principles
  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
    }
  };

  const handleSearchClick = () => {
    console.log('Search clicked');
    // TODO: Open search modal or navigate to search page
  };

  const handleCartClick = () => {
    console.log('Cart clicked');
    // TODO: Navigate to cart page
  };

  const handleLogoClick = () => {
    console.log('Logo clicked');
    // TODO: Navigate to home page
  };

  // Style objects following clean code principles
  const navbarStyles = {
    backgroundColor: APP_CONFIG.COLORS.WHITE,
    borderBottom: '1px solid #e9ecef'
  };

  const logoStyles = {
    color: APP_CONFIG.COLORS.SECONDARY,
    fontSize: '1.5rem',
    letterSpacing: '-0.02em',
    fontFamily: APP_CONFIG.FONTS.PRIMARY,
    fontWeight: '700'
  };

  const buttonStyles = {
    border: 'none',
    background: 'none',
    color: APP_CONFIG.COLORS.SECONDARY
  };

  const badgeStyles = {
    fontSize: '0.6rem'
  };

  // Render methods following single responsibility principle
  const renderMenuButton = () => (
    <button
      onClick={handleMenuClick}
      className="btn btn-link me-3 header-btn"
      style={buttonStyles}
      aria-label="Open menu"
    >
      <List size={24} />
    </button>
  );

  const renderLogo = () => (
    <Navbar.Brand 
      href="/" 
      className="mx-auto fw-bold header-logo"
      style={logoStyles}
      onClick={handleLogoClick}
    >
      Dapper Squad
    </Navbar.Brand>
  );

  const renderSearchButton = () => (
    <button
      onClick={handleSearchClick}
      className="btn btn-link me-3 header-btn"
      style={buttonStyles}
      aria-label="Search"
    >
      <Search size={24} />
    </button>
  );

  const renderCartButton = () => (
    <button
      onClick={handleCartClick}
      className="btn btn-link header-btn position-relative"
      style={buttonStyles}
      aria-label="Shopping cart"
    >
      <Bag size={24} />
      <span 
        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-badge"
        style={badgeStyles}
        aria-label="2 items in cart"
      >
        2
      </span>
    </button>
  );

  const renderRightIcons = () => (
    <div className="d-flex align-items-center">
      {renderSearchButton()}
      {renderCartButton()}
    </div>
  );

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
          
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
        style={navbarStyles}
      >
        <Container fluid className="px-4">
          {renderMenuButton()}
          {renderLogo()}
          {renderRightIcons()}
        </Container>
      </Navbar>
    </>
  );
};

export default Header;