import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css';
import LoginImage from '../assets/LoginImage.png';
import AuthService from '../services/authService';

/**
 * LoginPage Component
 * 
 * A responsive authentication page that handles both user login and registration.
 * Features:
 * - Toggle between login and registration forms
 * - Mobile-first responsive design
 * - Form validation and error handling
 * - Social login options (UI only)
 * - Loading states and user feedback
 * 
 * @returns {JSX.Element} The LoginPage component
 */
const LoginPage = () => {
  // ===========================================
  // STATE MANAGEMENT
  // ===========================================
  
  // Form mode state - controls whether user is logging in or registering
  const [isLogin, setIsLogin] = useState(true);
  
  // Loading state for form submissions
  const [isLoading, setIsLoading] = useState(false);
  
  // Message state for displaying alerts (success/error messages)
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Login form data state
  const [loginData, setLoginData] = useState({
    emailOrPhone: '',
    password: ''
  });
  
  // Registration form data state
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  // Forgot password state management
  const [forgotPasswordData, setForgotPasswordData] = useState({
    emailOrPhone: '',
    verificationCode: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // Forgot password flow state
  const [forgotPasswordStep, setForgotPasswordStep] = useState('email'); // 'email' or 'reset'
  const [resetToken, setResetToken] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  // ===========================================
  // EVENT HANDLERS
  // ===========================================
  
  /**
   * Handles switching between login and registration forms
   * @param {boolean} newIsLogin - Whether to show login form (true) or registration form (false)
   */
  const handleFormSwitch = (newIsLogin) => {
    setIsLogin(newIsLogin);
    setMessage({ type: '', text: '' }); // Clear any existing messages
    // Reset forgot password state when switching forms
    setForgotPasswordStep('email');
    setResetToken('');
    setForgotPasswordData({
      emailOrPhone: '',
      verificationCode: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  /**
   * Handles input changes for forgot password form
   * @param {Event} e - The input change event
   */
  const handleForgotPasswordChange = (e) => {
    setForgotPasswordData({
      ...forgotPasswordData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Handles forgot password request - Step 1: Send verification code
   * @param {Event} e - The form submit event
   */
  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await AuthService.forgotPassword(forgotPasswordData.emailOrPhone);
      
      if (result.success) {
        setResetToken(result.data.resetToken);
        setForgotPasswordStep('reset');
        setMessage({ 
          type: 'success', 
          text: `Verification code sent! Code: ${result.data.verificationCode} (Demo only - expires in 15 minutes)` 
        });
      } else {
        setMessage({ type: 'danger', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'An error occurred. Please try again.' });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  /**
   * Handles password reset - Step 2: Reset password with verification code
   * @param {Event} e - The form submit event
   */
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setMessage({ type: '', text: '' });

    // Client-side validation
    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmNewPassword) {
      setMessage({ type: 'danger', text: 'New passwords do not match' });
      setForgotPasswordLoading(false);
      return;
    }

    try {
      const result = await AuthService.resetPassword(
        resetToken,
        forgotPasswordData.verificationCode,
        forgotPasswordData.newPassword
      );
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Password reset successfully! You can now login with your new password.' });
        // Reset forgot password state and go back to login
        setTimeout(() => {
          setForgotPasswordStep('email');
          setResetToken('');
          setForgotPasswordData({
            emailOrPhone: '',
            verificationCode: '',
            newPassword: '',
            confirmNewPassword: ''
          });
          setIsLogin(true);
          setMessage({ type: '', text: '' });
        }, 2000);
      } else {
        setMessage({ type: 'danger', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'An error occurred. Please try again.' });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  /**
   * Handles going back to login form from forgot password
   */
  const handleBackToLogin = () => {
    setForgotPasswordStep('email');
    setResetToken('');
    setForgotPasswordData({
      emailOrPhone: '',
      verificationCode: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setIsLogin(true);
    setMessage({ type: '', text: '' });
  };

  /**
   * Handles input changes for login form
   * @param {Event} e - The input change event
   */
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Handles input changes for registration form
   * Supports both text inputs and checkboxes
   * @param {Event} e - The input change event
   */
  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData({
      ...registerData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  /**
   * Handles login form submission
   * Validates credentials and redirects on success
   * @param {Event} e - The form submit event
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await AuthService.login(loginData);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        // Redirect to home page after successful login
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setMessage({ type: 'danger', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles registration form submission
   * Validates form data and creates new user account
   * @param {Event} e - The form submit event
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Client-side validation
    if (registerData.password !== registerData.confirmPassword) {
      setMessage({ type: 'danger', text: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    if (!registerData.agreeTerms) {
      setMessage({ type: 'danger', text: 'Please agree to the terms and conditions' });
      setIsLoading(false);
      return;
    }

    try {
      // Remove unnecessary fields before sending to API
      const { confirmPassword, agreeTerms, ...userData } = registerData;
      const result = await AuthService.register(userData);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Registration successful! Redirecting...' });
        // Redirect to home page after successful registration
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setMessage({ type: 'danger', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // ===========================================
  // RENDER METHODS
  // ===========================================
  
  /**
   * Renders the mobile layout for authentication
   * Includes background image, status bar, and form container
   */
  const renderMobileLayout = () => (
      <div className="mobile-auth-container">
        {/* Mobile Background Image */}
        <div 
          className={`mobile-bg-image ${!isLogin ? 'register-bg' : ''}`}
          style={{
            backgroundImage: `url(${LoginImage})`,
            opacity: 1
          }}
        >
          {/* Status Bar */}
          <div className="mobile-status-bar">
            <div className="status-text">Premium rentals starting at ₹1500</div>
          </div>
        </div>

        {/* Mobile Form Card */}
        <div className={`mobile-form-container ${!isLogin ? 'register-section' : ''}`}>
          <div className="form-transition-container">
            <div className={`mobile-form-card ${isLogin ? 'login-form' : 'signup-form'}`}>
            {isLogin ? renderMobileLoginForm() : 
             forgotPasswordStep === 'email' ? renderMobileForgotPasswordForm() :
             forgotPasswordStep === 'reset' ? renderMobileResetPasswordForm() :
             renderMobileRegisterForm()}
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Renders the mobile login form
   * Includes email/phone input, password input, and social login options
   */
  const renderMobileLoginForm = () => (
                <>
                  <div className="form-header">
                    <Button variant="link" className="back-btn">
                      <i className="fas fa-arrow-left"></i>
                    </Button>
                    <h4 className="form-title">Welcome Back</h4>
                  </div>

                  <Form className="mobile-form" onSubmit={handleLogin}>
        {/* Alert Messages */}
                    {message.text && (
                      <Alert variant={message.type} className="mb-3">
                        {message.text}
                      </Alert>
                    )}
                    
        {/* Email/Phone Input */}
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-icon">
                          <i className="fas fa-envelope"></i>
                        </span>
                        <input
                          type="text"
                          name="emailOrPhone"
                          placeholder="Email or Phone Number"
                          className="form-input"
                          value={loginData.emailOrPhone}
                          onChange={handleLoginChange}
                          required
                        />
                      </div>
                    </div>

        {/* Password Input */}
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-icon">
                          <i className="fas fa-lock"></i>
                        </span>
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          className="form-input"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          required
                        />
                      </div>
                    </div>

        {/* Forgot Password Link */}
                    <div className="forgot-password">
          <Button 
            variant="link" 
            className="forgot-link"
            onClick={() => {
              setIsLogin(false);
              setForgotPasswordStep('email');
            }}
          >
                        Forgot password?
                      </Button>
                    </div>

        {/* Login Button */}
                    <Button 
                      type="submit" 
                      className="login-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>

        {/* Social Login Divider */}
                    <div className="divider">
                      <span className="divider-text">or login with</span>
                    </div>

        {/* Social Login Buttons */}
                    <div className="social-buttons">
                      <Button className="social-btn google-btn">
                        <i className="fab fa-google"></i>
                      </Button>
                      <Button className="social-btn apple-btn">
                        <i className="fab fa-apple"></i>
                      </Button>
                      <Button className="social-btn facebook-btn">
                        <i className="fab fa-facebook-f"></i>
                      </Button>
                    </div>

        {/* Sign Up Link */}
                    <div className="signup-link">
                      <span className="link-text">Don't have an account? </span>
                      <Button 
                        variant="link" 
                        className="signup-btn"
                        onClick={() => handleFormSwitch(false)}
                      >
                        Sign Up
                      </Button>
                    </div>
                  </Form>
                </>
  );

  /**
   * Renders the mobile forgot password form (Step 1: Email/Phone input)
   * User enters email or phone to receive verification code
   */
  const renderMobileForgotPasswordForm = () => (
    <>
      <div className="form-header">
        <Button variant="link" className="back-btn" onClick={handleBackToLogin}>
          <i className="fas fa-arrow-left"></i>
        </Button>
        <h4 className="form-title">Reset Password</h4>
      </div>

      <Form className="mobile-form" onSubmit={handleForgotPasswordRequest}>
        {/* Alert Messages */}
        {message.text && (
          <Alert variant={message.type} className="mb-3">
            {message.text}
          </Alert>
        )}
        
        {/* Email/Phone Input */}
        <div className="form-group">
          <div className="input-group">
            <span className="input-icon">
              <i className="fas fa-envelope"></i>
            </span>
            <input
              type="text"
              name="emailOrPhone"
              placeholder="Email or Phone Number"
              className="form-input"
              value={forgotPasswordData.emailOrPhone}
              onChange={handleForgotPasswordChange}
              required
            />
          </div>
        </div>

        {/* Send Code Button */}
        <Button 
          type="submit" 
          className="login-btn"
          disabled={forgotPasswordLoading}
        >
          {forgotPasswordLoading ? 'Sending Code...' : 'Send Verification Code'}
        </Button>

        {/* Back to Login Link */}
        <div className="signup-link">
          <span className="link-text">Remember your password? </span>
          <Button 
            variant="link" 
            className="signup-btn"
            onClick={handleBackToLogin}
          >
            Back to Login
          </Button>
        </div>
      </Form>
    </>
  );

  /**
   * Renders the mobile reset password form (Step 2: Verification code and new password)
   * User enters verification code and new password
   */
  const renderMobileResetPasswordForm = () => (
    <>
      <div className="form-header">
        <Button variant="link" className="back-btn" onClick={() => setForgotPasswordStep('email')}>
          <i className="fas fa-arrow-left"></i>
        </Button>
        <h4 className="form-title">Enter New Password</h4>
      </div>

      <Form className="mobile-form" onSubmit={handlePasswordReset}>
        {/* Alert Messages */}
        {message.text && (
          <Alert variant={message.type} className="mb-3">
            {message.text}
          </Alert>
        )}
        
        {/* Verification Code Input */}
        <div className="form-group">
          <div className="input-group">
            <span className="input-icon">
              <i className="fas fa-key"></i>
            </span>
            <input
              type="text"
              name="verificationCode"
              placeholder="Enter 6-digit code"
              className="form-input"
              value={forgotPasswordData.verificationCode}
              onChange={handleForgotPasswordChange}
              maxLength="6"
              required
            />
          </div>
        </div>

        {/* New Password Input */}
        <div className="form-group">
          <div className="input-group">
            <span className="input-icon">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              className="form-input"
              value={forgotPasswordData.newPassword}
              onChange={handleForgotPasswordChange}
              required
            />
          </div>
        </div>

        {/* Confirm New Password Input */}
        <div className="form-group">
          <div className="input-group">
            <span className="input-icon">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              className="form-input"
              value={forgotPasswordData.confirmNewPassword}
              onChange={handleForgotPasswordChange}
              required
            />
          </div>
        </div>

        {/* Reset Password Button */}
        <Button 
          type="submit" 
          className="signup-btn-main"
          disabled={forgotPasswordLoading}
        >
          {forgotPasswordLoading ? 'Resetting Password...' : 'Reset Password'}
        </Button>

        {/* Back to Email Step Link */}
        <div className="login-link">
          <span className="link-text">Didn't receive code? </span>
          <Button 
            variant="link" 
            className="login-btn-link"
            onClick={() => setForgotPasswordStep('email')}
          >
            Resend Code
          </Button>
        </div>
      </Form>
    </>
  );

  /**
   * Renders the mobile registration form
   * Includes all registration fields, validation, and social signup options
   */
  const renderMobileRegisterForm = () => (
                <>
                  <div className="form-header">
                    <Button variant="link" className="back-btn">
                      <i className="fas fa-arrow-left"></i>
                    </Button>
                    <h4 className="form-title">Create Your Account</h4>
                  </div>

                  <Form className="mobile-form" onSubmit={handleRegister}>
        {/* Alert Messages */}
                    {message.text && (
                      <Alert variant={message.type} className="mb-3">
                        {message.text}
                      </Alert>
                    )}
                    
        {/* Full Name Input */}
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-icon">
                          <i className="fas fa-user"></i>
                        </span>
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Full Name"
                          className="form-input"
                          value={registerData.fullName}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                    </div>

        {/* Email Input */}
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-icon">
                          <i className="fas fa-envelope"></i>
                        </span>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          className="form-input"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                    </div>

        {/* Phone Input */}
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-icon">
                          <i className="fas fa-phone"></i>
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Mobile Number"
                          className="form-input"
                          value={registerData.phone}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                    </div>

        {/* Password Input */}
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-icon">
                          <i className="fas fa-lock"></i>
                        </span>
                        <input
                          type="password"
                          name="password"
                          placeholder="Create Password"
                          className="form-input"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                    </div>

        {/* Confirm Password Input */}
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-icon">
                          <i className="fas fa-lock"></i>
                        </span>
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          className="form-input"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                    </div>

        {/* Terms and Conditions Checkbox */}
                    <div className="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        name="agreeTerms"
                        className="terms-checkbox"
                        checked={registerData.agreeTerms}
                        onChange={handleRegisterChange}
                        required
                      />
                      <label htmlFor="terms" className="terms-label">
                        I agree to the Terms & Conditions and Privacy Policy
                      </label>
                    </div>

        {/* Sign Up Button */}
                    <Button 
                      type="submit" 
                      className="signup-btn-main"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </Button>

        {/* Social Signup Divider */}
                    <div className="divider">
                      <span className="divider-text">or Continue with</span>
                    </div>

        {/* Social Signup Buttons */}
                    <div className="social-buttons">
                      <Button className="social-btn google-btn">
                        <i className="fab fa-google"></i>
                      </Button>
                      <Button className="social-btn apple-btn">
                        <i className="fab fa-apple"></i>
                      </Button>
                      <Button className="social-btn facebook-btn">
                        <i className="fab fa-facebook-f"></i>
                      </Button>
                    </div>

        {/* Login Link */}
                    <div className="login-link">
                      <span className="link-text">Already have an account? </span>
                      <Button 
                        variant="link" 
                        className="login-btn-link"
                        onClick={() => handleFormSwitch(true)}
                      >
                        Log In
                      </Button>
                    </div>
                  </Form>
                </>
  );

  /**
   * Renders the desktop layout for authentication
   * Includes background image on left and form on right
   */
  const renderDesktopLayout = () => (
      <div className="desktop-layout">
        <Container fluid className="h-100">
          <Row className="h-100 g-0">
            {/* Left Side - Background Image */}
            <Col md={5} className="d-none d-md-flex position-relative">
               <div 
                 className="w-100 h-100 position-relative desktop-bg-image"
                 style={{
                   backgroundImage: `url(${LoginImage})`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   backgroundRepeat: 'no-repeat'
                 }}
               >
                {/* Status Bar */}
                <div className="position-absolute top-0 start-0 end-0 d-flex justify-content-center align-items-center p-4 text-white">
                  <div style={{ 
                    fontSize: '14px', 
                    backgroundColor: 'rgba(0,0,0,0.4)', 
                    padding: '8px 20px', 
                    borderRadius: '20px',
                    fontWeight: '500'
                  }}>
                    Premium rentals starting at ₹5000
                  </div>
                </div>
              </div>
            </Col>

            {/* Right Side - Form */}
            <Col md={7} className="d-flex align-items-center justify-content-center p-4">
              <div className="w-100" style={{ maxWidth: '400px' }}>
                {/* Desktop Form */}
                <div className="d-none d-md-block w-100">
                   <Card className="shadow-lg border-0 desktop-form-card" 
                         style={{ 
                           borderRadius: '16px'
                         }}>
                    <Card.Body className="p-4">
                    {/* Form Header */}
                      <div className="d-flex align-items-center mb-3">
                      <Button 
                        variant="link" 
                        className="p-0 me-3 text-dark"
                        onClick={() => {
                          if (forgotPasswordStep === 'reset') {
                            setForgotPasswordStep('email');
                          } else if (forgotPasswordStep === 'email') {
                            handleBackToLogin();
                          }
                        }}
                      >
                          <i className="fas fa-arrow-left" style={{ fontSize: '20px' }}></i>
                        </Button>
                        <h4 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#333' }}>
                        {isLogin ? 'Welcome Back' : 
                         forgotPasswordStep === 'email' ? 'Reset Password' :
                         forgotPasswordStep === 'reset' ? 'Enter New Password' :
                         'Create Your Account'}
                        </h4>
                      </div>

                    {/* Desktop Form Content */}
                    <Form onSubmit={
                      isLogin ? handleLogin : 
                      forgotPasswordStep === 'email' ? handleForgotPasswordRequest :
                      forgotPasswordStep === 'reset' ? handlePasswordReset :
                      handleRegister
                    }>
                      {/* Alert Messages */}
                         {message.text && (
                           <Alert variant={message.type} className="mb-3">
                             {message.text}
                           </Alert>
                         )}
                         
                      {/* Render appropriate form based on mode */}
                      {isLogin ? renderDesktopLoginForm() : 
                       forgotPasswordStep === 'email' ? renderDesktopForgotPasswordForm() :
                       forgotPasswordStep === 'reset' ? renderDesktopResetPasswordForm() :
                       renderDesktopRegisterForm()}
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );

  /**
   * Renders the desktop login form
   * Uses Bootstrap Form components for desktop layout
   */
  const renderDesktopLoginForm = () => (
    <>
      {/* Email/Phone Input */}
                             <Form.Group className="mb-3">
                               <Form.Control
                                 type="text"
                                 name="emailOrPhone"
                                 placeholder="Email or Phone Number"
                                 value={loginData.emailOrPhone}
                                 onChange={handleLoginChange}
                                 style={{ 
                                   backgroundColor: '#f8f9fa', 
                                   border: '1px solid #e9ecef', 
                                   borderRadius: '12px',
                                   fontSize: '16px',
                                   padding: '14px',
                                   height: '50px'
                                 }}
                                 required
                               />
                             </Form.Group>

      {/* Password Input */}
                             <Form.Group className="mb-3">
                               <Form.Control
                                 type="password"
                                 name="password"
                                 placeholder="Password"
                                 value={loginData.password}
                                 onChange={handleLoginChange}
                                 style={{ 
                                   backgroundColor: '#f8f9fa', 
                                   border: '1px solid #e9ecef', 
                                   borderRadius: '12px',
                                   fontSize: '16px',
                                   padding: '14px',
                                   height: '50px'
                                 }}
                                 required
                               />
                             </Form.Group>

      {/* Forgot Password Link */}
                             <div className="text-start mb-3">
        <Button 
          variant="link" 
          className="p-0 text-decoration-none text-muted"
          onClick={() => {
            setIsLogin(false);
            setForgotPasswordStep('email');
          }}
        >
                                 Forgot password?
                               </Button>
                             </div>

      {/* Login Button */}
                             <Button 
                               type="submit"
                               variant="dark" 
                               className="w-100 mb-3 py-3"
                               disabled={isLoading}
                               style={{ 
                                 borderRadius: '12px', 
                                 backgroundColor: '#333',
                                 fontSize: '16px',
                                 fontWeight: '600',
                                 height: '50px'
                               }}
                             >
                               {isLoading ? 'Logging in...' : 'Login'}
                             </Button>

      {/* Social Login Divider */}
                            <div className="text-center mb-3">
                              <small className="text-muted" style={{ fontSize: '12px' }}>or login with</small>
                            </div>

      {/* Social Login Buttons */}
                            <div className="d-flex justify-content-center gap-3 mb-3">
                              <Button variant="outline-light" className="rounded-circle p-2 border" style={{ width: '40px', height: '40px' }}>
                                <i className="fab fa-google" style={{ color: '#db4437' }}></i>
                              </Button>
                              <Button variant="outline-light" className="rounded-circle p-2 border" style={{ width: '40px', height: '40px' }}>
                                <i className="fab fa-apple" style={{ color: '#000' }}></i>
                              </Button>
                              <Button variant="outline-light" className="rounded-circle p-2 border" style={{ width: '40px', height: '40px' }}>
                                <i className="fab fa-facebook-f" style={{ color: '#3b5998' }}></i>
                              </Button>
                            </div>

      {/* Sign Up Link */}
                            <div className="text-center">
                              <small className="text-muted" style={{ fontSize: '12px' }}>
                                Don't have an account?{' '}
                                 <Button 
                                   variant="link" 
                                   className="p-0 text-decoration-none small fw-bold text-primary"
                                   onClick={() => handleFormSwitch(false)}
                                 >
                                   Sign Up
                                 </Button>
                              </small>
                            </div>
                          </>
  );

  /**
   * Renders the desktop forgot password form (Step 1: Email/Phone input)
   * Uses Bootstrap Form components for desktop layout
   */
  const renderDesktopForgotPasswordForm = () => (
    <>
      {/* Email/Phone Input */}
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          name="emailOrPhone"
          placeholder="Email or Phone Number"
          value={forgotPasswordData.emailOrPhone}
          onChange={handleForgotPasswordChange}
          style={{ 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #e9ecef', 
            borderRadius: '12px',
            fontSize: '16px',
            padding: '14px',
            height: '50px'
          }}
          required
        />
      </Form.Group>

      {/* Send Code Button */}
      <Button 
        type="submit"
        variant="dark" 
        className="w-100 mb-3 py-3"
        disabled={forgotPasswordLoading}
        style={{ 
          borderRadius: '12px', 
          backgroundColor: '#333',
          fontSize: '16px',
          fontWeight: '600',
          height: '50px'
        }}
      >
        {forgotPasswordLoading ? 'Sending Code...' : 'Send Verification Code'}
      </Button>

      {/* Back to Login Link */}
      <div className="text-center">
        <small className="text-muted" style={{ fontSize: '12px' }}>
          Remember your password?{' '}
          <Button 
            variant="link" 
            className="p-0 text-decoration-none small fw-bold text-primary"
            onClick={handleBackToLogin}
          >
            Back to Login
          </Button>
        </small>
      </div>
    </>
  );

  /**
   * Renders the desktop reset password form (Step 2: Verification code and new password)
   * Uses Bootstrap Form components for desktop layout
   */
  const renderDesktopResetPasswordForm = () => (
    <>
      {/* Verification Code Input */}
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          name="verificationCode"
          placeholder="Enter 6-digit code"
          value={forgotPasswordData.verificationCode}
          onChange={handleForgotPasswordChange}
          maxLength="6"
          style={{ 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #e9ecef', 
            borderRadius: '12px',
            fontSize: '16px',
            padding: '14px',
            height: '50px'
          }}
          required
        />
      </Form.Group>

      {/* New Password Input */}
      <Form.Group className="mb-3">
        <Form.Control
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={forgotPasswordData.newPassword}
          onChange={handleForgotPasswordChange}
          style={{ 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #e9ecef', 
            borderRadius: '12px',
            fontSize: '16px',
            padding: '14px',
            height: '50px'
          }}
          required
        />
      </Form.Group>

      {/* Confirm New Password Input */}
      <Form.Group className="mb-3">
        <Form.Control
          type="password"
          name="confirmNewPassword"
          placeholder="Confirm New Password"
          value={forgotPasswordData.confirmNewPassword}
          onChange={handleForgotPasswordChange}
          style={{ 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #e9ecef', 
            borderRadius: '12px',
            fontSize: '16px',
            padding: '14px',
            height: '50px'
          }}
          required
        />
      </Form.Group>

      {/* Reset Password Button */}
      <Button 
        type="submit"
        variant="dark" 
        className="w-100 mb-3 py-3"
        disabled={forgotPasswordLoading}
        style={{ 
          borderRadius: '12px', 
          backgroundColor: '#333',
          fontSize: '16px',
          fontWeight: '600',
          height: '50px'
        }}
      >
        {forgotPasswordLoading ? 'Resetting Password...' : 'Reset Password'}
      </Button>

      {/* Back to Email Step Link */}
      <div className="text-center">
        <small className="text-muted" style={{ fontSize: '12px' }}>
          Didn't receive code?{' '}
          <Button 
            variant="link" 
            className="p-0 text-decoration-none small fw-bold text-primary"
            onClick={() => setForgotPasswordStep('email')}
          >
            Resend Code
          </Button>
        </small>
      </div>
    </>
  );

  /**
   * Renders the desktop registration form
   * Uses Bootstrap Form components for desktop layout
   */
  const renderDesktopRegisterForm = () => (
    <>
      {/* Full Name Input */}
                            <Form.Group className="mb-3">
                              <Form.Control
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={registerData.fullName}
                                onChange={handleRegisterChange}
                                style={{ 
                                  backgroundColor: '#f8f9fa',
                                  border: '1px solid #e9ecef',
                                  borderRadius: '12px',
                                  fontSize: '16px',
                                  padding: '14px',
                                  height: '50px'
                                }}
                                required
                              />
                            </Form.Group>

      {/* Email Input */}
                            <Form.Group className="mb-3">
                              <Form.Control
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                style={{ 
                                  backgroundColor: '#f8f9fa',
                                  border: '1px solid #e9ecef',
                                  borderRadius: '12px',
                                  fontSize: '16px',
                                  padding: '14px',
                                  height: '50px'
                                }}
                                required
                              />
                            </Form.Group>

      {/* Phone Input */}
                            <Form.Group className="mb-3">
                              <Form.Control
                                type="tel"
                                name="phone"
                                placeholder="Mobile Number"
                                value={registerData.phone}
                                onChange={handleRegisterChange}
                                style={{ 
                                  backgroundColor: '#f8f9fa',
                                  border: '1px solid #e9ecef',
                                  borderRadius: '12px',
                                  fontSize: '16px',
                                  padding: '14px',
                                  height: '50px'
                                }}
                                required
                              />
                            </Form.Group>

      {/* Password Input */}
                            <Form.Group className="mb-3">
                              <Form.Control
                                type="password"
                                name="password"
                                placeholder="Create Password"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                style={{ 
                                  backgroundColor: '#f8f9fa',
                                  border: '1px solid #e9ecef',
                                  borderRadius: '12px',
                                  fontSize: '16px',
                                  padding: '14px',
                                  height: '50px'
                                }}
                                required
                              />
                            </Form.Group>

      {/* Confirm Password Input */}
                            <Form.Group className="mb-3">
                              <Form.Control
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={registerData.confirmPassword}
                                onChange={handleRegisterChange}
                                style={{ 
                                  backgroundColor: '#f8f9fa',
                                  border: '1px solid #e9ecef',
                                  borderRadius: '12px',
                                  fontSize: '16px',
                                  padding: '14px',
                                  height: '50px'
                                }}
                                required
                              />
                            </Form.Group>

      {/* Terms and Conditions Checkbox */}
                            <Form.Group className="mb-3">
                              <Form.Check 
                                type="checkbox"
                                name="agreeTerms"
                                checked={registerData.agreeTerms}
                                onChange={handleRegisterChange}
                                label={<span style={{ fontSize: '14px', color: '#666' }}>I agree to the Terms & Conditions and Privacy Policy</span>}
                                required
                              />
                            </Form.Group>

      {/* Sign Up Button */}
                            <Button 
                              type="submit"
                              variant="dark" 
                              className="w-100 mb-3 py-3"
                              disabled={isLoading}
                              style={{ 
                                borderRadius: '12px', 
                                backgroundColor: '#333',
                                fontSize: '16px',
                                fontWeight: '600',
                                height: '50px'
                              }}
                            >
                              {isLoading ? 'Creating Account...' : 'Sign Up'}
                            </Button>

      {/* Social Signup Divider */}
                            <div className="text-center mb-3">
                              <small className="text-muted" style={{ fontSize: '12px' }}>or Continue with</small>
                            </div>

      {/* Social Signup Buttons */}
                            <div className="d-flex justify-content-center gap-3 mb-3">
                              <Button variant="outline-secondary" className="rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
                                <i className="fab fa-google" style={{ color: '#db4437' }}></i>
                              </Button>
                              <Button variant="outline-secondary" className="rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
                                <i className="fab fa-apple" style={{ color: '#000' }}></i>
                              </Button>
                              <Button variant="outline-secondary" className="rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
                                <i className="fab fa-facebook-f" style={{ color: '#3b5998' }}></i>
                              </Button>
                            </div>

      {/* Login Link */}
                            <div className="text-center">
                              <small className="text-muted" style={{ fontSize: '12px' }}>
                                Already have an account?{' '}
                                 <Button 
                                   variant="link" 
                                   className="p-0 text-decoration-none small fw-bold text-primary"
                                   onClick={() => handleFormSwitch(true)}
                                 >
                                   Log In
                                 </Button>
                              </small>
                            </div>
                          </>
  );

  // ===========================================
  // MAIN COMPONENT RENDER
  // ===========================================
  
  return (
    <>
      {renderMobileLayout()}
      {renderDesktopLayout()}
    </>
  );
};

export default LoginPage;