import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Form, InputGroup, Row, Col, Button } from 'react-bootstrap';
import { Heart, Bag, Person, Search, ChevronDown, List } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../constants';
import FavoritesService from '../services/favoritesService';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Categories list
  const categories = [
    'Lehangas',
    'Blazers',
    'Suits',
    'Western',
    'Ethnic',
    'Accessories',
    'Jewellery'
  ];

  // Update favorites count when component mounts
  useEffect(() => {
    const updateFavoritesCount = () => {
      const count = FavoritesService.getTotalFavoritesCount();
      setFavoritesCount(count);
    };

    updateFavoritesCount();

    const handleStorageChange = (event) => {
      updateFavoritesCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
    };
  }, []);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  const handleCartClick = () => {
    // Navigate to cart page when implemented
    console.log('Cart clicked');
  };

  const handleProfileClick = () => {
    // Navigate to profile page when implemented
    console.log('Profile clicked');
  };

  const handleCategoryClick = (category) => {
    // Navigate to category page
    navigate('/products', { state: { category } });
    setShowCategories(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/products', { state: { search: searchQuery } });
    }
  };

  return (
    <>
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          .header-wrapper {
            position: sticky;
            top: 0;
            z-index: 1000;
            background-color: #fff;
            width: 100%;
            margin: 0;
            padding: 0;
            left: 0;
            right: 0;
          }

          .top-black-bar {
            background-color: #000;
            height: 2px;
            width: 100%;
            margin: 0;
            padding: 0;
          }

          .header-main {
            background-color: #fff;
            padding: 12px 0;
            width: 100%;
            margin: 0;
            border-bottom: 1px solid #f0f0f0;
          }

          .header-container {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 40px;
          }

          /* On very large screens, center content with max-width */
          @media (min-width: 1400px) {
            .header-container {
              max-width: 1400px;
              margin: 0 auto;
            }

            .categories-container {
              max-width: 1400px;
              margin: 0 auto;
            }
          }

          @media (max-width: 768px) {
            .header-container {
              padding: 0 16px;
            }

            .categories-container {
              padding: 0 16px;
            }
          }

          .header-logo {
            font-weight: 700;
            font-size: 1.25rem;
            color: #000;
            text-decoration: none;
            font-family: ${APP_CONFIG.FONTS.PRIMARY};
          }

          .header-logo:hover {
            color: #000;
            text-decoration: none;
          }

          .header-nav-link {
            color: #4a4a4a;
            font-size: 0.875rem;
            text-decoration: none;
            padding: 6px 14px;
            font-family: ${APP_CONFIG.FONTS.PRIMARY};
            transition: color 0.2s;
            font-weight: 400;
          }

          .header-nav-link:hover {
            color: #000;
            text-decoration: none;
          }

          .header-search {
            max-width: 350px;
            width: 100%;
          }

          .header-search-input {
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 7px 12px 7px 36px;
            font-size: 0.875rem;
            color: #666;
            width: 100%;
            background-color: #fafafa;
          }

          .header-search-input:focus {
            border-color: #d0d0d0;
            box-shadow: none;
            outline: none;
            background-color: #fff;
          }

          .header-search-input::placeholder {
            color: #999;
          }

          .header-icon-btn {
            background: none;
            border: none;
            color: #4a4a4a;
            padding: 6px 10px;
            cursor: pointer;
            position: relative;
            transition: color 0.2s;
          }

          .header-icon-btn:hover {
            color: #000;
          }

          .header-icon-btn .icon {
            font-size: 1.1rem;
          }

          .header-profile-icon {
            background-color: #f0f0f0;
            border-radius: 4px;
            padding: 6px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .header-profile-icon .icon {
            color: #000;
            font-size: 1rem;
          }

          .categories-row {
            background-color: #fff;
            border-top: 1px solid #e9ecef;
            padding: 12px 0;
            width: 100%;
            margin: 0;
          }

          .categories-container {
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
            padding: 0 24px;
          }

          .category-link {
            color: #666;
            font-size: 0.9rem;
            text-decoration: none;
            padding: 4px 12px;
            font-family: ${APP_CONFIG.FONTS.PRIMARY};
            transition: color 0.2s;
          }

          .category-link:hover {
            color: #000;
            text-decoration: none;
          }

          .dropdown-toggle::after {
            margin-left: 8px;
          }

          .nav-dropdown-menu {
            border: 1px solid #e9ecef;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-top: 8px;
          }

          .nav-dropdown-item {
            color: #666;
            font-size: 0.9rem;
            padding: 8px 16px;
            font-family: ${APP_CONFIG.FONTS.PRIMARY};
          }

          .nav-dropdown-item:hover {
            background-color: #f8f9fa;
            color: #000;
          }

          .favorites-badge {
            position: absolute;
            top: 4px;
            right: 8px;
            background-color: #dc3545;
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            font-size: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
          }

          @media (max-width: 991px) {
            .header-main {
              padding: 12px 0;
            }

            .header-nav-link {
              padding: 6px 12px;
              font-size: 0.85rem;
            }

            .header-search {
              max-width: 100%;
              margin: 12px 0;
            }

            .categories-row {
              padding: 8px 0;
            }

            .category-link {
              font-size: 0.85rem;
              padding: 4px 8px;
            }
          }
        `}
      </style>
      
      <div className="header-wrapper">
        {/* Top Black Bar */}
        <div className="top-black-bar"></div>

        {/* Main Header */}
        <div className="header-main">
        <div className="header-container">
          {isMobile ? (
            // Mobile Layout: Hamburger | Logo | Search + Bag
            <div className="d-flex align-items-center justify-content-between position-relative">
              {/* Hamburger Menu */}
              <Button
                variant="link"
                className="p-0 text-dark border-0"
                onClick={onMenuClick}
                aria-label="Menu"
                style={{ zIndex: 1 }}
              >
                <List size={24} />
              </Button>

              {/* Logo - Centered */}
              <Navbar.Brand 
                href="/" 
                className="header-logo position-absolute start-50 translate-middle-x"
                style={{ zIndex: 0 }}
              >
                Logo
              </Navbar.Brand>

              {/* Right Icons - Search and Bag */}
              <div className="d-flex align-items-center gap-3" style={{ zIndex: 1 }}>
                <Button
                  variant="link"
                  className="p-0 text-dark border-0"
                  onClick={() => {/* Handle search click */}}
                  aria-label="Search"
                >
                  <Search size={20} />
                </Button>
                <Button
                  variant="link"
                  className="p-0 text-dark border-0 position-relative"
                  onClick={handleCartClick}
                  aria-label="Shopping Cart"
                >
                  <Bag size={20} />
                </Button>
              </div>
            </div>
          ) : (
            // Desktop Layout
            <Row className="align-items-center g-0">
              {/* Logo */}
              <Col xs={12} lg={2} className="mb-3 mb-lg-0">
                <Navbar.Brand href="/" className="header-logo">
                  Logo
                </Navbar.Brand>
              </Col>

              {/* Navigation Links */}
              <Col xs={12} lg={4} className="mb-3 mb-lg-0">
                <Nav className="d-flex flex-wrap align-items-center">
                  <Nav.Link href="/" className="header-nav-link">Home</Nav.Link>
                  <Nav.Link
                    href="#"
                    className="header-nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCategories(!showCategories);
                    }}
                  >
                    Categories <ChevronDown size={12} />
                  </Nav.Link>
                  <Nav.Link href="/how-it-works" className="header-nav-link">How It Works</Nav.Link>
                  <Nav.Link href="/new-arrivals" className="header-nav-link">New Arrivals</Nav.Link>
                </Nav>
              </Col>

              {/* Search Bar */}
              <Col xs={12} lg={4} className="mb-3 mb-lg-0">
                <Form onSubmit={handleSearchSubmit} className="header-search">
                  <InputGroup>
                    <InputGroup.Text style={{ 
                      position: 'absolute', 
                      left: 0, 
                      zIndex: 10, 
                      background: 'none', 
                      border: 'none',
                      paddingLeft: '10px'
                    }}>
                      <Search size={14} color="#999" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search for products..."
                      className="header-search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: '36px' }}
                    />
                  </InputGroup>
                </Form>
              </Col>

              {/* Right Icons */}
              <Col xs={12} lg={2} className="d-flex justify-content-end align-items-center gap-2">
                <button
                  onClick={handleFavoritesClick}
                  className="header-icon-btn position-relative"
                  aria-label="Favorites"
                >
                  <Heart className="icon" />
                  {favoritesCount > 0 && (
                    <span className="favorites-badge">{favoritesCount}</span>
                  )}
                </button>
                <button
                  onClick={handleCartClick}
                  className="header-icon-btn"
                  aria-label="Shopping Cart"
                >
                  <Bag className="icon" />
                </button>
                <button
                  onClick={handleProfileClick}
                  className="header-icon-btn header-profile-icon"
                  aria-label="Profile"
                >
                  <Person className="icon" />
                </button>
              </Col>
            </Row>
          )}
        </div>
      </div>

      {/* Categories Row - Shows when Categories is clicked */}
      {showCategories && (
        <div className="categories-row">
          <div className="categories-container">
            <Row className="g-0">
              <Col>
                <div className="d-flex flex-wrap align-items-center">
                  {categories.map((category) => (
                    <a
                      key={category}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryClick(category);
                      }}
                      className="category-link"
                    >
                      {category}
                    </a>
                  ))}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Header;