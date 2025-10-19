import React from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { Search, Funnel } from 'react-bootstrap-icons';
import { APP_CONFIG } from '../../constants';

const ModernSearchBar = ({ 
  searchTerm, 
  value,
  onSearchChange, 
  onFilterClick,
  placeholder = "Search" 
}) => {
  const handleSearchChange = (e) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  return (
    <div className="w-100">
      <div className="modern-search-container">
        {/* Search Icon inside the input */}
        <Search 
          size={18} 
          className="search-icon-inside"
        />
        
        {/* Search Input */}
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={value || searchTerm || ''}
          onChange={handleSearchChange}
          className="search-input-modern"
        />
        
        {/* Filter Icon inside the input */}
        <Funnel 
          size={16} 
          className="filter-icon-inside"
          onClick={onFilterClick}
        />
      </div>
      
      <style>{`
        .modern-search-container {
          position: relative;
          display: flex;
          align-items: center;
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 12px 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        
        .modern-search-container:focus-within {
          background-color: #fff;
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        .search-icon-inside {
          position: absolute;
          left: 16px;
          color: #6c757d;
          pointer-events: none;
          z-index: 2;
        }
        
        .search-input-modern {
          border: none !important;
          background: transparent !important;
          padding: 0 40px 0 40px !important;
          font-family: ${APP_CONFIG.FONTS.SECONDARY} !important;
          font-size: 16px !important;
          color: #495057 !important;
          box-shadow: none !important;
          outline: none !important;
          flex: 1;
        }
        
        .search-input-modern:focus {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        .search-input-modern::placeholder {
          color: #6c757d;
          font-weight: 400;
        }
        
        .filter-icon-inside {
          position: absolute;
          right: 16px;
          color: #6c757d;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 2;
        }
        
        .filter-icon-inside:hover {
          color: #007bff;
          transform: scale(1.1);
        }
        
        .filter-icon-inside:active {
          color: #0056b3;
          transform: scale(0.95);
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .modern-search-container {
            margin: 0 8px;
            padding: 10px 14px;
          }
          
          .search-icon-inside {
            left: 14px;
          }
          
          .filter-icon-inside {
            right: 14px;
          }
          
          .search-input-modern {
            padding: 0 36px 0 36px !important;
            font-size: 16px !important; /* Prevents zoom on iOS */
          }
        }
      `}</style>
    </div>
  );
};

export default ModernSearchBar;