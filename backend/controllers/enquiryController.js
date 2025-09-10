const Enquiry = require('../models/Enquiry');
const { validationResult } = require('express-validator');

/**
 * Enquiry Controller
 * Handles all enquiry-related operations following clean code principles
 */
class EnquiryController {
  
  /**
   * Create a new enquiry
   * POST /api/enquiries
   */
  static async createEnquiry(req, res) {
    try {
      // Debug: Log the received data
      console.log('Received enquiry data:', req.body);
      
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const {
        fullName,
        mobileNumber,
        email,
        preferredBookingDate,
        selectedSize,
        pickupDate,
        returnDate,
        city,
        specialNotes,
        productId,
        productName
      } = req.body;

      // Create new enquiry
      const enquiry = new Enquiry({
        fullName,
        mobileNumber,
        email,
        preferredBookingDate: new Date(preferredBookingDate),
        selectedSize,
        pickupDate: pickupDate ? new Date(pickupDate) : null,
        returnDate: returnDate ? new Date(returnDate) : null,
        city,
        specialNotes,
        productId: productId || null,
        productName: productName || null
      });

      await enquiry.save();

      res.status(201).json({
        success: true,
        message: 'Enquiry submitted successfully',
        data: {
          enquiry: enquiry
        }
      });

    } catch (error) {
      console.error('Create enquiry error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * Get all enquiries with pagination and filtering
   * GET /api/enquiries
   */
  static async getAllEnquiries(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        city,
        priority,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Build filter object
      const filter = {};
      if (status) filter.status = status;
      if (city) filter.city = city;
      if (priority) filter.priority = priority;

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query with pagination
      const enquiries = await Enquiry.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const total = await Enquiry.countDocuments(filter);

      res.json({
        success: true,
        data: {
          enquiries,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalEnquiries: total,
            hasNext: skip + enquiries.length < total,
            hasPrev: parseInt(page) > 1
          }
        }
      });

    } catch (error) {
      console.error('Get enquiries error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * Get enquiry by ID
   * GET /api/enquiries/:id
   */
  static async getEnquiryById(req, res) {
    try {
      const { id } = req.params;

      const enquiry = await Enquiry.findById(id)
        .populate('productId', 'name price image')
        .populate('contactedBy', 'name email');

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      res.json({
        success: true,
        data: {
          enquiry
        }
      });

    } catch (error) {
      console.error('Get enquiry by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * Update enquiry status and admin notes
   * PUT /api/enquiries/:id
   */
  static async updateEnquiry(req, res) {
    try {
      const { id } = req.params;
      const { status, priority, adminNotes } = req.body;

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const updateData = {};
      if (status) updateData.status = status;
      if (priority) updateData.priority = priority;
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

      // If status is being updated to 'contacted', set contactedAt and contactedBy
      if (status === 'contacted') {
        updateData.contactedAt = new Date();
        updateData.contactedBy = req.user?.id || null;
      }

      const enquiry = await Enquiry.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('productId', 'name price image')
       .populate('contactedBy', 'name email');

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      res.json({
        success: true,
        message: 'Enquiry updated successfully',
        data: {
          enquiry
        }
      });

    } catch (error) {
      console.error('Update enquiry error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * Delete enquiry
   * DELETE /api/enquiries/:id
   */
  static async deleteEnquiry(req, res) {
    try {
      const { id } = req.params;

      const enquiry = await Enquiry.findByIdAndDelete(id);

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      res.json({
        success: true,
        message: 'Enquiry deleted successfully'
      });

    } catch (error) {
      console.error('Delete enquiry error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * Get enquiry statistics for dashboard
   * GET /api/enquiries/stats
   */
  static async getEnquiryStats(req, res) {
    try {
      const stats = await Enquiry.aggregate([
        {
          $group: {
            _id: null,
            totalEnquiries: { $sum: 1 },
            pendingEnquiries: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            contactedEnquiries: {
              $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] }
            },
            confirmedEnquiries: {
              $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
            },
            cancelledEnquiries: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
            }
          }
        }
      ]);

      // Get enquiries by city
      const cityStats = await Enquiry.aggregate([
        {
          $group: {
            _id: '$city',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ]);

      // Get enquiries by month for the last 12 months
      const monthlyStats = await Enquiry.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]);

      res.json({
        success: true,
        data: {
          overview: stats[0] || {
            totalEnquiries: 0,
            pendingEnquiries: 0,
            contactedEnquiries: 0,
            confirmedEnquiries: 0,
            cancelledEnquiries: 0
          },
          cityStats,
          monthlyStats
        }
      });

    } catch (error) {
      console.error('Get enquiry stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * Update enquiry status (Admin only)
   * PUT /api/enquiries/admin/:id/status
   */
  static async updateEnquiryStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const enquiry = await Enquiry.findByIdAndUpdate(
        id,
        { 
          status,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      res.json({
        success: true,
        message: 'Enquiry status updated successfully',
        data: {
          enquiry
        }
      });

    } catch (error) {
      console.error('Update enquiry status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }
}

module.exports = EnquiryController;
