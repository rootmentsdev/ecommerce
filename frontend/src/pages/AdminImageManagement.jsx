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
  Tag,
  Bell,
  PersonCircle
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import ImageService from '../services/imageService';
import ImageUploadService from '../services/imageUploadService';
import ImageUploadComponent from '../components/ImageUploadComponent';
import { createTestImageData, validateImageData } from '../utils/testImageCreation';
import DashboardSidebar from '../components/DashboardSidebar';
import Logo from '../assets/Logo.png';
import '../styles/AdminDashboard.css';

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
    altText: '',
    seoTitle: '',
    seoDescription: '',
    focusKeyword: '',
    category: 'product',
    tags: '',
    isActive: true,
    displayOrder: 0,
    quality: 85,
    maxWidth: '',
    maxHeight: ''
  });

  // File upload state
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [seoAnalysis, setSeoAnalysis] = useState(null);

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

    // For new images, check if image is selected
    if (!selectedImage && selectedImages.length === 0) {
      errors.image = 'Please select an image to upload';
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

    // Quality validation
    if (formData.quality && (formData.quality < 1 || formData.quality > 100)) {
      errors.quality = 'Quality must be between 1 and 100';
    }

    // Dimension validation
    if (formData.maxWidth && formData.maxWidth < 1) {
      errors.maxWidth = 'Max width must be a positive number';
    }

    if (formData.maxHeight && formData.maxHeight < 1) {
      errors.maxHeight = 'Max height must be a positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle image selection from upload component
   */
  const handleImageSelect = (imageData) => {
    setSelectedImages([imageData]); // Only allow one image for now
    
    // Auto-fill form data based on image metadata
    if (!formData.altText.trim() && imageData.metadata) {
      const suggestedAltText = `${formData.title || imageData.file.name.split('.')[0].replace(/[-_]/g, ' ')} - ${formData.category} image`;
      setFormData(prev => ({
        ...prev,
        altText: suggestedAltText.substring(0, 125)
      }));
    }
    
    // Auto-generate focus keyword
    if (!formData.focusKeyword.trim()) {
      const keyword = (formData.title || imageData.file.name.split('.')[0]).replace(/[-_]/g, ' ').toLowerCase();
      setFormData(prev => ({
        ...prev,
        focusKeyword: keyword.substring(0, 50)
      }));
    }
  };

  /**
   * Handle image removal
   */
  const handleImageRemove = (imageId) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };

  /**
   * Handle actual file upload to server
   */
  const handleFileUpload = async () => {
    if (selectedImages.length === 0) {
      setError('Please select an image to upload');
      return null;
    }

    const imageData = selectedImages[0];
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const uploadResponse = await ImageUploadService.uploadImage(
        imageData.file,
        formData,
        (progress) => setUploadProgress(progress)
      );
      
      if (uploadResponse.success) {
        setSeoAnalysis(uploadResponse.data.seoAnalysis);
        setSuccess('Image uploaded and optimized successfully!');
        return uploadResponse.data;
      } else {
        throw new Error(uploadResponse.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(`Upload failed: ${error.message}`);
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
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

      let response;
      
      if (selectedImage) {
        // Update existing image (legacy method)
        const submitData = {
          ...formData,
          displayOrder: parseInt(formData.displayOrder) || 0,
          seoTitle: formData.seoTitle?.trim() || undefined,
          seoDescription: formData.seoDescription?.trim() || undefined,
          focusKeyword: formData.focusKeyword?.trim()?.toLowerCase() || undefined
        };

        response = await ImageService.updateImage(selectedImage._id, submitData);
        setSuccess('Image updated successfully!');
      } else {
        // Create new image with file upload
        const uploadedImageData = await handleFileUpload();
        
        if (!uploadedImageData) {
          return; // Error already set in handleFileUpload
        }

        setSuccess('Image uploaded and created successfully!');
        response = { success: true, data: uploadedImageData };
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
      altText: '',
      seoTitle: '',
      seoDescription: '',
      focusKeyword: '',
      category: 'product',
      tags: '',
      isActive: true,
      displayOrder: 0,
      quality: 85,
      maxWidth: '',
      maxHeight: ''
    });
    setSelectedImages([]);
    setSeoAnalysis(null);
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
      altText: '',
      seoTitle: '',
      seoDescription: '',
      focusKeyword: '',
      category: 'product',
      tags: '',
      isActive: true,
      displayOrder: 0,
      quality: 85,
      maxWidth: '',
      maxHeight: ''
    });
    setSelectedImages([]);
    setSeoAnalysis(null);
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <DashboardSidebar 
        onLogout={handleLogout}
        userInfo={{ name: 'Desaport', role: 'Marketing@desaport...' }}
      />

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: '250px', display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 999,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h4
              style={{
                margin: 0,
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '600',
                color: '#1e293b',
                fontSize: '24px',
              }}
            >
              Product
            </h4>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Search Bar */}
            <div style={{ position: 'relative', width: '320px' }}>
              <Form.Control
                type="text"
                placeholder="Search data, users, or reports"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  height: '40px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  backgroundColor: '#f8fafc',
                }}
              />
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                }}
              />
            </div>

            {/* Notification Bell */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Bell size={18} color="#64748b" />
            </div>

            {/* User Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PersonCircle size={24} color="#64748b" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ padding: '32px', flex: 1 }}>
          {/* Alerts */}
          {error && (
            <Alert 
              variant="danger" 
              dismissible 
              onClose={() => setError('')}
              style={{
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert 
              variant="success" 
              dismissible 
              onClose={() => setSuccess('')}
              style={{
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              {success}
            </Alert>
          )}

          {/* Page Header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '600',
                  color: '#1e293b',
                  fontSize: '32px',
                }}
              >
                Add Item
              </h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  variant="outline-secondary"
                  style={{
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                  }}
                >
                  Save to Draft
                </Button>
                <Button
                  onClick={handleCreateClick}
                  style={{
                    borderRadius: '8px',
                    padding: '8px 20px',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: '#1e293b',
                    border: 'none',
                    color: 'white',
                  }}
                >
                  Publish Product
                </Button>
              </div>
            </div>
          </div>

          {/* Form Layout */}
          <Row>
            <Col lg={8}>
              {/* Basic Details Card */}
              <Card
                style={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '24px',
                  boxShadow: 'none',
                }}
              >
                <Card.Body style={{ padding: '24px' }}>
                  <h5
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '20px',
                      fontSize: '18px',
                    }}
                  >
                    Basic Details
                  </h5>

                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    >
                      Product Name *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Navy Blue Indo-Western Kurta with Jacket"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        padding: '12px 16px',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    >
                      Product Description *
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="A stylish navy blue Indo-Western kurta set with embroidered Nehru jacket. Perfect for engagements, sangeet, or wedding ceremonies. Includes kurta, churidar, and detachable jacket."
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        padding: '12px 16px',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        resize: 'vertical',
                      }}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}
                        >
                          Category *
                        </Form.Label>
                        <Form.Select
                          style={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            padding: '12px 16px',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                          }}
                        >
                          <option>Groom Wear</option>
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}
                        >
                          Sub Category *
                        </Form.Label>
                        <Form.Select
                          style={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            padding: '12px 16px',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                          }}
                        >
                          <option>Indo-Western</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Measurements Card */}
              <Card
                style={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '24px',
                  boxShadow: 'none',
                }}
              >
                <Card.Body style={{ padding: '24px' }}>
                  <h5
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '20px',
                      fontSize: '18px',
                    }}
                  >
                    Measurements
                  </h5>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}
                        >
                          Size *
                        </Form.Label>
                        <Form.Select
                          style={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            padding: '12px 16px',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                          }}
                        >
                          <option>XL</option>
                          <option>S</option>
                          <option>M</option>
                          <option>L</option>
                          <option>XXL</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}
                        >
                          Stock Quantity *
                        </Form.Label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            style={{
                              borderRadius: '6px 0 0 6px',
                              border: '1px solid #e2e8f0',
                              width: '36px',
                              height: '44px',
                            }}
                          >
                            -
                          </Button>
                          <Form.Control
                            type="number"
                            value="18"
                            style={{
                              borderRadius: '0',
                              border: '1px solid #e2e8f0',
                              borderLeft: 'none',
                              borderRight: 'none',
                              textAlign: 'center',
                              fontFamily: 'Poppins, sans-serif',
                              fontSize: '14px',
                              width: '60px',
                            }}
                          />
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            style={{
                              borderRadius: '0 6px 6px 0',
                              border: '1px solid #e2e8f0',
                              width: '36px',
                              height: '44px',
                            }}
                          >
                            +
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}
                        >
                          Chest
                        </Form.Label>
                        <Form.Select
                          style={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            padding: '12px 16px',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                          }}
                        >
                          <option>40 in</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}
                        >
                          Waist
                        </Form.Label>
                        <Form.Select
                          style={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            padding: '12px 16px',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                          }}
                        >
                          <option>34 in</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}
                        >
                          Hip
                        </Form.Label>
                        <Form.Select
                          style={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            padding: '12px 16px',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                          }}
                        >
                          <option>40 in</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}
                        >
                          Length
                        </Form.Label>
                        <Form.Select
                          style={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            padding: '12px 16px',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                          }}
                        >
                          <option>44 in</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}
                        >
                          Sleeve Length
                        </Form.Label>
                        <Form.Select
                          style={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            padding: '12px 16px',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                          }}
                        >
                          <option>25 in</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Rental & Pricing Card */}
              <Card
                style={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '24px',
                  boxShadow: 'none',
                }}
              >
                <Card.Body style={{ padding: '24px' }}>
                  <h5
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '20px',
                      fontSize: '18px',
                    }}
                  >
                    Rental & Pricing
                  </h5>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}
                        >
                          Rental Price (4 Days) *
                        </Form.Label>
                        <Form.Select
                          style={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            padding: '12px 16px',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                          }}
                        >
                          <option>₹6,500</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}
                        >
                          Security Deposit *
                        </Form.Label>
                        <Form.Select
                          style={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            padding: '12px 16px',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                          }}
                        >
                          <option>₹3,000</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}
                        >
                          Discount Price (Optional)
                        </Form.Label>
                        <Form.Select
                          style={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            padding: '12px 16px',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                          }}
                        >
                          <option>₹5,800</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Right Sidebar */}
            <Col lg={4}>
              {/* Upload Product Image Card */}
              <Card
                style={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '24px',
                  boxShadow: 'none',
                }}
              >
                <Card.Body style={{ padding: '24px' }}>
                  <h5
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '20px',
                      fontSize: '18px',
                    }}
                  >
                    Upload Product Image
                  </h5>

                  <ImageUploadComponent
                    onImageSelect={handleImageSelect}
                    onImageRemove={handleImageRemove}
                    selectedImages={selectedImages}
                    maxFiles={1}
                    showPreview={true}
                    showMetadata={true}
                    showSEOAnalysis={true}
                  />

                  {/* Upload Progress */}
                  {isUploading && (
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                          Uploading and optimizing...
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          {Math.round(uploadProgress)}%
                        </span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '8px', 
                        backgroundColor: '#e2e8f0', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div 
                          style={{ 
                            width: `${uploadProgress}%`, 
                            height: '100%', 
                            backgroundColor: '#3b82f6',
                            transition: 'width 0.3s ease'
                          }} 
                        />
                      </div>
                    </div>
                  )}

                  {/* SEO Analysis */}
                  {seoAnalysis && (
                    <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0369a1', marginBottom: '8px' }}>
                        📊 SEO Analysis Score: {seoAnalysis.score}/100
                      </div>
                      {seoAnalysis.recommendations && seoAnalysis.recommendations.length > 0 && (
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '500', color: '#075985', marginBottom: '4px' }}>
                            Recommendations:
                          </div>
                          <ul style={{ fontSize: '11px', color: '#075985', margin: '0', paddingLeft: '16px' }}>
                            {seoAnalysis.recommendations.slice(0, 3).map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Additional Info Card */}
              <Card
                style={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '24px',
                  boxShadow: 'none',
                }}
              >
                <Card.Body style={{ padding: '24px' }}>
                  <h5
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '20px',
                      fontSize: '18px',
                    }}
                  >
                    Additional Info
                  </h5>

                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    >
                      Items Included *
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Dry clean only. Jacket embroidery is delicate, avoid rough handling."
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        padding: '12px 16px',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        resize: 'vertical',
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    >
                      Condition Notes
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Dry clean only. Jacket embroidery is delicate, avoid rough handling."
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        padding: '12px 16px',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        resize: 'vertical',
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    >
                      Remarks
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Best paired with embroidered mojris (available separately)."
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        padding: '12px 16px',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        resize: 'vertical',
                      }}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>


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
