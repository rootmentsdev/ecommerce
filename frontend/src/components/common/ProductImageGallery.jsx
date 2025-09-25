import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { Heart } from 'react-bootstrap-icons';
import FrontendImageService from '../../services/frontendImageService';
import AdminImage from './AdminImage';
import { APP_CONFIG } from '../../constants';

/**
 * ProductImageGallery Component
 * Displays product images from the admin image management system
 */
const ProductImageGallery = ({
  category = 'product',
  tags = [],
  limit = 12,
  columns = { xs: 2, sm: 2, md: 3, lg: 4 },
  showTitle = true,
  showDescription = false,
  imageHeight = '240px',
  className = '',
  onImageClick = null,
  searchKeyword = ''
}) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadImages();
  }, [category, tags, searchKeyword, limit]);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🖼️ ProductImageGallery loading images:', { category, tags, searchKeyword, limit });

      let fetchedImages = [];

      if (searchKeyword && searchKeyword.trim()) {
        // Search images by keyword
        console.log('🔍 Searching images by keyword:', searchKeyword.trim());
        fetchedImages = await FrontendImageService.searchImages(searchKeyword.trim());
      } else if (tags && tags.length > 0) {
        // Get images by tags
        console.log('🏷️ Getting images by tags:', tags);
        fetchedImages = await FrontendImageService.getImagesByTags(tags);
      } else {
        // Get images by category (now using product categories: buy, rent, featured, trending)
        console.log('📂 Getting images by category:', category);
        fetchedImages = await FrontendImageService.getImagesByCategory(category, { limit });
      }

      console.log('✅ ProductImageGallery loaded images:', fetchedImages.length, fetchedImages);
      setImages(fetchedImages);
    } catch (err) {
      console.error('❌ Error loading images:', err);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image) => {
    console.log('🖼️ ProductImageGallery - Image clicked:', image);
    const product = convertImageToProduct(image);
    console.log('🖼️ ProductImageGallery - Converted product:', product);
    
    if (onImageClick) {
      onImageClick(image);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Loading images...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="warning" className="text-center">
        <p style={{ fontFamily: 'Poppins, sans-serif', margin: 0 }}>
          {error}
        </p>
      </Alert>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-4">
        <p style={{ fontFamily: 'Poppins, sans-serif', color: '#6c757d' }}>
          No images found for this category.
        </p>
      </div>
    );
  }

  // Helper function to convert image to product format for display
  const convertImageToProduct = (image) => {
    console.log('💰 ProductImageGallery - Raw image data:', {
      id: image._id,
      title: image.title,
      price: image.price,
      rentalPrice: image.rentalPrice,
      actualPrice: image.actualPrice,
      securityDeposit: image.securityDeposit
    });
    
    const parseCommaSeparated = (value, defaultValue = []) => {
      if (!value || value.trim() === '') return defaultValue;
      return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    };

    const product = {
      id: image._id,
      name: image.title || 'Untitled Product',
      price: image.price ? parseInt(image.price) : (image.rentalPrice ? parseInt(image.rentalPrice) : 1200),
      rentalPrice: image.rentalPrice ? parseInt(image.rentalPrice) : (image.price ? parseInt(image.price) : 800),
      actualPrice: image.actualPrice ? parseInt(image.actualPrice) : 13000,
      securityDeposit: image.securityDeposit ? parseInt(image.securityDeposit) : 5000,
      image: image.imageUrl,
      category: image.category || 'product',
      occasion: parseCommaSeparated(image.occasions, ['Formal'])[0] || 'Formal', // Use first occasion from admin, fallback to default
      size: parseCommaSeparated(image.sizes, ['L'])[0] || 'L', // Use first size from admin, fallback to default
      type: image.type || 'newArrivals', // Use provided type or default
      productCategory: image.category || 'rent', // Use category field for routing
      description: image.description || 'No description available',
      fabric: image.fabric || 'Premium Fabric',
      color: image.color || 'Various',
      style: image.style || 'Modern Fit',
      occasions: parseCommaSeparated(image.occasions, ['Wedding Guest', 'Corporate Events', 'Reception', 'Cocktail Party']),
      inclusions: parseCommaSeparated(image.inclusions, ['Complete Outfit', 'Accessories included']),
      care: image.care || 'Dry Clean Only',
      sizes: parseCommaSeparated(image.sizes, ['S', 'M', 'L', 'XL', 'XXL']),
      colors: parseCommaSeparated(image.colors || image.color, ['Various']),
      inStock: image.inStock !== false && image.isActive !== false
    };
    
    console.log('💰 ProductImageGallery - Final converted product data:', {
      id: product.id,
      name: product.name,
      price: product.price,
      rentalPrice: product.rentalPrice,
      actualPrice: product.actualPrice,
      securityDeposit: product.securityDeposit
    });
    
    return product;
  };

  const handleHeartClick = (e, image) => {
    e.stopPropagation();
    console.log('Add to wishlist:', image);
    // TODO: Add to wishlist functionality
  };

  const cardStyles = {
    width: '100%',
    height: 'auto',
    cursor: onImageClick ? 'pointer' : 'default',
    borderRadius: '12px'
  };

  const imageContainerStyles = {
    position: 'relative',
    height: imageHeight,
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

  return (
    <div className={className}>
      <Row className="g-3">
        {images.map((image) => {
          const product = convertImageToProduct(image);
          
          return (
            <Col
              key={image._id}
              xs={12 / columns.xs}
              sm={12 / columns.sm}
              md={12 / columns.md}
              lg={12 / columns.lg}
              className="mb-4"
            >
              <Card 
                className="border-0 shadow-sm h-100" 
                style={cardStyles}
                onClick={() => handleImageClick(image)}
              >
                <div style={imageContainerStyles}>
                  <Card.Img 
                    variant="top" 
                    src={image.imageUrl}
                    alt={image.altText || image.title}
                    style={imageStyles}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const placeholder = document.createElement('div');
                      placeholder.style.cssText = `
                        width: 100%;
                        height: 100%;
                        background: #f8f9fa;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #6c757d;
                        font-size: 12px;
                        position: absolute;
                        top: 0;
                        left: 0;
                      `;
                      placeholder.textContent = 'Image not available';
                      e.target.parentNode.style.position = 'relative';
                      e.target.parentNode.appendChild(placeholder);
                    }}
                  />
                  <Button 
                    variant="light"
                    style={heartButtonStyles}
                    onClick={(e) => handleHeartClick(e, image)}
                  >
                    <Heart size={16} className="text-dark" />
                  </Button>
                </div>
                
                <Card.Body className="p-3">
                  <Card.Title className="h6 mb-2" style={titleStyles}>
                    {image.title || 'Untitled Product'}
                  </Card.Title>
                  <Card.Text className="h5 mb-3 fw-bold" style={priceStyles}>
                    ₹{product.price}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ProductImageGallery;
