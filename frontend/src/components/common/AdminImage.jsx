import React, { useState } from 'react';
import { Image } from 'react-bootstrap';

/**
 * AdminImage Component
 * Displays images from the admin image management system with SEO optimization
 */
const AdminImage = ({
  image,
  width,
  height,
  className = '',
  style = {},
  onClick,
  showTitle = false,
  showDescription = false,
  lazy = true,
  fallbackSrc = null,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const imageStyle = {
    width: width || '100%',
    height: height || 'auto',
    objectFit: 'cover',
    transition: 'opacity 0.3s ease',
    opacity: imageLoaded ? 1 : 0.8,
    ...style
  };

  const containerStyle = {
    position: 'relative',
    display: 'inline-block',
    width: width || '100%',
    height: height || 'auto'
  };

  // Fallback placeholder
  const renderFallback = () => (
    <div
      style={{
        ...imageStyle,
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6c757d',
        fontSize: '14px',
        border: '1px solid #dee2e6',
        borderRadius: '4px'
      }}
      className={className}
    >
      {image?.title || 'Image not available'}
    </div>
  );

  if (!image || (!image.imageUrl && !fallbackSrc)) {
    return renderFallback();
  }

  return (
    <div style={containerStyle} onClick={onClick}>
      {!imageError ? (
        <Image
          src={image.imageUrl || fallbackSrc}
          alt={image.altText || image.title || 'Image'}
          title={image.seoTitle || image.title}
          style={imageStyle}
          className={className}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading={lazy ? 'lazy' : 'eager'}
          {...props}
        />
      ) : (
        renderFallback()
      )}
      
      {/* SEO-friendly structured data */}
      {image && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ImageObject",
              "name": image.title,
              "description": image.description,
              "url": image.imageUrl,
              "encodingFormat": `image/${image.metadata?.format || 'jpeg'}`,
              "width": image.metadata?.dimensions?.width,
              "height": image.metadata?.dimensions?.height,
              "keywords": image.tags?.join(', '),
              "dateCreated": image.createdAt
            })
          }}
        />
      )}
      
      {/* Optional title and description */}
      {(showTitle || showDescription) && (
        <div style={{ padding: '8px 0' }}>
          {showTitle && image.title && (
            <h6 style={{ 
              fontFamily: 'Century Gothic, sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              margin: '0 0 4px 0',
              color: '#2c3e50'
            }}>
              {image.title}
            </h6>
          )}
          {showDescription && image.description && (
            <p style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '12px',
              color: '#6c757d',
              margin: 0,
              lineHeight: '1.4'
            }}>
              {image.description.length > 100 
                ? `${image.description.substring(0, 100)}...`
                : image.description
              }
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminImage;
