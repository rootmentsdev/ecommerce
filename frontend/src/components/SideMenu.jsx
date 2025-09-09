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

const SideMenu = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Close the menu
    handleClose();
    
    // Navigate to login page
    navigate('/login');
  };

  const menuItems = [
    { icon: HouseDoor, label: 'Home', href: '/' },
    { icon: Person, label: 'Profile', href: '/profile' },
    { icon: ListUl, label: 'Categories', href: '/categories' },
    { icon: Box, label: 'My Orders', href: '/orders' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: ArrowClockwise, label: 'How it Works', href: '/how-it-works' },
    { icon: GeoAlt, label: 'Store Near Me', href: '/store-locator' }
  ];

  const utilityItems = [
    { icon: ChatDots, label: 'Support/ Help Center', href: '/support' },
    { icon: Gear, label: 'Settings', href: '/settings' },
    { icon: BoxArrowRight, label: 'Log Out', action: 'logout' }
  ];

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
          
          /* Mobile-specific touch effects */
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
        style={{ 
          width: isDesktop ? '350px' : '85%' 
        }}
      >
      <Offcanvas.Header className="border-0 pb-0">
        <Offcanvas.Title className="w-100 d-flex justify-content-end">
          <Button 
            variant="link" 
            onClick={handleClose}
            className="p-0 text-dark close-btn"
            style={{ fontSize: '1.5rem' }}
          >
            <X />
          </Button>
        </Offcanvas.Title>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="pt-0">
        {/* User Profile Section */}
        <div className="d-flex align-items-center mb-4 profile-section">
          <Image 
            src="https://via.placeholder.com/60x60/8B4513/FFFFFF?text=JW" 
            roundedCircle 
            className="me-3"
            style={{ width: '60px', height: '60px' }}
          />
          <div>
            <h5 className="mb-1 fw-bold text-dark" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '600', letterSpacing: '-0.02em' }}>John Wick</h5>
            <p className="mb-0 text-muted small" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '400', letterSpacing: '-0.01em' }}>+91 98765 43210</p>
          </div>
        </div>

        <hr className="my-3" />

        {/* Main Navigation Links */}
        <ListGroup variant="flush" className="mb-3">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <ListGroup.Item 
                key={index}
                action 
                href={item.href}
                className="border-0 py-3 px-3 d-flex align-items-center menu-item"
                style={{ fontSize: '1rem' }}
              >
                <IconComponent className="me-3 text-dark" size={20} />
                <span className="text-dark" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '500', letterSpacing: '-0.01em' }}>{item.label}</span>
              </ListGroup.Item>
            );
          })}
        </ListGroup>

        <hr className="my-3" />

        {/* Utility/Support Links */}
        <ListGroup variant="flush">
          {utilityItems.map((item, index) => {
            const IconComponent = item.icon;
            const isLogout = item.action === 'logout';
            
            return (
              <ListGroup.Item 
                key={index}
                action={!isLogout}
                href={isLogout ? undefined : item.href}
                onClick={isLogout ? handleLogout : undefined}
                className="border-0 py-3 px-3 d-flex align-items-center menu-item"
                style={{ fontSize: '1rem' }}
              >
                <IconComponent className="me-3 text-dark" size={20} />
                <span className="text-dark" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '500', letterSpacing: '-0.01em' }}>{item.label}</span>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Offcanvas.Body>
    </Offcanvas>
    </>
  );
};

export default SideMenu;
