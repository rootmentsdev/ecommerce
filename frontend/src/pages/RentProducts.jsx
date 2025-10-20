import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Pagination, Card, Badge, Spinner } from 'react-bootstrap';
import { ArrowLeft, Search, Funnel, Heart, HeartFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import FavoritesService from '../services/favoritesService';

// Import reusable components
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';
import FilterSidebar from '../components/common/FilterSidebar';
import ModernSearchBar from '../components/common/ModernSearchBar';

// Import services
import ImageService from '../services/imageService';
import SEOService from '../services/seoService';

// Import constants and utilities
import { APP_CONFIG } from '../constants';

const RentProducts = () => {
  const navigate = useNavigate();
  
  // State for admin images
  const [adminImages, setAdminImages] = useState([]);
  const [loadingAdminImages, setLoadingAdminImages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminImageFavorites, setAdminImageFavorites] = useState(new Set());

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // State management
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    priceRange: [1000, 10000],
    categories: [],
    occasions: [],
    sizes: []
  });

  // Initialize SEO for rent products page
  useEffect(() => {
    SEOService.initializeRentPageSEO();
  }, []);

  // Load rent-specific images
  useEffect(() => {
    const loadRentImages = async () => {
      try {
        setLoadingAdminImages(true);
        
        // Load saved admin image favorites from localStorage
        const savedAdminFavorites = FavoritesService.getAdminFavorites();
        setAdminImageFavorites(new Set(savedAdminFavorites));
        
        console.log('🎯 RentProducts - Fetching rent images...');
        const response = await ImageService.getImagesByCategory('rent');
        
        if (response.success) {
          setAdminImages(response.data.images || []);
          console.log('🎯 RentProducts - Loaded rent images:', response.data.images?.length || 0);
          console.log('🎯 RentProducts - Images data:', response.data.images?.map(img => ({
            id: img._id,
            title: img.title,
            category: img.category,
            categories: img.categories,
            price: img.price,
            rentalPrice: img.rentalPrice,
            actualPrice: img.actualPrice
          })));
        } else {
          setAdminImages([]);
        }
      } catch (error) {
        console.error('Error loading rent images:', error);
        setAdminImages([]);
      } finally {
        setLoadingAdminImages(false);
      }
    };

    loadRentImages();
  }, []);

  // Load saved favorites from localStorage
  useEffect(() => {
    const savedAdminFavorites = FavoritesService.getAdminFavorites();
    setAdminImageFavorites(new Set(savedAdminFavorites));
  }, []);

  // Reset to page 1 when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters, searchQuery]);

  // Debug: Log when appliedFilters change
  useEffect(() => {
    console.log('🎯 RentProducts - appliedFilters state changed:', appliedFilters);
  }, [appliedFilters]);

  // Event handlers
  const handleShowSideMenu = () => setShowSideMenu(true);
  const handleCloseSideMenu = () => setShowSideMenu(false);
  const handleFilterToggle = () => setShowFilterSidebar(!showFilterSidebar);
  const handleSearchChange = (query) => setSearchQuery(query);

  const handleImageClick = (image) => {
    console.log('Rent product clicked:', image);
    const product = {
      id: image._id,
      name: image.title,
      image: image.imageUrl,
      price: image.rentalPrice || image.price,
      description: image.description,
      category: 'rent',
      fabric: image.fabric,
      color: image.color,
      style: image.style
    };
    
    navigate('/product-details', { 
      state: { 
        product,
        enquiryType: 'rent'
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
    console.log('🎯 RentProducts - Received filters from FilterSidebar:', filters);
    console.log('🎯 RentProducts - Previous applied filters:', appliedFilters);
    setAppliedFilters(filters);
    setShowFilterSidebar(false);
    console.log('🎯 RentProducts - Updated applied filters state');
  };

  // Filter images based on applied filters
  const getFilteredImages = () => {
    let filtered = [...adminImages];
    
    console.log('🎯 RentProducts - Filtering images with filters:', appliedFilters);
    console.log('🎯 RentProducts - Total images before filtering:', adminImages.length);
    
    // Debug: Log all image prices to see what we're working with
    console.log('🎯 RentProducts - All image prices:', adminImages.map(img => ({
      title: img.title,
      price: img.price,
      rentalPrice: img.rentalPrice,
      actualPrice: img.actualPrice,
      finalPrice: img.price || img.rentalPrice || img.actualPrice || 0
    })));

    // Filter by price range
    if (appliedFilters.priceRange && appliedFilters.priceRange.length === 2) {
      const [minPrice, maxPrice] = appliedFilters.priceRange;
      console.log('🎯 RentProducts - Filtering by price range:', minPrice, '-', maxPrice);
      console.log('🎯 RentProducts - Price filter is ACTIVE');
      
      filtered = filtered.filter(image => {
        // For RENT products, always use rentalPrice for filtering
        let price = image.rentalPrice || 0;
        
        // Convert string to number if needed
        if (typeof price === 'string') {
          // Remove currency symbols and commas, then convert to number
          price = parseFloat(price.replace(/[₹,]/g, '')) || 0;
        } else if (typeof price !== 'number') {
          price = parseFloat(price) || 0;
        }
        
        const matches = price >= minPrice && price <= maxPrice;
        
        console.log('🎯 RentProducts - Price filter check:', {
          imageTitle: image.title,
          rentalPrice: image.rentalPrice,
          convertedPrice: price,
          minPrice: minPrice,
          maxPrice: maxPrice,
          matches: matches
        });
        
        return matches;
      });
      console.log('🎯 RentProducts - Images after price filtering:', filtered.length);
    } else {
      console.log('🎯 RentProducts - No price filter applied');
    }

    // Filter by categories
    if (appliedFilters.categories && appliedFilters.categories.length > 0) {
      console.log('🎯 RentProducts - Filtering by categories:', appliedFilters.categories);
      filtered = filtered.filter(image => {
        const imageCategories = image.categories || [];
        console.log('🎯 RentProducts - Image categories check:', {
          title: image.title,
          primaryCategory: image.category,
          categories: imageCategories
        });
        
        return appliedFilters.categories.some(selectedCat => {
          const selectedCatLower = selectedCat.toLowerCase();
          
          // Check if the selected category matches any of the image's categories
          const matchesCategories = imageCategories.some(imgCat => {
            const imgCatLower = imgCat.toLowerCase();
            return imgCatLower === selectedCatLower || 
                   imgCatLower.includes(selectedCatLower) ||
                   selectedCatLower.includes(imgCatLower);
          });
          
          const matches = matchesCategories;
          console.log('🎯 RentProducts - Category match result:', {
            selectedCategory: selectedCat,
            imageCategories: imageCategories,
            matches: matches
          });
          
          return matches;
        });
      });
      console.log('🎯 RentProducts - Images after category filtering:', filtered.length);
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

    console.log('🎯 RentProducts - Images after filtering:', filtered.length);
    return filtered;
  };

  const renderPageHeader = () => {
    const totalProducts = adminImages.length;
    
    return (
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
          <h1 
            className="h4 fw-bold mb-0"
            style={{ 
              fontFamily: 'Inter, sans-serif', 
              letterSpacing: '-0.02em',
              fontWeight: 700
            }}
          >
            Rent Products
          </h1>
          {totalProducts > 0 && (
            <p 
              className="text-muted mb-0 mt-1" 
              style={{ 
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400
              }}
            >
              {totalProducts} {totalProducts === 1 ? 'product' : 'products'} available
            </p>
          )}
        </Col>
      </Row>
      
      <Row>
        <Col>
          <ModernSearchBar
            value={searchQuery}
            onSearchChange={handleSearchChange}
            onFilterClick={handleFilterToggle}
            placeholder="Search rent products..."
          />
        </Col>
      </Row>
    </Container>
    );
  };

  const renderRentImages = () => {
    try {
      return (
        <Container className="py-3">
          {/* Show loading state */}
          {loadingAdminImages && (
            <div className="text-center py-4">
              <p style={{ fontFamily: 'Century Gothic' }}>Loading rent products...</p>
            </div>
          )}
          
          
          {/* Show filtered images */}
          <Row>
            <Col>
              {(() => {
                const filteredImages = getFilteredImages();
                
                console.log('🎯 RentProducts - Displaying filtered images:', filteredImages.length);
                console.log('🎯 RentProducts - Current applied filters:', appliedFilters);
                
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
                      <p className="text-muted">
                        No products found matching your criteria.
                      </p>
                      <p className="text-muted">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  );
                }

                // Pagination logic
                const totalPages = Math.ceil(searchFiltered.length / ITEMS_PER_PAGE);
                const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                const endIndex = startIndex + ITEMS_PER_PAGE;
                const paginatedImages = searchFiltered.slice(startIndex, endIndex);

                return (
                  <>
                    <Row className="g-3">
                    {paginatedImages.map((image, index) => {
                      // For RENT products, always show rental price
                      const displayPrice = image.rentalPrice || 0;
                      console.log('🎯 RentProducts - Displaying image:', {
                        title: image.title,
                        rentalPrice: displayPrice,
                        index: index
                      });
                      
                      return (
                      <Col key={image._id || index} xs={6} sm={6} md={4} lg={3}>
                        <Card 
                          className="h-100 border-0 shadow-sm hover-card"
                          onClick={() => handleImageClick(image)}
                          style={{ 
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '';
                          }}
                        >
                          <div className="position-relative">
                            <Card.Img 
                              variant="top" 
                              src={image.imageUrl}
                              alt={image.title || 'Product'}
                              loading="lazy"
                              style={{
                                height: '240px',
                                objectFit: 'cover'
                              }}
                            />
                            <Button
                              variant={adminImageFavorites.has(image._id) ? 'danger' : 'light'}
                              size="sm"
                              className="position-absolute top-0 end-0 m-2 rounded-circle p-0"
                              style={{
                                width: '36px',
                                height: '36px',
                                opacity: 0.9
                              }}
                              onClick={(e) => handleAdminImageFavorite(image._id, e)}
                            >
                              {adminImageFavorites.has(image._id) ? (
                                <HeartFill size={18} />
                              ) : (
                                <Heart size={18} />
                              )}
                            </Button>
                          </div>
                          <Card.Body className="p-3">
                            <Card.Title className="h6 mb-2 text-truncate">
                              {image.title || 'Product'}
                            </Card.Title>
                            <div className="d-flex flex-column">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="fw-bold fs-6">
                                  ₹{(image.rentalPrice || 0).toLocaleString('en-IN')}
                                </span>
                                <small className="text-muted">Rental</small>
                              </div>
                              {image.securityDeposit && (
                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                  Deposit: ₹{(image.securityDeposit || 0).toLocaleString('en-IN')}
                                </small>
                              )}
                            </div>
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
                  </>
                );
              })()}
            </Col>
          </Row>
        </Container>
      );
    } catch (error) {
      console.error('Error in renderRentImages:', error);
      return (
        <Container className="py-3">
          <div className="text-center py-4">
            <p style={{ fontFamily: 'Century Gothic', color: '#dc3545' }}>
              Error loading rent products. Please try again.
            </p>
          </div>
        </Container>
      );
    }
  };

  try {
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
        <div className="d-flex flex-column min-vh-100">
          <Header onMenuClick={handleShowSideMenu} />
          <SideMenu show={showSideMenu} handleClose={handleCloseSideMenu} />
        
        <main className="flex-grow-1">
          {renderPageHeader()}
          {renderRentImages()}
        </main>
        
         <FilterSidebar 
           show={showFilterSidebar} 
           handleClose={() => setShowFilterSidebar(false)}
           onApplyFilters={handleApplyFilters}
           initialFilters={appliedFilters}
         />
        
        <Footer />
      </div>
      </>
    );
  } catch (error) {
    console.error('Error in RentProducts component:', error);
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

export default RentProducts;
