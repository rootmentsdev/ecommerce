import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Image, Card, Pagination, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import Footer from '../components/Footer';
import { PRODUCTS_DATA } from '../data/products';
import FavoritesService from '../services/favoritesService';
import API_CONFIG from '../config/api';

const Favorites = () => {
  const navigate = useNavigate();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Load favorites from localStorage and admin images
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        
        // Get favorites using centralized service
        const savedFavorites = FavoritesService.getStaticFavorites();
        const adminImageFavorites = FavoritesService.getAdminFavorites();
        
        console.log('🔍 Debug - Saved favorites:', savedFavorites);
        console.log('🔍 Debug - Admin image favorites:', adminImageFavorites);
        
        // Get static products that are favorited
        const staticFavorites = savedFavorites.map(id => PRODUCTS_DATA.find(p => p.id === id)).filter(Boolean);
        
        console.log('🔍 Debug - Static favorites found:', staticFavorites);
        
        // Get admin images that are favorited
        let adminFavorites = [];
        if (adminImageFavorites.length > 0) {
          try {
            // Fetch ALL admin images (not just specific categories)
            console.log('🔍 Fetching admin images from:', `${API_CONFIG.BASE_URL}/images/public?limit=1000`);
            const response = await fetch(`${API_CONFIG.BASE_URL}/images/public?limit=1000`);
            const data = await response.json();
            
            console.log('🔍 API Response:', data);
            
            if (data.success && data.data && data.data.images) {
              // Filter by favorites
              adminFavorites = data.data.images.filter(img => adminImageFavorites.includes(img._id));
              console.log('🔍 Debug - Admin favorites found:', adminFavorites);
              console.log('🔍 Debug - Matching IDs:', adminFavorites.map(img => img._id));
            } else {
              console.log('🔍 No images in response or response format unexpected');
            }
          } catch (error) {
            console.error('Error fetching admin images for favorites:', error);
          }
        }
        
        // Combine both types of favorites
        setFavorites([...staticFavorites, ...adminFavorites]);
        console.log('🔍 Debug - Final favorites set:', [...staticFavorites, ...adminFavorites]);
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Handle removing from favorites
  const handleRemoveFavorite = (item) => {
    console.log('🗑️ Removing favorite:', item);
    
    // Use centralized favorites service
    FavoritesService.removeFromFavorites(item);
    
    // Update local state
    setFavorites(prev => {
      const updated = prev.filter(fav => 
        (item.id && fav.id !== item.id) || (item._id && fav._id !== item._id)
      );
      console.log('💖 Updated favorites list:', updated.length, 'items');
      return updated;
    });
    
    // Force dispatch the event to ensure header updates
    FavoritesService.dispatchFavoritesUpdated();
  };

  // Handle product click
  const handleProductClick = (product) => {
    navigate('/product-details', { state: { product } });
  };

  // Handle menu toggle
  const handleMenuToggle = () => {
    setShowSideMenu(!showSideMenu);
  };

  return (
    <>
      <style>{`
        .pagination-dark .page-link {
          background-color: #000;
          border-color: #000;
          color: #fff;
        }
        .pagination-dark .page-link:hover {
          background-color: #333;
          border-color: #333;
          color: #fff;
        }
        .pagination-dark .page-item.active .page-link {
          background-color: #000;
          border-color: #000;
          color: #fff;
        }
        .pagination-dark .page-item.disabled .page-link {
          background-color: #666;
          border-color: #666;
          color: #999;
        }
      `}</style>
      <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
        <Header onMenuClick={handleMenuToggle} />
        <SideMenu show={showSideMenu} handleClose={() => setShowSideMenu(false)} />
      
      <Container className="py-4">
        {/* Page Header */}
        <div className="text-center mb-5">
          <h1 
            style={{
              fontFamily: 'Poppins',
              fontWeight: 700,
              fontSize: '2.5rem',
              color: '#000',
              marginBottom: '1rem'
            }}
          >
            My Favorites
          </h1>
          <p 
            style={{
              fontFamily: 'Poppins',
              fontWeight: 400,
              fontSize: '1.1rem',
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto 1rem auto'
            }}
          >
            Your saved items and favorite products
          </p>
          {favorites.length > 0 && (
            <Badge bg="secondary" style={{ fontSize: '0.9rem', fontFamily: 'Poppins' }}>
              {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
            </Badge>
          )}
        </div>

        {/* Favorites Grid - Same UI as Product Listing */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3 text-muted">Loading your favorites...</p>
          </div>
        ) : favorites.length > 0 ? (
          <div>
            {/* Pagination logic */}
            {(() => {
              const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
              const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
              const endIndex = startIndex + ITEMS_PER_PAGE;
              const paginatedFavorites = favorites.slice(startIndex, endIndex);

              return (
                <>
                  {/* Product Count Badge */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Badge bg="dark" className="fs-6 fw-normal px-3 py-2">
                      Showing {startIndex + 1}-{Math.min(endIndex, favorites.length)} of {favorites.length} favorites
                    </Badge>
                    {totalPages > 1 && <span className="text-muted">Page {currentPage} of {totalPages}</span>}
                  </div>
            
            {/* Product Grid - Same as Product Listing Page */}
            <Container className="py-3">
              <Row className="g-3">
                {paginatedFavorites.map((item, index) => {
                  const isAdminImage = item._id;
                  const imageSrc = isAdminImage ? item.imageUrl : item.image;
                  const title = isAdminImage ? item.title : item.name;
                  const price = isAdminImage ? (item.price || item.rentalPrice) : item.price;
                  
                  return (
                    <Col key={isAdminImage ? item._id : item.id} xs={6} sm={6} md={4} lg={3}>
                      <Card 
                        className="border-0 shadow-sm h-100"
                        style={{ 
                          borderRadius: '12px',
                          overflow: 'hidden',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          if (isAdminImage) {
                            // Convert admin image to product format
                            const product = {
                              id: item._id,
                              name: item.title,
                              image: item.imageUrl,
                              price: item.price || item.rentalPrice || 0,
                              rentalPrice: item.rentalPrice || item.price || 0,
                              actualPrice: item.actualPrice || 0,
                              securityDeposit: item.securityDeposit || 0,
                              description: item.description || '',
                              category: item.category || 'product'
                            };
                            handleProductClick(product);
                          } else {
                            handleProductClick(item);
                          }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                      >
                        <div className="position-relative">
                          <Card.Img
                            variant="top"
                            src={imageSrc}
                            alt={title}
                            loading="lazy"
                            style={{
                              height: '240px',
                              objectFit: 'cover'
                            }}
                          />
                          
                          {/* Love Button - Same as Product Listing */}
                          <Button 
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-2 rounded-circle p-0"
                            style={{
                              width: '36px',
                              height: '36px',
                              opacity: 0.9
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFavorite(item);
                            }}
                          >
                            <HeartFill size={16} />
                          </Button>
                        </div>
                        
                        <Card.Body className="p-3">
                          <Card.Title className="h6 mb-2" style={{
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            fontSize: '14px',
                            color: '#000',
                            lineHeight: '1.4'
                          }}>
                            {title}
                          </Card.Title>
                          <Card.Text className="h5 mb-0 fw-bold" style={{
                            fontFamily: 'Poppins',
                            fontWeight: 700,
                            fontSize: '16px',
                            color: '#000'
                          }}>
                            ₹{price}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination className="pagination-dark">
                    <Pagination.First 
                      onClick={() => setCurrentPage(1)} 
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                      disabled={currentPage === 1}
                    />
                    
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      if (
                        pageNum === 1 || 
                        pageNum === totalPages || 
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <Pagination.Item
                            key={pageNum}
                            active={pageNum === currentPage}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Pagination.Item>
                        );
                      } else if (
                        pageNum === currentPage - 2 || 
                        pageNum === currentPage + 2
                      ) {
                        return <Pagination.Ellipsis key={pageNum} disabled />;
                      }
                      return null;
                    })}
                    
                    <Pagination.Next 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last 
                      onClick={() => setCurrentPage(totalPages)} 
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </Container>
            </>
            );
          })()}
          </div>
        ) : (
          <div className="text-center py-5">
            <Heart 
              size={64} 
              color="#ccc" 
              style={{ marginBottom: '1rem' }}
            />
            <h3 
              style={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: '1.5rem',
                color: '#666',
                marginBottom: '1rem'
              }}
            >
              No favorites yet
            </h3>
            <p 
              style={{
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontSize: '1rem',
                color: '#999',
                marginBottom: '2rem'
              }}
            >
              Start adding items to your favorites by clicking the heart icon
            </p>
            <Button 
              variant="dark" 
              size="lg"
              onClick={() => navigate('/')}
              style={{
                fontFamily: 'Poppins',
                fontWeight: 600,
                borderRadius: '20px',
                padding: '0.75rem 2rem'
              }}
            >
              Browse Products
            </Button>
          </div>
        )}
      </Container>
      
      <Footer />
    </div>
    </>
  );
};

export default Favorites;
