import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import FrontendImageService from '../../services/frontendImageService';
import AdminImage from './AdminImage';

/**
 * ProductImageGallery Component
 * Displays product images from the admin image management system
 */
const ProductImageGallery = ({
  category = 'product',
  tags = [],
  limit = 12,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  showTitle = true,
  showDescription = false,
  imageHeight = '200px',
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
        // Get images by category
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

  return (
    <div className={className}>
      <Row>
        {images.map((image) => (
          <Col
            key={image._id}
            xs={12 / columns.xs}
            sm={12 / columns.sm}
            md={12 / columns.md}
            lg={12 / columns.lg}
            className="mb-4"
          >
            <Card 
              style={{ 
                height: '100%',
                cursor: onImageClick ? 'pointer' : 'default',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              className={onImageClick ? 'hover-card' : ''}
              onMouseEnter={(e) => {
                if (onImageClick) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (onImageClick) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{ height: imageHeight, overflow: 'hidden' }}>
                <AdminImage
                  image={image}
                  height={imageHeight}
                  onClick={() => handleImageClick(image)}
                  style={{
                    borderTopLeftRadius: 'calc(0.375rem - 1px)',
                    borderTopRightRadius: 'calc(0.375rem - 1px)',
                    borderBottomLeftRadius: showTitle || showDescription ? '0' : 'calc(0.375rem - 1px)',
                    borderBottomRightRadius: showTitle || showDescription ? '0' : 'calc(0.375rem - 1px)'
                  }}
                />
              </div>
              
              {(showTitle || showDescription) && (
                <Card.Body style={{ padding: '12px' }}>
                  {showTitle && image.title && (
                    <Card.Title 
                      style={{ 
                        fontFamily: 'Century Gothic, sans-serif',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: showDescription ? '8px' : '0',
                        color: '#2c3e50'
                      }}
                    >
                      {image.title}
                    </Card.Title>
                  )}
                  
                  {showDescription && image.description && (
                    <Card.Text 
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        color: '#6c757d',
                        marginBottom: '0',
                        lineHeight: '1.4'
                      }}
                    >
                      {image.description.length > 80 
                        ? `${image.description.substring(0, 80)}...`
                        : image.description
                      }
                    </Card.Text>
                  )}

                  {/* SEO and metadata info */}
                  {image.tags && image.tags.length > 0 && (
                    <div className="mt-2">
                      {image.tags.slice(0, 3).map((tag, index) => (
                        <small
                          key={index}
                          style={{
                            backgroundColor: '#e9ecef',
                            color: '#495057',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            marginRight: '4px',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                        >
                          {tag}
                        </small>
                      ))}
                    </div>
                  )}
                </Card.Body>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductImageGallery;
