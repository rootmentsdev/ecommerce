import React, { useState, useEffect } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { List, Search, Heart } from 'react-bootstrap-icons';
import { APP_CONFIG } from '../constants';
import FavoritesService from '../services/favoritesService';

const Header = ({ onMenuClick }) => {
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Update favorites count when component mounts
  useEffect(() => {
    const updateFavoritesCount = () => {
      const count = FavoritesService.getTotalFavoritesCount();
      setFavoritesCount(count);
    };

    updateFavoritesCount();

    // Listen for storage changes to update count in real-time
    const handleStorageChange = () => {
      updateFavoritesCount();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when favorites are updated
    window.addEventListener('favoritesUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
    };
  }, []);

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


  const handleFavoritesClick = () => {
    window.location.href = '/favorites';
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
    color: '#000',
    fontFamily: 'Century Gothic'
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
      <div style={{ textAlign: 'center', lineHeight: '1.1' }}>
        <div style={{ 
          fontFamily: 'Century Gothic',
          fontWeight: 700,
          fontSize: '1.4rem',
          color: '#000'
        }}>
          dappr
        </div>
        <div style={{ 
          fontFamily: 'Century Gothic',
          fontWeight: 400,
          fontSize: '1rem',
          color: '#000'
        }}>
          SQUAD
        </div>
      </div>
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


  const renderFavoritesButton = () => (
    <button
      onClick={handleFavoritesClick}
      className="btn btn-link header-btn position-relative"
      style={buttonStyles}
      aria-label="Favorites"
    >
      <Heart size={24} />
      {favoritesCount > 0 && (
        <span 
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          style={{
            fontSize: '10px',
            minWidth: '20px',
            height: '20px',
            lineHeight: '20px',
            marginTop: '-10px',
            marginLeft: '-10px',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          aria-label={`${favoritesCount} favorites`}
        >
          {favoritesCount}
        </span>
      )}
    </button>
  );

  const renderRightIcons = () => (
    <div className="d-flex align-items-center">
      {renderSearchButton()}
      {renderFavoritesButton()}
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
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 44px;
            min-height: 44px;
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
            background-color: #f8f9fa !important;
            transform: scale(1.02);
          }
          
          .header-logo:hover div,
          .header-logo:active div,
          .header-logo:focus div {
            color: #000 !important;
          }
          
          .cart-badge {
            transition: all 0.3s ease;
            min-width: 18px;
            min-height: 18px;
            font-size: 10px;
            font-weight: 600;
          }
          
          /* Desktop header optimizations */
          @media (min-width: 992px) {
            .navbar {
              padding: 12px 0;
            }
            
            .navbar .container-fluid {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: nowrap;
              min-height: 70px;
              padding: 0 24px;
            }
            
            .navbar .container-fluid > * {
              flex-shrink: 0;
            }
            
            .navbar .container-fluid > div {
              display: flex;
              align-items: center;
            }
            
            .header-btn {
              padding: 12px 16px;
              min-width: 48px;
              min-height: 48px;
              margin: 0 8px;
            }
            
            .header-logo {
              padding: 12px 20px;
              min-height: 48px;
            }
            
            .header-logo div:first-child {
              font-size: 1.6rem;
            }
            
            .header-logo div:last-child {
              font-size: 1.1rem;
            }
          }

          /* Mobile header optimizations */
          @media (max-width: 991px) {
            .navbar {
              padding: 8px 0;
            }
            
            .navbar .container-fluid {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: nowrap;
              min-height: 60px;
            }
            
            .navbar .container-fluid > * {
              flex-shrink: 0;
            }
            
            .navbar .container-fluid > div {
              display: flex;
              align-items: center;
            }
          }
          
          /* iPhone 13 specific optimizations */
          @media screen and (max-width: 428px) {
            .navbar {
              padding: 6px 0;
            }
            
            .navbar .container-fluid {
              padding: 0 12px;
            }
            
            .header-btn {
              padding: 8px;
              margin: 0 1px;
              min-width: 40px;
              min-height: 40px;
            }
            
            .header-logo {
              padding: 8px 10px;
              min-height: 40px;
            }
            
            .header-logo div:first-child {
              font-size: 1.1rem;
            }
            
            .header-logo div:last-child {
              font-size: 0.8rem;
            }
            
            .cart-badge {
              font-size: 9px;
              min-width: 16px;
              min-height: 16px;
            }
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
              background-color: #f8f9fa !important;
              transform: scale(1.02);
            }
            
            .header-logo:active div {
              color: #000 !important;
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
          ...navbarStyles,
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        <Container fluid className="px-3">
          <div className="d-flex align-items-center w-100 justify-content-between" style={{ minHeight: '60px' }}>
            <div className="d-flex align-items-center">
              {renderMenuButton()}
            </div>
            <div className="d-flex align-items-center flex-grow-1 justify-content-center">
              {renderLogo()}
            </div>
            <div className="d-flex align-items-center">
              {renderRightIcons()}
            </div>
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;