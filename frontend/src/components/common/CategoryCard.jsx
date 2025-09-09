// Reusable CategoryCard component following clean code principles
import React from 'react';
import { Card } from 'react-bootstrap';
import { APP_CONFIG, CARD_SIZES } from '../../constants';

const CategoryCard = ({ 
  category, 
  onClick, 
  className = '' 
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(category);
    }
  };

  const cardStyles = {
    aspectRatio: CARD_SIZES.CATEGORY.ASPECT_RATIO,
    cursor: onClick ? 'pointer' : 'default'
  };

  const imageStyles = {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0
  };

  const overlayStyles = {
    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
  };

  const textStyles = {
    fontFamily: APP_CONFIG.FONTS.PRIMARY,
    fontWeight: '600'
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
