import { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Form, InputGroup, Container, Button, Dropdown, Offcanvas, Image, ListGroup } from 'react-bootstrap';
import { Heart, Bag, Person, Search, List, X, Plus, Dash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import FavoritesService from '../services/favoritesService';
import LogoImage from '../assets/Logo.png';
import API_CONFIG from '../config/api';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileSuggestionsRef = useRef(null);

  const categories = [
    { name: 'Suits', slug: 'suits' },
    { name: 'Kurtas', slug: 'kurtas' },
    { name: 'Bandhgalas', slug: 'bandhgalas' },
    { name: 'Formal', slug: 'formal' },
    { name: 'Jewellery', slug: 'jewellery' }
  ];

  // Fetch all products for search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/images/public?category=all&limit=200`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.images) {
            const products = data.data.images.map(item => ({
              id: item._id,
              name: item.title,
              category: item.category,
              image: item.imageUrl
            }));
            setAllProducts(products);
          }
        }
      } catch (err) {
        console.error('Error fetching products for search:', err);
      }
    };
    fetchProducts();
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
      
      if (
        mobileSearchRef.current && 
        !mobileSearchRef.current.contains(event.target) &&
        mobileSuggestionsRef.current &&
        !mobileSuggestionsRef.current.contains(event.target)
      ) {
        // Don't close mobile search on outside click, only close suggestions
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate mobile search suggestions
  useEffect(() => {
    if (mobileSearchQuery.trim().length > 0) {
      const query = mobileSearchQuery.toLowerCase().trim();
      const suggestions = [];

      // Search in categories
      categories.forEach(cat => {
        if (cat.name.toLowerCase().includes(query) || cat.slug.toLowerCase().includes(query)) {
          suggestions.push({
            type: 'category',
            name: cat.name,
            slug: cat.slug
          });
        }
      });

      // Search in products
      allProducts.forEach(product => {
        if (product.name.toLowerCase().includes(query)) {
          suggestions.push({
            type: 'product',
            name: product.name,
            category: product.category,
            id: product.id,
            image: product.image
          });
        }
      });

      // Limit to 8 suggestions
      setSearchSuggestions(suggestions.slice(0, 8));
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [mobileSearchQuery, allProducts]);

  // Generate search suggestions for desktop
  useEffect(() => {
    if (searchQuery.trim().length > 0 && !showMobileSearch) {
      const query = searchQuery.toLowerCase().trim();
      const suggestions = [];

      // Search in categories
      categories.forEach(cat => {
        if (cat.name.toLowerCase().includes(query) || cat.slug.toLowerCase().includes(query)) {
          suggestions.push({
            type: 'category',
            name: cat.name,
            slug: cat.slug
          });
        }
      });

      // Search in products
      allProducts.forEach(product => {
        if (product.name.toLowerCase().includes(query)) {
          suggestions.push({
            type: 'product',
            name: product.name,
            category: product.category,
            id: product.id,
            image: product.image
          });
        }
      });

      // Limit to 8 suggestions
      setSearchSuggestions(suggestions.slice(0, 8));
      setShowSuggestions(suggestions.length > 0);
    } else if (!showMobileSearch) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allProducts, showMobileSearch]);

  useEffect(() => {
    const updateFavoritesCount = () => {
      const count = FavoritesService.getTotalFavoritesCount();
      setFavoritesCount(count);
    };

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      // Calculate total quantity of all items
      const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(totalQuantity);
      setCartItems(cart);
    };

    updateFavoritesCount();
    updateCartCount();

    const handleStorageChange = () => {
      updateFavoritesCount();
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesUpdated', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const handleCartClick = () => {
    setShowCart(true);
  };

  const handleRemoveFromCart = (productId, selectedType) => {
    // Read from localStorage directly to get the most current cart state
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = currentCart.filter(item => {
      const itemId = item.id || item._id;
      const itemType = item.selectedType || 'buy';
      const targetType = selectedType || 'buy';
      // Remove only if both ID and selectedType match
      return !(itemId === productId && itemType === targetType);
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleQuantityChange = (productId, newQuantity, selectedType) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId, selectedType);
      return;
    }
    
    // Read from localStorage directly to get the most current cart state
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = currentCart.map(item => {
      const itemId = item.id || item._id;
      const itemType = item.selectedType || 'buy';
      const targetType = selectedType || 'buy';
      // Update only if both ID and selectedType match
      if (itemId === productId && itemType === targetType) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      // Use rent price if selectedType is 'rent', otherwise use buy price
      const price = item.selectedType === 'rent' ? (item.rentPrice || 0) : (item.buyPrice || 0);
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  const handleEnquireClick = () => {
    // Determine enquiry type based on cart items
    const hasRentItems = cartItems.some(item => item.selectedType === 'rent');
    const hasBuyItems = cartItems.some(item => item.selectedType === 'buy' || !item.selectedType);
    
    let enquiryType = 'rent'; // default
    if (hasRentItems && hasBuyItems) {
      enquiryType = 'mixed'; // both rent and buy items
    } else if (hasBuyItems && !hasRentItems) {
      enquiryType = 'buy';
    } else if (hasRentItems && !hasBuyItems) {
      enquiryType = 'rent';
    }
    
    setShowCart(false);
    
    // Navigate to enquiry page with cart items and determined type
    navigate('/enquire', { 
      state: { 
        cartItems: cartItems,
        enquiryType: enquiryType,
        fromCart: true
      } 
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    const query = mobileSearchQuery.trim();
    if (query) {
      console.log('🔍 Mobile search submit:', query);
      setShowMobileSearch(false);
      setShowSuggestions(false);
      const searchUrl = `/products?search=${encodeURIComponent(query)}`;
      console.log('🔍 Navigating to:', searchUrl);
      navigate(searchUrl);
      setMobileSearchQuery('');
    }
  };

  const handleMobileSuggestionClick = (suggestion) => {
    console.log('🔍 Mobile suggestion clicked:', suggestion);
    
    // Close modal and clear state first
    setShowSuggestions(false);
    setShowMobileSearch(false);
    setMobileSearchQuery('');
    
    // Use setTimeout to ensure modal closes before navigation
    setTimeout(() => {
      if (suggestion.type === 'category') {
        const categoryUrl = `/category/${suggestion.slug}`;
        console.log('🔍 Navigating to category:', categoryUrl);
        navigate(categoryUrl);
      } else if (suggestion.type === 'product') {
        const productCategoryUrl = `/category/${suggestion.category}`;
        console.log('🔍 Navigating to product category:', productCategoryUrl);
        navigate(productCategoryUrl);
      }
    }, 100);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery('');
    setShowSuggestions(false);
    
    if (suggestion.type === 'category') {
      navigate(`/category/${suggestion.slug}`);
    } else if (suggestion.type === 'product') {
      // Navigate to category page with the product's category
      navigate(`/category/${suggestion.category}`);
    }
  };

  const handleCategoryClick = (category) => {
    // Handle both object and string format
    const categorySlug = typeof category === 'object' ? category.slug : category.toLowerCase();
    navigate(`/category/${categorySlug}`);
  };

  return (
    <>
      {/* Main Header */}
      <Navbar bg="white" expand="lg" className="border-bottom sticky-top" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Container fluid style={{ maxWidth: '1440px', paddingLeft: '100px', paddingRight: '100px' }}>
          {/* Mobile Layout */}
          <div className="d-flex d-lg-none w-100 align-items-center justify-content-between py-2">
            <Button 
              variant="link" 
              className="p-0 text-dark" 
              onClick={onMenuClick} 
              style={{ minWidth: '40px', zIndex: 1032, pointerEvents: 'auto', position: 'relative' }}
            >
              <List size={26} />
            </Button>
            <Navbar.Brand href="/" className="mx-auto">
              <Image src={LogoImage} alt="Dappr Squad Logo" style={{ height: '42px', width: 'auto' }} />
            </Navbar.Brand>
            <div className="d-flex gap-3 align-items-center">
              <Button 
                variant="link" 
                className="p-0 text-dark position-relative" 
                onClick={() => setShowMobileSearch(true)}
                style={{ minWidth: '40px', zIndex: 1032, pointerEvents: 'auto', position: 'relative' }}
              >
                <Search size={22} />
              </Button>
              <Button 
                variant="link" 
                className="p-0 text-dark position-relative"
                onClick={handleCartClick}
                style={{ minWidth: '40px', zIndex: 1032, pointerEvents: 'auto', position: 'relative' }}
              >
                <Bag size={22} />
                {cartCount > 0 && (
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                    style={{ 
                      fontSize: '0.65rem', 
                      padding: '2px 5px',
                      transition: 'none',
                      animation: 'none',
                      WebkitTransition: 'none',
                      MozTransition: 'none',
                      OTransition: 'none'
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="d-none d-lg-flex w-100 align-items-center py-3" style={{ flexWrap: 'nowrap' }}>
            {/* Logo */}
            <Navbar.Brand href="/" className="me-4" style={{ minWidth: '140px', flexShrink: 0 }}>
              <Image src={LogoImage} alt="Dappr Squad Logo" style={{ height: '55px', width: 'auto' }} />
            </Navbar.Brand>

            {/* Navigation Links */}
            <Nav className="me-auto align-items-center flex-nowrap">
              <Nav.Link 
                href="/" 
                className="text-dark px-4 fw-medium"
                style={{ fontSize: '0.9rem', letterSpacing: '0.2px', whiteSpace: 'nowrap' }}
              >
                Home
              </Nav.Link>
              <Dropdown>
                <Dropdown.Toggle 
                  variant="link" 
                  className="text-dark text-decoration-none px-4 fw-medium d-flex align-items-center"
                  style={{ fontSize: '0.9rem', letterSpacing: '0.2px', border: 'none', whiteSpace: 'nowrap' }}
                >
                  Categories
                  <span className="ms-1" style={{ fontSize: '0.65rem' }}>▼</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="mt-2 border-0 shadow-lg" style={{ borderRadius: '8px', padding: '8px 0', minWidth: '200px' }}>
                  <Dropdown.Item 
                    onClick={() => navigate('/products')}
                    className="px-4 py-2"
                    style={{ fontSize: '0.9rem' }}
                  >
                    All Products
                  </Dropdown.Item>
                  <Dropdown.Divider className="my-2" />
                  {categories.map((cat) => (
                    <Dropdown.Item 
                      key={cat.slug} 
                      onClick={() => handleCategoryClick(cat)}
                      className="px-4 py-2"
                      style={{ fontSize: '0.9rem' }}
                    >
                      {cat.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Nav.Link 
                href="/how-it-works" 
                className="text-dark px-4 fw-medium"
                style={{ fontSize: '0.9rem', letterSpacing: '0.2px', whiteSpace: 'nowrap' }}
              >
                How It Works
              </Nav.Link>
              <Nav.Link 
                href="/new-arrivals" 
                className="text-dark px-4 fw-medium"
                style={{ fontSize: '0.9rem', letterSpacing: '0.2px', whiteSpace: 'nowrap' }}
              >
                New Arrivals
              </Nav.Link>
            </Nav>

            {/* Search Bar */}
            <div className="me-4 position-relative" ref={searchRef} style={{ width: '280px', flexShrink: 0 }}>
              <Form onSubmit={handleSearchSubmit}>
                <InputGroup className="border rounded-pill" style={{ backgroundColor: '#f8f9fa' }}>
                  <InputGroup.Text className="bg-transparent border-0 ps-3">
                    <Search size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search products..."
                    className="bg-transparent border-0 pe-3"
                    style={{ fontSize: '0.9rem' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim().length > 0 && setShowSuggestions(true)}
                  />
                </InputGroup>
              </Form>
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="position-absolute w-100 mt-1 bg-white border rounded shadow-lg"
                  style={{ 
                    zIndex: 1050, 
                    maxHeight: '400px', 
                    overflowY: 'auto',
                    top: '100%',
                    left: 0
                  }}
                >
                  <ListGroup variant="flush">
                    {searchSuggestions.map((suggestion, index) => (
                      <ListGroup.Item
                        key={index}
                        action
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-2 d-flex align-items-center"
                        style={{ cursor: 'pointer', border: 'none' }}
                      >
                        {suggestion.type === 'category' ? (
                          <>
                            <Search size={16} className="text-muted me-2" />
                            <div className="flex-grow-1">
                              <div className="fw-medium">{suggestion.name}</div>
                              <small className="text-muted">Category</small>
                            </div>
                          </>
                        ) : (
                          <>
                            {suggestion.image && (
                              <Image 
                                src={suggestion.image} 
                                alt={suggestion.name}
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                className="me-2 rounded"
                              />
                            )}
                            <div className="flex-grow-1">
                              <div className="fw-medium">{suggestion.name}</div>
                              <small className="text-muted">{suggestion.category}</small>
                            </div>
                          </>
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}
            </div>

            {/* Right Icons */}
            <div className="d-flex gap-4 align-items-center flex-shrink-0">
              <Button 
                variant="link" 
                className="p-0 text-dark position-relative d-flex align-items-center justify-content-center" 
                onClick={() => navigate('/favorites')}
                style={{ width: '40px', height: '40px' }}
              >
                <Heart size={24} />
                {favoritesCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem', padding: '3px 6px' }}>
                    {favoritesCount}
                  </span>
                )}
              </Button>
              <Button 
                variant="link" 
                className="p-0 text-dark position-relative d-flex align-items-center justify-content-center"
                onClick={handleCartClick}
                style={{ width: '40px', height: '40px' }}
              >
                <Bag size={24} />
                {cartCount > 0 && (
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                    style={{ 
                      fontSize: '0.7rem', 
                      padding: '3px 6px',
                      transition: 'none',
                      animation: 'none',
                      WebkitTransition: 'none',
                      MozTransition: 'none',
                      OTransition: 'none'
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button 
                variant="outline-dark" 
                className="rounded-circle d-flex align-items-center justify-content-center border-2"
                style={{ width: '40px', height: '40px', padding: 0 }}
              >
                <Person size={20} />
              </Button>
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Cart Sidebar */}
      <Offcanvas 
        show={showCart} 
        onHide={() => setShowCart(false)} 
        placement="end"
        className="cart-offcanvas"
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="fw-bold">CART</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <Bag size={48} className="text-muted mb-3" />
              <h5 className="text-muted">Your cart is empty</h5>
              <p className="text-muted">Add some products to get started</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-grow-1" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedType || 'buy'}`} className="d-flex align-items-center p-3 border-bottom">
                    <Image 
                      src={item.image} 
                      alt={item.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', cursor: 'pointer' }}
                      className="me-3"
                      onClick={() => {
                        setShowCart(false);
                        navigate('/product-details', { state: { product: item } });
                      }}
                    />
                    <div 
                      className="flex-grow-1"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setShowCart(false);
                        navigate('/product-details', { state: { product: item } });
                      }}
                    >
                      <h6 className="mb-1" style={{ fontSize: '0.85rem' }}>{item.name}</h6>
                      <p className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>{item.category}</p>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          {item.selectedType === 'rent' ? (
                            <>
                              <span className="fw-bold" style={{ fontSize: '0.85rem', color: '#FF8C00' }}>
                                ₹{((item.rentPrice || 0) * (item.quantity || 1)).toLocaleString()}
                              </span>
                              <span className="text-muted" style={{ fontSize: '0.7rem' }}>/day</span>
                              <span 
                                className="px-2 py-1 rounded" 
                                style={{ 
                                  fontSize: '0.65rem', 
                                  backgroundColor: '#FFF3E0', 
                                  color: '#FF8C00',
                                  fontWeight: 600
                                }}
                              >
                                RENT
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="fw-bold" style={{ fontSize: '0.85rem' }}>
                                ₹{((item.buyPrice || 0) * (item.quantity || 1)).toLocaleString()}
                              </span>
                              <span 
                                className="px-2 py-1 rounded" 
                                style={{ 
                                  fontSize: '0.65rem', 
                                  backgroundColor: '#E8E8E8', 
                                  color: '#333',
                                  fontWeight: 600
                                }}
                              >
                                BUY
                              </span>
                            </>
                          )}
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="d-flex align-items-center border rounded" style={{ minWidth: '100px' }}>
                          <Button 
                            variant="link" 
                            className="p-1 text-dark border-0"
                            style={{ minWidth: '30px', fontSize: '0.8rem' }}
                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1, item.selectedType)}
                          >
                            <Dash size={14} />
                          </Button>
                          <span className="px-2 text-center" style={{ minWidth: '30px', fontSize: '0.85rem' }}>
                            {item.quantity || 1}
                          </span>
                          <Button 
                            variant="link" 
                            className="p-1 text-dark border-0"
                            style={{ minWidth: '30px', fontSize: '0.8rem' }}
                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1, item.selectedType)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="link" 
                      className="p-1 text-muted ms-2"
                      onClick={() => handleRemoveFromCart(item.id, item.selectedType)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div className="border-top p-3 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold fs-5">₹{getTotalPrice().toLocaleString()}</span>
                </div>
                <Button 
                  variant="dark" 
                  className="w-100 rounded-0 fw-bold text-uppercase"
                  onClick={handleEnquireClick}
                  style={{ 
                    fontSize: '0.9rem',
                    padding: '0.75rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  ENQUIRE
                </Button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Mobile Search Modal */}
      <Offcanvas 
        show={showMobileSearch} 
        onHide={() => {
          setShowMobileSearch(false);
          setShowSuggestions(false);
          setMobileSearchQuery('');
        }}
        backdrop={true}
        backdropClassName="mobile-search-backdrop"
        placement="top"
        className="mobile-search-offcanvas"
      >
        <Offcanvas.Header className="border-bottom pb-3">
          <div className="w-100 position-relative" ref={mobileSearchRef}>
            <Form onSubmit={handleMobileSearchSubmit}>
              <InputGroup className="border rounded-pill" style={{ backgroundColor: '#f8f9fa' }}>
                <InputGroup.Text className="bg-transparent border-0 ps-3">
                  <Search size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent border-0 pe-3"
                  style={{ fontSize: '0.95rem' }}
                  value={mobileSearchQuery}
                  onChange={(e) => {
                    setMobileSearchQuery(e.target.value);
                    if (e.target.value.trim().length > 0) {
                      setShowSuggestions(true);
                    } else {
                      setShowSuggestions(false);
                    }
                  }}
                  onFocus={() => {
                    if (mobileSearchQuery.trim().length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  autoFocus
                />
                {mobileSearchQuery.trim() && (
                  <Button
                    type="submit"
                    variant="link"
                    className="bg-transparent border-0 pe-2"
                    style={{ color: '#000' }}
                  >
                    <Search size={18} />
                  </Button>
                )}
                <Button
                  variant="link"
                  className="bg-transparent border-0 pe-2"
                  onClick={() => {
                    setShowMobileSearch(false);
                    setShowSuggestions(false);
                    setMobileSearchQuery('');
                  }}
                >
                  <X size={20} className="text-muted" />
                </Button>
              </InputGroup>
            </Form>
            
            {/* Mobile Search Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div 
                ref={mobileSuggestionsRef}
                className="position-absolute w-100 mt-2 bg-white border rounded shadow-lg"
                style={{ 
                  zIndex: 1050, 
                  maxHeight: '400px', 
                  overflowY: 'auto',
                  top: '100%',
                  left: 0
                }}
              >
                <ListGroup variant="flush">
                  {searchSuggestions.map((suggestion, index) => (
                    <ListGroup.Item
                      key={index}
                      action
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🔍 ListGroup.Item clicked:', suggestion);
                        handleMobileSuggestionClick(suggestion);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="px-3 py-2 d-flex align-items-center"
                      style={{ 
                        cursor: 'pointer', 
                        border: 'none', 
                        touchAction: 'manipulation',
                        userSelect: 'none',
                        WebkitUserSelect: 'none'
                      }}
                    >
                      {suggestion.type === 'category' ? (
                        <>
                          <Search size={16} className="text-muted me-2" />
                          <div className="flex-grow-1">
                            <div className="fw-medium">{suggestion.name}</div>
                            <small className="text-muted">Category</small>
                          </div>
                        </>
                      ) : (
                        <>
                          {suggestion.image && (
                            <Image 
                              src={suggestion.image} 
                              alt={suggestion.name}
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              className="me-2 rounded"
                            />
                          )}
                          <div className="flex-grow-1">
                            <div className="fw-medium">{suggestion.name}</div>
                            <small className="text-muted">{suggestion.category}</small>
                          </div>
                        </>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
          </div>
        </Offcanvas.Header>
      </Offcanvas>

      {/* Responsive Styles */}
      <style>
        {`
          /* Navigation Links - Prevent Wrapping */
          .nav-link {
            white-space: nowrap !important;
            flex-shrink: 0;
          }

          /* Navigation Links Hover Effect */
          .nav-link:hover {
            color: #000 !important;
            opacity: 0.8;
          }

          /* Nav Container - Prevent Wrapping */
          .navbar-nav {
            flex-wrap: nowrap !important;
            white-space: nowrap;
          }

          /* Dropdown Toggle - No Animation */
          .dropdown-toggle {
            text-decoration: none !important;
            border: none !important;
            white-space: nowrap !important;
            flex-shrink: 0;
          }

          .dropdown-toggle::after {
            display: none !important;
          }

          .dropdown-toggle:hover {
            color: #000 !important;
            opacity: 0.8;
          }

          /* Dropdown Menu - No Animation, Better Styling */
          .dropdown-menu {
            border: none !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;
            border-radius: 8px !important;
            margin-top: 8px !important;
            padding: 8px 0 !important;
          }

          .dropdown-item {
            transition: none !important;
          }

          .dropdown-item:hover {
            background-color: #f8f9fa !important;
            color: #000 !important;
          }

          .dropdown-item:active {
            background-color: #e9ecef !important;
            color: #000 !important;
          }

          /* Search Bar Styling */
          .form-control:focus {
            box-shadow: none !important;
            border-color: transparent !important;
            background-color: #f8f9fa !important;
          }

          .input-group:focus-within {
            box-shadow: 0 0 0 2px rgba(0,0,0,0.1) !important;
            background-color: #fff !important;
          }

          /* Button Links */
          .btn-link {
            text-decoration: none !important;
            border: none !important;
          }

          .btn-link:hover {
            opacity: 0.7;
          }

          /* Remove all focus outlines and animations */
          *:focus,
          *:active,
          *:focus-visible {
            outline: none !important;
            box-shadow: none !important;
          }

          .btn:focus,
          .btn:active,
          .btn-link:focus,
          .btn-link:active,
          .dropdown-toggle:focus,
          .dropdown-toggle:active,
          .nav-link:focus,
          .nav-link:active {
            box-shadow: none !important;
            outline: none !important;
            border: none !important;
          }

          .btn,
          .btn-link,
          .dropdown-toggle,
          .nav-link,
          button,
          .dropdown-item {
            transition: none !important;
          }

          /* Cart Badge - No Animation - Override All */
          .badge,
          .badge *,
          span.badge,
          .navbar .badge,
          .navbar .position-relative .badge {
            transition: none !important;
            animation: none !important;
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            -webkit-animation: none !important;
            -moz-animation: none !important;
            -o-animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }

          /* Cart Icon Button - No Animation */
          .navbar .btn-link.position-relative,
          .navbar .btn.position-relative,
          .navbar button.position-relative {
            transition: none !important;
            animation: none !important;
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            transform: none !important;
          }

          /* Cart Icon - No Animation */
          .navbar .btn-link svg,
          .navbar .btn svg {
            transition: none !important;
            animation: none !important;
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
          }

          /* Cart Sidebar - No Animation */
          .cart-offcanvas,
          .cart-offcanvas.offcanvas-end,
          .cart-offcanvas.offcanvas-end.show,
          .cart-offcanvas.offcanvas-end.showing {
            width: 400px !important;
            right: 0 !important;
            left: auto !important;
            top: 0 !important;
            bottom: 0 !important;
            transition: none !important;
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            animation: none !important;
            -webkit-animation: none !important;
            -moz-animation: none !important;
            -o-animation: none !important;
          }
          
          .cart-offcanvas.offcanvas-end {
            transform: translateX(100%) !important;
          }
          
          .cart-offcanvas.offcanvas-end.show,
          .cart-offcanvas.offcanvas-end.showing {
            transform: translateX(0) !important;
          }
          
          .cart-offcanvas .offcanvas-backdrop {
            z-index: 1040 !important;
            transition: none !important;
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
          }

          /* Mobile Search Offcanvas */
          .mobile-search-offcanvas.offcanvas-top {
            height: auto !important;
            max-height: 80vh !important;
            border-bottom: 1px solid #e5e5e5;
            z-index: 1055 !important;
          }

          .mobile-search-offcanvas .offcanvas-header {
            padding: 1rem;
          }

          .mobile-search-offcanvas .offcanvas-body {
            padding: 0;
          }

          .mobile-search-backdrop {
            z-index: 1054 !important;
          }

          /* Ensure suggestions are clickable */
          .mobile-search-offcanvas .list-group-item {
            pointer-events: auto !important;
            -webkit-tap-highlight-color: rgba(0,0,0,0.1);
          }

          /* Badge Styling - No Animation */
          .badge,
          .badge.rounded-pill,
          .badge.bg-danger,
          .navbar .badge,
          .navbar .position-relative .badge,
          .navbar button .badge,
          .navbar .btn-link .badge {
            font-weight: 600;
            transition: none !important;
            animation: none !important;
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            -webkit-animation: none !important;
            -moz-animation: none !important;
            -o-animation: none !important;
            transform: none !important;
            will-change: auto !important;
          }

          /* Prevent Bootstrap badge animations */
          .badge:before,
          .badge:after {
            animation: none !important;
            transition: none !important;
          }

          /* Search Suggestions */
          .list-group-item:hover {
            background-color: #f8f9fa !important;
          }

          .list-group-item:active {
            background-color: #e9ecef !important;
          }

          /* Mobile Header Buttons - Ensure Clickability */
          @media (max-width: 991px) {
            .navbar {
              z-index: 1030 !important;
            }

            .navbar .btn-link,
            .navbar .btn {
              position: relative !important;
              z-index: 1031 !important;
              pointer-events: auto !important;
              touch-action: manipulation !important;
              -webkit-tap-highlight-color: transparent;
            }

            .navbar-brand {
              position: relative;
              z-index: 1030;
            }

            .navbar .container-fluid {
              position: relative;
              z-index: 1030;
            }
          }

          /* Tablet Responsive */
          @media (max-width: 1200px) {
            .navbar .container-fluid {
              padding-left: 60px !important;
              padding-right: 60px !important;
            }
            
            .navbar form {
              width: 320px !important;
            }
          }

          @media (max-width: 992px) {
            .navbar .container-fluid {
              padding-left: 40px !important;
              padding-right: 40px !important;
            }
            
            .navbar form {
              width: 280px !important;
            }
          }

          @media (max-width: 768px) {
            .navbar .container-fluid {
              padding-left: 16px !important;
              padding-right: 16px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Header;
