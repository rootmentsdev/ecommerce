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
  const enquiryType = location.state?.enquiryType || 'rent'; // 'rent' or 'buy'
  
  // Debug: Log the product object and additional data
  console.log('Product object:', product);
  console.log('Selected size:', selectedSize);
  console.log('Selected quantity:', selectedQuantity);
  
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
    
    // Clear previous errors and messages
    setErrors({});
    setSubmitMessage({ type: '', text: '' });
    
    // Validate form data
    const validation = EnquiryService.validateEnquiryForm(formData, enquiryType);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
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
      
      // Only add productId if it's a valid MongoDB ObjectId format
      if (product.id && /^[0-9a-fA-F]{24}$/.test(product.id)) {
        enquiryData.productId = product.id;
      }
      
      // Only add productName if product has a name
      if (product.name) {
        enquiryData.productName = product.name;
      }
      
      // Debug: Log the data being sent
      console.log('Enquiry data being sent:', enquiryData);
      
      // Submit enquiry
      const response = await EnquiryService.submitEnquiry(enquiryData);
      
      if (response.success) {
        setSubmitMessage({
          type: 'success',
          text: 'Enquiry submitted successfully! We will contact you soon.'
        });
        
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
      console.error('Submit enquiry error:', error);
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
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <div className="text-center mb-4">
            <h1 
              className="h3 fw-bold mb-0"
              style={{
                fontFamily: APP_CONFIG.FONTS.PRIMARY,
                fontWeight: '700',
                letterSpacing: '-0.02em',
                color: '#000'
              }}
            >
              Enquire Now
            </h1>
          </div>

          <Form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-4">
              <Form.Label 
                className="fw-medium mb-2"
                style={{
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontSize: '14px',
                  color: '#000'
                }}
              >
                Full Name
              </Form.Label>
              <div className="position-relative">
                <Envelope 
                  size={16} 
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                />
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`ps-5 ${errors.fullName ? 'is-invalid' : ''}`}
                  style={{
                    borderRadius: '8px',
                    border: errors.fullName ? '1px solid #dc3545' : '1px solid #e9ecef',
                    fontFamily: APP_CONFIG.FONTS.SECONDARY,
                    fontSize: '14px',
                    padding: '12px 16px'
                  }}
                />
              </div>
              {errors.fullName && (
                <div className="text-danger mt-1" style={{ fontSize: '12px', fontFamily: APP_CONFIG.FONTS.SECONDARY }}>
                  {errors.fullName}
                </div>
              )}
            </div>

            {/* Mobile Number */}
            <div className="mb-4">
              <Form.Label 
                className="fw-medium mb-2"
                style={{
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontSize: '14px',
                  color: '#000'
                }}
              >
                Mobile Number
              </Form.Label>
              <div className="position-relative">
                <Telephone 
                  size={16} 
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                />
                <Form.Control
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className={`ps-5 ${errors.mobileNumber ? 'is-invalid' : ''}`}
                  style={{
                    borderRadius: '8px',
                    border: errors.mobileNumber ? '1px solid #dc3545' : '1px solid #e9ecef',
                    fontFamily: APP_CONFIG.FONTS.SECONDARY,
                    fontSize: '14px',
                    padding: '12px 16px'
                  }}
                />
              </div>
              {errors.mobileNumber && (
                <div className="text-danger mt-1" style={{ fontSize: '12px', fontFamily: APP_CONFIG.FONTS.SECONDARY }}>
                  {errors.mobileNumber}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <Form.Label 
                className="fw-medium mb-2"
                style={{
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontSize: '14px',
                  color: '#000'
                }}
              >
                Email
              </Form.Label>
              <div className="position-relative">
                <Envelope 
                  size={16} 
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                />
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={`ps-5 ${errors.email ? 'is-invalid' : ''}`}
                  style={{
                    borderRadius: '8px',
                    border: errors.email ? '1px solid #dc3545' : '1px solid #e9ecef',
                    fontFamily: APP_CONFIG.FONTS.SECONDARY,
                    fontSize: '14px',
                    padding: '12px 16px'
                  }}
                />
              </div>
              {errors.email && (
                <div className="text-danger mt-1" style={{ fontSize: '12px', fontFamily: APP_CONFIG.FONTS.SECONDARY }}>
                  {errors.email}
                </div>
              )}
            </div>

             {/* Preferred Booking Date and City - Only show booking date for rent enquiries */}
             <Row className="mb-4 g-3">
               {enquiryType === 'rent' && (
                 <Col xs={6}>
                   <Form.Label 
                     className="fw-medium mb-2"
                     style={{
                       fontFamily: APP_CONFIG.FONTS.SECONDARY,
                       fontSize: '14px',
                       color: '#000'
                     }}
                   >
                     Preferred Booking Date
                   </Form.Label>
                   <Form.Control
                     type="date"
                     name="preferredBookingDate"
                     value={formData.preferredBookingDate}
                     onChange={handleInputChange}
                     min={new Date().toISOString().split('T')[0]}
                     style={{
                       borderRadius: '8px',
                       border: errors.preferredBookingDate ? '1px solid #dc3545' : '1px solid #e9ecef',
                       fontFamily: APP_CONFIG.FONTS.SECONDARY,
                       fontSize: '14px',
                       padding: '12px'
                     }}
                   />
                   {errors.preferredBookingDate && (
                     <div className="text-danger mt-1" style={{ fontSize: '12px', fontFamily: APP_CONFIG.FONTS.SECONDARY }}>
                       {errors.preferredBookingDate}
                     </div>
                   )}
                 </Col>
               )}
              <Col xs={enquiryType === 'rent' ? 6 : 12}>
                <Form.Label 
                  className="fw-medium mb-2"
                  style={{
                    fontFamily: APP_CONFIG.FONTS.SECONDARY,
                    fontSize: '14px',
                    color: '#000'
                  }}
                >
                  District
                </Form.Label>
                <Button
                  variant="outline-secondary"
                  className="w-100 d-flex align-items-center justify-content-between p-3"
                  onClick={() => setShowCityModal(true)}
                  style={{
                    borderRadius: '8px',
                    border: errors.city ? '1px solid #dc3545' : '1px solid #e9ecef',
                    backgroundColor: '#fff',
                    fontFamily: APP_CONFIG.FONTS.SECONDARY,
                    fontSize: '14px',
                    color: formData.city ? '#000' : '#6c757d'
                  }}
                >
                  <div className="d-flex align-items-center">
                    <GeoAlt size={16} className="text-muted me-2" />
                    <span>{formData.city || 'Select District'}</span>
                  </div>
                  <ChevronDown size={16} className="text-muted" />
                </Button>
                {errors.city && (
                  <div className="text-danger mt-1" style={{ fontSize: '12px', fontFamily: APP_CONFIG.FONTS.SECONDARY }}>
                    {errors.city}
                  </div>
                )}
              </Col>
            </Row>

            {/* Pickup and Return Dates - Only show for rent enquiries */}
            {enquiryType === 'rent' && (
              <Row className="mb-4 g-3">
                <Col xs={6}>
                  <Form.Label 
                    className="fw-medium mb-2"
                    style={{
                      fontFamily: APP_CONFIG.FONTS.SECONDARY,
                      fontSize: '14px',
                      color: '#000'
                    }}
                  >
                    Pickup Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handlePickupDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      borderRadius: '8px',
                      border: errors.pickupDate ? '1px solid #dc3545' : '1px solid #e9ecef',
                      fontFamily: APP_CONFIG.FONTS.SECONDARY,
                      fontSize: '14px',
                      padding: '12px'
                    }}
                  />
                  {errors.pickupDate && (
                    <div className="text-danger mt-1" style={{ fontSize: '12px', fontFamily: APP_CONFIG.FONTS.SECONDARY }}>
                      {errors.pickupDate}
                    </div>
                  )}
                </Col>
                <Col xs={6}>
                  <Form.Label 
                    className="fw-medium mb-2"
                    style={{
                      fontFamily: APP_CONFIG.FONTS.SECONDARY,
                      fontSize: '14px',
                      color: '#000'
                    }}
                  >
                    Return Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    readOnly
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #e9ecef',
                      fontFamily: APP_CONFIG.FONTS.SECONDARY,
                      fontSize: '14px',
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      color: '#6c757d'
                    }}
                  />
                  <small className="text-muted" style={{ fontSize: '11px', fontFamily: APP_CONFIG.FONTS.SECONDARY }}>
                    Automatically set to 5 days after pickup
                  </small>
                </Col>
              </Row>
            )}

            {/* Special Notes */}
            <div className="mb-4">
              <Form.Label 
                className="fw-medium mb-2"
                style={{
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontSize: '14px',
                  color: '#000'
                }}
              >
                Special Notes
              </Form.Label>
              <Form.Control
                as="textarea"
                name="specialNotes"
                value={formData.specialNotes}
                onChange={handleInputChange}
                placeholder="Type something..."
                rows={4}
                className={errors.specialNotes ? 'is-invalid' : ''}
                style={{
                  borderRadius: '8px',
                  border: errors.specialNotes ? '1px solid #dc3545' : '1px solid #e9ecef',
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontSize: '14px',
                  padding: '12px 16px',
                  resize: 'none'
                }}
              />
              {errors.specialNotes && (
                <div className="text-danger mt-1" style={{ fontSize: '12px', fontFamily: APP_CONFIG.FONTS.SECONDARY }}>
                  {errors.specialNotes}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <Row className="g-3">
              <Col xs={6}>
                <Button
                  type="button"
                  variant="outline-secondary"
                  className="w-100"
                  onClick={handleCancel}
                  style={{
                    borderRadius: '8px',
                    fontFamily: APP_CONFIG.FONTS.SECONDARY,
                    fontSize: '16px',
                    fontWeight: '500',
                    padding: '12px',
                    border: '1px solid #000',
                    color: '#000',
                    backgroundColor: '#fff'
                  }}
                >
                  Cancel
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  type="submit"
                  variant="dark"
                  className="w-100"
                  disabled={isSubmitting || !formData.fullName || !formData.mobileNumber || !formData.email || !formData.city || (enquiryType === 'rent' && (!formData.preferredBookingDate || !formData.pickupDate))}
                  style={{
                    borderRadius: '8px',
                    fontFamily: APP_CONFIG.FONTS.SECONDARY,
                    fontSize: '16px',
                    fontWeight: '500',
                    padding: '12px',
                    backgroundColor: '#000',
                    border: 'none',
                    opacity: (isSubmitting || !formData.fullName || !formData.mobileNumber || !formData.email || !formData.city || (enquiryType === 'rent' && (!formData.preferredBookingDate || !formData.pickupDate))) ? 0.6 : 1
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </Col>
            </Row>

            {/* Success/Error Message */}
            {submitMessage.text && (
              <Alert 
                variant={submitMessage.type} 
                className="mt-3 mb-0"
                style={{
                  borderRadius: '8px',
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontSize: '14px'
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
      <Modal show={showCityModal} onHide={() => setShowCityModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title 
            style={{
              fontFamily: APP_CONFIG.FONTS.PRIMARY,
              fontWeight: '600'
            }}
          >
            Select District
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-grid gap-2">
            {cities.map((city) => (
              <Button
                key={city}
                variant={formData.city === city ? 'dark' : 'outline-secondary'}
                className="text-start"
                onClick={() => handleCitySelect(city)}
                style={{
                  borderRadius: '8px',
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontSize: '14px',
                  padding: '12px 16px'
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
