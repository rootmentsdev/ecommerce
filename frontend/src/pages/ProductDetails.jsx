import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Share, Heart, HeartFill, Truck, Shield, ArrowRepeat, CheckCircleFill, StarFill } from 'react-bootstrap-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import SEOService from '../services/seoService';
import FavoritesService from '../services/favoritesService';

import demo1 from '../assets/demo1.png';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';

const ProductDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const productData = location.state?.product || { name: 'Premium Suit', category: 'formal wear', image: demo1 };
    SEOService.initializeProductSEO(productData);
    window.scrollTo(0, 0);
    
    // If no description in passed data, try to fetch it from API
    if (productData.id && !productData.description) {
      console.log('🔍 ProductDetails - No description in passed data, fetching from API...');
      fetchProductDescription(productData.id);
    }
  }, [location.state]);
  
  const productData = location.state?.product || {
    id: '507f1f77bcf86cd799439021',
    name: 'Premium Black Tuxedo - Italian Fit',
    price: 1200,
    image: demo1
  };

  // Debug: Log the product data to see what description we're getting
  console.log('🔍 ProductDetails - Product data received:', productData);
  console.log('🔍 ProductDetails - Description from backend:', productData.description);

  const enquiryType = location.state?.enquiryType || 'rent';

  const product = {
    id: productData.id || '507f1f77bcf86cd799439021',
    name: productData.name || 'Premium Black Tuxedo - Italian Fit',
    buyPrice: productData.buyPrice || productData.price || 8000,
    rentPrice: productData.rentPrice || productData.rentalPrice || 1200,
    originalPrice: productData.originalPrice || productData.actualPrice || 13000,
    securityDeposit: productData.securityDeposit || 5000,
    image: productData.image || demo1,
    category: productData.category || 'Premium Suits',
    occasion: productData.occasion || 'Formal',
    rating: productData.rating || 4.5,
    reviews: productData.reviews || 128,
    description: productData.description || '',
    fabric: productData.fabric || '',
    color: productData.color || '',
    style: productData.style || '',
    occasions: productData.occasions || (productData.style ? productData.style.split(',').map(s => s.trim()) : ['Wedding', 'Reception', 'Corporate', 'Party']),
    inclusions: productData.inclusions 
      ? (typeof productData.inclusions === 'string' 
          ? productData.inclusions.split(',').map(s => s.trim()) 
          : productData.inclusions)
      : [],
    care: productData.care || 'Dry Clean Only',
    sizes: productData.sizes || ['S', 'M', 'L', 'XL', 'XXL']
  };

  // More detailed debugging
  console.log('🔍 ProductDetails - Final product object:', product);
  console.log('🔍 ProductDetails - Description check:', {
    hasDescription: !!product.description,
    descriptionLength: product.description?.length || 0,
    descriptionContent: product.description
  });

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[2] || 'L');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedType, setSelectedType] = useState(enquiryType || 'rent'); // 'rent' or 'buy'
  const [productDescription, setProductDescription] = useState('');

  // Function to fetch product description from API
  const fetchProductDescription = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/images/public?limit=100`);
      const data = await response.json();
      
      if (data.success && data.data.images) {
        const foundProduct = data.data.images.find(item => item._id === productId);
        if (foundProduct && foundProduct.description) {
          console.log('🔍 ProductDetails - Found description from API:', foundProduct.description);
          setProductDescription(foundProduct.description);
        }
      }
    } catch (error) {
      console.error('🔍 ProductDetails - Error fetching description:', error);
    }
  };

  // Check if product is favorited on mount
  useEffect(() => {
    const favorited = FavoritesService.isFavorited({ id: product.id });
    setIsFavorite(favorited);
  }, [product.id]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, []);

  const productImages = [product.image, product.image, product.image, product.image];

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    const newFavoriteStatus = FavoritesService.toggleFavorite({ id: product.id, ...product });
    setIsFavorite(newFavoriteStatus);
  };

  const handleAddToCart = () => {
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    let newCartItems;
    
    if (existingItemIndex >= 0) {
      newCartItems = [...cartItems];
      newCartItems[existingItemIndex].quantity = (newCartItems[existingItemIndex].quantity || 1) + 1;
    } else {
      newCartItems = [...cartItems, { ...product, quantity: 1, selectedSize, selectedType }];
    }
    
    setCartItems(newCartItems);
    localStorage.setItem('cart', JSON.stringify(newCartItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleEnquireNow = () => {
    navigate('/enquire', { 
      state: { product, selectedSize, selectedQuantity: 1, enquiryType: selectedType } 
    });
  };

  const discount = Math.round(((product.originalPrice - product.buyPrice) / product.originalPrice) * 100);

  return (
    <div className="product-details-page">
      <Header onMenuClick={() => setShowSideMenu(true)} />
      
      <Container fluid className="py-4 py-lg-5">
        <div className="main-container">
          <Row className="g-4 g-lg-5">
            {/* Left - Image Gallery */}
            <Col lg={5}>
              <div className="image-section">
                {/* Main Image */}
                <div className="main-image-wrapper">
                  <img src={productImages[selectedImage]} alt={product.name} className="main-image" />
                  <Badge className="discount-badge">{discount}% OFF</Badge>
                  <button className="favorite-btn" onClick={handleFavoriteToggle}>
                    {isFavorite ? <HeartFill size={22} color="#e53935" /> : <Heart size={22} />}
                  </button>
                  <button className="share-btn">
                    <Share size={18} />
                  </button>
                </div>
                
                {/* Thumbnails */}
                <div className="thumbnails">
                  {productImages.map((img, index) => (
                    <div
                      key={index}
                      className={`thumb ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={img} alt={`View ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </Col>

            {/* Right - Product Info */}
            <Col lg={7}>
              <div className="product-info">
                {/* Category */}
                <div className="category-tag">{product.category}</div>
                
                {/* Title & Rating */}
                <h1 className="product-title">{product.name}</h1>
                
                {/* Product Description - Under Title */}
                {(product.description && product.description.trim()) || (productDescription && productDescription.trim()) ? (
                  <p className="product-description-under-title">
                    {product.description || productDescription}
                  </p>
                ) : (
                  <p style={{ color: 'red', fontSize: '12px' }}>DEBUG: No description found (ID: {product.id})</p>
                )}
                
                <div className="rating-row">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <StarFill key={i} size={14} color={i < Math.floor(product.rating) ? '#FFB800' : '#E0E0E0'} />
                    ))}
                  </div>
                  <span className="rating-text">{product.rating} ({product.reviews} reviews)</span>
                </div>

                {/* Price Cards - Selectable */}
                <div className="price-section">
                  <div 
                    className={`price-card buy ${selectedType === 'buy' ? 'selected' : ''}`}
                    onClick={() => setSelectedType('buy')}
                  >
                    <div className="card-header">
                      <span className="label">Buy</span>
                      <div className={`radio-circle ${selectedType === 'buy' ? 'active' : ''}`}>
                        {selectedType === 'buy' && <div className="radio-dot"></div>}
                      </div>
                    </div>
                    <div className="price-row">
                      <span className="price">₹{product.buyPrice.toLocaleString()}</span>
                      <span className="original">₹{product.originalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <div 
                    className={`price-card rent ${selectedType === 'rent' ? 'selected' : ''}`}
                    onClick={() => setSelectedType('rent')}
                  >
                    <div className="card-header">
                      <span className="label">Rent</span>
                      <div className={`radio-circle ${selectedType === 'rent' ? 'active' : ''}`}>
                        {selectedType === 'rent' && <div className="radio-dot"></div>}
                      </div>
                    </div>
                    <div className="price-row">
                      <span className="price">₹{product.rentPrice.toLocaleString()}</span>
                      <span className="per-day">/day</span>
                    </div>
                  </div>
                </div>

                {/* Size Selection */}
                <div className="size-section">
                  <div className="size-header">
                    <span>Select Size</span>
                    <button className="size-guide">Size Guide</button>
                  </div>
                  <div className="sizes">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="actions">
                  <Button className="btn-add-cart" onClick={handleAddToCart}>
                    ADD TO CART
                  </Button>
                  <Button className="btn-enquire" onClick={handleEnquireNow}>
                    ENQUIRE NOW
                  </Button>
                </div>

                {/* Features Strip */}
                <div className="features-strip">
                  <div className="feature">
                    <Truck size={20} />
                    <span>Free Delivery</span>
                  </div>
                  <div className="feature">
                    <ArrowRepeat size={20} />
                    <span>Easy Returns</span>
                  </div>
                  <div className="feature">
                    <Shield size={20} />
                    <span>Secure Payment</span>
                  </div>
                </div>

                {/* Reviews Section */}
                {product.reviews && product.reviews > 0 && (
                  <div className="reviews-section">
                    <h3>Customer Reviews</h3>
                    <div className="reviews-summary">
                      <div className="rating-overview">
                        <div className="stars-large">
                          {[...Array(5)].map((_, i) => (
                            <StarFill key={i} size={18} color={i < Math.floor(product.rating) ? '#FFB800' : '#E0E0E0'} />
                          ))}
                        </div>
                        <span className="rating-number">{product.rating} out of 5</span>
                        <span className="review-count">Based on {product.reviews} reviews</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Details Accordion Style */}
                <div className="details-section">
                  {/* Product Details - Only show if any field has data */}
                  {(product.fabric || product.color || product.style || product.care) && (
                    <div className="detail-group">
                      <h3>Product Details</h3>
                      <div className="detail-grid">
                        {product.fabric && (
                          <div className="detail-item">
                            <span className="label">Fabric</span>
                            <span className="value">{product.fabric}</span>
                          </div>
                        )}
                        {product.color && (
                          <div className="detail-item">
                            <span className="label">Color</span>
                            <span className="value">{product.color}</span>
                          </div>
                        )}
                        {product.style && (
                          <div className="detail-item">
                            <span className="label">Style</span>
                            <span className="value">{product.style}</span>
                          </div>
                        )}
                        {product.care && (
                          <div className="detail-item">
                            <span className="label">Care</span>
                            <span className="value">{product.care}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* What's Included - Only show if inclusions exist */}
                  {product.inclusions && product.inclusions.length > 0 && (
                    <div className="detail-group">
                      <h3>What's Included</h3>
                      <ul className="inclusions">
                        {product.inclusions.map((item, index) => (
                          <li key={index}>
                            <CheckCircleFill size={16} color="#4CAF50" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Perfect For - Only show if occasions exist */}
                  {product.occasions && product.occasions.length > 0 && (
                    <div className="detail-group">
                      <h3>Perfect For</h3>
                      <div className="occasions">
                        {product.occasions.map((occasion, index) => (
                          <span key={index} className="occasion-tag">{occasion}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      <Footer />
      <SideMenu show={showSideMenu} handleClose={() => setShowSideMenu(false)} />

      <style>{`
        .product-details-page {
          background: #FAFAFA;
          min-height: 100vh;
        }
        
        .main-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        /* Image Section */
        .image-section {
          position: sticky;
          top: 100px;
        }
        
        .main-image-wrapper {
          position: relative;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        
        .main-image {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
        }
        
        .discount-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: linear-gradient(135deg, #FF6B6B, #EE5A5A);
          color: white;
          font-size: 14px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 25px;
          border: none;
        }
        
        .favorite-btn, .share-btn {
          position: absolute;
          top: 20px;
          background: white;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }
        
        .favorite-btn:hover, .share-btn:hover {
          transform: scale(1.1);
        }
        
        .favorite-btn { right: 20px; }
        .share-btn { right: 74px; }
        
        .thumbnails {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          justify-content: center;
        }
        
        .thumb {
          width: 80px;
          height: 100px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.2s;
          background: #fff;
        }
        
        .thumb.active {
          border-color: #1a1a1a;
        }
        
        .thumb:hover {
          transform: translateY(-2px);
        }
        
        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        /* Product Info */
        .product-info {
          padding: 0 0 0 20px;
        }
        
        .category-tag {
          display: inline-block;
          background: #F5F5F5;
          color: #666;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          padding: 6px 14px;
          border-radius: 20px;
          margin-bottom: 16px;
        }
        
        .product-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.2;
          margin-bottom: 12px;
        }
        
        .product-description-under-title {
          font-size: 16px;
          color: #666;
          line-height: 1.5;
          margin-bottom: 16px;
          font-weight: 400;
        }
        
        .rating-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .stars {
          display: flex;
          gap: 2px;
        }
        
        .rating-text {
          color: #666;
          font-size: 14px;
        }
        
        .description {
          color: #555;
          font-size: 15px;
          line-height: 1.7;
          margin-bottom: 28px;
        }
        
        /* Price Section */
        .price-section {
          display: flex;
          gap: 16px;
          margin-bottom: 28px;
        }
        
        .price-card {
          flex: 1;
          padding: 20px;
          border-radius: 16px;
          background: #fff;
          border: 2px solid #E8E8E8;
          transition: all 0.2s;
          cursor: pointer;
        }
        
        .price-card:hover {
          border-color: #888;
        }
        
        .price-card.selected {
          border-color: #1a1a1a;
          background: #FAFAFA;
        }
        
        .price-card.selected.buy {
          border-color: #1a1a1a;
        }
        
        .price-card.selected.rent {
          border-color: #FF8C00;
        }
        
        .price-card .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .price-card .label {
          display: block;
          font-size: 13px;
          color: #888;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .radio-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #D0D0D0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .radio-circle.active {
          border-color: #1a1a1a;
        }
        
        .price-card.rent .radio-circle.active {
          border-color: #FF8C00;
        }
        
        .radio-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #1a1a1a;
        }
        
        .price-card.rent .radio-dot {
          background: #FF8C00;
        }
        
        .price-card .price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        
        .price-card .price {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
        }
        
        .price-card.rent .price {
          color: #FF8C00;
        }
        
        .price-card .original {
          font-size: 16px;
          color: #999;
          text-decoration: line-through;
        }
        
        .price-card .per-day {
          font-size: 14px;
          color: #888;
        }
        
        /* Size Section */
        .size-section {
          margin-bottom: 28px;
        }
        
        .size-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        
        .size-header span {
          font-weight: 600;
          font-size: 15px;
          color: #1a1a1a;
        }
        
        .size-guide {
          background: none;
          border: none;
          color: #666;
          font-size: 13px;
          text-decoration: underline;
          cursor: pointer;
        }
        
        .sizes {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .size-btn {
          min-width: 52px;
          height: 52px;
          border: 2px solid #E0E0E0;
          background: #fff;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .size-btn:hover {
          border-color: #1a1a1a;
        }
        
        .size-btn.active {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: white;
        }
        
        /* Actions */
        .actions {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
        
        .btn-add-cart {
          flex: 1;
          height: 56px;
          background: #1a1a1a;
          border: none;
          border-radius: 14px;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.5px;
          transition: all 0.2s;
        }
        
        .btn-add-cart:hover {
          background: #333;
          transform: translateY(-2px);
        }
        
        .btn-enquire {
          flex: 1;
          height: 56px;
          background: transparent;
          border: 2px solid #1a1a1a;
          color: #1a1a1a;
          border-radius: 14px;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.5px;
          transition: all 0.2s;
        }
        
        .btn-enquire:hover {
          background: #1a1a1a;
          color: white;
          transform: translateY(-2px);
        }
        
        /* Features Strip */
        .features-strip {
          display: flex;
          justify-content: space-between;
          padding: 20px 0;
          border-top: 1px solid #E8E8E8;
          border-bottom: 1px solid #E8E8E8;
          margin-bottom: 28px;
        }
        
        .feature {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #555;
          font-size: 13px;
          font-weight: 500;
        }
        
        /* Details Section */
        .details-section {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        
        .detail-group {
          padding-bottom: 20px;
          margin-bottom: 20px;
          border-bottom: 1px solid #F0F0F0;
        }
        
        .detail-group:last-child {
          padding-bottom: 0;
          margin-bottom: 0;
          border-bottom: none;
        }
        
        .detail-group h3 {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 16px;
        }
        
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .detail-item .label {
          font-size: 12px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-item .value {
          font-size: 14px;
          color: #1a1a1a;
          font-weight: 500;
        }
        
        .inclusions {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        
        .inclusions li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #333;
        }
        
        .occasions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .occasion-tag {
          background: #F8F8F8;
          color: #555;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 25px;
          border: 1px solid #E8E8E8;
        }
        
        /* Responsive */
        @media (max-width: 991px) {
          .main-container {
            padding: 0 16px;
          }
          
          .image-section {
            position: relative;
            top: 0;
          }
          
          .product-info {
            padding: 20px 0 0 0;
          }
          
          .product-title {
            font-size: 24px;
          }
          
          .product-description-under-title {
            font-size: 14px;
            margin-bottom: 12px;
          }
          
          .price-section {
            flex-direction: column;
            gap: 12px;
          }
          
          .price-card .price {
            font-size: 24px;
          }
          
          .features-strip {
            flex-wrap: wrap;
            gap: 16px;
          }
          
          .feature {
            flex: 1 1 45%;
          }
          
          .inclusions {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 576px) {
          .main-container {
            padding: 0 12px;
          }
          
          .thumbnails {
            gap: 8px;
          }
          
          .thumb {
            width: 60px;
            height: 75px;
          }
          
          .actions {
            flex-direction: column;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
        
        /* Reviews Section */
        .reviews-section {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        
        .reviews-section h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
        }
        
        .reviews-summary {
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #F0F0F0;
        }
        
        .rating-overview {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .stars-large {
          display: flex;
          gap: 4px;
        }
        
        .rating-number {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }
        
        .review-count {
          font-size: 14px;
          color: #666;
        }
        
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .review-item {
          padding: 16px;
          background: #FAFAFA;
          border-radius: 12px;
        }
        
        .review-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .reviewer-name {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
        }
        
        .review-stars {
          display: flex;
          gap: 2px;
        }
        
        .review-date {
          font-size: 12px;
          color: #888;
        }
        
        .review-text {
          font-size: 14px;
          color: #555;
          line-height: 1.5;
          margin: 0;
        }
        
        /* Description Section */
        .description-section {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        
        .description-section h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 16px;
        }
        
        .description-section .description {
          margin-bottom: 0;
        }
        
        @media (max-width: 768px) {
          .reviews-section, .description-section {
            padding: 16px;
            margin-bottom: 16px;
          }
          
          .review-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          
          .rating-overview {
            align-items: center;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;
