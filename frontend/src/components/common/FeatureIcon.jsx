// Reusable FeatureIcon component following clean code principles
import React from 'react';
import { Card } from 'react-bootstrap';
import { APP_CONFIG } from '../../constants';

const FeatureIcon = ({ 
  icon: IconComponent, 
  title, 
  className = '' 
}) => {
  const cardStyles = {
    backgroundColor: '#ffffff',
    borderRadius: '12px 12px 0px 0px',
    minHeight: '120px',
    border: 'none'
  };

  const iconContainerStyles = {
    width: '48px',
    height: '48px'
  };

  const textStyles = {
    fontFamily: APP_CONFIG.FONTS.SECONDARY,
    fontSize: '12px',
    lineHeight: '1.3',
    color: '#333333'
  };

  return (
    <Card 
      className={`border-0 h-100 ${className}`}
      style={cardStyles}
    >
      <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
        <div 
          className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-3"
          style={iconContainerStyles}
        >
          <IconComponent size={20} className="text-dark" />
        </div>
        <small 
          className="text-center fw-medium"
          style={textStyles}
        >
          {title}
        </small>
      </Card.Body>
    </Card>
  );
};

export default FeatureIcon;