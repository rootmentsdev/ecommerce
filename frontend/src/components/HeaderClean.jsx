import React, { useState, useEffect } from 'react';
import { Navbar, Container, Button, Badge } from 'react-bootstrap';
import { List, Heart } from 'react-bootstrap-icons';
import FavoritesService from '../services/favoritesService';

const HeaderClean = ({ onMenuClick }) => {
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const updateFavoritesCount = () => {
      const count = FavoritesService.getTotalFavoritesCount();
      setFavoritesCount(count);
    };

    updateFavoritesCount();
    window.addEventListener('storage', updateFavoritesCount);
    window.addEventListener('favoritesUpdated', updateFavoritesCount);

    return () => {
      window.removeEventListener('storage', updateFavoritesCount);
      window.removeEventListener('favoritesUpdated', updateFavoritesCount);
    };
  }, []);

  return (
    <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm border-bottom py-2">
      <Container fluid className="px-3">
        <div className="d-flex align-items-center w-100 justify-content-between position-relative">
          {/* Left: Menu Button */}
          <div className="d-flex align-items-center">
            <Button 
              variant="link" 
              onClick={onMenuClick}
              className="text-dark p-2 rounded-2"
              aria-label="Open menu"
            >
              <List size={24} />
            </Button>
          </div>

          {/* Center: Logo */}
          <Navbar.Brand 
            href="/" 
            className="position-absolute start-50 translate-middle-x text-dark fw-bold text-center"
          >
            <div className="fs-4 lh-1">dappr</div>
            <div className="fs-6 fw-normal">SQUAD</div>
          </Navbar.Brand>

          {/* Right: Favorites Button */}
          <div className="d-flex align-items-center">
            <Button 
              variant="link" 
              onClick={() => window.location.href = '/favorites'}
              className="text-dark p-2 rounded-2 position-relative"
              aria-label="Favorites"
            >
              <Heart size={24} />
              {favoritesCount > 0 && (
                <Badge 
                  bg="danger" 
                  pill 
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{fontSize: '10px'}}
                >
                  {favoritesCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default HeaderClean;

