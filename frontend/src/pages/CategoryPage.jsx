import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Image, Badge, Breadcrumb, Dropdown, Spinner, Alert } from 'react-bootstrap';
import { X, Funnel } from 'react-bootstrap-icons';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_CONFIG from '../config/api';

const CategoryPage = () => {
  const navigate = useNavigate();
  const { category } = useParams(); // Get category from URL
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [sortBy, setSortBy] = useState('Recommended');
  
  // API state
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCloseFilters = () => setShowFilters(false);
  const handleShowFilters = () => setShowFilters(true);

  // Fetch products from backend for this category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/images/public?category=${category}&limit=100`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        
        if (data.success && data.data.images) {
          // Transform backend data to match frontend structure
          const transformedProducts = data.data.images.map(item => ({
            id: item._id,
            image: item.imageUrl,
            name: item.title,
            category: item.description || item.category,
            productCategory: item.category,
            categories: item.categories || [item.category],
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
          console.log('✅ Fetched products for category:', category, transformedProducts.length);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const occasions = ['Wedding', 'Formal', 'Party'];
  const sizes = ['XS', 'S', 'L', 'XL', 'XXL'];
  const availability = ['Rental', 'Purchase'];

  // Filter products based on selected filters
  const filteredProducts = allProducts.filter(product => {
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
    setSelectedOccasions([]);
    setSelectedSizes([]);
    setSelectedAvailability([]);
    setPriceRange([0, 15000]);
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

  // Get category display name
  const getCategoryDisplayName = () => {
    const categoryNames = {
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
      'jewellery': 'Jewellery',
      'buy': 'Buy Now',
      'rent': 'Rent Now',
      'featured': 'Featured',
      'trending': 'Trending',
      'topCategories': 'Top Categories'
    };
    return categoryNames[category] || category?.charAt(0).toUpperCase() + category?.slice(1);
  };

  // Reusable filter content
  const renderFilterContent = () => (
    <>
      {/* Price Range */}
      <div className="mb-4">
        <h6 className="fw-bold mb-3">Price Range</h6>
        <div className="d-flex gap-2 mb-2">
          <Form.Control
            type="number"
            size="sm"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            placeholder="Min"
          />
          <Form.Control
            type="number"
            size="sm"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            placeholder="Max"
          />
        </div>
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

      {/* Occasion */}
      <div className="mb-4">
        <h6 className="fw-bold mb-3">Occasion</h6>
        {occasions.map((occasion) => (
          <Form.Check
            key={occasion}
            type="checkbox"
            id={`occasion-${occasion}`}
            label={occasion}
            checked={selectedOccasions.includes(occasion)}
            onChange={() => handleOccasionChange(occasion)}
            className="mb-2"
          />
        ))}
      </div>

      {/* Size */}
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
            id={`availability-${avail}`}
            label={avail}
            checked={selectedAvailability.includes(avail)}
            onChange={() => handleAvailabilityChange(avail)}
            className="mb-2"
          />
        ))}
      </div>
    </>
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      
      <Container fluid className="flex-grow-1 bg-white py-4">
        <Container style={{ maxWidth: '1440px' }}>
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/products">All Products</Breadcrumb.Item>
            <Breadcrumb.Item active>{getCategoryDisplayName()}</Breadcrumb.Item>
          </Breadcrumb>

          <Row className="flex-nowrap">
            {/* Inline Filters Sidebar - Collapsible */}
            {showFilters && (
              <Col lg={3} md={4} sm={12} className="pe-3">
                <div className="border-end pe-3" style={{ height: '100%' }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Filters</h5>
                    <Button variant="link" className="text-dark p-0" onClick={handleCloseFilters}>
                      <X size={20} />
                    </Button>
                  </div>

                  {renderFilterContent()}
                  
                  {/* Apply & Clear Buttons */}
                  <div className="d-flex gap-2 mt-4">
                    <Button variant="dark" className="flex-grow-1 rounded-0" onClick={handleCloseFilters}>
                      Apply
                    </Button>
                    <Button variant="outline-secondary" className="rounded-0" onClick={handleClearFilters}>
                      Clear
                    </Button>
                  </div>
                </div>
              </Col>
            )}

            {/* Products Grid */}
            <Col lg={showFilters ? 9 : 12} md={showFilters ? 8 : 12} sm={12}>
              {/* Filter Button & Sort */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div className="d-flex gap-2 align-items-center flex-wrap">
                  {/* Filter Button */}
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    className="rounded-0"
                    onClick={handleShowFilters}
                  >
                    <Funnel size={14} className="me-2" />
                    Filters
                  </Button>
                  
                  {/* Product Count */}
                  <span className="text-muted">{sortedProducts.length} products</span>
                </div>

                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm" className="rounded-0">
                    <Funnel size={14} className="me-2" />
                    Sort by: {sortBy}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSortBy('Recommended')}>Recommended</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('Price: Low to High')}>Price: Low to High</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('Price: High to Low')}>Price: High to Low</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('Newest First')}>Newest First</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <p className="mt-3 text-muted">Loading {getCategoryDisplayName().toLowerCase()}...</p>
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
                <Row className="g-3">
                  {sortedProducts.map((product) => (
                    <Col key={product.id} xl={3} lg={3} md={4} sm={6} xs={6}>
                      <div className="cursor-pointer h-100 d-flex flex-column" onClick={() => navigate('/product-details', { state: { product } })}>
                        <div className="position-relative bg-light mb-2" style={{ aspectRatio: '3/4' }}>
                          <Image src={product.image} alt={product.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                          {product.badge && (
                            <Badge bg="warning" text="dark" className="position-absolute top-0 start-0 m-2 fw-bold text-uppercase px-2 py-1" style={{ fontSize: '0.65rem' }}>
                              {product.badge}
                            </Badge>
                          )}
                          <Badge bg="secondary" className="position-absolute bottom-0 start-0 m-2 px-2 py-1" style={{ fontSize: '0.65rem' }}>
                            {Math.round(((product.originalPrice - product.buyPrice) / product.originalPrice) * 100)}% OFF
                          </Badge>
                        </div>
                        
                        <div className="d-flex flex-column flex-grow-1">
                          <p className="text-muted text-uppercase mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.3px' }}>
                            {product.category}
                          </p>
                          <h6 className="fw-bold mb-2" style={{ fontSize: '0.9rem', lineHeight: '1.3' }}>{product.name}</h6>
                          
                          {/* Rating & Reviews */}
                          <div className="d-flex align-items-center gap-1 mb-2" style={{ fontSize: '0.75rem' }}>
                            <span className="text-warning fw-bold">★</span>
                            <span className="fw-bold">{product.rating}</span>
                            <span className="text-muted">|</span>
                            <span className="text-primary" style={{ fontSize: '0.7rem' }}>
                              ({product.reviews > 1000 ? `${(product.reviews / 1000).toFixed(1)}K` : product.reviews})
                            </span>
                          </div>
                          
                          {/* Pricing */}
                          <div className="mb-2">
                            <div className="d-flex align-items-center gap-1 mb-1">
                              <span className="text-muted" style={{ fontSize: '0.7rem' }}>Rent:</span>
                              <span className="fw-bold" style={{ fontSize: '0.95rem' }}>₹{product.rentPrice.toLocaleString()}</span>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              <span className="text-muted" style={{ fontSize: '0.7rem' }}>Buy:</span>
                              <span className="fw-bold" style={{ fontSize: '0.95rem' }}>₹{product.buyPrice.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          {/* Add to Cart Button */}
                          <Button variant="dark" className="w-100 rounded-0 fw-bold mt-auto py-2" style={{ fontSize: '0.75rem' }}>
                            ADD TO CART
                          </Button>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}

              {/* No Results Message */}
              {!loading && !error && sortedProducts.length === 0 && (
                <div className="text-center py-5">
                  <h5 className="text-muted">No products found in {getCategoryDisplayName()}</h5>
                  <Button variant="outline-dark" className="mt-3" onClick={() => navigate('/products')}>
                    View All Products
                  </Button>
                </div>
              )}

              {/* Pagination */}
              <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
                <Button variant="outline-secondary" size="sm" className="rounded-0">← Previous</Button>
                <Button variant="dark" size="sm" className="rounded-0">1</Button>
                <Button variant="outline-secondary" size="sm" className="rounded-0">2</Button>
                <Button variant="outline-secondary" size="sm" className="rounded-0">3</Button>
                <Button variant="outline-secondary" size="sm" className="rounded-0">Next →</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>

      <Footer />
    </div>
  );
};

export default CategoryPage;
