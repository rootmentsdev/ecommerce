import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Card, Nav, Tab, Modal } from 'react-bootstrap';
import { ArrowLeft, Heart, Share, ChevronDown, Calendar, GeoAlt } from 'react-bootstrap-icons';
import { useNavigate, useLocation } from 'react-router-dom';

// Import images
import demo1 from '../assets/demo1.png';

// Import reusable components
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';

// Import constants
import { APP_CONFIG } from '../constants';

const ProductDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get product data from navigation state with fallback defaults
  const productData = location.state?.product || {
    id: '507f1f77bcf86cd799439021',
    name: 'Premium Black Tuxedo - Italian Fit',
    price: 1200,
    image: demo1
  };

  // Ensure all required properties exist with defaults
  const product = {
    id: productData.id || '507f1f77bcf86cd799439021',
    name: productData.name || 'Premium Black Tuxedo - Italian Fit',
    price: productData.price || 1200,
    actualPrice: productData.actualPrice || 13000,
    securityDeposit: productData.securityDeposit || 5000,
    image: productData.image || demo1,
    category: productData.category || 'Premium Suits',
    occasion: productData.occasion || 'Formal',
    size: productData.size || 'L',
    type: productData.type || 'newArrivals',
    description: productData.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    fabric: productData.fabric || 'Premium Wool Blend',
    color: productData.color || 'Black',
    style: productData.style || 'Two-Piece (Blazer + Trousers)',
    occasions: productData.occasions || ['Wedding Guest', 'Corporate Events', 'Reception', 'Cocktail Party'],
    inclusions: productData.inclusions || ['Blazer + Trousers', 'Shirt & Tie not included'],
    care: productData.care || 'Dry Clean Only'
  };

  const [selectedSize, setSelectedSize] = useState('L');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [showPickupCalendar, setShowPickupCalendar] = useState(false);
  const [showReturnCalendar, setShowReturnCalendar] = useState(false);

  // Available sizes
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Event handlers
  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShowSideMenu = () => {
    setShowSideMenu(true);
  };

  const handleCloseSideMenu = () => {
    setShowSideMenu(false);
  };

  const handleBookTrial = () => {
    console.log('Book trial clicked');
    // TODO: Implement book trial functionality
  };

  const handleEnquireNow = () => {
    console.log('Enquire now clicked');
    navigate('/enquire', { 
      state: { 
        product,
        selectedSize,
        pickupDate,
        returnDate
      } 
    });
  };

  const handleShare = () => {
    console.log('Share clicked');
    // TODO: Implement share functionality
  };

  const handlePickupDateSelect = (date) => {
    setPickupDate(date);
    setShowPickupCalendar(false);
  };

  const handleReturnDateSelect = (date) => {
    setReturnDate(date);
    setShowReturnCalendar(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Select Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // 3 months from now
    return maxDate.toISOString().split('T')[0];
  };

  // Render methods
  const renderProductImage = () => (
    <div className="position-relative" style={{ height: '50vh', overflow: 'hidden' }}>
      <img
        src={product.image}
        alt={product.name}
        className="w-100 h-100 object-fit-cover"
        style={{ borderRadius: '0px 0px 12px 12px' }}
      />
      <Button
        variant="light"
        className="position-absolute top-0 end-0 m-3 rounded-circle p-2"
        onClick={handleFavoriteToggle}
        style={{ 
          width: '40px', 
          height: '40px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: 'none'
        }}
      >
        <Heart 
          size={20} 
          className={isFavorite ? 'text-danger' : 'text-muted'}
          fill={isFavorite ? 'currentColor' : 'none'}
        />
      </Button>
    </div>
  );

  const renderProductInfo = () => (
    <Card className="border-0 shadow-sm" style={{ borderRadius: '12px 12px 0px 0px' }}>
      <Card.Body className="p-4">
        {/* Product Title */}
        <h1 
          className="h3 fw-bold mb-3"
          style={{
            fontFamily: APP_CONFIG.FONTS.PRIMARY,
            letterSpacing: '-0.02em',
            color: '#000'
          }}
        >
          {product.name}
        </h1>

        {/* Description */}
        <p 
          className="text-muted mb-4"
          style={{
            fontFamily: APP_CONFIG.FONTS.SECONDARY,
            fontSize: '14px',
            lineHeight: '1.5'
          }}
        >
          {product.description}
        </p>

        {/* Pricing */}
        <Row className="mb-4">
          <Col xs={6}>
            <div>
              <div 
                className="h4 fw-bold mb-1"
                style={{
                  fontFamily: APP_CONFIG.FONTS.PRIMARY,
                  color: '#000'
                }}
              >
                ₹{product.price}
              </div>
              <div 
                className="text-muted text-decoration-line-through"
                style={{
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontSize: '12px'
                }}
              >
                Actual Price: ₹{product.actualPrice}
              </div>
            </div>
          </Col>
          <Col xs={6} className="text-end">
            <div>
              <div 
                className="h5 fw-bold mb-1"
                style={{
                  fontFamily: APP_CONFIG.FONTS.PRIMARY,
                  color: '#000'
                }}
              >
                ₹{product.securityDeposit}
              </div>
              <div 
                className="text-muted"
                style={{
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontSize: '12px'
                }}
              >
                Security Deposit
              </div>
            </div>
          </Col>
        </Row>

        {/* Available Sizes */}
        <div className="mb-4">
          <Row className="align-items-center mb-3">
            <Col>
              <span 
                className="fw-medium"
                style={{
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontSize: '14px'
                }}
              >
                Available Sizes
              </span>
            </Col>
            <Col className="text-end">
              <Button 
                variant="link" 
                className="p-0 text-decoration-none"
                style={{
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontSize: '12px',
                  color: '#000'
                }}
              >
                Size Guide
              </Button>
            </Col>
          </Row>
          <Row className="g-2">
            {sizes.map((size) => (
              <Col key={size} xs="auto">
                <Button
                  variant={selectedSize === size ? 'dark' : 'outline-secondary'}
                  size="sm"
                  onClick={() => handleSizeSelect(size)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    fontFamily: APP_CONFIG.FONTS.SECONDARY,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {size}
                </Button>
              </Col>
            ))}
          </Row>
        </div>

        {/* Pickup & Return Store */}
        <div className="mb-4">
          <div 
            className="mb-2"
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Pickup & Return Store
          </div>
          <Button
            variant="outline-secondary"
            className="w-100 d-flex align-items-center justify-content-between p-3"
            style={{
              borderRadius: '8px',
              border: '1px solid #e9ecef',
              backgroundColor: '#fff'
            }}
          >
            <div className="d-flex align-items-center">
              <GeoAlt size={16} className="text-muted me-2" />
              <span 
                style={{
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontSize: '14px',
                  color: '#000'
                }}
              >
                Default Nearest Store
              </span>
            </div>
            <ChevronDown size={16} className="text-muted" />
          </Button>
        </div>

        {/* Pickup & Return Dates */}
        <Row className="mb-4 g-3">
          <Col xs={6}>
            <div 
              className="mb-2"
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Pickup Date
            </div>
            <Button
              variant="outline-secondary"
              className="w-100 d-flex align-items-center p-3"
              onClick={() => setShowPickupCalendar(true)}
              style={{
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                backgroundColor: '#fff'
              }}
            >
              <Calendar size={16} className="text-muted me-2" />
              <span 
                style={{
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontSize: '14px',
                  color: pickupDate ? '#000' : '#6c757d'
                }}
              >
                {formatDate(pickupDate)}
              </span>
            </Button>
          </Col>
          <Col xs={6}>
            <div 
              className="mb-2"
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Return Date
            </div>
            <Button
              variant="outline-secondary"
              className="w-100 d-flex align-items-center p-3"
              onClick={() => setShowReturnCalendar(true)}
              style={{
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                backgroundColor: '#fff'
              }}
            >
              <Calendar size={16} className="text-muted me-2" />
              <span 
                style={{
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontSize: '14px',
                  color: returnDate ? '#000' : '#6c757d'
                }}
              >
                {formatDate(returnDate)}
              </span>
            </Button>
          </Col>
        </Row>

        {/* Included Items */}
        <div className="mb-4">
          <div 
            className="mb-3"
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Included Items
          </div>
          <ul className="list-unstyled mb-0">
            {product.inclusions.map((item, index) => (
              <li key={index} className="mb-2">
                <div 
                  className="d-flex align-items-center"
                  style={{
                    fontFamily: APP_CONFIG.FONTS.SECONDARY,
                    fontSize: '14px'
                  }}
                >
                  <div 
                    className="me-2"
                    style={{
                      width: '4px',
                      height: '4px',
                      backgroundColor: '#000',
                      borderRadius: '50%'
                    }}
                  />
                  {item}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Cancellation Policy */}
        <Card 
          className="mb-4"
          style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: 'none'
          }}
        >
          <Card.Body className="p-3">
            <div 
              className="mb-2"
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancellation Policy
            </div>
            <p 
              className="mb-2"
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                fontSize: '12px',
                color: '#6c757d',
                lineHeight: '1.4'
              }}
            >
              Free cancellation up to 24 hours before pickup. Security deposit refunded within 5-7 business days after return.
            </p>
            <Button 
              variant="link" 
              className="p-0 text-decoration-none"
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                fontSize: '12px',
                color: '#000'
              }}
            >
              View Full Policy →
            </Button>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );

  const renderNavigationTabs = () => (
    <div className="bg-white border-top">
      <Container>
        <Nav variant="tabs" className="border-0">
          {['Details', 'Availability', 'Return', 'Review'].map((tab) => (
            <Nav.Item key={tab}>
              <Nav.Link
                eventKey={tab.toLowerCase()}
                className={`border-0 px-4 py-3 ${
                  activeTab === tab.toLowerCase() ? 'bg-dark text-white' : 'text-muted'
                }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
                style={{
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: activeTab === tab.toLowerCase() ? '8px 8px 0px 0px' : '0px'
                }}
              >
                {tab}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </Container>
    </div>
  );

  const renderProductDetails = () => (
    <Container className="py-4">
      <div 
        className="mb-3"
        style={{
          fontFamily: APP_CONFIG.FONTS.PRIMARY,
          fontSize: '18px',
          fontWeight: '600'
        }}
      >
        Product Details
      </div>
      <div className="row g-3">
        <div className="col-6">
          <div 
            className="text-muted"
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '12px'
            }}
          >
            Fabric
          </div>
          <div 
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {product.fabric}
          </div>
        </div>
        <div className="col-6">
          <div 
            className="text-muted"
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '12px'
            }}
          >
            Color
          </div>
          <div 
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {product.color}
          </div>
        </div>
        <div className="col-6">
          <div 
            className="text-muted"
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '12px'
            }}
          >
            Style
          </div>
          <div 
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {product.style}
          </div>
        </div>
        <div className="col-6">
          <div 
            className="text-muted"
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '12px'
            }}
          >
            Occasions
          </div>
          <div 
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {product.occasions.join(', ')}
          </div>
        </div>
        <div className="col-6">
          <div 
            className="text-muted"
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '12px'
            }}
          >
            Inclusions
          </div>
          <div 
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {product.inclusions.join(', ')}
          </div>
        </div>
        <div className="col-6">
          <div 
            className="text-muted"
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '12px'
            }}
          >
            Care
          </div>
          <div 
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {product.care}
          </div>
        </div>
      </div>
    </Container>
  );

  const renderActionButtons = () => (
    <div className="bg-white border-top">
      <Container className="py-4">
        <Row className="g-3">
          <Col xs={12} className="text-center">
            <Button
              variant="outline-secondary"
              size="lg"
              className="w-100 mb-3"
              onClick={handleBookTrial}
              style={{
                borderRadius: '8px',
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                fontSize: '16px',
                fontWeight: '500',
                padding: '12px'
              }}
            >
              Book a Trial
            </Button>
          </Col>
        </Row>
      </Container>
      
      {/* Sticky Footer */}
      <div 
        className="position-fixed bottom-0 start-0 end-0 bg-white border-top p-3"
        style={{ zIndex: 1000 }}
      >
        <Row className="g-3">
          <Col xs="auto">
            <Button
              variant="outline-secondary"
              className="rounded-3 p-3"
              onClick={handleShare}
              style={{
                width: '50px',
                height: '50px'
              }}
            >
              <Share size={20} />
            </Button>
          </Col>
          <Col>
            <Button
              variant="dark"
              size="lg"
              className="w-100 h-100"
              onClick={handleEnquireNow}
              disabled={!pickupDate || !returnDate}
              style={{
                borderRadius: '8px',
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                fontSize: '16px',
                fontWeight: '600',
                height: '50px',
                opacity: (!pickupDate || !returnDate) ? 0.5 : 1,
                cursor: (!pickupDate || !returnDate) ? 'not-allowed' : 'pointer'
              }}
            >
              Enquire now
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
      <Header onMenuClick={handleShowSideMenu} />
      <div className="flex-grow-1" style={{ paddingBottom: '100px' }}>
        {renderProductImage()}
        {renderProductInfo()}
        {renderNavigationTabs()}
        {renderProductDetails()}
        {renderActionButtons()}
      </div>
      <SideMenu 
        show={showSideMenu} 
        handleClose={handleCloseSideMenu} 
      />
      
      {/* Pickup Date Calendar Modal */}
      <Modal show={showPickupCalendar} onHide={() => setShowPickupCalendar(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title 
            style={{
              fontFamily: APP_CONFIG.FONTS.PRIMARY,
              fontWeight: '600'
            }}
          >
            Select Pickup Date
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="date"
            value={pickupDate}
            onChange={(e) => handlePickupDateSelect(e.target.value)}
            min={getMinDate()}
            max={getMaxDate()}
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '16px',
              padding: '12px',
              borderRadius: '8px'
            }}
          />
        </Modal.Body>
      </Modal>

      {/* Return Date Calendar Modal */}
      <Modal show={showReturnCalendar} onHide={() => setShowReturnCalendar(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title 
            style={{
              fontFamily: APP_CONFIG.FONTS.PRIMARY,
              fontWeight: '600'
            }}
          >
            Select Return Date
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="date"
            value={returnDate}
            onChange={(e) => handleReturnDateSelect(e.target.value)}
            min={pickupDate || getMinDate()}
            max={getMaxDate()}
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '16px',
              padding: '12px',
              borderRadius: '8px'
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductDetails;
