import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Image, Badge, Breadcrumb, Dropdown, Spinner, Alert, Offcanvas } from 'react-bootstrap';
import { X, Funnel } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_CONFIG from '../config/api';

const AllProductsPage = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [sortBy, setSortBy] = useState('Recommended');
  
  // API state
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleToggleFilters = () => setShowFilters(!showFilters);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/images/public?category=all&limit=100`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        
        console.log('🔍 AllProductsPage - API Response:', data);
        console.log('🔍 AllProductsPage - Images count:', data.data?.images?.length);
        
        if (data.success && data.data.images) {
          // Transform backend data to match frontend structure
          const transformedProducts = data.data.images.map(item => ({
            id: item._id,
            image: item.imageUrl,
            name: item.title,
            category: item.description || item.category,
            productCategory: item.category,
            categories: item.categories || [item.category], // Include categories array
            rentPrice: item.rentalPrice || 0,
            buyPrice: item.price || 0,
            originalPrice: item.actualPrice || item.price || 0,
            badge: item.type === 'new' ? 'New' : null,
            occasion: item.occasions || item.style || 'General',
            sizes: item.sizes ? (typeof item.sizes === 'string' ? item.sizes.split(',') : item.sizes) : ['S', 'M', 'L', 'XL'],
            availability: [],
            rating: 4.5,
            reviews: Math.floor(Math.random() * 1000) + 100,
            fabric: item.fabric,
            color: item.color,
            style: item.style,
            inStock: item.inStock !== false
          }));
          
          // Set availability based on prices
          transformedProducts.forEach(product => {
            if (product.rentPrice > 0) product.availability.push('Rental');
            if (product.buyPrice > 0) product.availability.push('Purchase');
            if (product.availability.length === 0) product.availability = ['Purchase'];
          });
          
          setAllProducts(transformedProducts);
          console.log('✅ Fetched products:', transformedProducts.length);
          console.log('🔍 First 3 products:', transformedProducts.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Category display names
  const getCategoryLabel = (category) => {
    const labels = {
      'suits': 'Suits',
      'kurtas': 'Kurtas',
      'bandhgalas': 'Bandhgalas',
      'formal': 'Formal Wear',
      'traditional': 'Traditional',
      'lehangas': 'Lehangas',
      'blazers': 'Blazers',
      'western': 'Western Wear',
      'ethnic': 'Ethnic Wear',
      'accessories': 'Accessories',
      'jewellery': 'Jewellery'
    };
    return labels[category] || category;
  };

  const categories = [
    'suits',
    'kurtas',
    'bandhgalas',
    'formal',
    'traditional',
    'lehangas',
    'blazers',
    'western',
    'ethnic',
    'accessories',
    'jewellery'
  ];

  const occasions = ['Wedding', 'Formal', 'Party', 'Casual'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availability = ['Rental', 'Purchase'];
  const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Gold', 'Silver'];

  // Filter products based on selected filters
  const filteredProducts = allProducts.filter(product => {
    // Category filter - check both primary category and categories array
    if (selectedCategories.length > 0) {
      const productCategories = product.categories || [product.productCategory];
      const hasMatchingCategory = selectedCategories.some(cat => 
        productCategories.includes(cat) || product.productCategory === cat
      );
      console.log('🔍 Filter check:', {
        productName: product.name,
        productCategories,
        selectedCategories,
        hasMatchingCategory
      });
      if (!hasMatchingCategory) {
        return false;
      }
    }

    // Price filter
    if (product.buyPrice < priceRange[0] || product.buyPrice > priceRange[1]) {
      return false;
    }

    // Occasion filter
    if (selectedOccasions.length > 0 && !selectedOccasions.includes(product.occasion)) {
      return false;
    }

    // Size filter
    if (selectedSizes.length > 0 && !selectedSizes.some(size => product.sizes.includes(size))) {
      return false;
    }

    // Availability filter
    if (selectedAvailability.length > 0 && !selectedAvailability.some(avail => product.availability.includes(avail))) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High':
        return a.buyPrice - b.buyPrice;
      case 'Price: High to Low':
        return b.buyPrice - a.buyPrice;
      case 'Newest First':
        return b.id - a.id;
      case 'Recommended':
      default:
        return b.rating - a.rating;
    }
  });

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedOccasions([]);
    setSelectedSizes([]);
    setSelectedAvailability([]);
    setPriceRange([2300, 8400]);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category];
      console.log('🔍 Category filter changed:', {
        category,
        newCategories,
        allProductsCount: allProducts.length
      });
      return newCategories;
    });
  };

  const handleOccasionChange = (occasion) => {
    setSelectedOccasions(prev => 
      prev.includes(occasion) ? prev.filter(o => o !== occasion) : [...prev, occasion]
    );
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleAvailabilityChange = (avail) => {
    setSelectedAvailability(prev => 
      prev.includes(avail) ? prev.filter(a => a !== avail) : [...prev, avail]
    );
  };

  const handleColorChange = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedOccasions([]);
    setSelectedSizes([]);
    setSelectedAvailability([]);
    setSelectedColors([]);
    setPriceRange([0, 15000]);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      
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
            <Breadcrumb.Item active>All Products</Breadcrumb.Item>
          </Breadcrumb>

          {/* Mobile Filter & Sort Bar */}
          <div className="d-lg-none d-flex justify-content-between align-items-center mb-3 py-2">
            <Button 
              variant="dark" 
              className="rounded-0 d-flex align-items-center gap-2"
              onClick={handleToggleFilters}
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            >
              <Funnel size={16} />
              FILTER
            </Button>
            
            <Dropdown>
              <Dropdown.Toggle 
                variant="outline-secondary" 
                className="rounded-0 d-flex align-items-center gap-2"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                <Funnel size={16} />
                SORT BY
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSortBy('Recommended')}>Recommended</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('Price: Low to High')}>Price: Low to High</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('Price: High to Low')}>Price: High to Low</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('Newest First')}>Newest First</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Filter Button & Sort Bar - Desktop Only */}
          <div className="d-none d-lg-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-3 align-items-center">
              {/* Filter Button - Black with + */}
              <Button 
                variant="dark" 
                className="rounded-0 px-4 py-2"
                onClick={handleToggleFilters}
                style={{ fontWeight: 600, fontSize: '0.9rem' }}
              >
                FILTER +
              </Button>
              
              {/* Sort By Dropdown */}
              <Dropdown>
                <Dropdown.Toggle 
                  variant="outline-secondary" 
                  className="rounded-0 px-4 py-2"
                  style={{ fontWeight: 500, fontSize: '0.9rem', minWidth: '180px' }}
                >
                  SORT BY
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSortBy('Recommended')}>Recommended</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy('Price: Low to High')}>Price: Low to High</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy('Price: High to Low')}>Price: High to Low</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy('Newest First')}>Newest First</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* Product Count */}
            <div className="text-muted" style={{ fontSize: '0.95rem' }}>
              {sortedProducts.length} products
            </div>
          </div>

          {/* Dropdown Filter Panel - Desktop Only */}
          {showFilters && (
            <div className="border rounded-0 mb-4 p-4 bg-white d-none d-lg-block" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Row>
                {/* Categories Column */}
                <Col md={3} sm={6} xs={12} className="mb-4">
                  <h6 className="fw-bold mb-3" style={{ fontSize: '0.9rem' }}>Category</h6>
                  <div className="d-flex flex-column" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <Button 
                      variant="link" 
                      className="text-start text-decoration-none text-secondary p-1"
                      onClick={handleResetFilters}
                      style={{ fontSize: '0.85rem' }}
                    >
                      Reset
                    </Button>
                    {categories.map((cat) => (
                      <Form.Check
                        key={cat}
                        type="checkbox"
                        id={`cat-${cat}`}
                        label={getCategoryLabel(cat)}
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                        className="mb-2"
                        style={{ fontSize: '0.85rem' }}
                      />
                    ))}
                  </div>
                </Col>

                {/* Price Column */}
                <Col md={3} sm={6} xs={12} className="mb-4">
                  <h6 className="fw-bold mb-3" style={{ fontSize: '0.9rem' }}>Price</h6>
                  <Button 
                    variant="link" 
                    className="text-start text-decoration-none text-secondary p-1 mb-2"
                    onClick={() => setPriceRange([0, 15000])}
                    style={{ fontSize: '0.85rem' }}
                  >
                    Reset
                  </Button>
                  <div className="mb-3">
                    <Form.Range
                      min={0}
                      max={15000}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    />
                    <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </Col>

                {/* Occasions Column */}
                <Col md={2} sm={6} xs={12} className="mb-4">
                  <h6 className="fw-bold mb-3" style={{ fontSize: '0.9rem' }}>Occasions</h6>
                  <Button 
                    variant="link" 
                    className="text-start text-decoration-none text-secondary p-1"
                    onClick={() => setSelectedOccasions([])}
                    style={{ fontSize: '0.85rem' }}
                  >
                    Reset
                  </Button>
                  {occasions.map((occasion) => (
                    <Form.Check
                      key={occasion}
                      type="checkbox"
                      id={`occasion-${occasion}`}
                      label={occasion}
                      checked={selectedOccasions.includes(occasion)}
                      onChange={() => handleOccasionChange(occasion)}
                      className="mb-2"
                      style={{ fontSize: '0.85rem' }}
                    />
                  ))}
                </Col>

                {/* Availability Column */}
                <Col md={2} sm={6} xs={12} className="mb-4">
                  <h6 className="fw-bold mb-3" style={{ fontSize: '0.9rem' }}>Availability</h6>
                  <Button 
                    variant="link" 
                    className="text-start text-decoration-none text-secondary p-1"
                    onClick={() => setSelectedAvailability([])}
                    style={{ fontSize: '0.85rem' }}
                  >
                    Reset
                  </Button>
                  {availability.map((avail) => (
                    <Form.Check
                      key={avail}
                      type="checkbox"
                      id={`avail-${avail}`}
                      label={avail}
                      checked={selectedAvailability.includes(avail)}
                      onChange={() => handleAvailabilityChange(avail)}
                      className="mb-2"
                      style={{ fontSize: '0.85rem' }}
                    />
                  ))}
                </Col>

                {/* Sizes Column */}
                <Col md={2} sm={6} xs={12} className="mb-4">
                  <h6 className="fw-bold mb-3" style={{ fontSize: '0.9rem' }}>Size</h6>
                  <Button 
                    variant="link" 
                    className="text-start text-decoration-none text-secondary p-1 mb-2"
                    onClick={() => setSelectedSizes([])}
                    style={{ fontSize: '0.85rem' }}
                  >
                    Reset
                  </Button>
                  <div className="d-flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSizes.includes(size) ? 'dark' : 'outline-secondary'}
                        size="sm"
                        className="rounded-0"
                        onClick={() => handleSizeChange(size)}
                        style={{ minWidth: '40px', fontSize: '0.75rem' }}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </Col>
              </Row>

              {/* Apply and Clear Buttons */}
              <Row className="mt-3">
                <Col className="d-flex gap-2">
                  <Button 
                    variant="dark" 
                    className="rounded-0 px-4"
                    onClick={handleApplyFilters}
                  >
                    APPLY
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    className="rounded-0 px-4"
                    onClick={handleResetFilters}
                  >
                    Clear
                  </Button>
                </Col>
              </Row>
            </div>
          )}
          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3 text-muted">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="danger" className="my-4">
              <Alert.Heading>Error Loading Products</Alert.Heading>
              <p>{error}</p>
              <Button variant="outline-danger" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </Alert>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <div className="products-grid">
              {sortedProducts.map((product) => (
                <div 
                  key={product.id}
                  className="cursor-pointer d-flex flex-column product-card" 
                  onClick={() => navigate('/product-details', { state: { product } })}
                >
                  {/* Product Image */}
                  <div className="position-relative product-image-container" style={{ height: '200px', overflow: 'hidden' }}>
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      className="w-100 h-100" 
                      style={{ 
                        objectFit: 'cover',
                        display: 'block'
                      }} 
                    />
                    {/* BESTSELLER Badge */}
                    {product.badge && (
                      <Badge 
                        className="position-absolute top-0 start-0 m-2 px-2 py-1 text-uppercase fw-bold" 
                        style={{ 
                          fontSize: '0.55rem', 
                          letterSpacing: '0.3px',
                          backgroundColor: '#FFA726',
                          color: '#000',
                          border: 'none'
                        }}
                      >
                        BESTSELLER
                      </Badge>
                    )}
                    {/* Discount Badge */}
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
                        <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.65rem' }}>
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="d-flex align-items-baseline gap-1">
                        <span style={{ fontSize: '0.6rem', color: '#666' }}>Rent:</span>
                        <span className="fw-bold" style={{ fontSize: '0.85rem', color: '#FFA726' }}>
                          ₹{product.rentPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Add to Cart Button */}
                    <Button 
                      variant="dark" 
                      className="w-100 rounded-0 fw-bold mt-auto text-uppercase" 
                      style={{ 
                        fontSize: '0.65rem',
                        padding: '0.45rem',
                        letterSpacing: '0.3px',
                        backgroundColor: '#000',
                        border: 'none'
                      }}
                    >
                      ADD TO CART
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

              {/* No Results Message */}
              {!loading && !error && sortedProducts.length === 0 && (
                <div className="text-center py-5">
                  <h5 className="text-muted">No products found matching your filters</h5>
                  <Button variant="outline-dark" className="mt-3" onClick={handleResetFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              <div className="d-flex justify-content-center align-items-center gap-2 mt-5 mb-5 pagination-container">
                <Button 
                  variant="outline-dark" 
                  className="pagination-btn pagination-nav"
                  disabled
                >
                  <span className="d-none d-md-inline">← Previous</span>
                  <span className="d-md-none">←</span>
                </Button>
                
                <Button variant="dark" className="pagination-btn pagination-active">1</Button>
                <Button variant="outline-dark" className="pagination-btn">2</Button>
                <Button variant="outline-dark" className="pagination-btn">3</Button>
                <Button variant="outline-dark" className="pagination-btn d-none d-sm-inline-block">4</Button>
                <Button variant="outline-dark" className="pagination-btn d-none d-sm-inline-block">5</Button>
                <span className="text-muted px-1">...</span>
                <Button variant="outline-dark" className="pagination-btn d-none d-sm-inline-block">24</Button>
                
                <Button 
                  variant="outline-dark" 
                  className="pagination-btn pagination-nav"
                >
                  <span className="d-none d-md-inline">Next →</span>
                  <span className="d-md-none">→</span>
                </Button>
              </div>
        </div>
      </Container>

      {/* Mobile Filter Offcanvas */}
      <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end" className="d-lg-none">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Categories */}
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Category</h6>
            <Button 
              variant="link" 
              className="text-start text-decoration-none text-secondary p-0 mb-2"
              onClick={handleResetFilters}
              style={{ fontSize: '0.85rem' }}
            >
              Reset All
            </Button>
            {categories.map((cat) => (
              <Form.Check
                key={cat}
                type="checkbox"
                id={`mobile-cat-${cat}`}
                label={getCategoryLabel(cat)}
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                className="mb-2"
              />
            ))}
          </div>

          {/* Price Range */}
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Price</h6>
            <Form.Range
              min={0}
              max={15000}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            />
            <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.85rem' }}>
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>

          {/* Occasions */}
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Occasions</h6>
            {occasions.map((occasion) => (
              <Form.Check
                key={occasion}
                type="checkbox"
                id={`mobile-occasion-${occasion}`}
                label={occasion}
                checked={selectedOccasions.includes(occasion)}
                onChange={() => handleOccasionChange(occasion)}
                className="mb-2"
              />
            ))}
          </div>

          {/* Sizes */}
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Size</h6>
            <div className="d-flex flex-wrap gap-2">
              {sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSizes.includes(size) ? 'dark' : 'outline-secondary'}
                  size="sm"
                  className="rounded-0"
                  onClick={() => handleSizeChange(size)}
                  style={{ minWidth: '45px' }}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Availability</h6>
            {availability.map((avail) => (
              <Form.Check
                key={avail}
                type="checkbox"
                id={`mobile-avail-${avail}`}
                label={avail}
                checked={selectedAvailability.includes(avail)}
                onChange={() => handleAvailabilityChange(avail)}
                className="mb-2"
              />
            ))}
          </div>

          {/* Apply Button */}
          <Button 
            variant="dark" 
            className="w-100 rounded-0 fw-bold"
            onClick={handleApplyFilters}
          >
            APPLY FILTERS
          </Button>
        </Offcanvas.Body>
      </Offcanvas>

      <Footer />

      <style>{`
        .products-grid {
          display: grid;
          gap: 19px;
          grid-template-columns: repeat(auto-fill, minmax(265.5px, 1fr));
        }
        
        .product-card {
          width: 100%;
          height: 373px;
          background-color: #fff;
          overflow: hidden;
          border: 1px solid #f0f0f0;
        }
        
        .product-image-container {
          background-color: #f8f8f8;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        /* Pagination Styles */
        .pagination-container {
          flex-wrap: wrap;
        }
        
        .pagination-btn {
          min-width: 45px;
          height: 45px;
          border-radius: 0 !important;
          font-weight: 500;
          font-size: 0.95rem;
          border: 1px solid #333 !important;
          transition: all 0.2s ease;
          padding: 0.5rem 1rem;
        }
        
        .pagination-btn:hover:not(:disabled) {
          background-color: #333 !important;
          color: #fff !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        
        .pagination-active {
          background-color: #000 !important;
          color: #fff !important;
          border-color: #000 !important;
        }
        
        .pagination-nav {
          padding: 0.5rem 1.25rem;
        }
        
        @media (max-width: 991px) {
          .responsive-container {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          
          .products-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          
          .product-card {
            width: 100%;
            height: auto !important;
            min-height: 280px;
            border: 1px solid #e8e8e8;
          }
          
          .product-image-container {
            height: 160px !important;
          }
          
          .product-card .d-flex.flex-column.flex-grow-1 {
            padding: 8px !important;
            height: auto !important;
          }
          
          .product-card h6 {
            font-size: 0.75rem !important;
            line-height: 1.3 !important;
            height: auto !important;
            min-height: 2rem !important;
            margin-bottom: 6px !important;
          }
          
          .product-card p.text-muted {
            font-size: 0.6rem !important;
            margin-bottom: 4px !important;
          }
          
          .product-card .d-flex.align-items-center.gap-1 {
            font-size: 0.6rem !important;
            margin-bottom: 6px !important;
          }
          
          .product-card .d-flex.align-items-baseline.gap-1 span:first-child {
            font-size: 0.55rem !important;
          }
          
          .product-card .d-flex.align-items-baseline.gap-1 .fw-bold {
            font-size: 0.8rem !important;
          }
          
          .product-card .d-flex.align-items-baseline.gap-1 .text-muted {
            font-size: 0.6rem !important;
          }
          
          .product-card button {
            font-size: 0.65rem !important;
            padding: 0.5rem 0.4rem !important;
            margin-top: 6px !important;
            letter-spacing: 0.5px !important;
          }
          
          .product-card .badge {
            font-size: 0.5rem !important;
            padding: 0.25rem 0.4rem !important;
          }
          
          .pagination-btn {
            min-width: 40px;
            height: 40px;
            font-size: 0.85rem;
            padding: 0.4rem 0.8rem;
          }
          
          .pagination-nav {
            padding: 0.4rem 1rem;
          }
        }
        
        @media (min-width: 992px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(265.5px, 265.5px));
          }
        }
        
        @media (max-width: 576px) {
          .responsive-container {
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
          
          .products-grid {
            gap: 8px;
          }
          
          .product-card {
            min-height: 260px;
          }
          
          .product-image-container {
            height: 140px !important;
          }
          
          .product-card h6 {
            font-size: 0.7rem !important;
            min-height: 1.8rem !important;
          }
          
          .product-card button {
            font-size: 0.6rem !important;
            padding: 0.45rem 0.3rem !important;
          }
          
          .pagination-btn {
            min-width: 36px;
            height: 36px;
            font-size: 0.8rem;
            padding: 0.3rem 0.6rem;
          }
          
          .pagination-nav {
            padding: 0.3rem 0.8rem;
          }
          
          .pagination-container {
            gap: 0.4rem !important;
            margin-top: 2rem !important;
            margin-bottom: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AllProductsPage;
