import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button, Row, Col } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';
import { APP_CONFIG } from '../../constants';

const FilterSidebar = ({ show, handleClose, onApplyFilters, initialFilters = null, maxPrice = 10000 }) => {
  // Filter state following clean code principles
  const [filters, setFilters] = useState(initialFilters || {
    priceRange: [1000, maxPrice],
    sortBy: 'none'
  });

  // Update filters when initialFilters prop changes
  React.useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  // Filter options data
  const SORT_OPTIONS = [
    { value: 'none', label: 'Default' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
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

  const handleSortChange = (sortValue) => {
    setFilters({ ...filters, sortBy: sortValue });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      priceRange: [1000, maxPrice],
      sortBy: 'none'
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


  const renderSortOptions = () => (
    <div className="mb-4">
      <h6 
        className="fw-bold mb-3"
        style={{ fontFamily: APP_CONFIG.FONTS.SECONDARY }}
      >
        Sort By
      </h6>
      <div className="d-flex flex-column gap-2">
        {SORT_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={filters.sortBy === option.value ? 'dark' : 'outline-secondary'}
            className="text-start py-2 px-3"
            style={{
              fontFamily: APP_CONFIG.FONTS.SECONDARY,
              fontSize: '14px',
              fontWeight: filters.sortBy === option.value ? '600' : '400',
              borderRadius: '8px',
              border: filters.sortBy === option.value ? 'none' : '1px solid #dee2e6',
              backgroundColor: filters.sortBy === option.value ? '#000' : 'transparent',
              color: filters.sortBy === option.value ? '#fff' : '#333',
              transition: 'all 0.2s ease'
            }}
            onClick={() => handleSortChange(option.value)}
          >
            {option.label}
          </Button>
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
        {renderSortOptions()}
        {renderPriceFilter()}
        {renderApplyButton()}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default FilterSidebar;
