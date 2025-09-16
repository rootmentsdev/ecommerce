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
              fontFamily: 'Stoshi',
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