import React, { useState, useEffect } from 'react';
import { Offcanvas, Button, Image, ListGroup, Badge, Collapse } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  HouseDoor, 
  Person, 
  ListUl, 
  Box, 
  Heart, 
  ArrowClockwise, 
  GeoAlt,
  ChatDots,
  Gear,
  BoxArrowRight,
  X,
  PersonCircle,
  ChevronDown,
  ChevronUp
} from 'react-bootstrap-icons';
import { APP_CONFIG } from '../constants';

const SideMenu = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showCategories, setShowCategories] = useState(false);

  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Constants following clean code principles
  const CATEGORIES = [
    'Lehangas',
    'Blazers',
    'Suits',
    'Western',
    'Ethnic',
    'Accessories',
    'Jewellery'
  ];

  const MENU_ITEMS = [
    { icon: HouseDoor, label: 'Home', href: '/' },
    { icon: Person, label: 'Profile', href: '/profile' },
    { icon: ListUl, label: 'Categories', action: 'toggleCategories' },
    { icon: Box, label: 'My Orders', href: '/orders' },
    { icon: Heart, label: 'Wishlist', href: '/favorites' },
    { icon: ArrowClockwise, label: 'How it Works', href: '/how-it-works' },
    { icon: GeoAlt, label: 'Store Near Me', href: '/store-locator' }
  ];

  const UTILITY_ITEMS = [
    { icon: ChatDots, label: 'Support/ Help Center', href: '/support' },
    { icon: Gear, label: 'Settings', href: '/settings' },
    { icon: BoxArrowRight, label: 'Log Out', action: 'logout' }
  ];

  // Event handlers following clean code principles
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    handleClose();
    navigate('/');
  };

  const handleMenuItemClick = (item) => {
    if (item.action === 'logout') {
      handleLogout();
    } else if (item.action === 'toggleCategories') {
      setShowCategories(!showCategories);
    } else if (item.href) {
      navigate(item.href);
      handleClose();
    }
  };

  const handleCategoryClick = (category) => {
    // Convert display name to lowercase for URL
    const categorySlug = category.toLowerCase();
    navigate(`/category/${categorySlug}`);
    handleClose();
  };

  // Render methods following single responsibility principle
  const renderUserProfile = () => {
    const userName = user?.name || user?.fullName || 'John Wick';
    let userPhone = user?.phone || user?.mobileNumber || '+91 98765 43210';
    
    // Format phone number if it's a 10-digit number
    if (userPhone && userPhone.length === 10 && /^\d+$/.test(userPhone)) {
      userPhone = `+91 ${userPhone.slice(0, 5)} ${userPhone.slice(5)}`;
    }
    
    return (
      <div className="d-flex align-items-center mb-4">
        <div className="me-3">
          {user?.profilePicture ? (
            <Image 
              src={user.profilePicture} 
              roundedCircle 
              width={60} 
              height={60}
              className="border border-secondary"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div 
              className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
              style={{ width: '60px', height: '60px' }}
            >
              <PersonCircle size={50} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-grow-1">
          <div className="fw-bold mb-1" style={{ fontSize: '1.1rem', color: '#000' }}>
            {userName}
          </div>
          <div className="text-muted" style={{ fontSize: '0.9rem' }}>
            {userPhone}
          </div>
        </div>
      </div>
    );
  };

  const renderMenuItem = (item, index) => {
    const IconComponent = item.icon;
    const isCategories = item.action === 'toggleCategories';
    
    return (
      <React.Fragment key={index}>
        <ListGroup.Item 
          action
          onClick={() => handleMenuItemClick(item)}
          className="border-0 py-3 px-3 d-flex align-items-center justify-content-between"
          style={{ 
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div className="d-flex align-items-center">
            <IconComponent className="me-3 text-secondary" size={20} />
            <span 
              className="text-dark" 
              style={{ 
                fontFamily: APP_CONFIG.FONTS.PRIMARY,
                fontWeight: '400'
              }}
            >
              {item.label}
            </span>
          </div>
          {isCategories && (
            showCategories ? <ChevronUp size={16} /> : <ChevronDown size={16} />
          )}
        </ListGroup.Item>
        
        {/* Categories Dropdown */}
        {isCategories && (
          <Collapse in={showCategories}>
            <div>
              {CATEGORIES.map((category, catIndex) => (
                <ListGroup.Item
                  key={catIndex}
                  action
                  onClick={() => handleCategoryClick(category)}
                  className="border-0 py-2 ps-5 pe-3"
                  style={{
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    backgroundColor: '#f8f9fa',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e9ecef';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                >
                  <span 
                    className="text-dark"
                    style={{ 
                      fontFamily: APP_CONFIG.FONTS.PRIMARY,
                      fontWeight: '400'
                    }}
                  >
                    {category}
                  </span>
                </ListGroup.Item>
              ))}
            </div>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Offcanvas 
      show={show} 
      onHide={handleClose}
      backdrop={true}
      scroll={true}
      placement="start"
      style={{ width: '85%', maxWidth: '350px' }}
    >
      <Offcanvas.Header className="border-0 pb-2">
        <Offcanvas.Title className="w-100 d-flex justify-content-end">
          <Button 
            variant="link" 
            onClick={handleClose}
            className="p-0 text-dark border-0"
            aria-label="Close menu"
          >
            <X size={24} />
          </Button>
        </Offcanvas.Title>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="pt-0">
        {/* User Profile Section */}
        {renderUserProfile()}
        
        {/* Main Navigation Items */}
        <ListGroup variant="flush" className="mb-2">
          {MENU_ITEMS.map((item, index) => renderMenuItem(item, index))}
        </ListGroup>
        
        {/* Separator */}
        <hr className="my-2" />
        
        {/* Utility Items */}
        <ListGroup variant="flush">
          {UTILITY_ITEMS.map((item, index) => renderMenuItem(item, index))}
        </ListGroup>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default SideMenu;