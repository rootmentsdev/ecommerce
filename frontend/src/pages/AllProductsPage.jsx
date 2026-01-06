import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Image, Badge, Breadcrumb, Dropdown, Spinner, Alert, Offcanvas, Modal } from 'react-bootstrap';
import { X, Funnel } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_CONFIG from '../config/api';

const AllProductsPage = () => {
  const navigate = useNavigate();
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('Recommended');
  
  // API state
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cart state
  const [cartItems, setCartItems] = useState([]);
  
  // Buy/Rent selection modal state
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedType, setSelectedType] = useState('rent');

  const handleToggleDesktopFilters = () => setShowDesktopFilters(!showDesktopFilters);
  const handleToggleMobileFilters = () => setShowMobileFilters(!showMobileFilters);
  
  // Show type selection modal when clicking Add to Cart
  const handleAddToCartClick = (e, product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setSelectedType('rent'); // Default to rent
    setShowTypeModal(true);
  };
  
  // Confirm add to cart with selected type
  const handleConfirmAddToCart = () => {
    if (!selectedProduct) return;
    
    const existingItemIndex = cartItems.findIndex(item => item.id === selectedProduct.id);
    
    if (existingItemIndex >= 0) {
      const newCartItems = [...cartItems];
      newCartItems[existingItemIndex] = {
        ...newCartItems[existingItemIndex],
        quantity: (newCartItems[existingItemIndex].quantity || 1) + 1,
        selectedType: selectedType
      };
      setCartItems(newCartItems);
      localStorage.setItem('cart', JSON.stringify(newCartItems));
    } else {
      const productWithQuantity = { ...selectedProduct, quantity: 1, selectedType: selectedType };
      const newCartItems = [...cartItems, productWithQuantity];
      setCartItems(newCartItems);
      localStorage.setItem('cart', JSON.stringify(newCartItems));
    }
    
    window.dispatchEvent(new Event('cartUpdated'));
    setShowTypeModal(false);
    setSelectedProduct(null);
  };
  
  // Add to cart function (legacy - kept for compatibility)
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent navigation to product details
    
    // Check if product is already in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // If item exists, increase quantity
      const newCartItems = [...cartItems];
      newCartItems[existingItemIndex] = {
        ...newCartItems[existingItemIndex],
        quantity: (newCartItems[existingItemIndex].quantity || 1) + 1
      };
      setCartItems(newCartItems);
      localStorage.setItem('cart', JSON.stringify(newCartItems));
    } else {
      // If item doesn't exist, add with quantity 1
      const productWithQuantity = { ...product, quantity: 1 };
      const newCartItems = [...cartItems, productWithQuantity];
      setCartItems(newCartItems);
      localStorage.setItem('cart', JSON.stringify(newCartItems));
    }
    
    // Dispatch event to update header cart count
    window.dispatchEvent(new Event('cartUpdated'));
  };
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
    
    // Listen for cart updates
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
        
        console.log('🔍 AllProductsPage - Fetching from:', `${API_CONFIG.BASE_URL}/images/public?category=all&limit=100`);
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
            description: item.description || '', // Keep for ProductDetails page
            category: item.category,
            productCategory: item.category,
            categories: item.categories || [item.category], // Include categories array
            rentPrice: item.rentalPrice || 0,
            buyPrice: item.price || 0,
            originalPrice: item.actualPrice || item.price || 0,
            badge: item.type === 'new' ? 'New' : null,
            occasion: item.occasions || item.style || 'General',
            sizes: item.sizes ? (typeof item.sizes === 'string' ? item.sizes.split(',').map(s => s.trim()) : item.sizes) : ['S', 'M', 'L', 'XL'],
            availability: [],
            rating: 4.5,
            reviews: Math.floor(Math.random() * 1000) + 100,
            fabric: item.fabric || '',
            color: item.color || '',
            style: item.style || '',
            inclusions: item.inclusions || '',
            inStock: item.inStock !== false
          }));
          
          // Set availability based on prices
          transformedProducts.forEach(product => {
            if (product.rentPrice > 0) product.availability.push('Rental');
            if (product.buyPrice > 0) product.availability.push('Purchase');
            if (product.availability.length === 0) product.availability = ['Purchase'];
          });
          
          setAllProducts(transformedProducts);
          console.log('✅ AllProductsPage - Fetched products:', transformedProducts.length);
          console.log('🔍 AllProductsPage - First 3 products:', transformedProducts.slice(0, 3));
          console.log('🔍 AllProductsPage - All product categories:', transformedProducts.map(p => ({ name: p.name, category: p.category, categories: p.categories })));
        } else {
          console.error('🔍 AllProductsPage - Invalid API response structure:', data);
        }
      } catch (err) {
        console.error('🔍 AllProductsPage - Error fetching products:', err);
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

  console.log('🔍 AllProductsPage - Rendering state:', {
    allProductsCount: allProducts.length,
    filteredProductsCount: filteredProducts.length,
    sortedProductsCount: sortedProducts.length,
    selectedCategories,
    loading,
    error
  });

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedOccasions([]);
    setSelectedSizes([]);
    setSelectedAvailability([]);
    setPriceRange([0, 100000]);
  };

  const handleCategoryChange = (category) => {
    console.log('🔍 Category clicked:', category); // Debug log
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
    setShowDesktopFilters(false);
    setShowMobileFilters(false);
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedOccasions([]);
    setSelectedSizes([]);
    setSelectedAvailability([]);
    setSelectedColors([]);
    setPriceRange([0, 100000]);
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
              onClick={handleToggleMobileFilters}
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
                onClick={handleToggleDesktopFilters}
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
          {showDesktopFilters && (
            <>
              {/* Filter Panel */}
              <div 
                className="mb-4 p-4 bg-white d-none d-lg-block" 
                style={{ 
                  border: '1px solid #dee2e6',
                  borderRadius: '0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  position: 'static',
                  zIndex: 'auto'
                }}
              >
                <div className="row">
                  {/* Categories Column */}
                  <div className="col-md-3 col-sm-6 col-12 mb-4">
                    <h6 className="fw-bold mb-3" style={{ fontSize: '0.9rem', color: '#000' }}>Category</h6>
                    <div className="d-flex flex-column" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleResetFilters();
                        }}
                        style={{ 
                          fontSize: '0.85rem', 
                          border: 'none', 
                          background: 'none',
                          color: '#6c757d',
                          textAlign: 'left',
                          padding: '4px 0',
                          cursor: 'pointer',
                          textDecoration: 'none'
                        }}
                      >
                        Reset
                      </button>
                      {categories.map((cat) => (
                        <div key={cat} className="mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                          <input
                            type="checkbox"
                            id={`desktop-cat-${cat}`}
                            checked={selectedCategories.includes(cat)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleCategoryChange(cat);
                            }}
                            style={{ 
                              marginRight: '8px',
                              cursor: 'pointer',
                              width: '16px',
                              height: '16px'
                            }}
                          />
                          <label 
                            htmlFor={`desktop-cat-${cat}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleCategoryChange(cat);
                            }}
                            style={{ 
                              fontSize: '0.85rem', 
                              cursor: 'pointer', 
                              color: '#000',
                              margin: 0,
                              userSelect: 'none'
                            }}
                          >
                            {getCategoryLabel(cat)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Column */}
                  <div className="col-md-3 col-sm-6 col-12 mb-4">
                    <h6 className="fw-bold mb-3" style={{ fontSize: '0.9rem', color: '#000' }}>Price</h6>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPriceRange([0, 100000]);
                      }}
                      style={{ 
                        fontSize: '0.85rem', 
                        border: 'none', 
                        background: 'none',
                        color: '#6c757d',
                        textAlign: 'left',
                        padding: '4px 0',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        marginBottom: '8px'
                      }}
                    >
                      Reset
                    </button>
                    <div className="mb-3">
                      <input
                        type="range"
                        min={0}
                        max={100000}
                        value={priceRange[1]}
                        onChange={(e) => {
                          e.stopPropagation();
                          setPriceRange([priceRange[0], parseInt(e.target.value)]);
                        }}
                        style={{ 
                          width: '100%',
                          cursor: 'pointer'
                        }}
                      />
                      <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Occasions Column */}
                  <div className="col-md-2 col-sm-6 col-12 mb-4">
                    <h6 className="fw-bold mb-3" style={{ fontSize: '0.9rem', color: '#000' }}>Occasions</h6>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedOccasions([]);
                      }}
                      style={{ 
                        fontSize: '0.85rem', 
                        border: 'none', 
                        background: 'none',
                        color: '#6c757d',
                        textAlign: 'left',
                        padding: '4px 0',
                        cursor: 'pointer',
                        textDecoration: 'none'
                      }}
                    >
                      Reset
                    </button>
                    {occasions.map((occasion) => (
                      <div key={occasion} className="mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          id={`desktop-occasion-${occasion}`}
                          checked={selectedOccasions.includes(occasion)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleOccasionChange(occasion);
                          }}
                          style={{ 
                            marginRight: '8px',
                            cursor: 'pointer',
                            width: '16px',
                            height: '16px'
                          }}
                        />
                        <label 
                          htmlFor={`desktop-occasion-${occasion}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleOccasionChange(occasion);
                          }}
                          style={{ 
                            fontSize: '0.85rem', 
                            cursor: 'pointer', 
                            color: '#000',
                            margin: 0,
                            userSelect: 'none'
                          }}
                        >
                          {occasion}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Availability Column */}
                  <div className="col-md-2 col-sm-6 col-12 mb-4">
                    <h6 className="fw-bold mb-3" style={{ fontSize: '0.9rem', color: '#000' }}>Availability</h6>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedAvailability([]);
                      }}
                      style={{ 
                        fontSize: '0.85rem', 
                        border: 'none', 
                        background: 'none',
                        color: '#6c757d',
                        textAlign: 'left',
                        padding: '4px 0',
                        cursor: 'pointer',
                        textDecoration: 'none'
                      }}
                    >
                      Reset
                    </button>
                    {availability.map((avail) => (
                      <div key={avail} className="mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          id={`desktop-avail-${avail}`}
                          checked={selectedAvailability.includes(avail)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleAvailabilityChange(avail);
                          }}
                          style={{ 
                            marginRight: '8px',
                            cursor: 'pointer',
                            width: '16px',
                            height: '16px'
                          }}
                        />
                        <label 
                          htmlFor={`desktop-avail-${avail}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAvailabilityChange(avail);
                          }}
                          style={{ 
                            fontSize: '0.85rem', 
                            cursor: 'pointer', 
                            color: '#000',
                            margin: 0,
                            userSelect: 'none'
                          }}
                        >
                          {avail}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Sizes Column */}
                  <div className="col-md-2 col-sm-6 col-12 mb-4">
                    <h6 className="fw-bold mb-3" style={{ fontSize: '0.9rem', color: '#000' }}>Size</h6>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedSizes([]);
                      }}
                      style={{ 
                        fontSize: '0.85rem', 
                        border: 'none', 
                        background: 'none',
                        color: '#6c757d',
                        textAlign: 'left',
                        padding: '4px 0',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        marginBottom: '8px'
                      }}
                    >
                      Reset
                    </button>
                    <div className="d-flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSizeChange(size);
                          }}
                          style={{ 
                            minWidth: '40px', 
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            padding: '6px 12px',
                            border: selectedSizes.includes(size) ? '1px solid #212529' : '1px solid #6c757d',
                            backgroundColor: selectedSizes.includes(size) ? '#212529' : '#fff',
                            color: selectedSizes.includes(size) ? '#fff' : '#6c757d',
                            borderRadius: '0'
                          }}
                          onMouseEnter={(e) => {
                            if (!selectedSizes.includes(size)) {
                              e.target.style.backgroundColor = '#6c757d';
                              e.target.style.color = '#fff';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!selectedSizes.includes(size)) {
                              e.target.style.backgroundColor = '#fff';
                              e.target.style.color = '#6c757d';
                            }
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apply and Clear Buttons */}
                <div className="row mt-3">
                  <div className="col d-flex gap-2">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleApplyFilters();
                      }}
                      style={{ 
                        cursor: 'pointer',
                        padding: '8px 16px',
                        backgroundColor: '#212529',
                        color: '#fff',
                        border: '1px solid #212529',
                        borderRadius: '0',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      APPLY
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleResetFilters();
                      }}
                      style={{ 
                        cursor: 'pointer',
                        padding: '8px 16px',
                        backgroundColor: '#fff',
                        color: '#6c757d',
                        border: '1px solid #6c757d',
                        borderRadius: '0',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </>
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
                        color: '#fff',
                        border: 'none'
                      }}
                      onClick={(e) => handleAddToCartClick(e, product)}
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
      <Offcanvas show={showMobileFilters} onHide={() => setShowMobileFilters(false)} placement="end" className="d-lg-none">
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
              max={100000}
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

      {/* Buy/Rent Selection Modal */}
      <Modal show={showTypeModal} onHide={() => setShowTypeModal(false)} centered>
        <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '1.25rem' }}>Select Option</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '24px' }}>
          {selectedProduct && (
            <>
              {/* Product Preview */}
              <div className="d-flex gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid #eee' }}>
                <Image 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div>
                  <p className="text-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    {selectedProduct.category}
                  </p>
                  <h6 className="fw-bold mb-2" style={{ fontSize: '0.95rem' }}>{selectedProduct.name}</h6>
                </div>
              </div>
              
              {/* Buy/Rent Options */}
              <p className="fw-bold mb-3" style={{ fontSize: '0.9rem' }}>How would you like to get this?</p>
              <div className="d-flex flex-column gap-3">
                {/* Buy Option */}
                <div 
                  className={`p-3 d-flex justify-content-between align-items-center`}
                  style={{ 
                    border: selectedType === 'buy' ? '2px solid #000' : '2px solid #e0e0e0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    backgroundColor: selectedType === 'buy' ? '#fafafa' : '#fff',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setSelectedType('buy')}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      style={{ 
                        width: '22px', 
                        height: '22px', 
                        borderRadius: '50%', 
                        border: selectedType === 'buy' ? '2px solid #000' : '2px solid #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {selectedType === 'buy' && (
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#000' }}></div>
                      )}
                    </div>
                    <div>
                      <span className="fw-bold" style={{ fontSize: '0.95rem' }}>Buy</span>
                      <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>Own it forever</p>
                    </div>
                  </div>
                  <span className="fw-bold" style={{ fontSize: '1.1rem' }}>₹{selectedProduct.buyPrice?.toLocaleString()}</span>
                </div>
                
                {/* Rent Option */}
                <div 
                  className={`p-3 d-flex justify-content-between align-items-center`}
                  style={{ 
                    border: selectedType === 'rent' ? '2px solid #FF8C00' : '2px solid #e0e0e0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    backgroundColor: selectedType === 'rent' ? '#fff8f0' : '#fff',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setSelectedType('rent')}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      style={{ 
                        width: '22px', 
                        height: '22px', 
                        borderRadius: '50%', 
                        border: selectedType === 'rent' ? '2px solid #FF8C00' : '2px solid #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {selectedType === 'rent' && (
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FF8C00' }}></div>
                      )}
                    </div>
                    <div>
                      <span className="fw-bold" style={{ fontSize: '0.95rem', color: '#FF8C00' }}>Rent</span>
                      <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>Use it for a few days</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="fw-bold" style={{ fontSize: '1.1rem', color: '#FF8C00' }}>₹{selectedProduct.rentPrice?.toLocaleString()}</span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>/day</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={{ border: 'none', padding: '0 24px 24px' }}>
          <Button 
            variant="dark" 
            className="w-100 fw-bold"
            style={{ 
              height: '50px', 
              borderRadius: '10px',
              fontSize: '0.9rem',
              letterSpacing: '0.5px'
            }}
            onClick={handleConfirmAddToCart}
          >
            ADD TO CART
          </Button>
        </Modal.Footer>
      </Modal>

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
        
        /* Simple filter styles */
        .form-check-input {
          cursor: pointer !important;
        }
        
        .form-check-label {
          cursor: pointer !important;
        }
        
        .form-range {
          cursor: pointer !important;
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
