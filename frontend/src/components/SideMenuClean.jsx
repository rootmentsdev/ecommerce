import React, { useState, useEffect } from 'react';
import { Offcanvas, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  HouseDoor, Person, ListUl, Box, Heart, ArrowClockwise, 
  GeoAlt, ChatDots, Gear, BoxArrowRight, X, Cart3, ArrowRepeat
} from 'react-bootstrap-icons';

const SideMenuClean = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(false);

  const MENU_ITEMS = [
    { icon: HouseDoor, label: 'Home', href: '/' },
    { icon: Cart3, label: 'Buy Now', href: '/buy-now' },
    { icon: ArrowRepeat, label: 'Rent Now', href: '/rent-now' },
    { icon: ListUl, label: 'Products', href: '/products' },
    { icon: Heart, label: 'Favorites', href: '/favorites' },
    { icon: ChatDots, label: 'About Us', href: '/about' }
  ];

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

  useEffect(() => {
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 768);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <Offcanvas 
      show={show} 
      onHide={handleClose}
      placement="start"
      style={{width: isDesktop ? '350px' : '85%'}}
    >
      <Offcanvas.Header className="border-0 pb-0">
        <Offcanvas.Title className="w-100 d-flex justify-content-end">
          <Button 
            variant="link" 
            onClick={handleClose}
            className="p-2 text-dark rounded-circle"
            aria-label="Close menu"
          >
            <X size={24} />
          </Button>
        </Offcanvas.Title>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="pt-0">
        <div className="text-center mb-4">
          <div className="fw-bold display-6">dappr</div>
          <div className="fs-5">SQUAD</div>
        </div>

        <hr className="my-3" />

        <ListGroup variant="flush">
          {MENU_ITEMS.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <ListGroup.Item 
                key={index}
                action
                href={item.href}
                onClick={() => handleMenuItemClick(item)}
                className="border-0 py-3 px-3 d-flex align-items-center rounded-2"
              >
                <IconComponent className="me-3" size={20} />
                <span className="fw-medium">{item.label}</span>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default SideMenuClean;

