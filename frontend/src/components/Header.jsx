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
    borderBottom: '1px solid #e9ecef',
    minHeight: '60px',
    paddingTop: '8px',
    paddingBottom: '8px'
  };

  const logoStyles = {
    color: APP_CONFIG.COLORS.SECONDARY,
    fontSize: '1.4rem',
    letterSpacing: '-0.02em',
    fontFamily: APP_CONFIG.FONTS.PRIMARY,
    fontWeight: '700',
    lineHeight: '1.2'
  };

  const buttonStyles = {
    border: 'none',
    background: 'none',
    color: APP_CONFIG.COLORS.SECONDARY,
    padding: '10px',
    borderRadius: '10px',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const badgeStyles = {
    fontSize: '0.65rem',
    fontWeight: '600',
    minWidth: '18px',
    height: '18px',
    lineHeight: '18px'
  };

  // Render methods following single responsibility principle
  const renderMenuButton = () => (
    <button
      onClick={handleMenuClick}
      className="btn btn-link me-2 header-btn"
      style={buttonStyles}
      aria-label="Open menu"
    >
      <List size={22} />
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
      className="btn btn-link me-2 header-btn"
      style={buttonStyles}
      aria-label="Search"
    >
      <Search size={22} />
    </button>
  );

  const renderCartButton = () => (
    <button
      onClick={handleCartClick}
      className="btn btn-link header-btn position-relative"
      style={buttonStyles}
      aria-label="Shopping cart"
    >
      <Bag size={22} />
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
            transition: all 0.2s ease;
            border-radius: 10px;
            padding: 10px;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            user-select: none;
          }
          
          .header-btn:hover,
          .header-btn:active,
          .header-btn:focus {
            background-color: #f8f9fa !important;
            color: #000 !important;
            transform: scale(1.05);
          }
          
          .header-logo {
            transition: all 0.2s ease;
            padding: 8px 12px;
            border-radius: 8px;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            user-select: none;
          }
          
          .header-logo:hover,
          .header-logo:active,
          .header-logo:focus {
            background-color: #f8f9fa !important;
            color: #000 !important;
            transform: scale(1.02);
          }
          
          .cart-badge {
            transition: all 0.2s ease;
            font-size: 0.65rem;
            font-weight: 600;
            min-width: 18px;
            height: 18px;
            line-height: 18px;
          }
          
          .header-btn:hover .cart-badge,
          .header-btn:active .cart-badge,
          .header-btn:focus .cart-badge {
            background-color: #dc3545 !important;
            color: white !important;
          }
          
          /* iPhone 13 specific optimizations */
          @media (max-width: 428px) {
            .header-btn {
              min-width: 44px;
              min-height: 44px;
              padding: 8px;
            }
            
            .header-logo {
              font-size: 1.3rem;
              padding: 6px 10px;
            }
            
            .cart-badge {
              font-size: 0.6rem;
              min-width: 16px;
              height: 16px;
              line-height: 16px;
            }
          }
          
          /* Touch device optimizations */
          @media (hover: none) and (pointer: coarse) {
            .header-btn:active {
              background-color: #f8f9fa !important;
              color: #000 !important;
              transform: scale(1.05);
            }
            
            .header-logo:active {
              background-color: #f8f9fa !important;
              color: #000 !important;
              transform: scale(1.02);
            }
            
            .header-btn:active .cart-badge {
              background-color: #dc3545 !important;
              color: white !important;
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
        <Container fluid className="px-3">
          <div className="d-flex align-items-center justify-content-between w-100">
            {renderMenuButton()}
            {renderLogo()}
            {renderRightIcons()}
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;