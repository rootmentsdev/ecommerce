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
  X,
  Cart3,
  ArrowRepeat
} from 'react-bootstrap-icons';
import { APP_CONFIG } from '../constants';

const SideMenu = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(false);

  // Constants following clean code principles
  const MENU_ITEMS = [
    { icon: HouseDoor, label: 'Home', href: '/' },
    { icon: Cart3, label: 'Buy Now', href: '/buy-now' },
    { icon: ArrowRepeat, label: 'Rent Now', href: '/rent-now' },
    // { icon: Person, label: 'Profile', href: '/profile' }, // Coming soon
    { icon: ListUl, label: 'Products', href: '/products' },
    // { icon: Box, label: 'My Orders', href: '/orders' }, // Coming soon
    { icon: Heart, label: 'Favorites', href: '/favorites' },
    // { icon: ArrowClockwise, label: 'How it Works', href: '/how-it-works' }, // Coming soon
    // { icon: GeoAlt, label: 'Store Near Me', href: '/store-locator' }, // Coming soon
    { icon: ChatDots, label: 'About Us', href: '/about' }
  ];

  const UTILITY_ITEMS = [
    // { icon: ChatDots, label: 'Support/ Help Center', href: '/support' }, // Coming soon
    // { icon: Gear, label: 'Settings', href: '/settings' }, // Coming soon
    // { icon: BoxArrowRight, label: 'Log Out', action: 'logout' }
  ];

  // Event handlers following clean code principles
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    handleClose();
    navigate('/');
  };

  const handleMenuItemClick = (item) => {
    if (item.action === 'logout') {
      handleLogout();
    } else if (item.href) {
      navigate(item.href);
      handleClose();
    }
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
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


  const menuItemStyles = {
    fontSize: '1rem'
  };

  // Render methods following single responsibility principle
  const renderCloseButton = () => (
    <Button 
      type="button"
      variant="link" 
      onClick={handleCloseClick}
      className="p-0 text-dark close-btn"
      style={{ 
        fontSize: '1.5rem',
        cursor: 'pointer',
        zIndex: 1000
      }}
      aria-label="Close menu"
    >
      <X size={24} />
    </Button>
  );

  const renderLogo = () => (
    <div className="d-flex justify-content-center mb-4 logo-section">
      <div className="text-center">
        <div 
          className="fw-bold"
          style={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontSize: '1.8rem',
            color: '#000',
            lineHeight: '1.1',
            marginBottom: '0.25rem'
          }}
        >
          dappr
        </div>
        <div 
          style={{
            fontFamily: 'Poppins',
            fontWeight: 400,
            fontSize: '1.2rem',
            color: '#000',
            lineHeight: '1.1'
          }}
        >
          SQUAD
        </div>
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
            cursor: pointer !important;
            pointer-events: auto !important;
            text-decoration: none !important;
          }
          
          .side-menu .close-btn:hover,
          .side-menu .close-btn:active,
          .side-menu .close-btn:focus {
            background-color: #000 !important;
            color: white !important;
            transform: scale(1.1);
            text-decoration: none !important;
          }
          
          .side-menu .logo-section {
            transition: all 0.3s ease;
            padding: 10px;
            border-radius: 8px;
            -webkit-tap-highlight-color: transparent;
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
          }
        `}
      </style>
      <Offcanvas 
        show={show} 
        onHide={handleClose}
        backdrop={true}
        scroll={false}
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
          {renderLogo()}
        <hr className="my-3" />
          {renderMenuItems()}
        {UTILITY_ITEMS.length > 0 && (
          <>
            <hr className="my-3" />
            {renderUtilityItems()}
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
    </>
  );
};

export default SideMenu;