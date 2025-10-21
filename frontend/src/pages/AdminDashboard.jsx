import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Dropdown, Pagination, Modal, Image } from 'react-bootstrap';
import { Search, Bell, QuestionCircle, Calendar, Download, ChevronDown, ThreeDotsVertical, X, Image as ImageIcon } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import API_CONFIG, { getApiUrl } from '../config/api';
import Logo from '../assets/Logo.png';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalEnquiries: 0,
    newEnquiries: 0,
    contactedCustomers: 0,
    convertedEnquiries: 0,
    cancelledEnquiries: 0
  });
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEnquiry, setEditingEnquiry] = useState(null);
  const [editingField, setEditingField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching dashboard data...');
      
      // Fetch all enquiries with a higher limit to get all data
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ENQUIRIES.GET_ALL) + '?limit=1000', {
        method: 'GET',
        headers: API_CONFIG.DEFAULT_HEADERS
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        const enquiriesData = data.data.enquiries || [];
        console.log('Enquiries found:', enquiriesData.length);
        setEnquiries(enquiriesData);
        calculateStats(enquiriesData);
        
        // If no enquiries, show a message
        if (enquiriesData.length === 0) {
          console.log('No enquiries found in database');
        }
      } else {
        console.error('API returned error:', data.message);
        // Set empty data to show empty state
        setEnquiries([]);
        calculateStats([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (enquiriesData) => {
    const total = enquiriesData.length;
    const newCount = enquiriesData.filter(e => (e.status || 'new') === 'new').length;
    const contactedCount = enquiriesData.filter(e => (e.status || 'new') === 'contacted').length;
    const convertedCount = enquiriesData.filter(e => (e.status || 'new') === 'converted').length;
    const cancelledCount = enquiriesData.filter(e => (e.status || 'new') === 'cancelled').length;

    setDashboardStats({
      totalEnquiries: total,
      newEnquiries: newCount,
      contactedCustomers: contactedCount,
      convertedEnquiries: convertedCount,
      cancelledEnquiries: cancelledCount
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleDateFilterToggle = () => {
    setShowDateFilter(!showDateFilter);
  };

  const handleDateFilterApply = () => {
    // Reset to first page when applying date filter
    setCurrentPage(1);
    setShowDateFilter(false);
  };

  const handleDateFilterClear = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
    setShowDateFilter(false);
  };

  const handleEditStart = (enquiryId, field, currentValue) => {
    setEditingEnquiry(enquiryId);
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  const handleEditCancel = () => {
    setEditingEnquiry(null);
    setEditingField('');
    setEditValue('');
  };

  const handleEditSave = async () => {
    if (!editingEnquiry || !editingField) return;

    try {
      const adminToken = localStorage.getItem('adminToken');
      let updateData = {};
      
      if (editingField === 'status') {
        updateData = { status: editValue };
      } else if (editingField === 'specialNotes') {
        updateData = { specialNotes: editValue };
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ENQUIRIES.UPDATE(editingEnquiry)), {
        method: 'PUT',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the local state
        setEnquiries(prevEnquiries => 
          prevEnquiries.map(enquiry => 
            enquiry._id === editingEnquiry 
              ? { ...enquiry, [editingField]: editValue }
              : enquiry
          )
        );
        
        // Recalculate stats if status was changed
        if (editingField === 'status') {
          calculateStats(enquiries);
        }
        
        handleEditCancel();
      } else {
        console.error('Update failed:', data.message);
        alert('Update failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating enquiry:', error);
      alert('Error updating enquiry. Please try again.');
    }
  };

  const handleBulkCancel = async () => {
    if (selectedEnquiries.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to cancel ${selectedEnquiries.length} enquiry(ies)? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const adminToken = localStorage.getItem('adminToken');
      const updatePromises = selectedEnquiries.map(enquiryId => 
        fetch(getApiUrl(API_CONFIG.ENDPOINTS.ENQUIRIES.UPDATE(enquiryId)), {
          method: 'PUT',
          headers: API_CONFIG.DEFAULT_HEADERS,
          body: JSON.stringify({ status: 'cancelled' })
        })
      );

      const responses = await Promise.all(updatePromises);
      const results = await Promise.all(responses.map(res => res.json()));

      // Check if all updates were successful
      const allSuccessful = results.every(result => result.success);
      
      if (allSuccessful) {
        // Update local state
        setEnquiries(prevEnquiries => 
          prevEnquiries.map(enquiry => 
            selectedEnquiries.includes(enquiry._id)
              ? { ...enquiry, status: 'cancelled' }
              : enquiry
          )
        );
        
        // Recalculate stats
        calculateStats(enquiries);
        
        // Clear selection
        setSelectedEnquiries([]);
        setShowBulkActions(false);
        
        alert(`Successfully cancelled ${selectedEnquiries.length} enquiry(ies).`);
      } else {
        alert('Some enquiries could not be cancelled. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling enquiries:', error);
      alert('Error cancelling enquiries. Please try again.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEnquiries.length === 0) return;

    const confirmed = window.confirm(
      `⚠️ PERMANENT ACTION: Are you sure you want to DELETE ${selectedEnquiries.length} enquiry(ies)? This will permanently remove them from the database and CANNOT be undone.`
    );

    if (!confirmed) return;

    // Double confirmation for safety
    const doubleConfirmed = window.confirm(
      `This is your final warning. Click OK to permanently delete ${selectedEnquiries.length} enquiry(ies).`
    );

    if (!doubleConfirmed) return;

    try {
      const adminToken = localStorage.getItem('adminToken');
      
      // Delete enquiries using DELETE endpoint
      const deletePromises = selectedEnquiries.map(enquiryId => 
        fetch(getApiUrl(API_CONFIG.ENDPOINTS.ENQUIRIES.DELETE(enquiryId)), {
          method: 'DELETE',
          headers: {
            ...API_CONFIG.DEFAULT_HEADERS,
            'Authorization': `Bearer ${adminToken}`
          }
        })
      );

      const responses = await Promise.all(deletePromises);
      const results = await Promise.all(responses.map(res => res.json()));

      // Check if all deletions were successful
      const allSuccessful = results.every(result => result.success);
      
      if (allSuccessful) {
        // Remove deleted enquiries from local state
        setEnquiries(prevEnquiries => 
          prevEnquiries.filter(enquiry => !selectedEnquiries.includes(enquiry._id))
        );
        
        // Recalculate stats
        const updatedEnquiries = enquiries.filter(enquiry => !selectedEnquiries.includes(enquiry._id));
        calculateStats(updatedEnquiries);
        
        // Clear selection
        setSelectedEnquiries([]);
        setShowBulkActions(false);
        
        alert(`Successfully deleted ${selectedEnquiries.length} enquiry(ies) permanently.`);
        
        // Refresh dashboard data
        fetchDashboardData();
      } else {
        const failedCount = results.filter(result => !result.success).length;
        alert(`Failed to delete ${failedCount} enquiry(ies). Please try again.`);
      }
    } catch (error) {
      console.error('Error deleting enquiries:', error);
      alert('Error deleting enquiries. Please try again.');
    }
  };

  const handleSelectEnquiry = (enquiryId) => {
    setSelectedEnquiries(prev => {
      if (prev.includes(enquiryId)) {
        const newSelection = prev.filter(id => id !== enquiryId);
        setShowBulkActions(newSelection.length > 0);
        return newSelection;
      } else {
        const newSelection = [...prev, enquiryId];
        setShowBulkActions(newSelection.length > 0);
        return newSelection;
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedEnquiries.length === paginatedEnquiries.length) {
      setSelectedEnquiries([]);
      setShowBulkActions(false);
    } else {
      setSelectedEnquiries(paginatedEnquiries.map(enquiry => enquiry._id));
      setShowBulkActions(true);
    }
  };

  const handleDeleteAllEnquiries = async () => {
    if (enquiries.length === 0) {
      alert('No enquiries to delete.');
      return;
    }

    // First confirmation
    const confirmed = window.confirm(
      `⚠️ DANGER ZONE ⚠️\n\nYou are about to DELETE ALL ${enquiries.length} ENQUIRIES from the database.\n\nThis action is PERMANENT and CANNOT be undone!\n\nAre you absolutely sure you want to proceed?`
    );

    if (!confirmed) return;

    // Second confirmation - type specific text
    const confirmationText = prompt(
      `To confirm deletion of ALL ${enquiries.length} enquiries, please type: DELETE ALL ENQUIRIES\n\n(Type exactly as shown, in CAPITAL LETTERS)`
    );

    if (confirmationText !== 'DELETE ALL ENQUIRIES') {
      if (confirmationText !== null) {
        alert('Confirmation text did not match. Deletion cancelled for your safety.');
      }
      return;
    }

    // Final confirmation
    const finalConfirmed = window.confirm(
      `THIS IS YOUR FINAL WARNING!\n\nClicking OK will permanently delete ${enquiries.length} enquiry(ies).\n\nClick OK to DELETE ALL or Cancel to abort.`
    );

    if (!finalConfirmed) return;

    try {
      const adminToken = localStorage.getItem('adminToken');
      
      // Delete all enquiries
      const deletePromises = enquiries.map(enquiry => 
        fetch(getApiUrl(API_CONFIG.ENDPOINTS.ENQUIRIES.DELETE(enquiry._id)), {
          method: 'DELETE',
          headers: {
            ...API_CONFIG.DEFAULT_HEADERS,
            'Authorization': `Bearer ${adminToken}`
          }
        })
      );

      const responses = await Promise.all(deletePromises);
      const results = await Promise.all(responses.map(res => res.json()));

      // Check results
      const successCount = results.filter(result => result.success).length;
      const failedCount = results.length - successCount;
      
      if (successCount > 0) {
        // Clear all state
        setEnquiries([]);
        setSelectedEnquiries([]);
        setShowBulkActions(false);
        
        // Reset stats
        setDashboardStats({
          totalEnquiries: 0,
          newEnquiries: 0,
          contactedCustomers: 0,
          convertedEnquiries: 0,
          cancelledEnquiries: 0
        });
        
        if (failedCount === 0) {
          alert(`✅ Successfully deleted all ${successCount} enquiries.`);
        } else {
          alert(`⚠️ Partially completed:\n- Deleted: ${successCount} enquiries\n- Failed: ${failedCount} enquiries`);
        }
        
        // Refresh dashboard data
        fetchDashboardData();
      } else {
        alert('❌ Failed to delete enquiries. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting all enquiries:', error);
      alert('❌ Error deleting enquiries. Please check the console and try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { variant: 'primary', text: 'New' },
      contacted: { variant: 'warning', text: 'Contacted' },
      converted: { variant: 'success', text: 'Converted' },
      cancelled: { variant: 'secondary', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const filteredEnquiries = enquiries.filter(enquiry => {
    const enquiryStatus = enquiry.status || 'new';
    const enquiryType = enquiry.enquiryType || 'rent';
    
    // Status filter logic
    let matchesFilter = false;
    if (activeFilter === 'All') {
      matchesFilter = true;
    } else if (activeFilter === 'Rent') {
      matchesFilter = enquiryType === 'rent';
    } else if (activeFilter === 'Buy') {
      matchesFilter = enquiryType === 'buy';
    } else {
      matchesFilter = enquiryStatus === activeFilter.toLowerCase();
    }
    
    // Search filter logic
    const matchesSearch = searchTerm === '' || 
      enquiry.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.mobileNumber?.includes(searchTerm);
    
    // Date range filter logic
    let matchesDateRange = true;
    if (startDate || endDate) {
      const enquiryDate = new Date(enquiry.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start) {
        start.setHours(0, 0, 0, 0);
        matchesDateRange = matchesDateRange && enquiryDate >= start;
      }
      
      if (end) {
        end.setHours(23, 59, 59, 999);
        matchesDateRange = matchesDateRange && enquiryDate <= end;
      }
    }
    
    return matchesFilter && matchesSearch && matchesDateRange;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3" style={{ fontFamily: 'Inter, sans-serif' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Top Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e9ecef',
        padding: '16px 24px'
      }}>
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
          <Col xs={6}>
            <div style={{ position: 'relative' }}>
              <Form.Control
                type="text"
                placeholder="Search data, users, or reports"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #e9ecef',
                  padding: '8px 16px 8px 40px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px'
                }}
              />
              <Search 
                size={16} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#6c757d'
                }} 
              />
            </div>
          </Col>
          <Col className="text-end">
            <div className="d-flex align-items-center justify-content-end gap-3">
              <Button variant="link" style={{ padding: '8px', color: '#6c757d' }}>
                <Bell size={20} />
              </Button>
              <Button variant="link" style={{ padding: '8px', color: '#6c757d' }}>
                <QuestionCircle size={20} />
              </Button>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  backgroundColor: '#007bff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                A
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Container fluid style={{ padding: '24px' }}>
        <Row>
          {/* Left Sidebar */}
          <Col xs={12} md={3} lg={2} className="mb-4">
            <Card style={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <Card.Body style={{ padding: '20px' }}>
                <h6 style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '600',
                  color: '#6c757d',
                  marginBottom: '16px'
                }}>
                  Main menu
                </h6>
                
                <div 
                  style={{
                    backgroundColor: '#000',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Calendar size={16} />
                  Enquiries
                </div>

                <div 
                  style={{
                    backgroundColor: '#f8f9fa',
                    color: '#495057',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    border: '1px solid #dee2e6',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => navigate('/admin/images')}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e9ecef';
                    e.target.style.borderColor = '#adb5bd';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.borderColor = '#dee2e6';
                  }}
                >
                  <ImageIcon size={16} />
                  Image Management
                </div>

                <div className="mt-3">
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    onClick={handleLogout}
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px'
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col xs={12} md={9} lg={10}>
            <div className="mb-4">
              <h3 style={{ 
                fontFamily: 'Playfair Display, serif',
                fontWeight: '700',
                color: '#2c3e50',
                marginBottom: '24px'
              }}>
                Enquiries
              </h3>

              {/* Summary Cards */}
              <Row className="mb-4">
                <Col xs={12} sm={6} md={3} className="mb-3">
                  <Card style={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <Card.Body style={{ padding: '20px', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        <ThreeDotsVertical size={16} style={{ color: '#6c757d' }} />
                      </div>
                      <h6 style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: '#6c757d',
                        marginBottom: '8px'
                      }}>
                        Total Enquiry
                      </h6>
                      <h3 style={{ 
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: '700',
                        color: '#2c3e50',
                        marginBottom: '4px'
                      }}>
                        {dashboardStats.totalEnquiries}
                      </h3>
                      <small style={{ 
                        fontFamily: 'Inter, sans-serif',
                        color: '#28a745',
                        fontSize: '12px'
                      }}>
                        ↑18.4% vs previous week
                      </small>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} sm={6} md={3} className="mb-3">
                  <Card style={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <Card.Body style={{ padding: '20px', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        <ThreeDotsVertical size={16} style={{ color: '#6c757d' }} />
                      </div>
                      <h6 style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: '#6c757d',
                        marginBottom: '8px'
                      }}>
                        New Enquiries
                      </h6>
                      <h3 style={{ 
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: '700',
                        color: '#2c3e50',
                        marginBottom: '4px'
                      }}>
                        {dashboardStats.newEnquiries}
                      </h3>
                      <small style={{ 
                        fontFamily: 'Inter, sans-serif',
                        color: '#6c757d',
                        fontSize: '12px'
                      }}>
                        Pending follow-up
                      </small>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} sm={6} md={3} className="mb-3">
                  <Card style={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <Card.Body style={{ padding: '20px', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        <ThreeDotsVertical size={16} style={{ color: '#6c757d' }} />
                      </div>
                      <h6 style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: '#6c757d',
                        marginBottom: '8px'
                      }}>
                        Contacted Customers
                      </h6>
                      <h3 style={{ 
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: '700',
                        color: '#2c3e50',
                        marginBottom: '4px'
                      }}>
                        {dashboardStats.contactedCustomers}
                      </h3>
                      <small style={{ 
                        fontFamily: 'Inter, sans-serif',
                        color: '#6c757d',
                        fontSize: '12px'
                      }}>
                        Follow-up ongoing
                      </small>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} sm={6} md={3} className="mb-3">
                  <Card style={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <Card.Body style={{ padding: '20px', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        <ThreeDotsVertical size={16} style={{ color: '#6c757d' }} />
                      </div>
                      <h6 style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: '#6c757d',
                        marginBottom: '8px'
                      }}>
                        Converted Enquiries
                      </h6>
                      <h3 style={{ 
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: '700',
                        color: '#2c3e50',
                        marginBottom: '4px'
                      }}>
                        {dashboardStats.convertedEnquiries}
                      </h3>
                      <small style={{ 
                        fontFamily: 'Inter, sans-serif',
                        color: '#6c757d',
                        fontSize: '12px'
                      }}>
                        Confirmed into bookings
                      </small>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} sm={6} md={3} className="mb-3">
                  <Card style={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <Card.Body style={{ padding: '20px', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        <ThreeDotsVertical size={16} style={{ color: '#6c757d' }} />
                      </div>
                      <h6 style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: '#6c757d',
                        marginBottom: '8px'
                      }}>
                        Cancelled Enquiries
                      </h6>
                      <h3 style={{ 
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: '700',
                        color: '#2c3e50',
                        marginBottom: '4px'
                      }}>
                        {dashboardStats.cancelledEnquiries}
                      </h3>
                      <small style={{ 
                        fontFamily: 'Inter, sans-serif',
                        color: '#dc3545',
                        fontSize: '12px'
                      }}>
                        Cancelled by customer/admin
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Enquiry Details Section */}
              <Card style={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <Card.Body style={{ padding: '24px' }}>
                  <h5 style={{ 
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '20px'
                  }}>
                    Enquiry Details
                  </h5>

                  {/* Filter Buttons */}
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {/* Status Filters */}
                    {['All', 'New', 'Contacted', 'Converted', 'Cancelled'].map((filter) => (
                      <Button
                        key={filter}
                        variant={activeFilter === filter ? 'dark' : 'outline-secondary'}
                        size="sm"
                        onClick={() => setActiveFilter(filter)}
                        style={{ borderRadius: '20px', fontSize: '12px' }}
                      >
                        {filter}
                        {filter === 'New' && dashboardStats.newEnquiries > 0 && (
                          <Badge bg="danger" className="ms-1" style={{ fontSize: '10px' }}>
                            {dashboardStats.newEnquiries}
                          </Badge>
                        )}
                        {filter === 'Cancelled' && dashboardStats.cancelledEnquiries > 0 && (
                          <Badge bg="secondary" className="ms-1" style={{ fontSize: '10px' }}>
                            {dashboardStats.cancelledEnquiries}
                          </Badge>
                        )}
                      </Button>
                    ))}
                    
                    {/* Type Filters */}
                    <div className="ms-3 d-flex gap-2">
                      <Button
                        variant={activeFilter === 'Rent' ? 'info' : 'outline-info'}
                        size="sm"
                        onClick={() => setActiveFilter('Rent')}
                        style={{ borderRadius: '20px', fontSize: '12px' }}
                      >
                        Rent Only
                      </Button>
                      <Button
                        variant={activeFilter === 'Buy' ? 'success' : 'outline-success'}
                        size="sm"
                        onClick={() => setActiveFilter('Buy')}
                        style={{ borderRadius: '20px', fontSize: '12px' }}
                      >
                        Buy Only
                      </Button>
                    </div>
                  </div>

                  {/* Bulk Actions Bar */}
                  {showBulkActions && (
                    <div className="mb-3 p-3 bg-light rounded" style={{ border: '1px solid #dee2e6' }}>
                      <Row className="align-items-center">
                        <Col>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '500' }}>
                            {selectedEnquiries.length} enquiry(ies) selected
                          </span>
                        </Col>
                        <Col className="text-end">
                          <div className="d-flex gap-2 justify-content-end flex-wrap">
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={handleBulkDelete}
                              style={{ borderRadius: '8px', fontWeight: '500' }}
                            >
                              🗑️ Delete Selected
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={handleBulkCancel}
                              style={{ borderRadius: '8px' }}
                            >
                              Cancel Selected
                            </Button>
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => {
                                setSelectedEnquiries([]);
                                setShowBulkActions(false);
                              }}
                              style={{ borderRadius: '8px' }}
                            >
                              Clear Selection
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}

                  {/* Search and Actions */}
                  <Row className="mb-3">
                    <Col xs={12} md={6}>
                      <div style={{ position: 'relative' }}>
                        <Form.Control
                          type="text"
                          placeholder="Search by customer name, product, or mobile number..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                            borderRadius: '8px',
                            border: '1px solid #e9ecef',
                            padding: '8px 16px 8px 40px',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '14px'
                          }}
                        />
                        <Search 
                          size={16} 
                          style={{ 
                            position: 'absolute', 
                            left: '12px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#6c757d'
                          }} 
                        />
                      </div>
                    </Col>
                    <Col xs={12} md={6} className="d-flex gap-2 justify-content-md-end flex-wrap">
                      <Button variant="dark" size="sm" style={{ borderRadius: '8px' }}>
                        <Download size={14} className="me-1" />
                        Export CSV / PDF
                      </Button>
                      <Button 
                        variant={startDate || endDate ? "dark" : "outline-secondary"}
                        size="sm" 
                        style={{ borderRadius: '8px' }}
                        onClick={handleDateFilterToggle}
                      >
                        <Calendar size={14} className="me-1" />
                        {startDate || endDate ? 'Date Filtered' : 'Date Range'}
                        <ChevronDown size={12} className="ms-1" />
                        {(startDate || endDate) && (
                          <Badge bg="light" text="dark" className="ms-1" style={{ fontSize: '10px' }}>
                            {filteredEnquiries.length}
                          </Badge>
                        )}
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        style={{ 
                          borderRadius: '8px',
                          fontWeight: '600',
                          backgroundColor: '#dc3545',
                          border: 'none'
                        }}
                        onClick={handleDeleteAllEnquiries}
                        disabled={enquiries.length === 0}
                      >
                        🗑️ Delete All
                        {enquiries.length > 0 && (
                          <Badge bg="white" text="danger" className="ms-1" style={{ fontSize: '10px' }}>
                            {enquiries.length}
                          </Badge>
                        )}
                      </Button>
                    </Col>
                  </Row>

                  {/* Enquiries Table */}
                  <div style={{ overflowX: 'auto' }}>
                    <Table responsive hover>
                      <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                          <th style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#6c757d' }}>
                            <Form.Check
                              type="checkbox"
                              checked={selectedEnquiries.length === paginatedEnquiries.length && paginatedEnquiries.length > 0}
                              onChange={handleSelectAll}
                              style={{ margin: 0 }}
                            />
                          </th>
                          <th style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#6c757d' }}>DATE</th>
                          <th style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#6c757d' }}>TYPE</th>
                          <th style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#6c757d' }}>PRODUCT NAME</th>
                          <th style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#6c757d' }}>FULL NAME</th>
                          <th style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#6c757d' }}>MOBILE</th>
                          <th style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#6c757d' }}>DISTRICT</th>
                          <th style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#6c757d' }}>STATUS</th>
                          <th style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#6c757d' }}>REMARKS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedEnquiries.length > 0 ? (
                          paginatedEnquiries.map((enquiry, index) => (
                            <tr key={enquiry._id || index}>
                              <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>
                                <Form.Check
                                  type="checkbox"
                                  checked={selectedEnquiries.includes(enquiry._id)}
                                  onChange={() => handleSelectEnquiry(enquiry._id)}
                                  style={{ margin: 0 }}
                                />
                              </td>
                              <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>
                                {formatDate(enquiry.createdAt)}
                              </td>
                              <td>
                                <Badge 
                                  bg={enquiry.enquiryType === 'buy' ? 'success' : 'info'} 
                                  style={{ fontSize: '10px', textTransform: 'uppercase' }}
                                >
                                  {enquiry.enquiryType || 'rent'}
                                </Badge>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div 
                                    style={{ 
                                      width: '32px', 
                                      height: '32px', 
                                      backgroundColor: '#e9ecef',
                                      borderRadius: '4px',
                                      marginRight: '8px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '10px',
                                      color: '#6c757d'
                                    }}
                                  >
                                    IMG
                                  </div>
                                  <div>
                                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '500' }}>
                                      {enquiry.productName || 'N/A'}
                                    </div>
                                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#6c757d' }}>
                                      #{enquiry.productId?.slice(-8) || 'N/A'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '500' }}>
                                    {enquiry.fullName || 'N/A'}
                                  </div>
                                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#6c757d' }}>
                                    {enquiry.email || 'N/A'}
                                  </div>
                                </div>
                              </td>
                              <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>
                                {enquiry.mobileNumber || 'N/A'}
                              </td>
                              <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>
                                {enquiry.city || 'N/A'}
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  {editingEnquiry === enquiry._id && editingField === 'status' ? (
                                    <div className="d-flex align-items-center gap-2">
                                      <Form.Select
                                        size="sm"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        style={{ fontSize: '12px', width: '120px' }}
                                      >
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="converted">Converted</option>
                                        <option value="cancelled">Cancelled</option>
                                      </Form.Select>
                                      <Button
                                        size="sm"
                                        variant="success"
                                        onClick={handleEditSave}
                                        style={{ fontSize: '10px', padding: '2px 6px' }}
                                      >
                                        ✓
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline-secondary"
                                        onClick={handleEditCancel}
                                        style={{ fontSize: '10px', padding: '2px 6px' }}
                                      >
                                        ✕
                                      </Button>
                                    </div>
                                  ) : (
                                    <div 
                                      className="d-flex align-items-center"
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => handleEditStart(enquiry._id, 'status', enquiry.status || 'new')}
                                    >
                                      {getStatusBadge(enquiry.status || 'new')}
                                      <ChevronDown size={12} className="ms-1" style={{ color: '#6c757d' }} />
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>
                                {editingEnquiry === enquiry._id && editingField === 'specialNotes' ? (
                                  <div className="d-flex align-items-center gap-2">
                                    <Form.Control
                                      size="sm"
                                      type="text"
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      style={{ fontSize: '12px', width: '150px' }}
                                      placeholder="Enter remarks..."
                                    />
                                    <Button
                                      size="sm"
                                      variant="success"
                                      onClick={handleEditSave}
                                      style={{ fontSize: '10px', padding: '2px 6px' }}
                                    >
                                      ✓
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline-secondary"
                                      onClick={handleEditCancel}
                                      style={{ fontSize: '10px', padding: '2px 6px' }}
                                    >
                                      ✕
                                    </Button>
                                  </div>
                                ) : (
                                  <div 
                                    style={{ cursor: 'pointer', minHeight: '20px' }}
                                    onClick={() => handleEditStart(enquiry._id, 'specialNotes', enquiry.specialNotes || '')}
                                    title="Click to edit remarks"
                                  >
                                    {enquiry.specialNotes || 'Click to add remarks'}
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center" style={{ 
                              fontFamily: 'Inter, sans-serif', 
                              fontSize: '14px', 
                              color: '#6c757d',
                              padding: '40px 20px'
                            }}>
                              No enquiries found. Submit some enquiries from the main site to see them here.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6c757d' }}>
                      Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredEnquiries.length)} of {filteredEnquiries.length} enquiries
                    </div>
                    {totalPages > 1 && (
                      <Pagination>
                        <Pagination.First 
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(1)}
                        />
                        <Pagination.Prev 
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        />
                        
                        {/* Show page numbers with smart pagination */}
                        {Array.from({ length: totalPages }, (_, i) => {
                          const pageNum = i + 1;
                          // Show first page, last page, current page, and 2 pages around current
                          if (
                            pageNum === 1 || 
                            pageNum === totalPages || 
                            (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                          ) {
                            return (
                              <Pagination.Item
                                key={pageNum}
                                active={pageNum === currentPage}
                                onClick={() => setCurrentPage(pageNum)}
                              >
                                {pageNum}
                              </Pagination.Item>
                            );
                          } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                            return <Pagination.Ellipsis key={`ellipsis-${pageNum}`} />;
                          }
                          return null;
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
                    )}
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Date Range Filter Modal */}
      <Modal show={showDateFilter} onHide={() => setShowDateFilter(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
            Filter by Date Range
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col xs={12} md={6}>
              <Form.Label style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
                Start Date
              </Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </Col>
            <Col xs={12} md={6}>
              <Form.Label style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
                End Date
              </Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </Col>
          </Row>
          
          {(startDate || endDate) && (
            <div className="mt-3 p-2 bg-light rounded" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
              <strong>Current Filter:</strong>
              {startDate && <span> From: {new Date(startDate).toLocaleDateString()}</span>}
              {endDate && <span> To: {new Date(endDate).toLocaleDateString()}</span>}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={handleDateFilterClear}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Clear Filter
          </Button>
          <Button
            variant="dark"
            onClick={handleDateFilterApply}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Apply Filter
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
