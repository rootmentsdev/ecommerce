import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'danger' });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ show: false, message: '', variant: 'danger' });

    try {
      // Simple admin authentication (in production, use proper JWT)
      if (formData.email === 'admin@rootments.com' && formData.password === 'admin123') {
        // Store admin session
        localStorage.setItem('adminToken', 'admin-logged-in');
        localStorage.setItem('adminUser', JSON.stringify({
          email: formData.email,
          role: 'admin',
          name: 'Admin User'
        }));
        
        setAlert({
          show: true,
          message: 'Login successful! Redirecting to dashboard...',
          variant: 'success'
        });
        
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1500);
      } else {
        setAlert({
          show: true,
          message: 'Invalid admin credentials',
          variant: 'danger'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        message: 'Login failed. Please try again.',
        variant: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card style={{ 
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: 'none'
            }}>
              <Card.Body style={{ padding: '40px' }}>
                <div className="text-center mb-4">
                  <h2 style={{ 
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: '700',
                    color: '#2c3e50',
                    marginBottom: '8px'
                  }}>
                    Admin Login
                  </h2>
                  <p style={{ 
                    fontFamily: 'Inter, sans-serif',
                    color: '#6c757d',
                    fontSize: '14px'
                  }}>
                    Access the admin dashboard
                  </p>
                </div>

                {alert.show && (
                  <Alert 
                    variant={alert.variant} 
                    dismissible 
                    onClose={() => setAlert({ show: false, message: '', variant: 'danger' })}
                    style={{ borderRadius: '8px' }}
                  >
                    {alert.message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '500',
                      color: '#2c3e50'
                    }}>
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter admin email"
                      required
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #e9ecef',
                        padding: '12px 16px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '500',
                      color: '#2c3e50'
                    }}>
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter admin password"
                      required
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #e9ecef',
                        padding: '12px 16px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px'
                      }}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="dark"
                    size="lg"
                    className="w-100"
                    disabled={isLoading}
                    style={{
                      borderRadius: '8px',
                      padding: '12px',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '600',
                      fontSize: '16px',
                      height: '50px'
                    }}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <Button
                    variant="link"
                    onClick={() => navigate('/home')}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: '#6c757d',
                      textDecoration: 'none'
                    }}
                  >
                    ← Back to Main Site
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLogin;
