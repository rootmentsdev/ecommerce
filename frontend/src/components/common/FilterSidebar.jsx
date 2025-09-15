import React, { useState } from 'react';
import { Offcanvas, Form, Button, Row, Col } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';
import { APP_CONFIG } from '../../constants';

const FilterSidebar = ({ show, handleClose, onApplyFilters }) => {
  // Filter state following clean code principles
  const [filters, setFilters] = useState({
    priceRange: [600, 25000],
    categories: [],
    occasions: [],
    sizes: []
  });

  // Filter options data
  const CATEGORIES = [
    'Premium Suits',
    'Traditional Wear',
    'Party Wear',
    'Kids Wear',
    'Formal Wear', 
    'Sherwani',
    'Kurta',
    'Indo-Western',
    'Tie',
    'Cufflinks',
    'suits'
  ];

  const OCCASIONS = [
    'Wedding',
    'Formal',
    'Party'
  ];

  const SIZES = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL'
  ];

  // Event handlers following clean code principles
  const handlePriceChange = (index, value) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(value);
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
      priceRange: [600, 25000],
      categories: [],
      occasions: [],
      sizes: []
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const handleApplyFilters = () => {
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
        <Form.Range
          min="600"
          max="25000"
          step="100"
          value={filters.priceRange[1]}
          onChange={(e) => handlePriceChange(1, e.target.value)}
          className="mb-2"
          style={{ accentColor: '#000000' }}
        />
        <div className="d-flex justify-content-between">
          <span 
            className="small text-muted"
            style={{ fontFamily: APP_CONFIG.FONTS.SECONDARY }}
          >
            ₹{filters.priceRange[0].toLocaleString('en-IN')}
          </span>
          <span 
            className="small text-muted"
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
        {renderCheckboxList(CATEGORIES, filters.categories, handleCategoryChange, 'Categories')}
        {renderCheckboxList(OCCASIONS, filters.occasions, handleOccasionChange, 'Occasion')}
        {renderCheckboxList(SIZES, filters.sizes, handleSizeChange, 'Size')}
        {renderApplyButton()}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default FilterSidebar;
