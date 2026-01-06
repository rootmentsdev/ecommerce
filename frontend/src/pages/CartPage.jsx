import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Image, Card, Badge } from 'react-bootstrap';
import { Trash, Plus, Dash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
    
    // Initialize quantities
    const initialQuantities = {};
    savedCart.forEach(item => {
      initialQuantities[item.id] = 1;
    });
    setQuantities(initialQuantities);
  }, []);

  // Remove item from cart
  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Remove quantity
    const updatedQuantities = { ...quantities };
    delete updatedQuantities[productId];
    setQuantities(updatedQuantities);
  };

  // Update quantity
  const handleQuantityChange = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const quantity = quantities[item.id] || 1;
      return total + (item.buyPrice * quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      
      <Container fluid className="flex-grow-1 bg-light py-4">
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          paddingLeft: '20px',
          paddingRight: '20px'
        }}>
          <h2 className="mb-4 fw-bold">Shopping Cart</h2>

          {cartItems.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <h4 className="text-muted mb-4">Your cart is empty</h4>
                <Button 
                  variant="dark" 
                  className="rounded-0 px-4"
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {/* Cart Items */}
              <Col lg={8} className="mb-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="mb-3 rounded-0 border shadow-sm">
                    <Card.Body className="p-3">
                      <Row>
                        {/* Product Image */}
                        <Col xs={4} sm={3} md={2}>
                          <Image 
                            src={item.image} 
                            alt={item.name}
                            fluid
                            style={{ 
                              width: '100%',
                              height: '120px',
                              objectFit: 'cover',
                              cursor: 'pointer',
                              borderRadius: '4px'
                            }}
                            onClick={() => navigate('/product-details', { state: { product: item } })}
                          />
                        </Col>

                        {/* Product Details */}
                        <Col xs={8} sm={9} md={10}>
                          <div className="d-flex flex-column h-100">
                            {/* Top Section: Name and Remove */}
                            <div className="d-flex justify-content-between mb-2">
                              <div className="flex-grow-1">
                                <h5 
                                  className="mb-1 fw-bold" 
                                  style={{ cursor: 'pointer', fontSize: '1.1rem' }}
                                  onClick={() => navigate('/product-details', { state: { product: item } })}
                                >
                                  {item.name}
                                </h5>
                                <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                                  {item.category}
                                </p>
                                {item.badge && (
                                  <Badge bg="warning" text="dark" className="me-2">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="link"
                                className="text-danger p-0"
                                onClick={() => handleRemoveItem(item.id)}
                                style={{ height: 'fit-content' }}
                              >
                                <Trash size={20} />
                              </Button>
                            </div>

                            {/* Bottom Section: Quantity and Price */}
                            <div className="d-flex justify-content-between align-items-end mt-auto">
                              {/* Quantity Controls */}
                              <div className="d-flex align-items-center gap-2">
                                <span className="text-muted me-2" style={{ fontSize: '0.9rem' }}>Qty:</span>
                                <Button
                                  variant="outline-dark"
                                  size="sm"
                                  className="rounded-0"
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  disabled={quantities[item.id] <= 1}
                                  style={{ width: '32px', height: '32px', padding: '0' }}
                                >
                                  <Dash />
                                </Button>
                                <span className="fw-bold mx-2" style={{ minWidth: '30px', textAlign: 'center', fontSize: '1rem' }}>
                                  {quantities[item.id] || 1}
                                </span>
                                <Button
                                  variant="outline-dark"
                                  size="sm"
                                  className="rounded-0"
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  style={{ width: '32px', height: '32px', padding: '0' }}
                                >
                                  <Plus />
                                </Button>
                              </div>

                              {/* Price */}
                              <div className="text-end">
                                <p className="mb-0 fw-bold" style={{ fontSize: '1.3rem' }}>
                                  ₹{(item.buyPrice * (quantities[item.id] || 1)).toLocaleString()}
                                </p>
                                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                                  ₹{item.buyPrice.toLocaleString()} each
                                </p>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </Col>

              {/* Order Summary */}
              <Col lg={4}>
                <Card className="rounded-0 border shadow-sm sticky-top" style={{ top: '100px' }}>
                  <Card.Body className="p-4">
                    <h4 className="fw-bold mb-4">Order Summary</h4>
                    
                    <div className="d-flex justify-content-between mb-3" style={{ fontSize: '1rem' }}>
                      <span className="text-muted">Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                      <span className="fw-semibold">₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-3" style={{ fontSize: '1rem' }}>
                      <span className="text-muted">Tax (18% GST)</span>
                      <span className="fw-semibold">₹{Math.round(tax).toLocaleString()}</span>
                    </div>
                    
                    <hr className="my-3" />
                    
                    <div className="d-flex justify-content-between mb-4">
                      <span className="fw-bold" style={{ fontSize: '1.3rem' }}>Total</span>
                      <span className="fw-bold" style={{ fontSize: '1.3rem', color: '#000' }}>
                        ₹{Math.round(total).toLocaleString()}
                      </span>
                    </div>

                    <Button 
                      variant="dark" 
                      className="w-100 rounded-0 fw-bold mb-3 py-3"
                      onClick={() => navigate('/enquiry')}
                      style={{ fontSize: '1rem', letterSpacing: '0.5px' }}
                    >
                      PROCEED TO ENQUIRY
                    </Button>

                    <Button 
                      variant="outline-dark" 
                      className="w-100 rounded-0 py-2"
                      onClick={() => navigate('/products')}
                      style={{ fontSize: '0.95rem' }}
                    >
                      Continue Shopping
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default CartPage;
