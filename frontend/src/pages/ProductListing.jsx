import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { ArrowLeft, Search, Funnel } from 'react-bootstrap-icons';
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

  // State management
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const [appliedFilters, setAppliedFilters] = useState({
    priceRange: [1000, 3500],
    categories: [],
    occasions: [],
    sizes: []
  });

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
    console.log('Applying filters:', filters);
    setAppliedFilters(filters);
    setPriceRange(filters.priceRange);
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
    console.log('🎯 ProductListing renderAdminImages - enquiryType:', location.state?.enquiryType);
    console.log('🎯 ProductListing renderAdminImages - categoryParam:', categoryParam);
    
    return (
      <Container className="py-3">
        <Row>
          <Col>
          <ProductImageGallery
            category={location.state?.enquiryType || 'rent'}
            tags={categoryParam ? [categoryParam] : []}
            searchKeyword={searchQuery}
            limit={8}
            columns={{ xs: 2, sm: 2, md: 3, lg: 4 }}
            showTitle={true}
            showDescription={true}
            imageHeight="240px"
            onImageClick={handleImageClick}
          />
        </Col>
      </Row>
    </Container>
    );
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

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header onMenuClick={() => setShowSideMenu(true)} />
      <SideMenu show={showSideMenu} onHide={() => setShowSideMenu(false)} />
      
      <main className="flex-grow-1">
        {renderPageHeader()}
        {renderAdminImages()}
        {renderProductGrid()}
      </main>
      
      <FilterSidebar 
        show={showFilterSidebar} 
        handleClose={() => setShowFilterSidebar(false)}
        onApplyFilters={handleApplyFilters}
      />
      
      <Footer />
    </div>
  );
};

export default ProductListing;