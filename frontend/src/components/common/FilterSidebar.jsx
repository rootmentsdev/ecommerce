import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button, Row, Col } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';
import { APP_CONFIG } from '../../constants';
import { CATEGORIES } from '../../data/products';

const FilterSidebar = ({ show, handleClose, onApplyFilters, initialFilters = null, maxPrice = 10000 }) => {
  // Filter state following clean code principles
  const [filters, setFilters] = useState(initialFilters || {
    priceRange: [1000, maxPrice],
    categories: [],
    occasions: [],
    sizes: []
  });

  // Update filters when initialFilters prop changes
  React.useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  // Filter options data
  const CATEGORY_OPTIONS = CATEGORIES.map(cat => cat.name);

  const OCCASIONS = [
    'Wedding',
    'Formal',
    'Party',
    'Business',
    'Casual'
  ];

  const SIZES = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL'
  ];

  // Event handlers following clean code principles
  const handlePriceChange = (index, value) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(value);
    
    // Ensure min price doesn't exceed max price
    if (index === 0 && newPriceRange[0] > newPriceRange[1]) {
      newPriceRange[1] = newPriceRange[0];
    }
    // Ensure max price doesn't go below min price
    if (index === 1 && newPriceRange[1] < newPriceRange[0]) {
      newPriceRange[0] = newPriceRange[1];
    }
    
    console.log('🎯 FilterSidebar - Price range changed:', {
      index: index,
      value: value,
      newPriceRange: newPriceRange
    });
    
    setFilters({ ...filters, priceRange: newPriceRange });
  };

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    setFilters({ ...filters, categories: newCategories });
  };

  const handleOccasionChange = (occasion) => {
    const newOccasions = filters.occasions.includes(occasion)
      ? filters.occasions.filter(o => o !== occasion)
      : [...filters.occasions, occasion];
    setFilters({ ...filters, occasions: newOccasions });
  };

  const handleSizeChange = (size) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    setFilters({ ...filters, sizes: newSizes });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      priceRange: [1000, maxPrice],
      categories: [],
      occasions: [],
      sizes: []
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const handleApplyFilters = () => {
    console.log('🎯 FilterSidebar - Applying filters:', filters);
    onApplyFilters(filters);
    handleClose();
  };

  // Render methods following single responsibility principle
  const renderPriceFilter = () => (
    <div className="mb-4">
      <h6 
        className="fw-bold mb-3"
        style={{ fontFamily: APP_CONFIG.FONTS.SECONDARY }}
      >
        Filter by Price
      </h6>
      <div className="px-2">
        {/* Min Price Slider */}
        <div className="mb-3">
          <label 
            className="small text-muted mb-1 d-block"
            style={{ fontFamily: APP_CONFIG.FONTS.SECONDARY }}
          >
            Min Price: ₹{filters.priceRange[0].toLocaleString('en-IN')}
          </label>
          <Form.Range
            min="1000"
            max={maxPrice}
            step="100"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceChange(0, e.target.value)}
            style={{ accentColor: '#007bff' }}
          />
        </div>
        
        {/* Max Price Slider */}
        <div className="mb-2">
          <label 
            className="small text-muted mb-1 d-block"
            style={{ fontFamily: APP_CONFIG.FONTS.SECONDARY }}
          >
            Max Price: ₹{filters.priceRange[1].toLocaleString('en-IN')}
          </label>
          <Form.Range
            min="1000"
            max={maxPrice}
            step="100"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(1, e.target.value)}
            style={{ accentColor: '#28a745' }}
          />
        </div>
        
        <div className="d-flex justify-content-between mt-2">
          <span 
            className="small text-primary fw-bold"
            style={{ fontFamily: APP_CONFIG.FONTS.SECONDARY }}
          >
            ₹{filters.priceRange[0].toLocaleString('en-IN')}
          </span>
          <span 
            className="small text-success fw-bold"
            style={{ fontFamily: APP_CONFIG.FONTS.SECONDARY }}
          >
            ₹{filters.priceRange[1].toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );

  const renderCheckboxList = (items, selectedItems, onChange, title) => (
    <div className="mb-4">
      <h6 
        className="fw-bold mb-3"
        style={{ fontFamily: APP_CONFIG.FONTS.SECONDARY }}
      >
        {title}
      </h6>
      <div className="d-flex flex-column gap-2">
        {items.map((item) => (
          <Form.Check
            key={item}
            type="checkbox"
            id={`${title.toLowerCase()}-${item}`}
            label={item}
            checked={selectedItems.includes(item)}
            onChange={() => onChange(item)}
            style={{ fontFamily: APP_CONFIG.FONTS.SECONDARY }}
          />
        ))}
      </div>
    </div>
  );

  const renderApplyButton = () => (
    <div className="mt-4 pt-3 border-top">
      <Button
        variant="dark"
        className="w-100 py-2"
        onClick={handleApplyFilters}
        style={{
          fontFamily: APP_CONFIG.FONTS.SECONDARY,
          fontWeight: '500',
          borderRadius: '8px'
        }}
      >
        Apply Filter
      </Button>
    </div>
  );

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="end"
      style={{ width: '300px' }}
    >
      <Offcanvas.Header className="border-bottom pb-3">
        <div className="d-flex justify-content-between align-items-center w-100">
          <Offcanvas.Title 
            className="fw-bold mb-0"
            style={{ fontFamily: APP_CONFIG.FONTS.PRIMARY }}
          >
            Filters
          </Offcanvas.Title>
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              className="px-2 py-1"
              onClick={handleClearFilters}
              style={{ 
                fontFamily: APP_CONFIG.FONTS.SECONDARY,
                fontSize: '11px',
                fontWeight: '500',
                borderRadius: '4px',
                border: '1px solid #dee2e6',
                color: '#6c757d',
                backgroundColor: 'transparent',
                minWidth: '70px'
              }}
            >
              Clear Filter
            </Button>
            <Button
              variant="link"
              className="p-1 text-dark"
              onClick={handleClose}
              style={{ borderRadius: '4px' }}
            >
              <X size={18} />
            </Button>
          </div>
        </div>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="pt-3">
        {renderPriceFilter()}
        {renderCheckboxList(CATEGORY_OPTIONS, filters.categories, handleCategoryChange, 'Categories')}
        {renderCheckboxList(OCCASIONS, filters.occasions, handleOccasionChange, 'Occasion')}
        {renderCheckboxList(SIZES, filters.sizes, handleSizeChange, 'Size')}
        {renderApplyButton()}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default FilterSidebar;
