import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Image, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import Footer from '../components/Footer';
import { PRODUCTS_DATA } from '../data/products';
import FavoritesService from '../services/favoritesService';

const Favorites = () => {
  const navigate = useNavigate();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

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
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/images/public?limit=1000`);
            const data = await response.json();
            
            if (data.success && data.data.images) {
              // Filter by favorites
              adminFavorites = data.data.images.filter(img => adminImageFavorites.includes(img._id));
              console.log('🔍 Debug - Admin favorites found:', adminFavorites);
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
    // Use centralized favorites service
    FavoritesService.removeFromFavorites(item);
    
    // Update local state
    setFavorites(prev => prev.filter(fav => 
      (item.id && fav.id !== item.id) || (item._id && fav._id !== item._id)
    ));
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
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Header onMenuClick={handleMenuToggle} />
      <SideMenu show={showSideMenu} onHide={() => setShowSideMenu(false)} />
      
      <Container className="py-4">
        {/* Page Header */}
        <div className="text-center mb-5">
          <h1 
            style={{
              fontFamily: 'Century Gothic',
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
              fontFamily: 'Century Gothic',
              fontWeight: 400,
              fontSize: '1.1rem',
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Your saved items and favorite products
          </p>
        </div>

        {/* Favorites Grid - Same UI as Product Listing */}
        {loading ? (
          <div className="text-center py-5">
            <p style={{ fontFamily: 'Century Gothic' }}>Loading your favorites...</p>
          </div>
        ) : favorites.length > 0 ? (
          <div>
            <h2 
              style={{
                fontFamily: 'Century Gothic',
                fontWeight: 700,
                fontSize: '1.5rem',
                marginBottom: '2rem',
                color: '#000'
              }}
            >
              {favorites.length} Favorite Item{favorites.length !== 1 ? 's' : ''}
            </h2>
            
            {/* Product Grid - Same as Product Listing Page */}
            <Container className="py-3">
              <Row className="g-3">
                {favorites.map((item, index) => {
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
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
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
                        <div style={{ position: 'relative' }}>
                          <Card.Img
                            variant="top"
                            src={imageSrc}
                            alt={title}
                            style={{
                              width: '100%',
                              height: '240px',
                              objectFit: 'cover'
                            }}
                          />
                          
                          {/* Love Button - Same as Product Listing */}
                          <Button 
                            variant="light"
                            className="position-absolute"
                            style={{
                              top: '8px',
                              right: '8px',
                              width: '32px',
                              height: '32px',
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              border: 'none',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              padding: 0
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFavorite(item);
                            }}
                          >
                            <HeartFill size={16} className="text-danger" />
                          </Button>
                        </div>
                        
                        <Card.Body className="p-3">
                          <Card.Title className="h6 mb-2" style={{
                            fontFamily: 'Century Gothic',
                            fontWeight: 600,
                            fontSize: '14px',
                            color: '#000',
                            lineHeight: '1.4'
                          }}>
                            {title}
                          </Card.Title>
                          <Card.Text className="h5 mb-0 fw-bold" style={{
                            fontFamily: 'Century Gothic',
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
            </Container>
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
                fontFamily: 'Century Gothic',
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
                fontFamily: 'Century Gothic',
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
                fontFamily: 'Century Gothic',
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
  );
};

export default Favorites;
