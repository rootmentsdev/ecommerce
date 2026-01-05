import { useState, useEffect } from 'react';
import { Navbar, Nav, Form, InputGroup, Container, Button, Dropdown } from 'react-bootstrap';
import { Heart, Bag, Person, Search, List } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import FavoritesService from '../services/favoritesService';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Lehangas',
    'Blazers',
    'Suits',
    'Western',
    'Ethnic',
    'Accessories',
    'Jewellery'
  ];

  useEffect(() => {
    const updateFavoritesCount = () => {
      const count = FavoritesService.getTotalFavoritesCount();
      setFavoritesCount(count);
    };

    updateFavoritesCount();

    const handleStorageChange = () => {
      updateFavoritesCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
    };
  }, []);

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
            <Navbar.Brand href="/" className="fw-bold fs-5 mx-auto">Logo</Navbar.Brand>
            <div className="d-flex gap-3">
              <Button variant="link" className="p-0 text-dark">
                <Search size={20} />
              </Button>
              <Button variant="link" className="p-0 text-dark">
                <Bag size={20} />
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="d-none d-lg-flex w-100 align-items-center">
            {/* Logo */}
            <Navbar.Brand href="/" className="fw-bold fs-4 me-5">Logo</Navbar.Brand>

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
              <Button variant="link" className="p-0 text-secondary">
                <Bag size={22} />
              </Button>
              <Button variant="light" className="rounded p-2">
                <Person size={20} />
              </Button>
            </div>
          </div>
        </Container>
      </Navbar>

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

          /* Smooth Dropdown Animation - Fade Only */
          .dropdown-menu {
            display: block;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease, visibility 0.2s;
            pointer-events: none;
          }

          .dropdown-menu.show {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
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
