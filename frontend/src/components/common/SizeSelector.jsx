import React, { useState } from 'react';
import { Dropdown, Button, Form, Row, Col } from 'react-bootstrap';
import { ChevronDown } from 'react-bootstrap-icons';
import { APP_CONFIG } from '../../constants';

const SizeSelector = ({ 
  selectedSize, 
  onSizeChange, 
  selectedQuantity = 1, 
  onQuantityChange,
  availableSizes = ['S', 'M', 'L', 'XL', 'XXL']
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSizeSelect = (size) => {
    onSizeChange(size);
    setShowDropdown(false);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      onQuantityChange(newQuantity);
    }
  };

  return (
    <div className="mb-4">
      {/* Available Sizes Header */}
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

      {/* Size Selection Dropdown */}
      <Dropdown show={showDropdown} onToggle={setShowDropdown}>
        <Dropdown.Toggle
          as={Button}
          variant="outline-secondary"
          className="w-100 d-flex align-items-center justify-content-between p-3"
          style={{
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            backgroundColor: '#fff',
            fontFamily: APP_CONFIG.FONTS.SECONDARY,
            fontSize: '14px',
            color: '#000'
          }}
        >
          <div className="d-flex align-items-center">
            <span>Size {selectedSize}</span>
          </div>
          <ChevronDown size={16} className="text-muted" />
        </Dropdown.Toggle>

        <Dropdown.Menu 
          className="w-100"
          style={{
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          {availableSizes.map((size) => (
            <Dropdown.Item
              key={size}
              onClick={() => handleSizeSelect(size)}
              className={`d-flex justify-content-between align-items-center py-3 px-3 ${
                selectedSize === size ? 'bg-light' : ''
              }`}
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                fontSize: '14px',
                borderBottom: '1px solid #f8f9fa'
              }}
            >
              <span>Size {size}</span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {/* Quantity Selection */}
      <div className="mt-3">
        <Row className="align-items-center">
          <Col xs={6}>
            <span 
              className="fw-medium"
              style={{
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                fontSize: '14px'
              }}
            >
              Quantity:
            </span>
          </Col>
          <Col xs={6}>
            <div className="d-flex align-items-center justify-content-end">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handleQuantityChange(selectedQuantity - 1)}
                disabled={selectedQuantity <= 1}
                style={{
                  borderRadius: '6px 0 0 6px',
                  border: '1px solid #e9ecef',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                -
              </Button>
              <Form.Control
                type="number"
                value={selectedQuantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min={1}
                className="text-center border-0"
                style={{
                  width: '60px',
                  height: '40px',
                  borderRadius: '0',
                  fontFamily: APP_CONFIG.FONTS.SECONDARY,
                  fontSize: '14px',
                  border: '1px solid #e9ecef',
                  borderLeft: 'none',
                  borderRight: 'none'
                }}
              />
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handleQuantityChange(selectedQuantity + 1)}
                style={{
                  borderRadius: '0 6px 6px 0',
                  border: '1px solid #e9ecef',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                +
              </Button>
            </div>
          </Col>
        </Row>
        <div className="mt-2">
          <small 
            className="text-muted"
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '11px'
            }}
          >
            Note: You can select multiple quantities for different sizes.
          </small>
        </div>
      </div>
    </div>
  );
};

export default SizeSelector;
