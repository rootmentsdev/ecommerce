import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Badge,
  Modal,
  Alert,
  Spinner,
  Pagination,
  Dropdown,
  Image,
  InputGroup,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import {
  Plus,
  Search,
  Filter,
  Eye,
  EyeSlash,
  Pencil,
  Trash,
  Download,
  Upload,
  Grid,
  List,
  SortAlphaDown,
  SortAlphaUp,
  Calendar,
  Tag
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import ImageService from '../services/imageService';
import ImageUploader from '../components/ImageUploader';
import { createTestImageData, validateImageData } from '../utils/testImageCreation';
import Logo from '../assets/Logo.png';

const AdminImageManagement = () => {
  const navigate = useNavigate();

  // State management
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    altText: '',
    seoTitle: '',
    seoDescription: '',
    focusKeyword: '',
    category: 'product',
    tags: '',
    isActive: true,
    displayOrder: 0,
    metadata: {
      fileSize: '',
      dimensions: { width: '', height: '' },
      format: '',
      originalFormat: '',
      compressionQuality: 85,
      isOptimized: false
    }
  });

  const [formErrors, setFormErrors] = useState({});

  // Categories for dropdown
  const categories = [
    { value: 'hero', label: 'Hero Images' },
    { value: 'product', label: 'Product Images' },
    { value: 'banner', label: 'Banner Images' },
    { value: 'gallery', label: 'Gallery Images' },
    { value: 'testimonial', label: 'Testimonial Images' },
    { value: 'about', label: 'About Us Images' }
  ];

  // Load images on component mount and when filters change
  useEffect(() => {
    loadImages();
  }, [currentPage, searchTerm, selectedCategory, statusFilter, sortBy, sortOrder]);

  /**
   * Load images from API
   */
  const loadImages = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: currentPage,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(statusFilter !== 'all' && { isActive: statusFilter === 'active' }),
        sortBy,
        sortOrder
      };

      const response = await ImageService.getAllImages(params);

      if (response.success) {
        setImages(response.data.images);
        setTotalPages(response.data.pagination.totalPages);
        setTotalCount(response.data.pagination.totalCount);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form input changes
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          ...(grandchild ? {
            [child]: {
              ...prev[parent][child],
              [grandchild]: type === 'checkbox' ? checked : value
            }
          } : {
            [child]: type === 'checkbox' ? checked : value
          })
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }

    if (!formData.imageUrl.trim()) {
      errors.imageUrl = 'Image URL is required';
    } else {
      try {
        new URL(formData.imageUrl);
      } catch {
        errors.imageUrl = 'Please enter a valid URL';
      }
    }

    if (!formData.altText.trim()) {
      errors.altText = 'Alt text is required for accessibility';
    } else if (formData.altText.length < 10) {
      errors.altText = 'Alt text must be at least 10 characters for optimal SEO';
    } else if (formData.altText.length > 125) {
      errors.altText = 'Alt text cannot exceed 125 characters';
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    // SEO field validation
    if (formData.seoTitle && formData.seoTitle.length > 60) {
      errors.seoTitle = 'SEO title cannot exceed 60 characters';
    }

    if (formData.seoDescription && formData.seoDescription.length > 160) {
      errors.seoDescription = 'SEO description cannot exceed 160 characters';
    }

    if (formData.focusKeyword && formData.focusKeyword.length > 50) {
      errors.focusKeyword = 'Focus keyword cannot exceed 50 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle successful image upload
   */
  const handleUploadSuccess = (imageData) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: imageData.url,
      metadata: {
        ...prev.metadata,
        fileSize: imageData.size,
        dimensions: {
          width: imageData.dimensions.width,
          height: imageData.dimensions.height
        },
        format: imageData.optimization?.format || imageData.type.split('/')[1],
        originalFormat: imageData.optimization?.originalFormat?.split('/')[1],
        compressionQuality: imageData.optimization?.compressionQuality || 85,
        isOptimized: imageData.optimization?.isOptimized || false
      }
    }));

    // Auto-fill alt text if empty with SEO-friendly format
    if (!formData.altText.trim()) {
      const baseText = imageData.filename.split('.')[0].replace(/[-_]/g, ' ');
      const generatedAltText = `${baseText} - ${formData.category} image for ${formData.title || 'website'}`;
      // Ensure alt text is at least 10 characters
      const finalAltText = generatedAltText.length >= 10 
        ? generatedAltText 
        : `${generatedAltText} optimized for web`;
      
      setFormData(prev => ({
        ...prev,
        altText: finalAltText.substring(0, 125) // Ensure it doesn't exceed max length
      }));
    }

    // Auto-generate focus keyword from filename
    if (!formData.focusKeyword.trim()) {
      const keyword = imageData.filename.split('.')[0].replace(/[-_]/g, ' ').toLowerCase();
      setFormData(prev => ({
        ...prev,
        focusKeyword: keyword
      }));
    }
  };

  /**
   * Handle upload error
   */
  const handleUploadError = (error) => {
    setError(`Upload failed: ${error.message}`);
  };

  /**
   * Handle form submission for create/update
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Prepare metadata only if we have valid data
      const hasMetadata = formData.metadata && (
        formData.metadata.fileSize || 
        formData.metadata.dimensions?.width || 
        formData.metadata.dimensions?.height ||
        formData.metadata.format ||
        formData.metadata.originalFormat ||
        formData.metadata.compressionQuality ||
        formData.metadata.isOptimized
      );

      const submitData = {
        ...formData,
        displayOrder: parseInt(formData.displayOrder) || 0,
        // Ensure SEO fields are properly formatted
        seoTitle: formData.seoTitle?.trim() || undefined,
        seoDescription: formData.seoDescription?.trim() || undefined,
        focusKeyword: formData.focusKeyword?.trim()?.toLowerCase() || undefined
      };

      // Only include metadata if we have actual metadata to send
      if (hasMetadata) {
        submitData.metadata = {
          fileSize: formData.metadata.fileSize ? parseInt(formData.metadata.fileSize) : undefined,
          dimensions: {
            width: formData.metadata.dimensions?.width ? parseInt(formData.metadata.dimensions.width) : undefined,
            height: formData.metadata.dimensions?.height ? parseInt(formData.metadata.dimensions.height) : undefined
          },
          format: formData.metadata.format && formData.metadata.format.trim() ? formData.metadata.format.trim() : undefined,
          originalFormat: formData.metadata.originalFormat && formData.metadata.originalFormat.trim() ? formData.metadata.originalFormat.trim() : undefined,
          compressionQuality: formData.metadata.compressionQuality ? parseInt(formData.metadata.compressionQuality) : 85,
          isOptimized: Boolean(formData.metadata.isOptimized)
        };

        // Clean up undefined values from metadata
        Object.keys(submitData.metadata).forEach(key => {
          if (submitData.metadata[key] === undefined || submitData.metadata[key] === '') {
            delete submitData.metadata[key];
          }
        });

        // Clean up empty dimensions object
        if (submitData.metadata.dimensions && 
            !submitData.metadata.dimensions.width && 
            !submitData.metadata.dimensions.height) {
          delete submitData.metadata.dimensions;
        }

        // If metadata is now empty, don't send it
        if (Object.keys(submitData.metadata).length === 0) {
          delete submitData.metadata;
        }
      }

      // Clean up undefined values from main object
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === undefined || submitData[key] === '') {
          delete submitData[key];
        }
      });

      console.log('Submitting form data:', JSON.stringify(submitData, null, 2));

      let response;
      if (selectedImage) {
        response = await ImageService.updateImage(selectedImage._id, submitData);
        setSuccess('Image updated successfully!');
      } else {
        response = await ImageService.createImage(submitData);
        setSuccess('Image created successfully!');
      }

      if (response.success) {
        handleCloseModal();
        loadImages();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle image deletion
   */
  const handleDelete = async () => {
    if (!selectedImage) return;

    try {
      setLoading(true);
      const response = await ImageService.deleteImage(selectedImage._id);
      
      if (response.success) {
        setSuccess('Image deleted successfully!');
        setShowDeleteModal(false);
        setSelectedImage(null);
        loadImages();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle status toggle
   */
  const handleToggleStatus = async (image) => {
    try {
      const response = await ImageService.toggleImageStatus(image._id);
      
      if (response.success) {
        setSuccess(`Image ${response.data.isActive ? 'activated' : 'deactivated'} successfully!`);
        loadImages();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Open create modal
   */
  const handleCreateClick = () => {
    setSelectedImage(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      altText: '',
      seoTitle: '',
      seoDescription: '',
      focusKeyword: '',
      category: 'product',
      tags: '',
      isActive: true,
      displayOrder: 0,
      metadata: {
        fileSize: '',
        dimensions: { width: '', height: '' },
        format: '',
        originalFormat: '',
        compressionQuality: 85,
        isOptimized: false
      }
    });
    setFormErrors({});
    setShowCreateModal(true);
  };

  /**
   * Open edit modal
   */
  const handleEditClick = (image) => {
    setSelectedImage(image);
    setFormData({
      title: image.title,
      description: image.description,
      imageUrl: image.imageUrl,
      altText: image.altText,
      seoTitle: image.seoTitle || '',
      seoDescription: image.seoDescription || '',
      focusKeyword: image.focusKeyword || '',
      category: image.category,
      tags: image.tags ? image.tags.join(', ') : '',
      isActive: image.isActive,
      displayOrder: image.displayOrder || 0,
      metadata: {
        fileSize: image.metadata?.fileSize || '',
        dimensions: {
          width: image.metadata?.dimensions?.width || '',
          height: image.metadata?.dimensions?.height || ''
        },
        format: image.metadata?.format || '',
        originalFormat: image.metadata?.originalFormat || '',
        compressionQuality: image.metadata?.compressionQuality || 85,
        isOptimized: image.metadata?.isOptimized || false
      }
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  /**
   * Open delete modal
   */
  const handleDeleteClick = (image) => {
    setSelectedImage(image);
    setShowDeleteModal(true);
  };

  /**
   * Close all modals
   */
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedImage(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      altText: '',
      seoTitle: '',
      seoDescription: '',
      focusKeyword: '',
      category: 'product',
      tags: '',
      isActive: true,
      displayOrder: 0,
      metadata: {
        fileSize: '',
        dimensions: { width: '', height: '' },
        format: '',
        originalFormat: '',
        compressionQuality: 85,
        isOptimized: false
      }
    });
    setFormErrors({});
  };

  /**
   * Handle search
   */
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadImages();
  };

  /**
   * Test image creation with valid data
   */
  const handleTestImageCreation = async () => {
    try {
      setLoading(true);
      setError('');
      
      const testData = createTestImageData();
      const validation = validateImageData(testData);
      
      if (!validation.isValid) {
        setError(`Test data validation failed: ${validation.errors.join(', ')}`);
        return;
      }
      
      console.log('Creating test image with data:', testData);
      console.log('Submitting image data:', JSON.stringify(testData, null, 2));
      const response = await ImageService.createImage(testData);
      
      if (response.success) {
        setSuccess('Test image created successfully!');
        loadImages(); // Refresh the list
      }
    } catch (err) {
      console.error('Test image creation error:', err);
      setError(`Test creation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get category badge variant
   */
  const getCategoryBadgeVariant = (category) => {
    const variants = {
      hero: 'danger',
      product: 'primary',
      banner: 'warning',
      gallery: 'info',
      testimonial: 'success',
      about: 'secondary'
    };
    return variants[category] || 'secondary';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <Card style={{ borderRadius: 0, borderBottom: '1px solid #e9ecef' }}>
        <Card.Body style={{ padding: '16px 24px' }}>
          <Row className="align-items-center">
            <Col>
              <Image 
                src={Logo} 
                alt="Logo" 
                style={{
                  height: '40px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </Col>
            <Col xs="auto">
              <h5 style={{ 
                fontFamily: 'Century Gothic, sans-serif',
                fontWeight: '600',
                color: '#2c3e50',
                margin: 0
              }}>
                Image Management
              </h5>
            </Col>
            <Col xs="auto">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleLogout}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Logout
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Container fluid style={{ padding: '24px' }}>
        {/* Alerts */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Controls */}
        <Card className="mb-4">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={4}>
                <Form onSubmit={handleSearch}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search images..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    />
                    <Button variant="outline-secondary" type="submit">
                      <Search />
                    </Button>
                  </InputGroup>
                </Form>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <Filter className="me-1" />
                    Sort
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      active={sortBy === 'createdAt'}
                      onClick={() => setSortBy('createdAt')}
                    >
                      <Calendar className="me-2" />
                      Date Created
                    </Dropdown.Item>
                    <Dropdown.Item
                      active={sortBy === 'title'}
                      onClick={() => setSortBy('title')}
                    >
                      <SortAlphaDown className="me-2" />
                      Title
                    </Dropdown.Item>
                    <Dropdown.Item
                      active={sortBy === 'category'}
                      onClick={() => setSortBy('category')}
                    >
                      <Tag className="me-2" />
                      Category
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortOrder === 'asc' ? <SortAlphaUp /> : <SortAlphaDown />}
                      {' '}
                      {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col md={1}>
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid />
                </Button>
              </Col>
              <Col md={1}>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline-secondary'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List />
                </Button>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Button
                  variant="primary"
                  onClick={handleCreateClick}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="me-2"
                >
                  <Plus className="me-2" />
                  Add New Image
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={handleTestImageCreation}
                  disabled={loading}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {loading ? 'Testing...' : 'Test Create'}
                </Button>
                <span className="ms-3 text-muted" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Total: {totalCount} images
                </span>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Loading images...</p>
          </div>
        )}

        {/* Images Grid View */}
        {!loading && viewMode === 'grid' && (
          <Row>
            {images.map(image => (
              <Col key={image._id} md={4} lg={3} className="mb-4">
                <Card style={{ height: '100%' }}>
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    <Image
                      src={image.imageUrl}
                      alt={image.altText}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        // Show a simple text placeholder instead
                        const placeholder = document.createElement('div');
                        placeholder.style.cssText = `
                          width: 100%;
                          height: 100%;
                          background: #f8f9fa;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          color: #6c757d;
                          font-size: 12px;
                          position: absolute;
                          top: 0;
                          left: 0;
                        `;
                        placeholder.textContent = 'Image not available';
                        e.target.parentNode.style.position = 'relative';
                        e.target.parentNode.appendChild(placeholder);
                      }}
                    />
                    <div 
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        display: 'flex',
                        gap: '4px'
                      }}
                    >
                      <Badge bg={getCategoryBadgeVariant(image.category)}>
                        {image.category}
                      </Badge>
                      <Badge bg={image.isActive ? 'success' : 'secondary'}>
                        {image.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <Card.Body>
                    <Card.Title 
                      style={{ 
                        fontFamily: 'Century Gothic, sans-serif',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}
                    >
                      {image.title}
                    </Card.Title>
                    <Card.Text 
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.85rem',
                        color: '#6c757d'
                      }}
                    >
                      {image.description.length > 60 
                        ? `${image.description.substring(0, 60)}...`
                        : image.description
                      }
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <small 
                        className="text-muted"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {formatDate(image.createdAt)}
                      </small>
                      <div>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Toggle Status</Tooltip>}
                        >
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="me-1"
                            onClick={() => handleToggleStatus(image)}
                          >
                            {image.isActive ? <EyeSlash /> : <Eye />}
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Edit</Tooltip>}
                        >
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            onClick={() => handleEditClick(image)}
                          >
                            <Pencil />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Delete</Tooltip>}
                        >
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(image)}
                          >
                            <Trash />
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Images List View */}
        {!loading && viewMode === 'list' && (
          <Card>
            <Table responsive hover>
              <thead>
                <tr style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody style={{ fontFamily: 'Poppins, sans-serif' }}>
                {images.map(image => (
                  <tr key={image._id}>
                    <td>
                      <Image
                        src={image.imageUrl}
                        alt={image.altText}
                        style={{
                          width: '60px',
                          height: '40px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          // Show a simple text placeholder instead
                          const placeholder = document.createElement('div');
                          placeholder.style.cssText = `
                            width: 60px;
                            height: 40px;
                            background: #f8f9fa;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #6c757d;
                            font-size: 10px;
                            border-radius: 4px;
                            border: 1px solid #dee2e6;
                          `;
                          placeholder.textContent = 'No Image';
                          e.target.parentNode.appendChild(placeholder);
                        }}
                      />
                    </td>
                    <td>
                      <div>
                        <strong>{image.title}</strong>
                        <br />
                        <small className="text-muted">
                          {image.description.length > 50 
                            ? `${image.description.substring(0, 50)}...`
                            : image.description
                          }
                        </small>
                      </div>
                    </td>
                    <td>
                      <Badge bg={getCategoryBadgeVariant(image.category)}>
                        {image.category}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={image.isActive ? 'success' : 'secondary'}>
                        {image.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>{formatDate(image.createdAt)}</td>
                    <td>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-1"
                        onClick={() => handleToggleStatus(image)}
                      >
                        {image.isActive ? <EyeSlash /> : <Eye />}
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1"
                        onClick={() => handleEditClick(image)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteClick(image)}
                      >
                        <Trash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}

        {/* No images found */}
        {!loading && images.length === 0 && (
          <Card>
            <Card.Body className="text-center py-5">
              <h5 style={{ fontFamily: 'Century Gothic, sans-serif' }}>No images found</h5>
              <p style={{ fontFamily: 'Poppins, sans-serif', color: '#6c757d' }}>
                {searchTerm || selectedCategory !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by adding your first image.'
                }
              </p>
              <Button variant="primary" onClick={handleCreateClick}>
                <Plus className="me-2" />
                Add New Image
              </Button>
            </Card.Body>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              />
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              />
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }

                return (
                  <Pagination.Item
                    key={pageNumber}
                    active={pageNumber === currentPage}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Pagination.Item>
                );
              })}

              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              />
              <Pagination.Last
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              />
            </Pagination>
          </div>
        )}
      </Container>

      {/* Create Image Modal */}
      <Modal show={showCreateModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'Century Gothic, sans-serif' }}>
            Add New Image
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                    Title *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.title}
                    placeholder="Enter image title"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                    Category *
                  </Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.category}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                Description *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                isInvalid={!!formErrors.description}
                placeholder="Enter image description"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                Image URL *
              </Form.Label>
              <Form.Control
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                isInvalid={!!formErrors.imageUrl}
                placeholder="https://example.com/image.jpg"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.imageUrl}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Enter the full URL of the image
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                Alt Text *
              </Form.Label>
              <Form.Control
                type="text"
                name="altText"
                value={formData.altText}
                onChange={handleInputChange}
                isInvalid={!!formErrors.altText}
                placeholder="Describe the image for accessibility"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.altText}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                This text will be read by screen readers
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                    Tags
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="tag1, tag2, tag3"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  />
                  <Form.Text className="text-muted">
                    Separate tags with commas
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                    Display Order
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    min="0"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  />
                  <Form.Text className="text-muted">
                    Lower numbers appear first
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                label="Active (visible on site)"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
            </Form.Group>

            {/* Image Preview */}
            {formData.imageUrl && (
              <Form.Group className="mb-3">
                <Form.Label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                  Preview
                </Form.Label>
                <div>
                  <Image
                    src={formData.imageUrl}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Creating...
                </>
              ) : (
                'Create Image'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Image Modal */}
      <Modal show={showEditModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'Century Gothic, sans-serif' }}>
            Edit Image
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                    Title *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.title}
                    placeholder="Enter image title"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                    Category *
                  </Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.category}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                Description *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                isInvalid={!!formErrors.description}
                placeholder="Enter image description"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                Image URL *
              </Form.Label>
              <Form.Control
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                isInvalid={!!formErrors.imageUrl}
                placeholder="https://example.com/image.jpg"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.imageUrl}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Enter the full URL of the image
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                Alt Text *
              </Form.Label>
              <Form.Control
                type="text"
                name="altText"
                value={formData.altText}
                onChange={handleInputChange}
                isInvalid={!!formErrors.altText}
                placeholder="Describe the image for accessibility"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.altText}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                This text will be read by screen readers
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                    Tags
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="tag1, tag2, tag3"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  />
                  <Form.Text className="text-muted">
                    Separate tags with commas
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                    Display Order
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    min="0"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  />
                  <Form.Text className="text-muted">
                    Lower numbers appear first
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                label="Active (visible on site)"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
            </Form.Group>

            {/* Image Preview */}
            {formData.imageUrl && (
              <Form.Group className="mb-3">
                <Form.Label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                  Preview
                </Form.Label>
                <div>
                  <Image
                    src={formData.imageUrl}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                'Update Image'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'Century Gothic, sans-serif' }}>
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontFamily: 'Poppins, sans-serif' }}>
          <p>Are you sure you want to delete this image?</p>
          {selectedImage && (
            <div className="text-center">
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.altText}
                style={{
                  maxWidth: '200px',
                  maxHeight: '150px',
                  objectFit: 'contain',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px'
                }}
              />
              <p className="mt-2">
                <strong>{selectedImage.title}</strong>
                <br />
                <small className="text-muted">{selectedImage.description}</small>
              </p>
            </div>
          )}
          <p className="text-danger">
            <strong>This action cannot be undone.</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete Image'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminImageManagement;
