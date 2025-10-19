// Reusable CategoryCard component following clean code principles
import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../../constants';
import FavoritesService from '../../services/favoritesService';

const CategoryCard = ({ 
  category, 
  onClick, 
  className = '',
  showLoveButton = true
}) => {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  // Check if category is in favorites on component mount
  useEffect(() => {
    setIsFavorited(FavoritesService.isFavorited(category));
  }, [category]);

  const handleCardClick = () => {
    if (onClick) {
      onClick(category);
    } else {
      // Default behavior: navigate to category page
      navigate(`/category/${category.category || category.name?.toLowerCase()}`);
    }
  };

  const handleHeartClick = (e) => {
    e.stopPropagation(); // Prevent card click when heart is clicked
    
    const newFavoriteStatus = FavoritesService.toggleFavorite(category);
    setIsFavorited(newFavoriteStatus);
  };

  const cardStyles = {
    aspectRatio: '1',
    cursor: onClick ? 'pointer' : 'default',
    borderRadius: '12px'
  };

  const imageStyles = {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: '12px'
  };

  const overlayStyles = {
    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
  };

  const textStyles = {
    fontFamily: APP_CONFIG.FONTS.SECONDARY,
    fontWeight: '600',
    fontSize: '14px'
  };

  return (
    <Card 
      className={`border-0 shadow-sm position-relative overflow-hidden ${className}`}
      style={cardStyles}
      onClick={handleCardClick}
    >
      <Card.Img 
        src={category.image}
        alt={category.name}
        style={imageStyles}
      />
      
      {/* Love Button */}
      {showLoveButton && (
        <Button 
          variant="light"
          className="position-absolute"
          style={{
            top: '10px',
            right: '10px',
            width: '35px',
            height: '35px',
            backgroundColor: isFavorited ? 'rgba(220, 53, 69, 0.1)' : 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            padding: 0
          }}
          onClick={handleHeartClick}
        >
          {isFavorited ? (
            <HeartFill size={18} className="text-danger" />
          ) : (
            <Heart size={18} className="text-dark" />
          )}
        </Button>
      )}
      
      <div 
        className="position-absolute bottom-0 start-0 end-0 text-white p-3"
        style={overlayStyles}
      >
        <Card.Text className="mb-0 fw-semibold" style={textStyles}>
          {category.name}
        </Card.Text>
      </div>
    </Card>
  );
};

export default CategoryCard;