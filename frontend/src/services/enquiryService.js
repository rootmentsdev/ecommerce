const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Enquiry Service
 * Handles all enquiry-related API calls following clean code principles
 */
class EnquiryService {
  
  /**
   * Submit a new enquiry
   * @param {Object} enquiryData - The enquiry data to submit
   * @returns {Promise<Object>} - API response
   */
  static async submitEnquiry(enquiryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enquiryData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Handle validation errors specifically
        if (response.status === 400 && data.errors) {
          const errorMessages = data.errors.map(error => error.msg).join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        throw new Error(data.message || 'Failed to submit enquiry');
      }
      
      return data;
    } catch (error) {
      console.error('Submit enquiry error:', error);
      throw error;
    }
  }

  /**
   * Get all enquiries (Admin only)
   * @param {Object} params - Query parameters for filtering and pagination
   * @returns {Promise<Object>} - API response with enquiries and pagination
   */
  static async getAllEnquiries(params = {}) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Build query string
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/enquiries${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch enquiries');
      }
      
      return data;
    } catch (error) {
      console.error('Get enquiries error:', error);
      throw error;
    }
  }

  /**
   * Get enquiry by ID (Admin only)
   * @param {string} enquiryId - The enquiry ID
   * @returns {Promise<Object>} - API response with enquiry data
   */
  static async getEnquiryById(enquiryId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/enquiries/${enquiryId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch enquiry');
      }
      
      return data;
    } catch (error) {
      console.error('Get enquiry by ID error:', error);
      throw error;
    }
  }

  /**
   * Update enquiry status and admin notes (Admin only)
   * @param {string} enquiryId - The enquiry ID
   * @param {Object} updateData - The data to update
   * @returns {Promise<Object>} - API response
   */
  static async updateEnquiry(enquiryId, updateData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/enquiries/${enquiryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update enquiry');
      }
      
      return data;
    } catch (error) {
      console.error('Update enquiry error:', error);
      throw error;
    }
  }

  /**
   * Delete enquiry (Admin only)
   * @param {string} enquiryId - The enquiry ID
   * @returns {Promise<Object>} - API response
   */
  static async deleteEnquiry(enquiryId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/enquiries/${enquiryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete enquiry');
      }
      
      return data;
    } catch (error) {
      console.error('Delete enquiry error:', error);
      throw error;
    }
  }

  /**
   * Get enquiry statistics for dashboard (Admin only)
   * @returns {Promise<Object>} - API response with statistics
   */
  static async getEnquiryStats() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/enquiries/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch enquiry statistics');
      }
      
      return data;
    } catch (error) {
      console.error('Get enquiry stats error:', error);
      throw error;
    }
  }

  /**
   * Validate enquiry form data
   * @param {Object} formData - The form data to validate
   * @returns {Object} - Validation result with errors
   */
  static validateEnquiryForm(formData) {
    const errors = {};

    // Full Name validation
    if (!formData.fullName || formData.fullName.trim().length === 0) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length > 100) {
      errors.fullName = 'Full name cannot exceed 100 characters';
    }

    // Mobile Number validation
    if (!formData.mobileNumber || formData.mobileNumber.trim().length === 0) {
      errors.mobileNumber = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber.trim())) {
      errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    // Email validation
    if (!formData.email || formData.email.trim().length === 0) {
      errors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    // Preferred Booking Date validation
    if (!formData.preferredBookingDate) {
      errors.preferredBookingDate = 'Preferred booking date is required';
    } else {
      const selectedDate = new Date(formData.preferredBookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.preferredBookingDate = 'Preferred booking date must be in the future';
      }
    }

    // Size validation
    if (!formData.selectedSize || formData.selectedSize.trim().length === 0) {
      errors.selectedSize = 'Size selection is required';
    } else if (!['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(formData.selectedSize)) {
      errors.selectedSize = 'Please select a valid size';
    }

    // Pickup Date validation (optional)
    if (formData.pickupDate) {
      const pickupDate = new Date(formData.pickupDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (pickupDate < today) {
        errors.pickupDate = 'Pickup date must be in the future';
      }
    }

    // Return Date validation (optional)
    if (formData.returnDate) {
      const returnDate = new Date(formData.returnDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (returnDate < today) {
        errors.returnDate = 'Return date must be in the future';
      }
    }

    // City validation
    if (!formData.city || formData.city.trim().length === 0) {
      errors.city = 'City is required';
    }

    // Special Notes validation (optional)
    if (formData.specialNotes && formData.specialNotes.trim().length > 500) {
      errors.specialNotes = 'Special notes cannot exceed 500 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default EnquiryService;
