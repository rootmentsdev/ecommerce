const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced'],
    default: 'active'
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    enum: ['homepage', 'footer', 'popup', 'checkout'],
    default: 'homepage'
  },
  preferences: {
    fashionUpdates: {
      type: Boolean,
      default: true
    },
    exclusiveOffers: {
      type: Boolean,
      default: true
    },
    newProducts: {
      type: Boolean,
      default: true
    },
    styleTips: {
      type: Boolean,
      default: true
    }
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    referrer: String,
    country: String,
    city: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ status: 1 });
newsletterSchema.index({ subscriptionDate: -1 });

// Virtual for formatted subscription date
newsletterSchema.virtual('formattedSubscriptionDate').get(function() {
  return this.subscriptionDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Pre-save middleware to validate email
newsletterSchema.pre('save', function(next) {
  // Convert email to lowercase and trim
  this.email = this.email.toLowerCase().trim();
  next();
});

// Static method to get subscription statistics
newsletterSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: {
          $sum: {
            $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
          }
        },
        unsubscribed: {
          $sum: {
            $cond: [{ $eq: ['$status', 'unsubscribed'] }, 1, 0]
          }
        },
        thisMonth: {
          $sum: {
            $cond: [
              {
                $gte: [
                  '$subscriptionDate',
                  new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]);

  return stats[0] || { total: 0, active: 0, unsubscribed: 0, thisMonth: 0 };
};

// Instance method to unsubscribe
newsletterSchema.methods.unsubscribe = function() {
  this.status = 'unsubscribed';
  return this.save();
};

// Instance method to resubscribe
newsletterSchema.methods.resubscribe = function() {
  this.status = 'active';
  return this.save();
};

module.exports = mongoose.model('Newsletter', newsletterSchema);
