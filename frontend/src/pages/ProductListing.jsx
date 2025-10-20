import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Pagination, Card, Badge, Spinner } from 'react-bootstrap';
import { ArrowLeft, Search, Funnel, Heart, HeartFill } from 'react-bootstrap-icons';
import { useNavigate, useLocation } from 'react-router-dom';

// Import reusable components
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';
import FilterSidebar from '../components/common/FilterSidebar';
import ModernSearchBar from '../components/common/ModernSearchBar';

// Import services
import ImageService from '../services/imageService';
import FavoritesService from '../services/favoritesService';

// Import constants and utilities
import { APP_CONFIG } from '../constants';

const ProductListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get category from URL params
  const urlParams = new URLSearchParams(location.search);
  const categoryParam = urlParams.get('category');
  
  // State for current category
  const [currentCategory, setCurrentCategory] = useState(categoryParam || 'all');
  const [categoryTitle, setCategoryTitle] = useState('All Products');

  // State for admin images
  const [adminImages, setAdminImages] = useState([]);
  const [loadingAdminImages, setLoadingAdminImages] = useState(false);
  
  // State for favorites
  const [adminImageFavorites, setAdminImageFavorites] = useState(new Set());
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  
  // State for filters
  const [appliedFilters, setAppliedFilters] = useState({
    priceRange: [1000, 100000], // Higher range to accommodate both rent and buy products
    categories: [],
    occasions: [],
    sizes: []
  });


  // Set category title based on URL param
  useEffect(() => {
    if (currentCategory === 'all') {
      setCategoryTitle('All Products');
    } else {
      // Capitalize first letter
      const formattedCategory = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
      setCategoryTitle(formattedCategory);
    }
  }, [currentCategory]);

  // Load admin images for the current category
  useEffect(() => {
    const loadAdminImages = async () => {
      try {
        setLoadingAdminImages(true);
        
        // Determine which category to fetch based on enquiry type and current category
        let fetchCategory;
        
        // If coming from rent-now or buy-now page, filter by enquiry type
        if (location.state?.enquiryType) {
          fetchCategory = location.state.enquiryType;
          console.log('🎯 ProductListing - Filtering by enquiry type:', location.state.enquiryType);
        } else if (currentCategory === 'all') {
          // If no specific category and no enquiry type, fetch all active images
          fetchCategory = null; // Will fetch all active images
          console.log('🎯 ProductListing - Fetching all active images');
        } else {
          // Map category IDs to backend category names
          const categoryMapping = {
            'suits': 'suits',
            'kurtas': 'kurtas', 
            'bandhgalas': 'bandhgalas',
            'formal': 'formal',
            'traditional': 'traditional'
          };
          fetchCategory = categoryMapping[currentCategory];
        }

        if (fetchCategory) {
          const response = await ImageService.getImagesByCategory(fetchCategory);
          if (response.success) {
            setAdminImages(response.data.images || []);
            console.log('🎯 ProductListing - Loaded admin images for category:', fetchCategory, 'Count:', response.data.images?.length || 0);
            console.log('🎯 ProductListing - Images data:', response.data.images?.map(img => ({
              id: img._id,
              title: img.title,
              category: img.category,
              categories: img.categories
            })));
          } else {
            setAdminImages([]);
          }
        } else if (fetchCategory === null) {
          // Fetch all active images
          const response = await ImageService.getImagesByCategory('all');
          if (response.success) {
            setAdminImages(response.data.images || []);
            console.log('🎯 ProductListing - Loaded all active images:', response.data.images?.length || 0);
          } else {
            setAdminImages([]);
          }
        } else {
          setAdminImages([]);
        }
      } catch (error) {
        console.error('Error loading admin images for category:', currentCategory, error);
        setAdminImages([]);
      } finally {
        setLoadingAdminImages(false);
      }
    };

    loadAdminImages();
  }, [currentCategory, location.state?.enquiryType]);

  // State management
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Event handlers following clean code principles
  const handleBackClick = () => {
    navigate(-1);
  };


  // Load saved favorites from localStorage
  useEffect(() => {
    const savedAdminFavorites = FavoritesService.getAdminFavorites();
    setAdminImageFavorites(new Set(savedAdminFavorites));
  }, []);

  // Reset to page 1 when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters, searchQuery]);

  // Handle admin image favorite toggle
  const handleAdminImageFavorite = (imageId, e) => {
    e.stopPropagation();
    const image = adminImages.find(img => img._id === imageId);
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

  // Convert admin image to product format
  const convertImageToProduct = (image) => {
    console.log('💰 Converting image to product - Raw image data:', {
      id: image._id,
      title: image.title,
      price: image.price,
      rentalPrice: image.rentalPrice,
      actualPrice: image.actualPrice,
      securityDeposit: image.securityDeposit
    });
    
    // Helper function to parse comma-separated values
    const parseCommaSeparated = (value, defaultValue = []) => {
      if (!value || value.trim() === '') return defaultValue;
      return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    };

    const product = {
      id: image._id,
      name: image.title || 'Untitled Product',
      price: image.price ? parseInt(image.price) : (image.rentalPrice ? parseInt(image.rentalPrice) : 1200), // Use purchase price, fallback to rental price, then default
      rentalPrice: image.rentalPrice ? parseInt(image.rentalPrice) : (image.price ? parseInt(image.price) : 800), // Use rental price, fallback to purchase price, then default
      actualPrice: image.actualPrice ? parseInt(image.actualPrice) : 13000, // Use provided actual price or default
      securityDeposit: image.securityDeposit ? parseInt(image.securityDeposit) : 5000, // Use provided security deposit or default
      image: image.imageUrl,
      category: image.category || 'product',
      occasion: parseCommaSeparated(image.occasions, ['Formal'])[0] || 'Formal', // Use first occasion from admin, fallback to default
      size: parseCommaSeparated(image.sizes, ['L'])[0] || 'L', // Use first size from admin, fallback to default
      type: image.type || 'newArrivals', // Use provided type or default
      productCategory: image.category || 'rent', // Use category field for routing
      description: image.description || 'No description available',
      fabric: image.fabric || 'Premium Fabric', // Use provided fabric or default
      color: image.color || 'Various', // Use provided color or default
      style: image.style || 'Modern Fit', // Use provided style or default
      occasions: parseCommaSeparated(image.occasions, ['Wedding Guest', 'Corporate Events', 'Reception', 'Cocktail Party']), // Parse occasions
      inclusions: parseCommaSeparated(image.inclusions, ['Complete Outfit', 'Accessories included']), // Parse inclusions
      care: image.care || 'Dry Clean Only', // Use provided care instructions or default
      sizes: parseCommaSeparated(image.sizes, ['S', 'M', 'L', 'XL', 'XXL']), // Parse available sizes
      colors: parseCommaSeparated(image.colors || image.color, ['Various']), // Parse colors from colors field, fallback to color field
      inStock: image.inStock !== false && image.isActive !== false // Use both inStock and isActive status
    };
    
    console.log('💰 Final converted product data:', {
      id: product.id,
      name: product.name,
      price: product.price,
      rentalPrice: product.rentalPrice,
      actualPrice: product.actualPrice,
      securityDeposit: product.securityDeposit
    });
    
    return product;
  };

  const handleImageClick = (image) => {
    console.log('Admin image clicked:', image);
    const product = convertImageToProduct(image);
    
    // Determine enquiry type based on product category
    let enquiryType = 'rent'; // default
    if (product.productCategory === 'buy') {
      enquiryType = 'buy';
    } else if (product.productCategory === 'rent') {
      enquiryType = 'rent';
    } else if (product.productCategory === 'trending' || product.productCategory === 'featured') {
      // For trending/featured, use the original enquiry type or default to rent
      enquiryType = location.state?.enquiryType || 'rent';
    }
    
    console.log('Product category:', product.productCategory, 'Enquiry type:', enquiryType);
    
    navigate('/product-details', { 
      state: { 
        product,
        enquiryType: enquiryType
      } 
    });
  };


  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleFilterToggle = () => {
    setShowFilterSidebar(!showFilterSidebar);
  };

  const handleApplyFilters = (filters) => {
    console.log('🎯 ProductListing - Received filters from FilterSidebar:', filters);
    setAppliedFilters(filters);
    setShowFilterSidebar(false);
  };

  // Filter images based on applied filters
  const getFilteredImages = () => {
    let filtered = [...adminImages];
    
    console.log('🎯 ProductListing - Filtering images with filters:', appliedFilters);
    console.log('🎯 ProductListing - Total images before filtering:', adminImages.length);
    
    // Debug: Log all image prices to see what we're working with
    console.log('🎯 ProductListing - All image prices:', adminImages.map(img => ({
      title: img.title,
      price: img.price,
      rentalPrice: img.rentalPrice,
      actualPrice: img.actualPrice,
      finalPrice: img.price || img.rentalPrice || img.actualPrice || 0
    })));

    // Filter by price range
    if (appliedFilters.priceRange && appliedFilters.priceRange.length === 2) {
      const [minPrice, maxPrice] = appliedFilters.priceRange;
      console.log('🎯 ProductListing - Filtering by price range:', minPrice, '-', maxPrice);
      console.log('🎯 ProductListing - Price filter is ACTIVE');
      
      filtered = filtered.filter(image => {
        // Use appropriate price based on category:
        // - Rent category: use rentalPrice (rental price)
        // - Buy category: use price (purchase/selling price)
        // - All products: use price priority
        let price;
        if (image.category === 'rent') {
          price = image.rentalPrice || 0;
        } else if (image.category === 'buy') {
          price = image.price || 0;
        } else {
          price = image.price || image.rentalPrice || image.actualPrice || 0;
        }
        
        // Convert string to number if needed
        if (typeof price === 'string') {
          price = parseFloat(price.replace(/[₹,]/g, '')) || 0;
        } else if (typeof price !== 'number') {
          price = parseFloat(price) || 0;
        }
        
        const matches = price >= minPrice && price <= maxPrice;
        
        console.log('🎯 ProductListing - Price filter check:', {
          imageTitle: image.title,
          category: image.category,
          priceUsed: image.category === 'rent' ? 'rentalPrice' : image.category === 'buy' ? 'purchasePrice' : 'price',
          convertedPrice: price,
          minPrice: minPrice,
          maxPrice: maxPrice,
          matches: matches
        });
        
        return matches;
      });
      console.log('🎯 ProductListing - Images after price filtering:', filtered.length);
    } else {
      console.log('🎯 ProductListing - No price filter applied');
    }

    console.log('🎯 ProductListing - Images after filtering:', filtered.length);
    return filtered;
  };

  const handleCloseSideMenu = () => {
    setShowSideMenu(false);
  };

  // Render methods following single responsibility principle
  const renderPageHeader = () => {
    // Calculate total products count based on filtered images
    const filteredImages = getFilteredImages();
    const searchFiltered = searchQuery 
      ? filteredImages.filter(image => 
          image.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          image.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          image.altText?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : filteredImages;
    
    const totalProducts = searchFiltered.length;
    
    return (
    <Container className="py-3">
      <Row className="align-items-center mb-3">
        <Col xs="auto">
          <Button 
            variant="link" 
            className="p-0 text-dark"
            onClick={handleBackClick}
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
            {categoryTitle}
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
            searchTerm={searchQuery}
            onSearchChange={handleSearchChange}
            onFilterClick={handleFilterToggle}
            placeholder="Search products..."
          />
        </Col>
      </Row>
    </Container>
    );
  };

  const renderAdminImages = () => {
    // Declare variables outside try block to avoid scope issues
    let displayTitle = 'Products';
    let backendCategory = currentCategory;
    
    try {
    console.log('🎯 ProductListing renderAdminImages - enquiryType:', location.state?.enquiryType);
    console.log('🎯 ProductListing renderAdminImages - categoryParam:', categoryParam);
      console.log('🎯 ProductListing renderAdminImages - currentCategory:', currentCategory);
      console.log('🎯 ProductListing renderAdminImages - adminImages:', adminImages?.length || 0);
      
      // Determine display title based on enquiry type
      if (location.state?.enquiryType === 'rent') {
        displayTitle = 'Rent Products';
      } else if (location.state?.enquiryType === 'buy') {
        displayTitle = 'Buy Products';
      } else if (currentCategory === 'all') {
        displayTitle = 'All Products';
      } else {
        // Map frontend category to backend category
        const categoryMapping = {
          'suits': 'suits',
          'kurtas': 'kurtas', 
          'bandhgalas': 'bandhgalas',
          'formal': 'formal',
          'traditional': 'traditional'
        };
        backendCategory = categoryMapping[currentCategory] || currentCategory;
        displayTitle = backendCategory ? `${backendCategory.charAt(0).toUpperCase() + backendCategory.slice(1)} Products` : 'Products';
      }
    
    return (
      <Container className="py-3">
        {/* Show loading state */}
        {loadingAdminImages && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3 text-muted">Loading {displayTitle}...</p>
          </div>
        )}
        
        
        {/* Show filtered images */}
        <Row>
          <Col>
            {(() => {
              const filteredImages = getFilteredImages();
              
              console.log('🎯 ProductListing - Displaying filtered images:', filteredImages.length);
              console.log('🎯 ProductListing - Current applied filters:', appliedFilters);
              
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
                    // Show appropriate price based on category
                    let displayPrice, priceLabel;
                    if (image.category === 'rent') {
                      displayPrice = image.rentalPrice || 0;
                      priceLabel = 'Rental';
                    } else if (image.category === 'buy') {
                      displayPrice = image.price || 0; // Show purchase price for buy products
                      priceLabel = 'Buy';
                    } else {
                      displayPrice = image.price || image.rentalPrice || image.actualPrice || 0;
                      priceLabel = '';
                    }
                    
                    console.log('🎯 ProductListing - Displaying image:', {
                      title: image.title,
                      category: image.category,
                      price: displayPrice,
                      priceLabel: priceLabel,
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
                                ₹{displayPrice.toLocaleString('en-IN')}
                              </span>
                              {priceLabel && <small className="text-muted">{priceLabel}</small>}
                            </div>
                            {image.category === 'rent' && image.securityDeposit && (
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
                        // Show first page, last page, current page, and 2 pages around current
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
      console.error('Error in renderAdminImages:', error);
      return (
        <Container className="py-3">
          <div className="text-center py-4">
            <p style={{ fontFamily: 'Century Gothic', color: '#dc3545' }}>
              Error loading images. Please try again.
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
        <Header onMenuClick={() => setShowSideMenu(true)} />
        <SideMenu show={showSideMenu} handleClose={() => setShowSideMenu(false)} />
      
      <main className="flex-grow-1">
        {renderPageHeader()}
        {renderAdminImages()}
      </main>
      
      <FilterSidebar 
        show={showFilterSidebar} 
        handleClose={() => setShowFilterSidebar(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={appliedFilters}
        maxPrice={100000}
      />
      
      <Footer />
    </div>
    </>
  );
  } catch (error) {
    console.error('Error in ProductListing component:', error);
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header onMenuClick={() => setShowSideMenu(true)} />
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

export default ProductListing;