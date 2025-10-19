import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { ArrowLeft, Search, Funnel, Heart, HeartFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import FavoritesService from '../services/favoritesService';

// Import reusable components
import ProductCard from '../components/common/ProductCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';
import FilterSidebar from '../components/common/FilterSidebar';
import ModernSearchBar from '../components/common/ModernSearchBar';
import ProductImageGallery from '../components/common/ProductImageGallery';

// Import services
import ImageService from '../services/imageService';
import SEOService from '../services/seoService';

// Import constants and utilities
import { APP_CONFIG } from '../constants';

const BuyProducts = () => {
  const navigate = useNavigate();
  
  // State for admin images
  const [adminImages, setAdminImages] = useState([]);
  const [loadingAdminImages, setLoadingAdminImages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminImageFavorites, setAdminImageFavorites] = useState(new Set());

  // State management
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    priceRange: [1000, 10000],
    categories: [],
    occasions: [],
    sizes: []
  });

  // Initialize SEO for buy products page
  useEffect(() => {
    SEOService.initializeBuyPageSEO();
  }, []);

  // Load buy-specific images
  useEffect(() => {
    const loadBuyImages = async () => {
      try {
        setLoadingAdminImages(true);
        
        // Load saved admin image favorites from localStorage
        const savedAdminFavorites = FavoritesService.getAdminFavorites();
        setAdminImageFavorites(new Set(savedAdminFavorites));
        
        console.log('🎯 BuyProducts - Fetching buy images...');
        const response = await ImageService.getImagesByCategory('buy');
        
        if (response.success) {
          setAdminImages(response.data.images || []);
          console.log('🎯 BuyProducts - Loaded buy images:', response.data.images?.length || 0);
          console.log('🎯 BuyProducts - Images data:', response.data.images?.map(img => ({
            id: img._id,
            title: img.title,
            category: img.category,
            categories: img.categories
          })));
        } else {
          setAdminImages([]);
        }
      } catch (error) {
        console.error('Error loading buy images:', error);
        setAdminImages([]);
      } finally {
        setLoadingAdminImages(false);
      }
    };

    loadBuyImages();
  }, []);

  // Event handlers
  const handleShowSideMenu = () => setShowSideMenu(true);
  const handleCloseSideMenu = () => setShowSideMenu(false);
  const handleFilterToggle = () => setShowFilterSidebar(!showFilterSidebar);
  const handleSearchChange = (query) => setSearchQuery(query);

  const handleImageClick = (image) => {
    console.log('Buy product clicked:', image);
    const product = {
      id: image._id,
      name: image.title,
      image: image.imageUrl,
      price: image.price || image.actualPrice,
      description: image.description,
      category: 'buy',
      fabric: image.fabric,
      color: image.color,
      style: image.style
    };
    
    navigate('/product-details', { 
      state: { 
        product,
        enquiryType: 'buy'
      } 
    });
  };

  // Handle admin image favorite toggle
  const handleAdminImageFavorite = (imageId, e) => {
    e.stopPropagation();
    
    // Find the image object to toggle
    const image = adminImages.find(img => img._id === imageId);
    
    if (image) {
      // Use centralized favorites service
      const newFavoriteStatus = FavoritesService.toggleFavorite(image);
      
      // Update component state
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

  const handleApplyFilters = (filters) => {
    console.log('Applied filters:', filters);
    setAppliedFilters(filters);
    setShowFilterSidebar(false);
  };

  // Filter images based on applied filters
  const getFilteredImages = () => {
    let filtered = [...adminImages];
    
    console.log('🎯 BuyProducts - Filtering images with filters:', appliedFilters);
    console.log('🎯 BuyProducts - Total images before filtering:', adminImages.length);
    
    // Debug: Log all image prices to see what we're working with
    console.log('🎯 BuyProducts - All image prices:', adminImages.map(img => ({
      title: img.title,
      price: img.price,
      actualPrice: img.actualPrice,
      finalPrice: img.price || img.actualPrice || 0
    })));

    // Filter by price range
    if (appliedFilters.priceRange && appliedFilters.priceRange.length === 2) {
      const [minPrice, maxPrice] = appliedFilters.priceRange;
      console.log('🎯 BuyProducts - Filtering by price range:', minPrice, '-', maxPrice);
      filtered = filtered.filter(image => {
        // Convert price to number and handle string prices
        let price = image.price || image.actualPrice || 0;
        
        // Convert string to number if needed
        if (typeof price === 'string') {
          // Remove currency symbols and commas, then convert to number
          price = parseFloat(price.replace(/[₹,]/g, '')) || 0;
        } else if (typeof price !== 'number') {
          price = parseFloat(price) || 0;
        }
        
        const matches = price >= minPrice && price <= maxPrice;
        
        console.log('🎯 BuyProducts - Price filter check:', {
          imageTitle: image.title,
          originalPrice: image.price || image.actualPrice,
          convertedPrice: price,
          priceType: typeof (image.price || image.actualPrice),
          minPrice: minPrice,
          maxPrice: maxPrice,
          matches: matches
        });
        
        return matches;
      });
      console.log('🎯 BuyProducts - Images after price filtering:', filtered.length);
    }

    // Filter by categories
    if (appliedFilters.categories && appliedFilters.categories.length > 0) {
      filtered = filtered.filter(image => {
        const imageCategories = image.categories || [image.category];
        return appliedFilters.categories.some(cat => {
          // Simple category matching - check if image title or category contains the selected category
          const imageTitle = (image.title || '').toLowerCase();
          const imageCategory = (image.category || '').toLowerCase();
          const selectedCategory = cat.toLowerCase();
          
          return imageTitle.includes(selectedCategory) || 
                 imageCategory.includes(selectedCategory) ||
                 imageCategories.some(imgCat => imgCat.toLowerCase().includes(selectedCategory));
        });
      });
    }

    // Filter by occasions
    if (appliedFilters.occasions && appliedFilters.occasions.length > 0) {
      filtered = filtered.filter(image => {
        const occasions = image.occasions || [];
        return appliedFilters.occasions.some(occasion => 
          occasions.some(imgOccasion => 
            imgOccasion.toLowerCase().includes(occasion.toLowerCase()) ||
            occasion.toLowerCase().includes(imgOccasion.toLowerCase())
          )
        );
      });
    }

    // Filter by sizes
    if (appliedFilters.sizes && appliedFilters.sizes.length > 0) {
      filtered = filtered.filter(image => {
        const sizes = image.sizes ? image.sizes.split(',').map(s => s.trim()) : [];
        return appliedFilters.sizes.some(size => 
          sizes.some(imgSize => 
            imgSize.toLowerCase().includes(size.toLowerCase()) ||
            size.toLowerCase().includes(imgSize.toLowerCase())
          )
        );
      });
    }

    return filtered;
  };

  const renderPageHeader = () => (
    <Container className="py-3">
      <Row className="align-items-center mb-3">
        <Col xs="auto">
          <Button 
            variant="link" 
            className="p-0 text-decoration-none"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={24} />
          </Button>
        </Col>
        <Col>
          <h1 style={{ fontFamily: 'Century Gothic', fontSize: '1.5rem', margin: 0 }}>
            Buy Products
          </h1>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <ModernSearchBar
            value={searchQuery}
            onSearchChange={handleSearchChange}
            onFilterClick={handleFilterToggle}
            placeholder="Search buy products..."
          />
        </Col>
      </Row>
    </Container>
  );

  const renderBuyImages = () => {
    try {
      return (
        <Container className="py-3">
          {/* Show loading state */}
          {loadingAdminImages && (
            <div className="text-center py-4">
              <p style={{ fontFamily: 'Century Gothic' }}>Loading buy products...</p>
            </div>
          )}
          
          
          {/* Show filtered images */}
          <Row>
            <Col>
              {(() => {
                const filteredImages = getFilteredImages();
                
                // Apply search filter
                const searchFiltered = searchQuery 
                  ? filteredImages.filter(image => 
                      image.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      image.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      image.altText?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  : filteredImages;

                if (searchFiltered.length === 0) {
                  return (
                    <div className="text-center py-5">
                      <p style={{ fontFamily: 'Century Gothic', color: '#6c757d' }}>
                        No products found matching your criteria.
                      </p>
                      <p style={{ fontFamily: 'Century Gothic', color: '#6c757d' }}>
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  );
                }

                return (
                  <Row className="g-3">
                    {searchFiltered.map((image, index) => (
                      <Col key={image._id || index} xs={6} sm={6} md={4} lg={3}>
                        <div 
                          className="product-card"
                          onClick={() => handleImageClick(image)}
                          style={{
                            cursor: 'pointer',
                            border: '1px solid #e9ecef',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            backgroundColor: '#fff'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div 
                            style={{
                              width: '100%',
                              height: '240px',
                              backgroundImage: `url(${image.imageUrl})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              position: 'relative'
                            }}
                          >
                            <div 
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: adminImageFavorites.has(image._id) ? 'rgba(220, 53, 69, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onClick={(e) => handleAdminImageFavorite(image._id, e)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = adminImageFavorites.has(image._id) ? 'rgba(220, 53, 69, 0.2)' : 'rgba(255, 255, 255, 1)';
                                e.currentTarget.style.transform = 'scale(1.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = adminImageFavorites.has(image._id) ? 'rgba(220, 53, 69, 0.1)' : 'rgba(255, 255, 255, 0.9)';
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              {adminImageFavorites.has(image._id) ? (
                                <HeartFill size={18} color="#dc3545" />
                              ) : (
                                <Heart size={18} color="#dc3545" />
                              )}
                            </div>
                          </div>
                          <div style={{ padding: '12px' }}>
                            <h6 
                              style={{ 
                                fontFamily: 'Century Gothic', 
                                fontWeight: '600',
                                marginBottom: '8px',
                                fontSize: '14px',
                                lineHeight: '1.3'
                              }}
                            >
                              {image.title || 'Product'}
                            </h6>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span 
                                style={{ 
                                  fontFamily: 'Century Gothic', 
                                  fontWeight: '700',
                                  color: '#000',
                                  fontSize: '16px'
                                }}
                              >
                                ₹{(image.price || image.actualPrice || 0).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                );
              })()}
            </Col>
          </Row>
        </Container>
      );
    } catch (error) {
      console.error('Error in renderBuyImages:', error);
      return (
        <Container className="py-3">
          <div className="text-center py-4">
            <p style={{ fontFamily: 'Century Gothic', color: '#dc3545' }}>
              Error loading buy products. Please try again.
            </p>
          </div>
        </Container>
      );
    }
  };

  try {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header onMenuClick={handleShowSideMenu} />
        <SideMenu show={showSideMenu} handleClose={handleCloseSideMenu} />
        
        <main className="flex-grow-1">
          {renderPageHeader()}
          {renderBuyImages()}
        </main>
        
         <FilterSidebar 
           show={showFilterSidebar} 
           handleClose={() => setShowFilterSidebar(false)}
           onApplyFilters={handleApplyFilters}
           initialFilters={appliedFilters}
         />
        
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error in BuyProducts component:', error);
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header onMenuClick={handleShowSideMenu} />
        <main className="flex-grow-1">
          <Container className="py-5">
            <div className="text-center">
              <h2 style={{ fontFamily: 'Century Gothic', color: '#dc3545' }}>
                Something went wrong
              </h2>
              <p style={{ fontFamily: 'Century Gothic' }}>
                Please refresh the page or try again later.
              </p>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }
};

export default BuyProducts;
