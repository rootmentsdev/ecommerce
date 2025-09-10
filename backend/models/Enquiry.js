const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  // User Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },

  // Booking Information
  preferredBookingDate: {
    type: Date,
    required: [true, 'Preferred booking date is required'],
    validate: {
      validator: function(date) {
        return date >= new Date();
      },
      message: 'Preferred booking date must be in the future'
    }
  },
  selectedSize: {
    type: String,
    required: [true, 'Size selection is required'],
    trim: true,
    enum: {
      values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      message: 'Please select a valid size'
    }
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    enum: {
      values: [
        'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
        'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'
      ],
      message: 'Please select a valid city'
    }
  },
  specialNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Special notes cannot exceed 500 characters']
  },

  // Product Information (if enquiry is from product page)
  productId: {
    type: String,
    default: null
  },
  productName: {
    type: String,
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },

  // Enquiry Status
  status: {
    type: String,
    enum: ['new', 'contacted', 'interested', 'converted', 'cancelled'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },

  // Admin Notes
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },

  // Contact Information
  contactedAt: {
    type: Date,
    default: null
  },
  contactedBy: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ city: 1 });
enquirySchema.index({ preferredBookingDate: 1 });
enquirySchema.index({ email: 1 });

// Pre-save middleware to update updatedAt
enquirySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for formatted date
enquirySchema.virtual('formattedBookingDate').get(function() {
  return this.preferredBookingDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for enquiry age
enquirySchema.virtual('enquiryAge').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure virtual fields are serialized
enquirySchema.set('toJSON', { virtuals: true });
enquirySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
