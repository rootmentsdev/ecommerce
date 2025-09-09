// Reusable ProductCard component following clean code principles
import React from 'react';
import { Card } from 'react-bootstrap';
import { APP_CONFIG, CARD_SIZES } from '../../constants';
import { formatPrice } from '../../utils';

const ProductCard = ({ 
  product, 
  onClick, 
  className = '', 
  showPrice = true,
  imageHeight = CARD_SIZES.PRODUCT.IMAGE_HEIGHT,
  textHeight = CARD_SIZES.PRODUCT.TEXT_HEIGHT
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  const cardStyles = {
    width: CARD_SIZES.PRODUCT.WIDTH,
    height: CARD_SIZES.PRODUCT.HEIGHT,
    cursor: onClick ? 'pointer' : 'default'
  };

  const imageStyles = {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    borderRadius: '8px 8px 0 0'
  };

  const titleStyles = {
    fontFamily: APP_CONFIG.FONTS.PRIMARY,
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '1.3',
    height: '36px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  };

  const priceStyles = {
    fontFamily: APP_CONFIG.FONTS.SECONDARY,
    fontWeight: '700',
    fontSize: '16px',
    color: APP_CONFIG.COLORS.PRIMARY
  };

  return (
    <div 
      style={{ width: CARD_SIZES.PRODUCT.WIDTH, flexShrink: 0 }}
      className={className}
    >
      <Card 
        className="border-0 shadow-sm h-100" 
        style={cardStyles}
        onClick={handleCardClick}
      >
        <div className="position-relative" style={{ height: imageHeight }}>
          <Card.Img 
            variant="top" 
            src={product.image}
            alt={product.name}
            style={imageStyles}
          />
        </div>
        <Card.Body 
          className="p-3 d-flex flex-column justify-content-between" 
          style={{ height: textHeight }}
        >
          <Card.Title className="h6 mb-2" style={titleStyles}>
            {product.name}
          </Card.Title>
          {showPrice && (
            <Card.Text className="h5 mb-0 fw-bold" style={priceStyles}>
              {formatPrice(product.price)}
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductCard;
