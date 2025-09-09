// Reusable HorizontalScroll component following clean code principles
import React from 'react';

const HorizontalScroll = ({ 
  children, 
  className = '', 
  gap = '16px',
  hideScrollbar = true 
}) => {
  const containerStyles = {
    scrollbarWidth: hideScrollbar ? 'none' : 'thin',
    msOverflowStyle: hideScrollbar ? 'none' : 'auto',
    gap
  };

  const scrollbarStyles = hideScrollbar ? `
    .horizontal-scroll::-webkit-scrollbar {
      display: none;
    }
  ` : '';

  return (
    <>
      {hideScrollbar && (
        <style>{scrollbarStyles}</style>
      )}
      <div 
        className={`d-flex overflow-auto pb-3 ${hideScrollbar ? 'horizontal-scroll' : ''} ${className}`}
        style={containerStyles}
      >
        {children}
      </div>
    </>
  );
};

export default HorizontalScroll;
