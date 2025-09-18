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
    convertedEnquiries: 0
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

    setDashboardStats({
      totalEnquiries: total,
      newEnquiries: newCount,
      contactedCustomers: contactedCount,
      convertedEnquiries: convertedCount
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
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
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
                    {['All', 'New', 'Contacted', 'Converted'].map((filter) => (
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
                    <Col xs={12} md={6} className="d-flex gap-2 justify-content-md-end">
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
                    </Col>
                  </Row>

                  {/* Enquiries Table */}
                  <div style={{ overflowX: 'auto' }}>
                    <Table responsive hover>
                      <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
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
                            <td colSpan="8" className="text-center" style={{ 
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
