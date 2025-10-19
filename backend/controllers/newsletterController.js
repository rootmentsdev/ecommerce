const Newsletter = require('../models/Newsletter');
const { validationResult } = require('express-validator');

// Subscribe to newsletter
const subscribeNewsletter = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, preferences = {}, source = 'homepage' } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const referrer = req.get('Referer');

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email });
    
    if (existingSubscription) {
      if (existingSubscription.status === 'unsubscribed') {
        // Resubscribe
        existingSubscription.status = 'active';
        existingSubscription.subscriptionDate = new Date();
        existingSubscription.source = source;
        existingSubscription.preferences = { ...existingSubscription.preferences, ...preferences };
        existingSubscription.metadata = {
          ...existingSubscription.metadata,
          ipAddress,
          userAgent,
          referrer
        };
        await existingSubscription.save();

        return res.status(200).json({
          success: true,
          message: 'Successfully resubscribed to newsletter!',
          data: {
            email: existingSubscription.email,
            status: existingSubscription.status
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Email is already subscribed to our newsletter'
        });
      }
    }

    // Create new subscription
    const newsletter = new Newsletter({
      email,
      source,
      preferences: {
        fashionUpdates: preferences.fashionUpdates !== false,
        exclusiveOffers: preferences.exclusiveOffers !== false,
        newProducts: preferences.newProducts !== false,
        styleTips: preferences.styleTips !== false
      },
      metadata: {
        ipAddress,
        userAgent,
        referrer
      }
    });

    await newsletter.save();

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: {
        email: newsletter.email,
        status: newsletter.status,
        subscriptionDate: newsletter.subscriptionDate
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Unsubscribe from newsletter
const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const newsletter = await Newsletter.findOne({ email });

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our newsletter database'
      });
    }

    await newsletter.unsubscribe();

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from newsletter',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get newsletter statistics (Admin only)
const getNewsletterStats = async (req, res) => {
  try {
    const stats = await Newsletter.getStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get newsletter stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch newsletter statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get all newsletter subscribers (Admin only)
const getAllSubscribers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const status = req.query.status || 'active';

    const filter = {};
    if (status !== 'all') {
      filter.status = status;
    }

    const subscribers = await Newsletter.find(filter)
      .sort({ subscriptionDate: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Newsletter.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        subscribers,
        pagination: {
          currentPage: page,
          totalPages,
          totalSubscribers: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get all subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update subscriber preferences (Admin only)
const updateSubscriberPreferences = async (req, res) => {
  try {
    const { email } = req.params;
    const { preferences, status } = req.body;

    const newsletter = await Newsletter.findOne({ email });

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    if (preferences) {
      newsletter.preferences = { ...newsletter.preferences, ...preferences };
    }

    if (status) {
      newsletter.status = status;
    }

    await newsletter.save();

    res.status(200).json({
      success: true,
      message: 'Subscriber preferences updated successfully',
      data: newsletter
    });

  } catch (error) {
    console.error('Update subscriber preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscriber preferences',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getNewsletterStats,
  getAllSubscribers,
  updateSubscriberPreferences
};
