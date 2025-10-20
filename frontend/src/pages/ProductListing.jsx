import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { ArrowLeft, Search, Funnel, Heart } from 'react-bootstrap-icons';
import { useNavigate, useLocation } from 'react-router-dom';

// Import product data
import { PRODUCTS_DATA, CATEGORIES, getProductsByCategory } from '../data/products';

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

// Import constants and utilities
import { APP_CONFIG } from '../constants';

const ProductListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get category from URL params
  const urlParams = new URLSearchParams(location.search);
  const categoryParam = urlParams.get('category');
  
  // State for filtered products
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(categoryParam || 'all');
  const [categoryTitle, setCategoryTitle] = useState('All Products');
  
  // State for admin images
  const [adminImages, setAdminImages] = useState([]);
  const [loadingAdminImages, setLoadingAdminImages] = useState(false);
  
  // State for filters
  const [appliedFilters, setAppliedFilters] = useState({
    priceRange: [1000, 10000],
    categories: [],
    occasions: [],
    sizes: []
  });


  // Filter products based on category
  useEffect(() => {
    const products = getProductsByCategory(currentCategory === 'all' ? null : currentCategory);
    setFilteredProducts(products);
    
    // Set category title
    if (currentCategory === 'all') {
      setCategoryTitle('All Products');
    } else {
      const category = CATEGORIES.find(cat => cat.id === currentCategory);
      setCategoryTitle(category ? category.name : 'Products');
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

  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
    navigate('/product-details', { 
      state: { 
        product,
        enquiryType: location.state?.enquiryType || 'rent'
      } 
    });
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

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
    // TODO: Implement add to cart functionality
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
        // Convert price to number and handle string prices
        let price = image.price || image.rentalPrice || image.actualPrice || 0;
        
        // Convert string to number if needed
        if (typeof price === 'string') {
          // Remove currency symbols and commas, then convert to number
          price = parseFloat(price.replace(/[₹,]/g, '')) || 0;
        } else if (typeof price !== 'number') {
          price = parseFloat(price) || 0;
        }
        
        const matches = price >= minPrice && price <= maxPrice;
        
        console.log('🎯 ProductListing - Price filter check:', {
          imageTitle: image.title,
          originalPrice: image.price || image.rentalPrice || image.actualPrice,
          convertedPrice: price,
          priceType: typeof (image.price || image.rentalPrice || image.actualPrice),
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

  // Filter products based on search term and applied filters
  const searchFilteredProducts = filteredProducts.filter(product => {
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes((searchQuery || '').toLowerCase());
    
    // Price filter
    const matchesPrice = product.price >= appliedFilters.priceRange[0] && 
                        product.price <= appliedFilters.priceRange[1];
    
    // Category filter - match category ID with category name
    const matchesCategory = appliedFilters.categories.length === 0 || 
                           appliedFilters.categories.some(filterCategory => {
                             const categoryObj = CATEGORIES.find(cat => cat.name === filterCategory);
                             return categoryObj && categoryObj.id === product.category;
                           });
    
    // Size filter - check if any selected size is available in product sizes
    const matchesSize = appliedFilters.sizes.length === 0 || 
                       appliedFilters.sizes.some(size => product.sizes && product.sizes.includes(size));
    
    // Occasion filter - extract from description or use default
    const productOccasion = product.description.toLowerCase().includes('wedding') ? 'Wedding' :
                           product.description.toLowerCase().includes('business') ? 'Business' :
                           product.description.toLowerCase().includes('formal') ? 'Formal' :
                           product.description.toLowerCase().includes('party') ? 'Party' : 'Casual';
    
    const matchesOccasion = appliedFilters.occasions.length === 0 || 
                           appliedFilters.occasions.includes(productOccasion);
    
    return matchesSearch && matchesPrice && matchesCategory && matchesOccasion && matchesSize;
  });

  // Render methods following single responsibility principle
  const renderPageHeader = () => (
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
              fontFamily: 'Century Gothic',
              letterSpacing: '-0.02em'
            }}
          >
            {categoryTitle}
          </h1>
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
          <div className="text-center py-4">
            <p style={{ fontFamily: 'Century Gothic' }}>Loading {displayTitle} images...</p>
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
                  {searchFiltered.map((image, index) => {
                    const displayPrice = image.rentalPrice || image.price || image.actualPrice || 0;
                    console.log('🎯 ProductListing - Displaying image:', {
                      title: image.title,
                      price: displayPrice,
                      index: index
                    });
                    
                    return (
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
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              borderRadius: '50%',
                              width: '36px',
                              height: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle favorite toggle here if needed
                            }}
                          >
                            <Heart size={18} color="#dc3545" />
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
                              ₹{(image.rentalPrice || image.price || image.actualPrice || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Col>
                    );
                  })}
                </Row>
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

  const renderProductGrid = () => (
    <Container className="py-3">
      <Row className="g-3">
        {searchFilteredProducts.map((product) => (
          <Col key={product.id} xs={6} sm={6} md={4} lg={3}>
            <ProductCard
              product={product}
              onClick={handleProductClick}
              onAddToCart={handleAddToCart}
              showPrice={true}
              showAddToCart={false}
            />
          </Col>
        ))}
      </Row>
      
      {searchFilteredProducts.length === 0 && (
        <Row>
          <Col className="text-center py-5">
            <h3 className="text-muted">No products found</h3>
            <p className="text-muted">Try adjusting your search or filters</p>
          </Col>
        </Row>
      )}
    </Container>
  );

  try {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header onMenuClick={() => setShowSideMenu(true)} />
      <SideMenu show={showSideMenu} handleClose={() => setShowSideMenu(false)} />
      
      <main className="flex-grow-1">
        {renderPageHeader()}
        {renderAdminImages()}
        {renderProductGrid()}
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