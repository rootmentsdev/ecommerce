// Reusable FeatureIcon component following clean code principles
import React from 'react';
import { APP_CONFIG } from '../../constants';

const FeatureIcon = ({ 
  icon: IconComponent, 
  title, 
  className = '' 
}) => {
  const containerStyles = {
    maxWidth: '120px',
    margin: '0 auto'
  };

  const iconContainerStyles = {
    width: '48px',
    height: '48px'
  };

  const textStyles = {
    fontFamily: APP_CONFIG.FONTS.SECONDARY,
    fontSize: '12px',
    lineHeight: '1.3'
  };

  return (
    <div 
      className={`d-flex flex-column align-items-center ${className}`}
      style={containerStyles}
    >
      <div 
        className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-2"
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
    </div>
  );
};

export default FeatureIcon;
