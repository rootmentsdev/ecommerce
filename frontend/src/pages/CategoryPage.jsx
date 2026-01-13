import { useState, useEffect } from 'react';
import { Container, Button, Image, Badge, Breadcrumb, Dropdown, Spinner, Alert, Offcanvas, Form } from 'react-bootstrap';
import { Funnel } from 'react-bootstrap-icons';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import Footer from '../components/Footer';
import API_CONFIG from '../config/api';

const CategoryPage = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('Recommended');
  
  // API state
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cart state
  const [cartItems, setCartItems] = useState([]);

  const handleToggleDesktopFilters = () => setShowDesktopFilters(!showDesktopFilters);
  const handleToggleMobileFilters = () => setShowMobileFilters(!showMobileFilters);

  // Add to cart function
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    
    // Read from localStorage directly to get the most current cart state
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const productId = product.id || product._id;
    const existingItemIndex = currentCart.findIndex(item => {
      const itemId = item.id || item._id;
      return itemId === productId;
    });
    
    if (existingItemIndex >= 0) {
      const newCartItems = [...currentCart];
      newCartItems[existingItemIndex] = {
        ...newCartItems[existingItemIndex],
        quantity: (newCartItems[existingItemIndex].quantity || 1) + 1
      };
      setCartItems(newCartItems);
      localStorage.setItem('cart', JSON.stringify(newCartItems));
    } else {
      const productWithQuantity = { ...product, quantity: 1 };
      const newCartItems = [...currentCart, productWithQuantity];
      setCartItems(newCartItems);
      localStorage.setItem('cart', JSON.stringify(newCartItems));
    }
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
    
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(updatedCart);
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  // Fetch products from backend
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
          const transformedProducts = data.data.images.map(item => ({
            id: item._id,
            image: item.imageUrl,
            name: item.title,
            description: item.description || '', // Keep for ProductDetails page
            category: item.category,
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
          
          transformedProducts.forEach(product => {
            if (product.rentPrice > 0) product.availability.push('Rental');
            if (product.buyPrice > 0) product.availability.push('Purchase');
            if (product.availability.length === 0) product.availability = ['Purchase'];
          });
          
          setAllProducts(transformedProducts);
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

  const occasions = ['Wedding', 'Formal', 'Party', 'Casual'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availability = ['Rental', 'Purchase'];

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    if (product.buyPrice < priceRange[0] || product.buyPrice > priceRange[1]) return false;
    if (selectedOccasions.length > 0 && !selectedOccasions.includes(product.occasion)) return false;
    if (selectedSizes.length > 0 && !selectedSizes.some(size => product.sizes.includes(size))) return false;
    if (selectedAvailability.length > 0 && !selectedAvailability.some(avail => product.availability.includes(avail))) return false;
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High': return a.buyPrice - b.buyPrice;
      case 'Price: High to Low': return b.buyPrice - a.buyPrice;
      case 'Newest First': return b.id - a.id;
      default: return b.rating - a.rating;
    }
  });

  const handleOccasionChange = (occasion) => {
    setSelectedOccasions(prev => prev.includes(occasion) ? prev.filter(o => o !== occasion) : [...prev, occasion]);
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const handleAvailabilityChange = (avail) => {
    setSelectedAvailability(prev => prev.includes(avail) ? prev.filter(a => a !== avail) : [...prev, avail]);
  };

  const handleApplyFilters = () => {
    setShowDesktopFilters(false);
    setShowMobileFilters(false);
  };

  const handleResetFilters = () => {
    setSelectedOccasions([]);
    setSelectedSizes([]);
    setSelectedAvailability([]);
    setPriceRange([0, 100000]);
  };

  const getCategoryDisplayName = () => {
    const names = {
      'suits': 'Suits', 'kurtas': 'Kurtas', 'bandhgalas': 'Bandhgalas',
      'formal': 'Formal Wear', 'traditional': 'Traditional', 'lehangas': 'Lehangas',
      'blazers': 'Blazers', 'western': 'Western Wear', 'ethnic': 'Ethnic Wear',
      'accessories': 'Accessories', 'jewellery': 'Jewellery'
    };
    return names[category] || category?.charAt(0).toUpperCase() + category?.slice(1);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header onMenuClick={() => setShowSideMenu(true)} />
      <SideMenu show={showSideMenu} handleClose={() => setShowSideMenu(false)} />
      
      <Container fluid className="flex-grow-1 bg-white py-4">
        <div style={{ maxWidth: '1440px', paddingLeft: '100px', paddingRight: '100px', margin: '0 auto' }} className="responsive-container">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-3 d-none d-lg-block">
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/products">All Products</Breadcrumb.Item>
            <Breadcrumb.Item active>{getCategoryDisplayName()}</Breadcrumb.Item>
          </Breadcrumb>

          {/* Mobile Filter & Sort Bar */}
          <div className="d-lg-none d-flex justify-content-between align-items-center mb-3 py-2">
            <Button variant="dark" className="rounded-0 d-flex align-items-center gap-2" onClick={handleToggleMobileFilters} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              <Funnel size={16} />
              FILTER
            </Button>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" className="rounded-0 d-flex align-items-center gap-2" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
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

          {/* Desktop Filter Button & Sort Bar */}
          <div className="d-none d-lg-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-3 align-items-center">
              <Button variant="dark" className="rounded-0 px-4 py-2" onClick={handleToggleDesktopFilters} style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                FILTER +
              </Button>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="rounded-0 px-4 py-2" style={{ fontWeight: 500, fontSize: '0.9rem', minWidth: '180px' }}>
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
            <div className="text-muted" style={{ fontSize: '0.95rem' }}>{sortedProducts.length} products</div>
          </div>

          {/* Desktop Filter Panel */}
          {showDesktopFilters && (
            <>
              <div className="mb-4 p-4 bg-white d-none d-lg-block" style={{ border: '1px solid #dee2e6', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'static', zIndex: 'auto' }}>
                <div className="row">
                  {/* Price Column */}
                  <div className="col-md-3 col-sm-6 col-12 mb-4">
                    <h6 className="fw-bold mb-3" style={{ fontSize: '0.9rem', color: '#000' }}>Price</h6>
                    <button type="button" onClick={(e) => { e.preventDefault(); setPriceRange([0, 100000]); }} style={{ fontSize: '0.85rem', border: 'none', background: 'none', color: '#6c757d', textAlign: 'left', padding: '4px 0', cursor: 'pointer', marginBottom: '8px' }}>Reset</button>
                    <div className="mb-3">
                      <input type="range" min={0} max={100000} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} style={{ width: '100%', cursor: 'pointer' }} />
                      <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Occasions Column */}
                  <div className="col-md-3 col-sm-6 col-12 mb-4">
                    <h6 className="fw-bold mb-3" style={{ fontSize: '0.9rem', color: '#000' }}>Occasions</h6>
                    <button type="button" onClick={(e) => { e.preventDefault(); setSelectedOccasions([]); }} style={{ fontSize: '0.85rem', border: 'none', background: 'none', color: '#6c757d', textAlign: 'left', padding: '4px 0', cursor: 'pointer' }}>Reset</button>
                    {occasions.map((occasion) => (
                      <div key={occasion} className="mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                        <input type="checkbox" id={`desktop-occasion-${occasion}`} checked={selectedOccasions.includes(occasion)} onChange={() => handleOccasionChange(occasion)} style={{ marginRight: '8px', cursor: 'pointer', width: '16px', height: '16px' }} />
                        <label htmlFor={`desktop-occasion-${occasion}`} onClick={(e) => { e.preventDefault(); handleOccasionChange(occasion); }} style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#000', margin: 0, userSelect: 'none' }}>{occasion}</label>
                      </div>
                    ))}
                  </div>

                  {/* Availability Column */}
                  <div className="col-md-3 col-sm-6 col-12 mb-4">
                    <h6 className="fw-bold mb-3" style={{ fontSize: '0.9rem', color: '#000' }}>Availability</h6>
                    <button type="button" onClick={(e) => { e.preventDefault(); setSelectedAvailability([]); }} style={{ fontSize: '0.85rem', border: 'none', background: 'none', color: '#6c757d', textAlign: 'left', padding: '4px 0', cursor: 'pointer' }}>Reset</button>
                    {availability.map((avail) => (
                      <div key={avail} className="mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                        <input type="checkbox" id={`desktop-avail-${avail}`} checked={selectedAvailability.includes(avail)} onChange={() => handleAvailabilityChange(avail)} style={{ marginRight: '8px', cursor: 'pointer', width: '16px', height: '16px' }} />
                        <label htmlFor={`desktop-avail-${avail}`} onClick={(e) => { e.preventDefault(); handleAvailabilityChange(avail); }} style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#000', margin: 0, userSelect: 'none' }}>{avail}</label>
                      </div>
                    ))}
                  </div>

                  {/* Sizes Column */}
                  <div className="col-md-3 col-sm-6 col-12 mb-4">
                    <h6 className="fw-bold mb-3" style={{ fontSize: '0.9rem', color: '#000' }}>Size</h6>
                    <button type="button" onClick={(e) => { e.preventDefault(); setSelectedSizes([]); }} style={{ fontSize: '0.85rem', border: 'none', background: 'none', color: '#6c757d', textAlign: 'left', padding: '4px 0', cursor: 'pointer', marginBottom: '8px' }}>Reset</button>
                    <div className="d-flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button key={size} type="button" onClick={(e) => { e.preventDefault(); handleSizeChange(size); }} style={{ minWidth: '40px', fontSize: '0.75rem', cursor: 'pointer', padding: '6px 12px', border: selectedSizes.includes(size) ? '1px solid #212529' : '1px solid #6c757d', backgroundColor: selectedSizes.includes(size) ? '#212529' : '#fff', color: selectedSizes.includes(size) ? '#fff' : '#6c757d', borderRadius: '0' }}>{size}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apply and Clear Buttons */}
                <div className="row mt-3">
                  <div className="col d-flex gap-2">
                    <button type="button" onClick={handleApplyFilters} style={{ cursor: 'pointer', padding: '8px 16px', backgroundColor: '#212529', color: '#fff', border: '1px solid #212529', borderRadius: '0', fontSize: '0.9rem', fontWeight: '500' }}>APPLY</button>
                    <button type="button" onClick={handleResetFilters} style={{ cursor: 'pointer', padding: '8px 16px', backgroundColor: '#fff', color: '#6c757d', border: '1px solid #6c757d', borderRadius: '0', fontSize: '0.9rem', fontWeight: '500' }}>Clear</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
              <p className="mt-3 text-muted">Loading {getCategoryDisplayName().toLowerCase()}...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="danger" className="my-4">
              <Alert.Heading>Error Loading Products</Alert.Heading>
              <p>{error}</p>
              <Button variant="outline-danger" onClick={() => window.location.reload()}>Retry</Button>
            </Alert>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <div className="products-grid">
              {sortedProducts.map((product) => (
                <div key={product.id} className="cursor-pointer d-flex flex-column product-card" onClick={() => navigate('/product-details', { state: { product } })}>
                  <div className="position-relative product-image-container" style={{ height: '200px', overflow: 'hidden' }}>
                    <Image src={product.image} alt={product.name} className="w-100 h-100" style={{ objectFit: 'cover', display: 'block' }} />
                    {product.badge && (
                      <Badge className="position-absolute top-0 start-0 m-2 px-2 py-1 text-uppercase fw-bold" style={{ fontSize: '0.55rem', letterSpacing: '0.3px', backgroundColor: '#FFA726', color: '#000', border: 'none' }}>BESTSELLER</Badge>
                    )}
                    <Badge className="position-absolute bottom-0 start-0 m-2 px-2 py-1 fw-bold" style={{ fontSize: '0.6rem', backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none' }}>
                      {Math.round(((product.originalPrice - product.buyPrice) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </div>
                  
                  <div className="d-flex flex-column flex-grow-1 p-2" style={{ height: '173px' }}>
                    <p className="text-muted text-uppercase mb-1" style={{ fontSize: '0.6rem', letterSpacing: '0.3px', fontWeight: 500 }}>{product.category}</p>
                    <h6 className="mb-1 fw-bold" style={{ fontSize: '0.75rem', lineHeight: '1.2', color: '#000', height: '1.8rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.name}</h6>
                    <div className="d-flex align-items-center gap-1 mb-1" style={{ fontSize: '0.6rem' }}>
                      <span className="text-warning fw-bold" style={{ fontSize: '0.7rem' }}>★</span>
                      <span className="fw-bold" style={{ color: '#000' }}>{product.rating}</span>
                      <span className="text-muted">|</span>
                      <span className="text-primary" style={{ fontSize: '0.6rem' }}>({product.reviews > 1000 ? `${(product.reviews / 1000).toFixed(1)}K` : product.reviews})</span>
                    </div>
                    <div className="mb-2">
                      <div className="d-flex align-items-baseline gap-1 mb-1">
                        <span style={{ fontSize: '0.6rem', color: '#666' }}>Buy:</span>
                        <span className="fw-bold" style={{ fontSize: '0.85rem', color: '#000' }}>₹{product.buyPrice.toLocaleString()}</span>
                        <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.65rem' }}>₹{product.originalPrice.toLocaleString()}</span>
                      </div>
                      <div className="d-flex align-items-baseline gap-1">
                        <span style={{ fontSize: '0.6rem', color: '#666' }}>Rent:</span>
                        <span className="fw-bold" style={{ fontSize: '0.85rem', color: '#FFA726' }}>₹{product.rentPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button variant="dark" className="w-100 rounded-0 fw-bold mt-auto text-uppercase" style={{ fontSize: '0.65rem', padding: '0.45rem', letterSpacing: '0.3px', backgroundColor: '#000', color: '#fff', border: 'none' }} onClick={(e) => handleAddToCart(e, product)}>ADD TO CART</Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && sortedProducts.length === 0 && (
            <div className="text-center py-5">
              <h5 className="text-muted">No products found in {getCategoryDisplayName()}</h5>
              <Button variant="outline-dark" className="mt-3" onClick={() => navigate('/products')}>View All Products</Button>
            </div>
          )}

          {/* Pagination */}
          <div className="d-flex justify-content-center align-items-center gap-2 mt-5 mb-5 pagination-container">
            <Button variant="outline-dark" className="pagination-btn pagination-nav" disabled><span className="d-none d-md-inline">← Previous</span><span className="d-md-none">←</span></Button>
            <Button variant="dark" className="pagination-btn pagination-active">1</Button>
            <Button variant="outline-dark" className="pagination-btn">2</Button>
            <Button variant="outline-dark" className="pagination-btn">3</Button>
            <Button variant="outline-dark" className="pagination-btn pagination-nav"><span className="d-none d-md-inline">Next →</span><span className="d-md-none">→</span></Button>
          </div>
        </div>
      </Container>

      {/* Mobile Filter Offcanvas */}
      <Offcanvas show={showMobileFilters} onHide={() => setShowMobileFilters(false)} placement="end" className="d-lg-none">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Price</h6>
            <Form.Range min={0} max={100000} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} />
            <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.85rem' }}>
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Occasions</h6>
            {occasions.map((occasion) => (
              <Form.Check key={occasion} type="checkbox" id={`mobile-occasion-${occasion}`} label={occasion} checked={selectedOccasions.includes(occasion)} onChange={() => handleOccasionChange(occasion)} className="mb-2" />
            ))}
          </div>
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Size</h6>
            <div className="d-flex flex-wrap gap-2">
              {sizes.map((size) => (
                <Button key={size} variant={selectedSizes.includes(size) ? 'dark' : 'outline-secondary'} size="sm" className="rounded-0" onClick={() => handleSizeChange(size)} style={{ minWidth: '45px' }}>{size}</Button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Availability</h6>
            {availability.map((avail) => (
              <Form.Check key={avail} type="checkbox" id={`mobile-avail-${avail}`} label={avail} checked={selectedAvailability.includes(avail)} onChange={() => handleAvailabilityChange(avail)} className="mb-2" />
            ))}
          </div>
          <Button variant="dark" className="w-100 rounded-0 fw-bold" onClick={handleApplyFilters}>APPLY FILTERS</Button>
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
        .form-check-input, .form-check-label, .form-range {
          cursor: pointer !important;
        }
        .pagination-container { flex-wrap: wrap; }
        .pagination-btn {
          min-width: 45px;
          height: 45px;
          border-radius: 0 !important;
          font-weight: 500;
          font-size: 0.95rem;
          border: 1px solid #333 !important;
          padding: 0.5rem 1rem;
        }
        .pagination-btn:hover:not(:disabled) {
          background-color: #333 !important;
          color: #fff !important;
        }
        .pagination-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .pagination-active {
          background-color: #000 !important;
          color: #fff !important;
          border-color: #000 !important;
        }
        .pagination-nav { padding: 0.5rem 1.25rem; }
        @media (max-width: 991px) {
          .responsive-container { padding-left: 12px !important; padding-right: 12px !important; }
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .product-card { height: auto !important; min-height: 280px; border: 1px solid #e8e8e8; }
          .product-image-container { height: 160px !important; }
          .product-card .d-flex.flex-column.flex-grow-1 { padding: 8px !important; height: auto !important; }
          .product-card h6 { font-size: 0.75rem !important; line-height: 1.3 !important; height: auto !important; min-height: 2rem !important; margin-bottom: 6px !important; }
          .product-card p.text-muted { font-size: 0.6rem !important; margin-bottom: 4px !important; }
          .product-card button { font-size: 0.65rem !important; padding: 0.5rem 0.4rem !important; margin-top: 6px !important; }
          .product-card .badge { font-size: 0.5rem !important; padding: 0.25rem 0.4rem !important; }
          .pagination-btn { min-width: 40px; height: 40px; font-size: 0.85rem; padding: 0.4rem 0.8rem; }
        }
        @media (min-width: 992px) {
          .products-grid { grid-template-columns: repeat(auto-fill, minmax(265.5px, 265.5px)); }
        }
        @media (max-width: 576px) {
          .responsive-container { padding-left: 10px !important; padding-right: 10px !important; }
          .products-grid { gap: 8px; }
          .product-card { min-height: 260px; }
          .product-image-container { height: 140px !important; }
          .pagination-btn { min-width: 36px; height: 36px; font-size: 0.8rem; padding: 0.3rem 0.6rem; }
          .pagination-container { gap: 0.4rem !important; margin-top: 2rem !important; margin-bottom: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;
