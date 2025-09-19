import React, { useState, useRef, useCallback } from 'react';
import { Button, Alert, ProgressBar, Badge } from 'react-bootstrap';
import { Upload, X, CheckCircle, ExclamationTriangle, InfoCircle } from 'react-bootstrap-icons';
import ImageUploadService from '../services/imageUploadService';

const ImageUploadComponent = ({ 
  onImageSelect, 
  onImageRemove, 
  selectedImages = [], 
  maxFiles = 1,
  showPreview = true,
  showMetadata = true,
  showSEOAnalysis = true 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = useCallback(async (files) => {
    const fileList = Array.from(files);
    
    // Clear previous errors/warnings
    setErrors([]);
    setWarnings([]);
    
    // Validate each file
    const validFiles = [];
    const allErrors = [];
    const allWarnings = [];
    
    for (const file of fileList) {
      const validation = ImageUploadService.validateImageFile(file);
      
      if (validation.isValid) {
        validFiles.push(file);
        if (validation.warnings.length > 0) {
          allWarnings.push(...validation.warnings.map(w => `${file.name}: ${w}`));
        }
      } else {
        allErrors.push(...validation.errors.map(e => `${file.name}: ${e}`));
      }
    }
    
    setErrors(allErrors);
    setWarnings(allWarnings);
    
    // Process valid files
    for (const file of validFiles.slice(0, maxFiles)) {
      try {
        // Get image metadata and preview
        const [metadata, preview] = await Promise.all([
          ImageUploadService.getImageMetadata(file),
          ImageUploadService.getImagePreview(file)
        ]);
        
        const imageData = {
          file,
          preview,
          metadata,
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        
        onImageSelect(imageData);
      } catch (error) {
        console.error('Error processing file:', error);
        setErrors(prev => [...prev, `${file.name}: Failed to process image`]);
      }
    }
  }, [onImageSelect, maxFiles]);

  // Handle drag events
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  // Handle file input change
  const handleInputChange = useCallback((e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
    // Clear input
    e.target.value = '';
  }, [handleFileSelect]);

  // Handle browse click
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Handle image removal
  const handleRemoveImage = (imageId) => {
    onImageRemove(imageId);
  };

  // Get priority color for recommendations
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  // Get icon for recommendation type
  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'error': return <X color="#dc3545" size={16} />;
      case 'warning': return <ExclamationTriangle color="#ffc107" size={16} />;
      case 'info': return <InfoCircle color="#0dcaf0" size={16} />;
      case 'success': return <CheckCircle color="#198754" size={16} />;
      default: return <InfoCircle color="#6c757d" size={16} />;
    }
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Upload Area */}
      <div
        className={`upload-area ${dragOver ? 'drag-over' : ''}`}
        style={{
          border: `2px dashed ${dragOver ? '#3b82f6' : '#e2e8f0'}`,
          borderRadius: '12px',
          padding: '40px 20px',
          textAlign: 'center',
          backgroundColor: dragOver ? '#eff6ff' : '#f8fafc',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          position: 'relative'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={maxFiles > 1}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        
        <Upload size={48} color={dragOver ? '#3b82f6' : '#64748b'} />
        
        <h5 style={{ 
          margin: '16px 0 8px', 
          color: dragOver ? '#3b82f6' : '#1e293b',
          fontWeight: '600' 
        }}>
          {dragOver ? 'Drop your images here' : 'Upload Product Image'}
        </h5>
        
        <p style={{ 
          color: '#64748b', 
          fontSize: '14px',
          margin: '0 0 16px' 
        }}>
          Drag and drop your images here, or click to browse
        </p>
        
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button
            variant="outline-primary"
            size="sm"
            style={{
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            📁 Browse Files
          </Button>
        </div>
        
        <div style={{ 
          marginTop: '12px', 
          fontSize: '12px', 
          color: '#64748b' 
        }}>
          Supports: JPEG, PNG, WebP, GIF (Max 10MB)
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="danger" className="mt-3" style={{ borderRadius: '8px' }}>
          <strong>Upload Errors:</strong>
          <ul className="mb-0 mt-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Warning Messages */}
      {warnings.length > 0 && (
        <Alert variant="warning" className="mt-3" style={{ borderRadius: '8px' }}>
          <strong>Recommendations:</strong>
          <ul className="mb-0 mt-1">
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Selected Images */}
      {selectedImages.length > 0 && showPreview && (
        <div style={{ marginTop: '20px' }}>
          <h6 style={{ 
            fontWeight: '600', 
            color: '#1e293b', 
            marginBottom: '16px',
            fontSize: '16px'
          }}>
            Selected Images ({selectedImages.length})
          </h6>
          
          {selectedImages.map((imageData) => (
            <div 
              key={imageData.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
                backgroundColor: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                {/* Image Preview */}
                <div style={{ flexShrink: 0 }}>
                  <img
                    src={imageData.preview}
                    alt="Preview"
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}
                  />
                </div>
                
                {/* Image Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <h6 style={{ 
                        fontWeight: '600', 
                        color: '#1e293b', 
                        margin: '0 0 4px',
                        fontSize: '14px'
                      }}>
                        {imageData.file.name}
                      </h6>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {ImageUploadService.formatFileSize(imageData.file.size)} • {imageData.file.type.split('/')[1].toUpperCase()}
                      </div>
                    </div>
                    
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveImage(imageData.id)}
                      style={{
                        borderRadius: '6px',
                        padding: '4px 8px'
                      }}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                  
                  {/* Metadata */}
                  {showMetadata && imageData.metadata && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Badge bg="secondary" style={{ fontSize: '11px' }}>
                          {imageData.metadata.width} × {imageData.metadata.height}
                        </Badge>
                        <Badge bg="info" style={{ fontSize: '11px' }}>
                          {imageData.metadata.aspectRatio}:1
                        </Badge>
                        <Badge bg={imageData.metadata.isLandscape ? 'success' : imageData.metadata.isPortrait ? 'warning' : 'primary'} style={{ fontSize: '11px' }}>
                          {imageData.metadata.isLandscape ? 'Landscape' : imageData.metadata.isPortrait ? 'Portrait' : 'Square'}
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  {/* SEO Analysis */}
                  {showSEOAnalysis && imageData.metadata && (
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                        SEO Analysis
                      </div>
                      
                      {ImageUploadService.generateSEORecommendations(imageData.metadata, {}).map((rec, index) => (
                        <div 
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 8px',
                            backgroundColor: rec.type === 'error' ? '#fef2f2' : rec.type === 'warning' ? '#fefbf2' : '#f0f9ff',
                            borderRadius: '6px',
                            marginBottom: '4px',
                            fontSize: '11px'
                          }}
                        >
                          {getRecommendationIcon(rec.type)}
                          <span style={{ flex: 1 }}>{rec.message}</span>
                          <Badge bg={getPriorityColor(rec.priority)} style={{ fontSize: '10px' }}>
                            {rec.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Upload Progress */}
              {uploadProgress[imageData.id] !== undefined && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}>
                      Uploading...
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      {Math.round(uploadProgress[imageData.id])}%
                    </span>
                  </div>
                  <ProgressBar 
                    now={uploadProgress[imageData.id]} 
                    style={{ height: '6px', borderRadius: '3px' }}
                    variant="primary"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Quick Tips */}
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        backgroundColor: '#f0f9ff', 
        borderRadius: '8px',
        border: '1px solid #bae6fd'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#0369a1', marginBottom: '4px' }}>
          💡 SEO Tips for Better Image Performance:
        </div>
        <ul style={{ fontSize: '11px', color: '#075985', margin: '0', paddingLeft: '16px' }}>
          <li>Use WebP format for better compression and loading speed</li>
          <li>Keep file sizes under 500KB for optimal performance</li>
          <li>Add descriptive alt text (10+ characters) for accessibility</li>
          <li>Use descriptive filenames with relevant keywords</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploadComponent;
