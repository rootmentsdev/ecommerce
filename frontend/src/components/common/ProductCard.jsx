// Reusable ProductCard component following clean code principles
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Heart, Cart } from 'react-bootstrap-icons';
import { APP_CONFIG } from '../../constants';

const ProductCard = ({ 
  product, 
  onClick, 
  onAddToCart,
  className = '', 
  showPrice = true,
  showAddToCart = false
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation(); // Prevent card click when button is clicked
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleHeartClick = (e) => {
    e.stopPropagation(); // Prevent card click when heart is clicked
    console.log('Add to wishlist:', product);
    // TODO: Add to wishlist functionality
  };

  const cardStyles = {
    width: '100%',
    height: 'auto',
    cursor: onClick ? 'pointer' : 'default',
    borderRadius: '12px'
  };

  const imageContainerStyles = {
    position: 'relative',
    height: '240px',
    overflow: 'hidden',
    borderRadius: '12px 12px 0px 0px'
  };

  const imageStyles = {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    borderRadius: '12px 12px 0px 0px'
  };

  const heartButtonStyles = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const titleStyles = {
    fontFamily: APP_CONFIG.FONTS.SECONDARY,
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '1.3',
    color: '#333333'
  };

  const priceStyles = {
    fontFamily: APP_CONFIG.FONTS.SECONDARY,
    fontWeight: '700',
    fontSize: '16px',
    color: '#000000'
  };

  const addToCartButtonStyles = {
    fontFamily: APP_CONFIG.FONTS.SECONDARY,
    fontWeight: '500',
    fontSize: '12px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    backgroundColor: '#ffffff',
    color: '#000000'
  };

  return (
    <div className={className}>
      <Card 
        className="border-0 shadow-sm h-100" 
        style={cardStyles}
        onClick={handleCardClick}
      >
        <div style={imageContainerStyles}>
          <Card.Img 
            variant="top" 
            src={product.image}
            alt={product.name}
            style={imageStyles}
          />
          <Button 
            variant="light"
            style={heartButtonStyles}
            onClick={handleHeartClick}
          >
            <Heart size={16} className="text-dark" />
          </Button>
        </div>
        
        <Card.Body className="p-3">
          <Card.Title className="h6 mb-2" style={titleStyles}>
            {product.name}
          </Card.Title>
          {showPrice && (
            <Card.Text className="h5 mb-3 fw-bold" style={priceStyles}>
              ₹{product.price}
            </Card.Text>
          )}
          
          {showAddToCart && (
            <Button 
              variant="outline-secondary"
              size="sm"
              className="w-100 d-flex align-items-center justify-content-center gap-2"
              style={addToCartButtonStyles}
              onClick={handleAddToCartClick}
            >
              <Cart size={14} />
              Add to Cart
            </Button>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductCard;