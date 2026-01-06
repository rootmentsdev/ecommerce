import React, { useState, useEffect } from 'react';
import { Container, Button, Image, Badge, Spinner, Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import Footer from '../components/Footer';
import FavoritesService from '../services/favoritesService';
import API_CONFIG from '../config/api';

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
        
        const savedFavorites = FavoritesService.getStaticFavorites();
        const adminImageFavorites = FavoritesService.getAdminFavorites();
        
        // Get admin images that are favorited
        let adminFavorites = [];
        if (adminImageFavorites.length > 0) {
          try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/images/public?limit=1000`);
            const data = await response.json();
            
            if (data.success && data.data && data.data.images) {
              adminFavorites = data.data.images
                .filter(img => adminImageFavorites.includes(img._id))
                .map(item => ({
                  id: item._id,
                  image: item.imageUrl,
                  name: item.title,
                  description: item.description || '',
                  category: item.description || item.category,
                  productCategory: item.category,
                  rentPrice: item.rentalPrice || 0,
                  buyPrice: item.price || 0,
                  originalPrice: item.actualPrice || item.price || 0,
                  rating: 4.5,
                  reviews: Math.floor(Math.random() * 1000) + 100,
                  fabric: item.fabric || '',
                  color: item.color || '',
                  style: item.style || '',
                  inclusions: item.inclusions || '',
                  sizes: item.sizes ? (typeof item.sizes === 'string' ? item.sizes.split(',').map(s => s.trim()) : item.sizes) : ['S', 'M', 'L', 'XL'],
                }));
            }
          } catch (error) {
            console.error('Error fetching admin images for favorites:', error);
          }
        }

        // Also check for products saved by id (from product details page)
        let productFavorites = [];
        if (savedFavorites.length > 0) {
          try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/images/public?limit=1000`);
            const data = await response.json();
            
            if (data.success && data.data && data.data.images) {
              productFavorites = data.data.images
                .filter(img => savedFavorites.includes(img._id))
                .map(item => ({
                  id: item._id,
                  image: item.imageUrl,
                  name: item.title,
                  description: item.description || '',
                  category: item.description || item.category,
                  productCategory: item.category,
                  rentPrice: item.rentalPrice || 0,
                  buyPrice: item.price || 0,
                  originalPrice: item.actualPrice || item.price || 0,
                  rating: 4.5,
                  reviews: Math.floor(Math.random() * 1000) + 100,
                  fabric: item.fabric || '',
                  color: item.color || '',
                  style: item.style || '',
                  inclusions: item.inclusions || '',
                  sizes: item.sizes ? (typeof item.sizes === 'string' ? item.sizes.split(',').map(s => s.trim()) : item.sizes) : ['S', 'M', 'L', 'XL'],
                }));
            }
          } catch (error) {
            console.error('Error fetching products for favorites:', error);
          }
        }
        
        // Combine and deduplicate
        const allFavorites = [...adminFavorites, ...productFavorites];
        const uniqueFavorites = allFavorites.filter((item, index, self) => 
          index === self.findIndex(t => t.id === item.id)
        );
        
        setFavorites(uniqueFavorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleRemoveFavorite = (e, product) => {
    e.stopPropagation();
    FavoritesService.removeFromFavorites({ id: product.id });
    FavoritesService.removeFromFavorites({ _id: product.id });
    setFavorites(prev => prev.filter(fav => fav.id !== product.id));
  };

  const handleProductClick = (product) => {
    navigate('/product-details', { state: { product } });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header onMenuClick={() => setShowSideMenu(true)} />
      
      <Container fluid className="flex-grow-1 bg-white py-4">
        <div style={{ 
          maxWidth: '1440px', 
          paddingLeft: '100px', 
          paddingRight: '100px',
          margin: '0 auto'
        }} className="responsive-container">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-3 d-none d-lg-block">
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>My Favorites</Breadcrumb.Item>
          </Breadcrumb>

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">My Favorites</h4>
            <div className="text-muted" style={{ fontSize: '0.95rem' }}>
              {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3 text-muted">Loading your favorites...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && favorites.length === 0 && (
            <div className="text-center py-5">
              <Heart size={64} className="text-muted mb-3" />
              <h5 className="text-muted mb-3">No favorites yet</h5>
              <p className="text-muted mb-4">Start adding items to your favorites by clicking the heart icon</p>
              <Button variant="dark" onClick={() => navigate('/products')}>
                Browse Products
              </Button>
            </div>
          )}

          {/* Products Grid - Same as AllProductsPage */}
          {!loading && favorites.length > 0 && (
            <div className="products-grid">
              {favorites.map((product) => (
                <div 
                  key={product.id}
                  className="cursor-pointer d-flex flex-column product-card" 
                  onClick={() => handleProductClick(product)}
                >
                  {/* Product Image */}
                  <div className="position-relative product-image-container" style={{ height: '200px', overflow: 'hidden' }}>
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      className="w-100 h-100" 
                      style={{ objectFit: 'cover', display: 'block' }} 
                    />
                    {/* Discount Badge */}
                    {product.originalPrice > product.buyPrice && (
                      <Badge 
                        className="position-absolute bottom-0 start-0 m-2 px-2 py-1 fw-bold" 
                        style={{ 
                          fontSize: '0.6rem',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: '#fff',
                          border: 'none'
                        }}
                      >
                        {Math.round(((product.originalPrice - product.buyPrice) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                    {/* Favorite Button */}
                    <Button
                      variant="light"
                      className="position-absolute top-0 end-0 m-2 rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px', backgroundColor: 'white' }}
                      onClick={(e) => handleRemoveFavorite(e, product)}
                    >
                      <HeartFill size={16} color="#e53935" />
                    </Button>
                  </div>
                  
                  {/* Product Info */}
                  <div className="d-flex flex-column flex-grow-1 p-2" style={{ height: '173px' }}>
                    {/* Category */}
                    <p className="text-muted text-uppercase mb-1" style={{ fontSize: '0.6rem', letterSpacing: '0.3px', fontWeight: 500 }}>
                      {product.category}
                    </p>
                    
                    {/* Product Name */}
                    <h6 className="mb-1 fw-bold" style={{ 
                      fontSize: '0.75rem', 
                      lineHeight: '1.2',
                      color: '#000',
                      height: '1.8rem',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {product.name}
                    </h6>
                    
                    {/* Rating & Reviews */}
                    <div className="d-flex align-items-center gap-1 mb-1" style={{ fontSize: '0.6rem' }}>
                      <span className="text-warning fw-bold" style={{ fontSize: '0.7rem' }}>★</span>
                      <span className="fw-bold" style={{ color: '#000' }}>{product.rating}</span>
                      <span className="text-muted">|</span>
                      <span className="text-primary" style={{ fontSize: '0.6rem' }}>
                        ({product.reviews > 1000 ? `${(product.reviews / 1000).toFixed(1)}K` : product.reviews})
                      </span>
                    </div>
                    
                    {/* Pricing */}
                    <div className="mb-2">
                      <div className="d-flex align-items-baseline gap-1 mb-1">
                        <span style={{ fontSize: '0.6rem', color: '#666' }}>Buy:</span>
                        <span className="fw-bold" style={{ fontSize: '0.85rem', color: '#000' }}>
                          ₹{product.buyPrice.toLocaleString()}
                        </span>
                        {product.originalPrice > product.buyPrice && (
                          <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.65rem' }}>
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="d-flex align-items-baseline gap-1">
                        <span style={{ fontSize: '0.6rem', color: '#666' }}>Rent:</span>
                        <span className="fw-bold" style={{ fontSize: '0.85rem', color: '#FFA726' }}>
                          ₹{product.rentPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* View Details Button */}
                    <Button 
                      variant="dark"
                      className="w-100 rounded-0 fw-bold mt-auto text-uppercase" 
                      style={{ 
                        fontSize: '0.65rem',
                        padding: '0.45rem',
                        letterSpacing: '0.3px',
                        backgroundColor: '#000',
                        color: '#fff',
                        border: 'none'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                    >
                      VIEW DETAILS
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>

      <Footer />
      <SideMenu show={showSideMenu} handleClose={() => setShowSideMenu(false)} />

      <style>{`
        .products-grid {
          display: grid;
          gap: 19px;
          grid-template-columns: repeat(auto-fill, minmax(265.5px, 1fr));
        }
        
        .product-card {
          background: #fff;
          border: 1px solid #eee;
          cursor: pointer;
        }
        
        .responsive-container {
          padding-left: 100px;
          padding-right: 100px;
        }
        
        @media (max-width: 991px) {
          .responsive-container {
            padding-left: 15px !important;
            padding-right: 15px !important;
          }
        }
        
        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          
          .product-image-container {
            height: 180px !important;
          }
        }
        
        @media (max-width: 576px) {
          .responsive-container {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          
          .product-image-container {
            height: 160px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Favorites;
