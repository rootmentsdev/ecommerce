import React, { useState, useEffect } from 'react';
import { Offcanvas, Button, Image, ListGroup } from 'react-bootstrap';
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
  X
} from 'react-bootstrap-icons';
import { APP_CONFIG } from '../constants';

const SideMenu = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(false);

  // Constants following clean code principles
  const MENU_ITEMS = [
    { icon: HouseDoor, label: 'Home', href: '/' },
    { icon: Person, label: 'Profile', href: '/profile' },
    { icon: ListUl, label: 'Categories', href: '/categories' },
    { icon: Box, label: 'My Orders', href: '/orders' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: ArrowClockwise, label: 'How it Works', href: '/how-it-works' },
    { icon: GeoAlt, label: 'Store Near Me', href: '/store-locator' }
  ];

  const UTILITY_ITEMS = [
    { icon: ChatDots, label: 'Support/ Help Center', href: '/support' },
    { icon: Gear, label: 'Settings', href: '/settings' },
    { icon: BoxArrowRight, label: 'Log Out', action: 'logout' }
  ];

  const USER_PROFILE = {
    name: 'John Wick',
    phone: '+91 98765 43210',
    avatar: 'https://via.placeholder.com/60x60/8B4513/FFFFFF?text=JW'
  };

  // Event handlers following clean code principles
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    handleClose();
    navigate('/login');
  };

  const handleMenuItemClick = (item) => {
    if (item.action === 'logout') {
      handleLogout();
    } else if (item.href) {
      navigate(item.href);
      handleClose();
    }
  };

  const handleCloseClick = () => {
    if (handleClose) {
      handleClose();
    }
  };

  // Responsive logic following clean code principles
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Style objects following clean code principles
  const offcanvasStyles = {
    width: isDesktop ? '350px' : '85%'
  };

  const avatarStyles = {
    width: '60px',
    height: '60px'
  };

  const nameStyles = {
    fontFamily: APP_CONFIG.FONTS.PRIMARY,
    fontWeight: '600',
    letterSpacing: '-0.02em'
  };

  const phoneStyles = {
    fontFamily: APP_CONFIG.FONTS.SECONDARY,
    fontWeight: '400',
    letterSpacing: '-0.01em'
  };

  const menuItemStyles = {
    fontSize: '1rem'
  };

  // Render methods following single responsibility principle
  const renderCloseButton = () => (
    <Button 
      variant="link" 
      onClick={handleCloseClick}
      className="p-0 text-dark close-btn"
      style={{ fontSize: '1.5rem' }}
      aria-label="Close menu"
    >
      <X />
    </Button>
  );

  const renderUserProfile = () => (
    <div className="d-flex align-items-center mb-4 profile-section">
      <Image 
        src={USER_PROFILE.avatar}
        roundedCircle 
        className="me-3"
        style={avatarStyles}
        alt="User avatar"
      />
      <div>
        <h5 
          className="mb-1 fw-bold text-dark"
          style={nameStyles}
        >
          {USER_PROFILE.name}
        </h5>
        <p 
          className="mb-0 text-muted small"
          style={phoneStyles}
        >
          {USER_PROFILE.phone}
        </p>
      </div>
    </div>
  );

  const renderMenuItem = (item, index) => {
    const IconComponent = item.icon;
    const isLogout = item.action === 'logout';
    
    return (
      <ListGroup.Item 
        key={index}
        action={!isLogout}
        href={isLogout ? undefined : item.href}
        onClick={() => handleMenuItemClick(item)}
        className="border-0 py-3 px-3 d-flex align-items-center menu-item"
        style={menuItemStyles}
      >
        <IconComponent className="me-3 text-dark" size={20} />
        <span 
          className="text-dark" 
          style={{ 
            fontFamily: APP_CONFIG.FONTS.PRIMARY,
            fontWeight: '500',
            letterSpacing: '-0.01em'
          }}
        >
          {item.label}
        </span>
      </ListGroup.Item>
    );
  };

  const renderMenuItems = () => (
    <ListGroup variant="flush" className="mb-3">
      {MENU_ITEMS.map((item, index) => renderMenuItem(item, index))}
    </ListGroup>
  );

  const renderUtilityItems = () => (
    <ListGroup variant="flush">
      {UTILITY_ITEMS.map((item, index) => renderMenuItem(item, index))}
    </ListGroup>
  );

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
          
          .side-menu .menu-item {
            transition: all 0.3s ease;
            border-radius: 8px;
            margin: 2px 0;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
          }
          
          .side-menu .menu-item:hover,
          .side-menu .menu-item:active,
          .side-menu .menu-item:focus {
            background-color: #000 !important;
            color: white !important;
            transform: translateX(5px);
          }
          
          .side-menu .menu-item:hover .text-dark,
          .side-menu .menu-item:active .text-dark,
          .side-menu .menu-item:focus .text-dark {
            color: white !important;
          }
          
          .side-menu .close-btn {
            transition: all 0.3s ease;
            border-radius: 50%;
            padding: 8px;
            -webkit-tap-highlight-color: transparent;
          }
          
          .side-menu .close-btn:hover,
          .side-menu .close-btn:active,
          .side-menu .close-btn:focus {
            background-color: #000 !important;
            color: white !important;
            transform: scale(1.1);
          }
          
          .side-menu .profile-section {
            transition: all 0.3s ease;
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
          }
          
          .side-menu .profile-section:hover,
          .side-menu .profile-section:active,
          .side-menu .profile-section:focus {
            background-color: #f8f9fa;
            transform: translateX(3px);
          }
          
          @media (hover: none) and (pointer: coarse) {
            .side-menu .menu-item:active {
              background-color: #000 !important;
              color: white !important;
              transform: translateX(5px);
            }
            
            .side-menu .menu-item:active .text-dark {
              color: white !important;
            }
            
            .side-menu .close-btn:active {
              background-color: #000 !important;
              color: white !important;
              transform: scale(1.1);
            }
            
            .side-menu .profile-section:active {
              background-color: #f8f9fa;
              transform: translateX(3px);
            }
          }
        `}
      </style>
      <Offcanvas 
        show={show} 
        onHide={handleClose} 
        placement="start"
        className="side-menu"
        style={offcanvasStyles}
      >
        <Offcanvas.Header className="border-0 pb-0">
          <Offcanvas.Title className="w-100 d-flex justify-content-end">
            {renderCloseButton()}
          </Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body className="pt-0">
          {renderUserProfile()}
          <hr className="my-3" />
          {renderMenuItems()}
          <hr className="my-3" />
          {renderUtilityItems()}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default SideMenu;