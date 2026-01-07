import { useState, useEffect } from 'react';
import { Navbar, Nav, Form, InputGroup, Container, Button, Dropdown, Offcanvas, Image } from 'react-bootstrap';
import { Heart, Bag, Person, Search, List, X, Plus, Dash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import FavoritesService from '../services/favoritesService';
import LogoImage from '../assets/Logo.png';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const categories = [
    'Suits',
    'Kurtas',
    'Bandhgalas',
    'Formal',
    'Jewellery'
  ];

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

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    const updatedCart = cartItems.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    
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
      navigate('/products', { state: { search: searchQuery } });
    }
  };

  const handleCategoryClick = (category) => {
    // Convert display name to lowercase for URL
    const categorySlug = category.toLowerCase();
    navigate(`/category/${categorySlug}`);
  };

  return (
    <>
      {/* Top Black Bar */}
      <div className="bg-dark" style={{ height: '2px' }}></div>

      {/* Main Header */}
      <Navbar bg="white" className="border-bottom py-3 sticky-top">
        <Container fluid style={{ maxWidth: '1440px', paddingLeft: '100px', paddingRight: '100px' }}>
          {/* Mobile Layout */}
          <div className="d-flex d-lg-none w-100 align-items-center justify-content-between">
            <Button variant="link" className="p-0 text-dark" onClick={onMenuClick}>
              <List size={24} />
            </Button>
            <Navbar.Brand href="/" className="mx-auto">
              <Image src={LogoImage} alt="Dappr Squad Logo" style={{ height: '40px', width: 'auto' }} />
            </Navbar.Brand>
            <div className="d-flex gap-3">
              <Button variant="link" className="p-0 text-dark">
                <Search size={20} />
              </Button>
              <Button 
                variant="link" 
                className="p-0 text-dark position-relative"
                onClick={handleCartClick}
              >
                <Bag size={20} />
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="d-none d-lg-flex w-100 align-items-center">
            {/* Logo */}
            <Navbar.Brand href="/" className="me-5">
              <Image src={LogoImage} alt="Dappr Squad Logo" style={{ height: '50px', width: 'auto' }} />
            </Navbar.Brand>

            {/* Navigation Links */}
            <Nav className="me-auto">
              <Nav.Link href="/" className="text-secondary px-3">Home</Nav.Link>
              <Dropdown>
                <Dropdown.Toggle variant="link" className="text-secondary text-decoration-none px-3">
                  Categories
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => navigate('/products')}>
                    All Products
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  {categories.map((cat) => (
                    <Dropdown.Item key={cat} onClick={() => handleCategoryClick(cat)}>
                      {cat}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Nav.Link href="/how-it-works" className="text-secondary px-3">How It Works</Nav.Link>
              <Nav.Link href="/new-arrivals" className="text-secondary px-3">New Arrivals</Nav.Link>
            </Nav>

            {/* Search Bar */}
            <Form onSubmit={handleSearchSubmit} className="me-4" style={{ width: '350px' }}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <Search size={16} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search for products..."
                  className="bg-light border-start-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Form>

            {/* Right Icons */}
            <div className="d-flex gap-3 align-items-center">
              <Button 
                variant="link" 
                className="p-0 text-secondary position-relative" 
                onClick={() => navigate('/favorites')}
              >
                <Heart size={22} />
                {favoritesCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                    {favoritesCount}
                  </span>
                )}
              </Button>
              <Button 
                variant="link" 
                className="p-0 text-secondary position-relative"
                onClick={handleCartClick}
              >
                <Bag size={22} />
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button variant="light" className="rounded p-2">
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
                  <div key={item.id} className="d-flex align-items-center p-3 border-bottom">
                    <Image 
                      src={item.image} 
                      alt={item.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      className="me-3"
                    />
                    <div className="flex-grow-1">
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
                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
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
                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="link" 
                      className="p-1 text-muted ms-2"
                      onClick={() => handleRemoveFromCart(item.id)}
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

      {/* Responsive Styles */}
      <style>
        {`
          .navbar {
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }

          .nav-link {
            font-size: 0.9rem;
          }

          .dropdown-toggle::after {
            margin-left: 0.5rem;
          }

          .btn-link {
            text-decoration: none;
            border: none;
          }

          /* Remove ALL focus/active states, animations, and transitions */
          *:focus,
          *:active,
          *:focus-visible {
            outline: none !important;
            box-shadow: none !important;
          }

          .btn,
          .btn-link,
          .dropdown-toggle,
          .nav-link,
          button {
            transition: none !important;
          }

          .btn:focus,
          .btn:active,
          .btn-link:focus,
          .btn-link:active,
          .dropdown-toggle:focus,
          .dropdown-toggle:active,
          .dropdown-toggle.show,
          .nav-link:focus,
          .nav-link:active {
            box-shadow: none !important;
            outline: none !important;
            border: none !important;
          }

          .btn:focus-visible,
          .btn-link:focus-visible,
          .dropdown-toggle:focus-visible {
            box-shadow: none !important;
            outline: none !important;
          }

          .form-control:focus {
            box-shadow: none;
            border-color: #dee2e6;
          }

          .input-group-text {
            border-right: none;
          }

          .form-control {
            border-left: none;
          }

          .form-control:focus + .input-group-text,
          .input-group-text + .form-control:focus {
            border-color: #dee2e6;
          }

          /* Dropdown - No Animation */
          .dropdown-menu {
            border: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 4px;
          }

          .dropdown-toggle::after {
            border: none;
            content: '';
          }

          /* Cart Sidebar - Force right side placement */
          .cart-offcanvas.offcanvas-end {
            width: 400px !important;
            right: 0 !important;
            left: auto !important;
            top: 0 !important;
            bottom: 0 !important;
            transform: translateX(100%) !important;
            transition: transform 0.3s ease-in-out !important;
          }
          
          .cart-offcanvas.offcanvas-end.show {
            transform: translateX(0) !important;
          }
          
          .cart-offcanvas .offcanvas-backdrop {
            z-index: 1040 !important;
          }

          /* Tablet Responsive */
          @media (max-width: 1200px) {
            .navbar .container-fluid {
              padding-left: 60px !important;
              padding-right: 60px !important;
            }
          }

          @media (max-width: 992px) {
            .navbar .container-fluid {
              padding-left: 40px !important;
              padding-right: 40px !important;
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
