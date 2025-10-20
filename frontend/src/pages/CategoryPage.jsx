import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Image, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, HeartFill, ChevronRight } from 'react-bootstrap-icons';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import Footer from '../components/Footer';
import HorizontalScroll from '../components/common/HorizontalScroll';
import { PRODUCTS_DATA } from '../data/products';
import ImageService from '../services/imageService';
import FavoritesService from '../services/favoritesService';

const CategoryPage = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [categoryImages, setCategoryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminImageFavorites, setAdminImageFavorites] = useState(new Set());

  // Load category images
  useEffect(() => {
    const loadCategoryImages = async () => {
      try {
        setLoading(true);
        
        // Get admin images for this category
        const response = await ImageService.getImagesByCategory(category);
        
        if (response.success) {
          setCategoryImages(response.data.images || []);
        } else {
          setCategoryImages([]);
        }
      } catch (error) {
        console.error('Error loading category images:', error);
        setCategoryImages([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      loadCategoryImages();
    }
  }, [category]);

  // Load saved favorites from localStorage
  useEffect(() => {
    const savedAdminFavorites = FavoritesService.getAdminFavorites();
    setAdminImageFavorites(new Set(savedAdminFavorites));
  }, []);

  // Handle admin image favorite toggle
  const handleAdminImageFavorite = (imageId, e) => {
    e.stopPropagation();
    const image = categoryImages.find(img => img._id === imageId);
    if (image) {
      const newFavoriteStatus = FavoritesService.toggleFavorite(image);
      setAdminImageFavorites(prev => {
        const newFavorites = new Set(prev);
        if (newFavoriteStatus) {
          newFavorites.add(imageId);
        } else {
          newFavorites.delete(imageId);
        }
        return newFavorites;
      });
    }
  };

  // Handle product click
  const handleProductClick = (product) => {
    navigate('/product-details', { state: { product } });
  };

  // Handle menu toggle
  const handleMenuToggle = () => {
    setShowSideMenu(!showSideMenu);
  };

  // Get category display name
  const getCategoryDisplayName = () => {
    const categoryNames = {
      'suits': 'Suits',
      'kurtas': 'Kurtas',
      'bandhgalas': 'Bandhgalas',
      'formal': 'Formal Wear',
      'traditional': 'Traditional',
      'shirts': 'Shirts',
      'pants': 'Pants',
      'accessories': 'Accessories',
      'shoes': 'Shoes',
      'jackets': 'Jackets',
      'buy': 'Buy Now',
      'rent': 'Rent Now',
      'featured': 'Featured',
      'trending': 'Trending',
      'topCategories': 'Top Categories'
    };
    return categoryNames[category] || category?.charAt(0).toUpperCase() + category?.slice(1);
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
            {getCategoryDisplayName()}
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
            Explore our collection of {getCategoryDisplayName().toLowerCase()}
          </p>
        </div>

        {/* Category Images Grid */}
        {loading ? (
          <div className="text-center py-5">
            <p style={{ fontFamily: 'Century Gothic' }}>Loading {getCategoryDisplayName().toLowerCase()}...</p>
          </div>
        ) : categoryImages.length > 0 ? (
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
              {categoryImages.length} Item{categoryImages.length !== 1 ? 's' : ''} in {getCategoryDisplayName()}
            </h2>
            
            <HorizontalScroll>
              {categoryImages.map((item, index) => {
                return (
                  <div key={item._id} style={{ width: '250px', flexShrink: 0 }}>
                    <Card 
                      style={{ 
                        border: 'none',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
                        <Image 
                          src={item.imageUrl} 
                          alt={item.title}
                          style={{
                            width: '100%',
                            height: '300px',
                            objectFit: 'cover'
                          }}
                        />
                        
                        {/* Love Button */}
                        <div 
                          className="position-absolute"
                          style={{
                            top: '10px',
                            right: '10px',
                            width: '35px',
                            height: '35px',
                            backgroundColor: adminImageFavorites.has(item._id) ? 'rgba(220, 53, 69, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onClick={(e) => handleAdminImageFavorite(item._id, e)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = adminImageFavorites.has(item._id) ? 'rgba(220, 53, 69, 0.2)' : 'rgba(255, 255, 255, 1)';
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = adminImageFavorites.has(item._id) ? 'rgba(220, 53, 69, 0.1)' : 'rgba(255, 255, 255, 0.9)';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          {adminImageFavorites.has(item._id) ? (
                            <HeartFill size={18} color="#dc3545" />
                          ) : (
                            <Heart size={18} color="#000" />
                          )}
                        </div>
                        
                        {/* Navigation Arrow */}
                        <div 
                          className="position-absolute"
                          style={{
                            bottom: '15px',
                            right: '15px',
                            width: '30px',
                            height: '30px',
                            backgroundColor: '#000',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                          }}
                          onClick={() => handleProductClick({
                            id: item._id,
                            name: item.title,
                            image: item.imageUrl,
                            price: item.price || 0,
                            rentalPrice: item.rentalPrice || 0
                          })}
                        >
                          <ChevronRight 
                            size={14} 
                            color="white"
                          />
                        </div>
                      </div>
                      
                      <Card.Body style={{ padding: '1rem' }}>
                        <Card.Title 
                          style={{
                            fontFamily: 'Century Gothic',
                            fontWeight: 700,
                            fontSize: '1rem',
                            color: '#000',
                            marginBottom: '0.5rem'
                          }}
                        >
                          {item.title}
                        </Card.Title>
                        <Card.Text 
                          style={{
                            fontFamily: 'Century Gothic',
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            color: '#000',
                            margin: 0
                          }}
                        >
                          ₹{item.price || item.rentalPrice}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                );
              })}
            </HorizontalScroll>
          </div>
        ) : (
          <div className="text-center py-5">
            <h3 
              style={{
                fontFamily: 'Century Gothic',
                fontWeight: 700,
                fontSize: '1.5rem',
                color: '#666',
                marginBottom: '1rem'
              }}
            >
              No items found
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
              No items available in {getCategoryDisplayName().toLowerCase()} category yet
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
              Browse All Products
            </Button>
          </div>
        )}
      </Container>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
