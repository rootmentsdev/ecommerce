import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Modal, Alert } from 'react-bootstrap';
import { Envelope, Telephone, GeoAlt, ChevronDown } from 'react-bootstrap-icons';
import { useNavigate, useLocation } from 'react-router-dom';

// Import reusable components
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';

// Import services and constants
import EnquiryService from '../services/enquiryService';
import { APP_CONFIG } from '../constants';

const EnquireNow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get product data from navigation state
  const product = location.state?.product || {};
  const selectedSize = location.state?.selectedSize || '';
  const selectedQuantity = location.state?.selectedQuantity || 1;
  const enquiryType = location.state?.enquiryType || 'rent'; // 'rent', 'buy', or 'mixed'
  const cartItems = location.state?.cartItems || [];
  const fromCart = location.state?.fromCart || false;
  
  // Debug: Log the product object and additional data
  console.log('🔍 EnquireNow - Product object:', product);
  console.log('🔍 EnquireNow - Selected size:', selectedSize);
  console.log('🔍 EnquireNow - Selected quantity:', selectedQuantity);
  console.log('🔍 EnquireNow - Enquiry type:', enquiryType);
  console.log('🔍 EnquireNow - Cart items:', cartItems);
  console.log('🔍 EnquireNow - From cart:', fromCart);
  
  // Determine if we need to show rent fields (for rent or mixed enquiries)
  const showRentFields = enquiryType === 'rent' || enquiryType === 'mixed';
  
  // Validate that we have the necessary product data
  if (!fromCart && (!product || !product.id)) {
    console.warn('⚠️ EnquireNow - Missing product data:', product);
  }
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    preferredBookingDate: '',
    pickupDate: '',
    returnDate: '',
    city: '',
    specialNotes: '',
    selectedSize: '',
    selectedQuantity: 1
  });

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  // Available cities - All Kerala Districts
  const cities = [
    'Thiruvananthapuram',
    'Kollam',
    'Pathanamthitta',
    'Alappuzha',
    'Kottayam',
    'Idukki',
    'Ernakulam',
    'Thrissur',
    'Palakkad',
    'Malappuram',
    'Kozhikode',
    'Wayanad',
    'Kannur',
    'Kasaragod'
  ];

  // Auto-fill user information from localStorage and product details
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setFormData(prev => ({
          ...prev,
          fullName: user.name || user.fullName || '',
          email: user.email || '',
          mobileNumber: user.phone || user.mobileNumber || '',
          selectedSize: selectedSize || '',
          selectedQuantity: selectedQuantity || 1
        }));
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    } else {
      // If no user info, still fill size
      setFormData(prev => ({
        ...prev,
        selectedSize: selectedSize || '',
        selectedQuantity: selectedQuantity || 1
      }));
    }
  }, [selectedSize, selectedQuantity]);

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Calculate return date (5 days after pickup date)
  const calculateReturnDate = (pickupDate) => {
    if (!pickupDate) return '';
    const pickup = new Date(pickupDate);
    const returnDate = new Date(pickup);
    returnDate.setDate(pickup.getDate() + 5);
    return returnDate.toISOString().split('T')[0];
  };

  // Handle pickup date change and auto-calculate return date
  const handlePickupDateChange = (e) => {
    const pickupDate = e.target.value;
    const returnDate = calculateReturnDate(pickupDate);
    
    setFormData(prev => ({
      ...prev,
      pickupDate,
      returnDate
    }));
    
    // Clear pickup date error when user changes the date
    if (errors.pickupDate) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.pickupDate;
        return newErrors;
      });
    }
  };

  const handleCitySelect = (city) => {
    setFormData(prev => ({
      ...prev,
      city: city
    }));
    setShowCityModal(false);
    
    // Clear city error when user selects a city
    if (errors.city) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.city;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 EnquireNow - Submit button clicked');
    console.log('🚀 EnquireNow - Product object:', product);
    console.log('🚀 EnquireNow - Form data:', formData);
    console.log('🚀 EnquireNow - Enquiry type:', enquiryType);
    
    // Clear previous errors and messages
    setErrors({});
    setSubmitMessage({ type: '', text: '' });
    
    // Validate form data
    const validation = EnquiryService.validateEnquiryForm(formData, enquiryType);
    
    if (!validation.isValid) {
      console.log('❌ EnquireNow - Form validation failed:', validation.errors);
      setErrors(validation.errors);
      
      // Auto-scroll to the first validation error field
      const firstErrorField = Object.keys(validation.errors)[0];
      if (firstErrorField) {
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          // Focus the field after scrolling
          setTimeout(() => {
            errorElement.focus();
          }, 500);
        }
      }
      return;
    }
    
    console.log('✅ EnquireNow - Form validation passed');
    setIsSubmitting(true);
    
    try {
      // Prepare enquiry data
      const enquiryData = {
        ...formData,
        enquiryType: enquiryType, // Add enquiry type to the data
        preferredBookingDate: formData.preferredBookingDate ? new Date(formData.preferredBookingDate).toISOString() : null,
        pickupDate: formData.pickupDate ? new Date(formData.pickupDate).toISOString() : null,
        returnDate: formData.returnDate ? new Date(formData.returnDate).toISOString() : null,
        selectedSize: formData.selectedSize && formData.selectedSize.trim() !== '' ? formData.selectedSize : null,
        selectedQuantity: formData.selectedQuantity || 1
      };
      
      // If coming from cart, add cart items info
      if (fromCart && cartItems.length > 0) {
        enquiryData.cartItems = cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          selectedType: item.selectedType || 'buy',
          quantity: item.quantity || 1,
          price: item.selectedType === 'rent' ? item.rentPrice : item.buyPrice
        }));
        // Use first item's info for backward compatibility
        enquiryData.productId = cartItems[0].id;
        enquiryData.productName = cartItems.map(item => item.name).join(', ');
      } else {
        // Add productId if it exists (relaxed validation for admin-created products)
        if (product.id && product.id.trim() !== '') {
          enquiryData.productId = product.id;
        }
        
        // Add productName if product has a name
        if (product.name && product.name.trim() !== '') {
          enquiryData.productName = product.name;
        }
      }
      
      // Debug: Log the data being sent
      console.log('📤 EnquireNow - Enquiry data being sent:', enquiryData);
      console.log('📤 EnquireNow - Product ID:', enquiryData.productId);
      console.log('📤 EnquireNow - Product Name:', enquiryData.productName);
      
      // Submit enquiry
      const response = await EnquiryService.submitEnquiry(enquiryData);
      
      if (response.success) {
        setSubmitMessage({
          type: 'success',
          text: 'Enquiry submitted successfully! We will contact you soon.'
        });
        
        // Clear cart if coming from cart
        if (fromCart) {
          localStorage.setItem('cart', JSON.stringify([]));
          window.dispatchEvent(new Event('cartUpdated'));
        }
        
        // Reset form after successful submission
        setTimeout(() => {
          navigate('/');
          // Ensure we scroll to top when navigating to home
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 100);
        }, 2000);
      }
    } catch (error) {
      console.error('❌ EnquireNow - Submit enquiry error:', error);
      console.error('❌ EnquireNow - Error details:', {
        message: error.message,
        product: product,
        formData: formData
      });
      
      setSubmitMessage({
        type: 'danger',
        text: error.message || 'Failed to submit enquiry. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
    // Ensure we scroll to top when navigating back
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const handleShowSideMenu = () => {
    setShowSideMenu(true);
  };

  const handleCloseSideMenu = () => {
    setShowSideMenu(false);
  };

  // Render methods
  const renderForm = () => (
    <Container fluid className="py-5" style={{ maxWidth: '800px' }}>
      <Row className="justify-content-center">
        <Col xs={12} lg={10}>
          {/* Header Section */}
          <div className="text-center mb-5">
            <h1 
              className="display-5 fw-bold mb-3"
              style={{
                fontFamily: APP_CONFIG.FONTS.PRIMARY,
                fontWeight: '700',
                letterSpacing: '-0.02em',
                color: '#000'
              }}
            >
              {enquiryType === 'buy' ? 'Buy Enquiry' : enquiryType === 'mixed' ? 'Enquire Now' : 'Rent Enquiry'}
            </h1>
            {enquiryType === 'mixed' && (
              <p className="text-muted fs-6">
                Your cart contains both rent and buy items
              </p>
            )}
            <p className="text-muted mt-2">
              Fill in your details and we'll get back to you soon
            </p>
          </div>

          {/* Cart Items Summary - Show when coming from cart */}
          {fromCart && cartItems.length > 0 && (
            <div className="mb-5 p-4 border rounded-3 shadow-sm">
              <h5 className="fw-bold mb-4">Items in your enquiry</h5>
              <div className="d-flex flex-column gap-3">
                {cartItems.map((item, index) => (
                  <div key={item.id || index} className="d-flex align-items-center gap-3 pb-3" style={{ borderBottom: index < cartItems.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="rounded"
                      style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-semibold">{item.name}</h6>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span 
                          className="badge px-2 py-1" 
                          style={{ 
                            fontSize: '0.7rem', 
                            backgroundColor: item.selectedType === 'rent' ? '#FFF3E0' : '#E8E8E8', 
                            color: item.selectedType === 'rent' ? '#FF8C00' : '#333',
                            fontWeight: 600
                          }}
                        >
                          {item.selectedType === 'rent' ? 'RENT' : 'BUY'}
                        </span>
                        <span className="text-muted small">Qty: {item.quantity || 1}</span>
                        <span className="fw-bold" style={{ color: item.selectedType === 'rent' ? '#FF8C00' : '#000' }}>
                          ₹{((item.selectedType === 'rent' ? item.rentPrice : item.buyPrice) * (item.quantity || 1)).toLocaleString()}
                          {item.selectedType === 'rent' && <span className="text-muted small">/day</span>}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Form onSubmit={handleSubmit} className="bg-white p-4 p-lg-5 rounded-3 shadow-sm">
            {/* Full Name */}
            <div className="mb-4">
              <Form.Label className="fw-semibold mb-2">
                Full Name <span className="text-danger">*</span>
              </Form.Label>
              <div className="position-relative">
                <Envelope 
                  size={18} 
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"
                />
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`ps-5 py-3 ${errors.fullName ? 'is-invalid border-danger' : 'border-secondary'}`}
                  style={{
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                />
              </div>
              {errors.fullName && (
                <Form.Text className="text-danger d-block mt-1">
                  {errors.fullName}
                </Form.Text>
              )}
            </div>

            {/* Mobile Number */}
            <div className="mb-4">
              <Form.Label className="fw-semibold mb-2">
                Mobile Number <span className="text-danger">*</span>
              </Form.Label>
              <div className="position-relative">
                <Telephone 
                  size={18} 
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"
                />
                <Form.Control
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className={`ps-5 py-3 ${errors.mobileNumber ? 'is-invalid border-danger' : 'border-secondary'}`}
                  style={{
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                />
              </div>
              {errors.mobileNumber && (
                <Form.Text className="text-danger d-block mt-1">
                  {errors.mobileNumber}
                </Form.Text>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <Form.Label className="fw-semibold mb-2">
                Email <span className="text-danger">*</span>
              </Form.Label>
              <div className="position-relative">
                <Envelope 
                  size={18} 
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"
                />
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={`ps-5 py-3 ${errors.email ? 'is-invalid border-danger' : 'border-secondary'}`}
                  style={{
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                />
              </div>
              {errors.email && (
                <Form.Text className="text-danger d-block mt-1">
                  {errors.email}
                </Form.Text>
              )}
            </div>

             {/* Preferred Booking Date and City - Only show booking date for rent enquiries */}
             <Row className="mb-4 g-3">
               {showRentFields && (
                 <Col xs={12} md={6}>
                   <Form.Label className="fw-semibold mb-2">
                     Preferred Booking Date <span className="text-danger">*</span>
                   </Form.Label>
                   <Form.Control
                     type="date"
                     name="preferredBookingDate"
                     value={formData.preferredBookingDate}
                     onChange={handleInputChange}
                     min={new Date().toISOString().split('T')[0]}
                     className={`py-3 ${errors.preferredBookingDate ? 'is-invalid border-danger' : 'border-secondary'}`}
                     style={{
                       borderRadius: '8px',
                       fontSize: '15px'
                     }}
                   />
                   {errors.preferredBookingDate && (
                     <Form.Text className="text-danger d-block mt-1">
                       {errors.preferredBookingDate}
                     </Form.Text>
                   )}
                 </Col>
               )}
              <Col xs={12} md={showRentFields ? 6 : 12}>
                <Form.Label className="fw-semibold mb-2">
                  District <span className="text-danger">*</span>
                </Form.Label>
                <Button
                  variant="outline-secondary"
                  className="w-100 d-flex align-items-center justify-content-between py-3"
                  onClick={() => setShowCityModal(true)}
                  style={{
                    borderRadius: '8px',
                    border: errors.city ? '2px solid #dc3545' : '1px solid #6c757d',
                    backgroundColor: '#fff',
                    fontSize: '15px',
                    color: formData.city ? '#000' : '#6c757d'
                  }}
                >
                  <div className="d-flex align-items-center">
                    <GeoAlt size={18} className="text-secondary me-2" />
                    <span>{formData.city || 'Select District'}</span>
                  </div>
                  <ChevronDown size={16} className="text-secondary" />
                </Button>
                {errors.city && (
                  <Form.Text className="text-danger d-block mt-1">
                    {errors.city}
                  </Form.Text>
                )}
              </Col>
            </Row>

            {/* Pickup and Return Dates - Only show for rent enquiries */}
            {showRentFields && (
              <Row className="mb-4 g-3">
                <Col xs={12} md={6}>
                  <Form.Label className="fw-semibold mb-2">
                    Pickup Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handlePickupDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`py-3 ${errors.pickupDate ? 'is-invalid border-danger' : 'border-secondary'}`}
                    style={{
                      borderRadius: '8px',
                      fontSize: '15px'
                    }}
                  />
                  {errors.pickupDate && (
                    <Form.Text className="text-danger d-block mt-1">
                      {errors.pickupDate}
                    </Form.Text>
                  )}
                </Col>
                <Col xs={12} md={6}>
                  <Form.Label className="fw-semibold mb-2">
                    Return Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    readOnly
                    className="py-3 border-secondary bg-light"
                    style={{
                      borderRadius: '8px',
                      fontSize: '15px',
                      color: '#6c757d'
                    }}
                  />
                  <Form.Text className="text-muted d-block mt-1">
                    Automatically set to 5 days after pickup
                  </Form.Text>
                </Col>
              </Row>
            )}

            {/* Selected Size - Only show when not from cart */}
            {!fromCart && (
              <div className="mb-4">
                <Form.Label className="fw-semibold mb-3">
                  Select Size
                </Form.Label>
                <div className="d-flex gap-2 flex-wrap">
                  {(product.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map((size) => (
                    <Button
                      key={size}
                      type="button"
                      variant={formData.selectedSize === size ? 'dark' : 'outline-dark'}
                      onClick={() => setFormData(prev => ({ ...prev, selectedSize: size }))}
                      className="px-4 py-2"
                      style={{
                        minWidth: '60px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '15px'
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                {errors.selectedSize && (
                  <Form.Text className="text-danger d-block mt-2">
                    {errors.selectedSize}
                  </Form.Text>
                )}
              </div>
            )}

            {/* Special Notes */}
            <div className="mb-4">
              <Form.Label className="fw-semibold mb-2">
                Special Notes <span className="text-muted fw-normal">(Optional)</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                name="specialNotes"
                value={formData.specialNotes}
                onChange={handleInputChange}
                placeholder="Any special requirements or notes..."
                rows={4}
                className={`py-3 ${errors.specialNotes ? 'is-invalid border-danger' : 'border-secondary'}`}
                style={{
                  borderRadius: '8px',
                  fontSize: '15px',
                  resize: 'none'
                }}
              />
              {errors.specialNotes && (
                <Form.Text className="text-danger d-block mt-1">
                  {errors.specialNotes}
                </Form.Text>
              )}
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-3 mt-5">
              <Button
                type="submit"
                variant="dark"
                size="lg"
                disabled={isSubmitting || !formData.fullName || !formData.mobileNumber || !formData.email || !formData.city || (showRentFields && (!formData.preferredBookingDate || !formData.pickupDate))}
                className="py-3 fw-semibold"
                style={{
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Enquiry'
                )}
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                size="lg"
                onClick={handleCancel}
                className="py-3 fw-semibold"
                style={{
                  borderRadius: '8px',
                  fontSize: '16px',
                  border: '2px solid #6c757d'
                }}
              >
                Cancel
              </Button>
            </div>

            {/* Success/Error Message */}
            {submitMessage.text && (
              <Alert 
                variant={submitMessage.type} 
                className="mt-4 mb-0 rounded-3"
                style={{
                  fontSize: '15px'
                }}
              >
                {submitMessage.text}
              </Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );

  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
      <Header onMenuClick={handleShowSideMenu} />
      <div className="flex-grow-1">
        {renderForm()}
      </div>
      <Footer />
      <SideMenu 
        show={showSideMenu} 
        handleClose={handleCloseSideMenu} 
      />
      
      {/* City Selection Modal */}
      <Modal show={showCityModal} onHide={() => setShowCityModal(false)} centered size="md">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            Select District
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <div className="d-grid gap-2">
            {cities.map((city) => (
              <Button
                key={city}
                variant={formData.city === city ? 'dark' : 'outline-secondary'}
                className="text-start py-3"
                onClick={() => handleCitySelect(city)}
                style={{
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: formData.city === city ? '600' : '400'
                }}
              >
                {city}
              </Button>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EnquireNow;
