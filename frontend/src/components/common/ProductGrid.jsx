import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Heart, HeartFill, Star, ShoppingCart } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import FavoritesService from '../../services/favoritesService';

const ProductGrid = ({ 
  products, 
  loading, 
  title, 
  showFilters = false, 
  onFilterChange,
  gridColumns = 4,
  showAddToCart = false,
  showPrice = true,
  showRentalPrice = false
}) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(new Set(FavoritesService.getFavorites()));

  const handleProductClick = (product) => {
    navigate('/product-details', { state: { product } });
  };

  const handleFavoriteClick = (e, product) => {
    e.stopPropagation();
    const newFavoriteStatus = FavoritesService.toggleFavorite(product);
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavoriteStatus) {
        newFavs.add(product._id);
      } else {
        newFavs.delete(product._id);
      }
      return newFavs;
    });
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    // Add to cart logic here
    console.log('Added to cart:', product);
  };

  const getGridColClass = () => {
    switch (gridColumns) {
      case 2: return 'col-lg-6 col-md-6 col-sm-12';
      case 3: return 'col-lg-4 col-md-6 col-sm-12';
      case 4: return 'col-lg-3 col-md-6 col-sm-12';
      case 6: return 'col-lg-2 col-md-4 col-sm-6';
      default: return 'col-lg-3 col-md-6 col-sm-12';
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Loading products...</p>
        </div>
      </Container>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="info" className="text-center">
          <Alert.Heading>No Products Found</Alert.Heading>
          <p>We're working on adding more products. Please check back later!</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {title && (
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-3" style={{ fontFamily: 'Poppins' }}>
            {title}
          </h2>
          <p className="text-muted">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
      )}

      <Row className="g-4">
        {products.map((product) => (
          <Col key={product._id} className={getGridColClass()}>
            <Card 
              className="h-100 product-card border-0 shadow-sm"
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: '15px'
              }}
              onClick={() => handleProductClick(product)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
            >
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src={product.imageUrl}
                  alt={product.title || product.name}
                  style={{
                    height: '280px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '15px',
                    borderTopRightRadius: '15px'
                  }}
                />
                
                {/* Favorite Button */}
                <Button
                  variant="outline-light"
                  size="sm"
                  className="position-absolute top-0 end-0 m-2 rounded-circle"
                  style={{
                    width: '35px',
                    height: '35px',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={(e) => handleFavoriteClick(e, product)}
                >
                  {favorites.has(product._id) ? (
                    <HeartFill size={16} color="#ff4757" />
                  ) : (
                    <Heart size={16} color="white" />
                  )}
                </Button>

                {/* Category Badge */}
                {product.category && (
                  <div
                    className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}
                  >
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </div>
                )}
              </div>

              <Card.Body className="d-flex flex-column">
                <Card.Title 
                  className="fw-bold mb-2"
                  style={{ 
                    fontFamily: 'Poppins',
                    fontSize: '1.1rem',
                    lineHeight: '1.3'
                  }}
                >
                  {product.title || product.name}
                </Card.Title>

                {product.description && (
                  <Card.Text 
                    className="text-muted mb-3 flex-grow-1"
                    style={{ fontSize: '0.9rem' }}
                  >
                    {product.description.length > 100 
                      ? `${product.description.substring(0, 100)}...` 
                      : product.description
                    }
                  </Card.Text>
                )}

                {/* Product Details */}
                <div className="mb-3">
                  {product.fabric && (
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-muted">Fabric:</small>
                      <small className="fw-medium">{product.fabric}</small>
                    </div>
                  )}
                  
                  {product.color && (
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-muted">Color:</small>
                      <small className="fw-medium">{product.color}</small>
                    </div>
                  )}

                  {product.style && (
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-muted">Style:</small>
                      <small className="fw-medium">{product.style}</small>
                    </div>
                  )}
                </div>

                {/* Price Section */}
                {showPrice && (
                  <div className="mb-3">
                    {product.price && (
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold text-primary fs-5">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.actualPrice && product.actualPrice > product.price && (
                          <span className="text-muted text-decoration-line-through fs-6">
                            ₹{product.actualPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}

                    {showRentalPrice && product.rentalPrice && (
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">Rental:</small>
                        <small className="fw-medium text-success">
                          ₹{product.rentalPrice.toLocaleString()}/day
                        </small>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="d-flex gap-2 mt-auto">
                  <Button
                    variant="outline-primary"
                    className="flex-grow-1"
                    style={{ fontFamily: 'Poppins', fontWeight: '500' }}
                  >
                    View Details
                  </Button>
                  
                  {showAddToCart && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <ShoppingCart size={16} />
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductGrid;
