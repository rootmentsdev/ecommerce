import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Card, Nav, Tab, Modal } from 'react-bootstrap';
import { ArrowLeft, Heart, Share, ChevronDown, GeoAlt } from 'react-bootstrap-icons';
import { useNavigate, useLocation } from 'react-router-dom';

// Import images
import demo1 from '../assets/demo1.png';

// Import reusable components
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';
import SizeSelector from '../components/common/SizeSelector';

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

  // Get enquiry type from navigation state
  const enquiryType = location.state?.enquiryType || 'rent';

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
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Available sizes
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Event handlers
  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSelectedQuantity(1); // Reset quantity when size changes
  };

  const handleQuantityChange = (quantity) => {
    setSelectedQuantity(quantity);
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

  const handleEnquireNow = () => {
    console.log('Enquire now clicked');
    // Get enquiry type from navigation state
    const enquiryType = location.state?.enquiryType || 'rent';
    
    navigate('/enquire', { 
      state: { 
        product,
        selectedSize,
        selectedQuantity,
        enquiryType
      } 
    });
  };

  const handleShare = () => {
    console.log('Share clicked');
    // TODO: Implement share functionality
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
          <Col xs={12}>
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
              {enquiryType === 'rent' && (
                <div 
                  className="text-info mt-2"
                  style={{
                    fontFamily: APP_CONFIG.FONTS.SECONDARY,
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  MOQ: 4 qty
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* Size and Quantity Selection - Hidden for both rent and buy enquiries */}
        {/* <SizeSelector
          selectedSize={selectedSize}
          onSizeChange={handleSizeSelect}
          selectedQuantity={selectedQuantity}
          onQuantityChange={handleQuantityChange}
          availableSizes={sizes}
        /> */}

        {/* Pickup & Return Store - Hidden for both rent and buy enquiries */}
        {/* <div className="mb-4">
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
        </div> */}


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
              {enquiryType === 'rent' 
                ? 'Free cancellation up to 48 hours before rental start date. Minimum order quantity of 4 items required for rental bookings. Full refund processed within 3-5 business days after cancellation.'
                : 'Free cancellation up to 48 hours before purchase delivery. Full refund processed within 3-5 business days after cancellation.'
              }
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
      </div>
    </Container>
  );

  const renderActionButtons = () => (
    <div className="bg-white border-top">
      <Container className="py-4">
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
              style={{
                borderRadius: '8px',
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                fontSize: '16px',
                fontWeight: '600',
                height: '50px'
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
      
    </div>
  );
};

export default ProductDetails;
