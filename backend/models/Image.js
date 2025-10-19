const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Image title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Image description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  altText: {
    type: String,
    required: [true, 'Alt text is required for accessibility'],
    trim: true,
    maxlength: [125, 'Alt text cannot exceed 125 characters for optimal SEO']
  },
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'SEO title cannot exceed 60 characters'],
    validate: {
      validator: function(v) {
        if (v && v.length > 0) {
          // Check for SEO-friendly title (no special chars except hyphens and spaces)
          return /^[a-zA-Z0-9\s\-]+$/.test(v);
        }
        return true;
      },
      message: 'SEO title should only contain letters, numbers, spaces, and hyphens'
    }
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'SEO description cannot exceed 160 characters'],
    validate: {
      validator: function(v) {
        if (v && v.length < 120) {
          console.warn('SEO description should be at least 120 characters for optimal results');
        }
        return true;
      }
    }
  },
  focusKeyword: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Focus keyword cannot exceed 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Image category is required'],
    enum: {
      values: ['buy', 'rent', 'featured', 'trending', 'topCategories', 'suits', 'kurtas', 'bandhgalas', 'formal', 'traditional', 'product', 'hero', 'banner', 'gallery', 'testimonial', 'about'], // Include all old values for migration
      message: 'Category must be one of: buy, rent, featured, trending, topCategories, suits, kurtas, bandhgalas, formal, traditional, product, hero, banner, gallery, testimonial, about'
    },
    default: 'rent'
  },
  categories: [{
    type: String,
    enum: {
      values: ['buy', 'rent', 'featured', 'trending', 'topCategories', 'suits', 'kurtas', 'bandhgalas', 'formal', 'traditional'],
      message: 'Category must be one of: buy, rent, featured, trending, topCategories, suits, kurtas, bandhgalas, formal, traditional'
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  // Product-related fields
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  rentalPrice: {
    type: Number,
    min: [0, 'Rental price cannot be negative']
  },
  actualPrice: {
    type: Number,
    min: [0, 'Actual price cannot be negative']
  },
  securityDeposit: {
    type: Number,
    min: [0, 'Security deposit cannot be negative']
  },
  fabric: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  colors: {
    type: String,
    trim: true
  },
  style: {
    type: String,
    trim: true
  },
  occasions: {
    type: String,
    trim: true
  },
  inclusions: {
    type: String,
    trim: true
  },
  care: {
    type: String,
    trim: true
  },
  sizes: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: {
      values: ['newArrivals', 'featured', 'popular', 'sale', 'bestseller', 'limited'],
      message: 'Type must be one of: newArrivals, featured, popular, sale, bestseller, limited'
    },
    default: 'newArrivals'
  },
  inStock: {
    type: Boolean,
    default: true
  },
  metadata: {
    fileSize: {
      type: Number,
      min: [0, 'File size cannot be negative']
    },
    dimensions: {
      width: {
        type: Number,
        min: [1, 'Width must be positive']
      },
      height: {
        type: Number,
        min: [1, 'Height must be positive']
      }
    },
    format: {
      type: String,
      enum: ['webp', 'jpg', 'jpeg', 'png', 'gif', 'svg'],
      lowercase: true,
      default: 'webp'
    },
    originalFormat: {
      type: String,
      enum: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      lowercase: true
    },
    compressionQuality: {
      type: Number,
      min: [1, 'Compression quality must be at least 1'],
      max: [100, 'Compression quality cannot exceed 100'],
      default: 85
    },
    isOptimized: {
      type: Boolean,
      default: false
    }
  },
  uploadedBy: {
    type: String,
    required: [true, 'Uploader information is required'],
    default: 'admin'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted file size
imageSchema.virtual('formattedFileSize').get(function() {
  if (!this.metadata?.fileSize) return 'Unknown';
  
  const bytes = this.metadata.fileSize;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for formatted dimensions
imageSchema.virtual('formattedDimensions').get(function() {
  if (!this.metadata?.dimensions?.width || !this.metadata?.dimensions?.height) {
    return 'Unknown';
  }
  return `${this.metadata.dimensions.width} × ${this.metadata.dimensions.height}`;
});

// Virtual for SEO score calculation
imageSchema.virtual('seoScore').get(function() {
  let score = 0;
  const maxScore = 100;

  // Alt text optimization (25 points)
  if (this.altText) {
    if (this.altText.length >= 10 && this.altText.length <= 125) score += 25;
    else if (this.altText.length > 0) score += 15;
  }

  // Title optimization (20 points)
  if (this.title) {
    if (this.title.length >= 10 && this.title.length <= 60) score += 20;
    else if (this.title.length > 0) score += 10;
  }

  // SEO title optimization (15 points)
  if (this.seoTitle) {
    if (this.seoTitle.length >= 10 && this.seoTitle.length <= 60) score += 15;
    else if (this.seoTitle.length > 0) score += 8;
  }

  // SEO description optimization (15 points)
  if (this.seoDescription) {
    if (this.seoDescription.length >= 120 && this.seoDescription.length <= 160) score += 15;
    else if (this.seoDescription.length >= 50) score += 10;
    else if (this.seoDescription.length > 0) score += 5;
  }

  // Focus keyword optimization (10 points)
  if (this.focusKeyword) {
    score += 5;
    // Check if focus keyword appears in title or alt text
    const keyword = this.focusKeyword.toLowerCase();
    const titleMatch = this.title?.toLowerCase().includes(keyword);
    const altMatch = this.altText?.toLowerCase().includes(keyword);
    if (titleMatch || altMatch) score += 5;
  }

  // WebP format optimization (10 points)
  if (this.metadata?.format === 'webp') score += 10;
  else if (['jpg', 'jpeg', 'png'].includes(this.metadata?.format)) score += 5;

  // Image optimization (5 points)
  if (this.metadata?.isOptimized) score += 5;

  return Math.min(score, maxScore);
});

// Virtual for SEO recommendations
imageSchema.virtual('seoRecommendations').get(function() {
  const recommendations = [];

  // Alt text recommendations
  if (!this.altText) {
    recommendations.push('Add descriptive alt text for accessibility and SEO');
  } else if (this.altText.length < 10) {
    recommendations.push('Alt text should be at least 10 characters long');
  } else if (this.altText.length > 125) {
    recommendations.push('Alt text should be under 125 characters for optimal SEO');
  }

  // Title recommendations
  if (!this.title) {
    recommendations.push('Add a descriptive title');
  } else if (this.title.length < 10) {
    recommendations.push('Title should be at least 10 characters long');
  } else if (this.title.length > 60) {
    recommendations.push('Title should be under 60 characters for better readability');
  }

  // SEO title recommendations
  if (!this.seoTitle) {
    recommendations.push('Add an SEO-optimized title for better search visibility');
  }

  // SEO description recommendations
  if (!this.seoDescription) {
    recommendations.push('Add an SEO description to improve search rankings');
  } else if (this.seoDescription.length < 120) {
    recommendations.push('SEO description should be at least 120 characters for optimal results');
  }

  // Focus keyword recommendations
  if (!this.focusKeyword) {
    recommendations.push('Add a focus keyword to target specific search terms');
  } else {
    const keyword = this.focusKeyword.toLowerCase();
    const titleMatch = this.title?.toLowerCase().includes(keyword);
    const altMatch = this.altText?.toLowerCase().includes(keyword);
    if (!titleMatch && !altMatch) {
      recommendations.push('Include focus keyword in title or alt text for better SEO');
    }
  }

  // Format recommendations
  if (this.metadata?.format !== 'webp') {
    recommendations.push('Convert to WebP format for better performance and SEO');
  }

  // Optimization recommendations
  if (!this.metadata?.isOptimized) {
    recommendations.push('Optimize image for faster loading times');
  }

  // File size recommendations
  if (this.metadata?.fileSize > 500000) { // 500KB
    recommendations.push('Consider compressing image - files over 500KB may slow page loading');
  }

  return recommendations;
});

// Index for better query performance
imageSchema.index({ category: 1, isActive: 1, displayOrder: 1 });
imageSchema.index({ tags: 1 });
imageSchema.index({ createdAt: -1 });

// Pre-save middleware for SEO optimization and validation
imageSchema.pre('save', function(next) {
  // Handle category migration from old values to new ones
  const categoryMapping = {
    'hero': 'featured',
    'banner': 'featured', 
    'gallery': 'trending',
    'testimonial': 'featured',
    'about': 'featured',
    'product': 'rent' // Default product to rent category
  };
  
  if (categoryMapping[this.category]) {
    console.log(`Migrating category from '${this.category}' to '${categoryMapping[this.category]}'`);
    this.category = categoryMapping[this.category];
  }

  // Handle categories array - allow multi-select but ensure primary category is included
  if (this.isModified('category') || this.isNew) {
    console.log(`🎯 Image Model - Processing category: ${this.category}, categories: ${JSON.stringify(this.categories)}`);
    
    // When primary category changes, ensure it's included in categories array
    if (!this.categories || this.categories.length === 0) {
      this.categories = [this.category];
    } else if (!this.categories.includes(this.category)) {
      // Add primary category to categories array if not already present
      this.categories.unshift(this.category); // Add as first element (primary)
    }
    console.log(`🎯 Image Model - Updated categories array to include primary category: ${this.category}, final categories: ${JSON.stringify(this.categories)}`);
  } else if (!this.categories || this.categories.length === 0) {
    // If no categories array, create one from the primary category
    this.categories = [this.category];
    console.log(`🎯 Image Model - Created categories array from primary category: ${this.category}`);
  } else {
    // Ensure all categories in the array are valid
    this.categories = this.categories.filter(cat => 
      ['buy', 'rent', 'featured', 'trending', 'topCategories', 'suits', 'kurtas', 'bandhgalas', 'formal', 'traditional'].includes(cat)
    );
    
    // Ensure primary category is included in categories array
    if (!this.categories.includes(this.category)) {
      this.categories.unshift(this.category); // Add as first element
    }
    
    // If categories array is empty after filtering, use primary category
    if (this.categories.length === 0) {
      this.categories = [this.category];
    }
    console.log(`🎯 Image Model - Final categories after processing: ${JSON.stringify(this.categories)}`);
  }
  
  // Handle tags
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags.filter(tag => tag && tag.trim().length > 0);
  }

  // Auto-generate SEO title if not provided
  if (!this.seoTitle && this.title) {
    this.seoTitle = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .substring(0, 60); // Limit to 60 characters
  }

  // Auto-generate SEO description if not provided
  if (!this.seoDescription && this.description) {
    this.seoDescription = this.description.substring(0, 160);
  }

  // Ensure focus keyword is lowercase
  if (this.focusKeyword) {
    this.focusKeyword = this.focusKeyword.toLowerCase().trim();
  }

  // Set WebP as default format if not specified
  if (!this.metadata?.format) {
    if (!this.metadata) this.metadata = {};
    this.metadata.format = 'webp';
  }

  // Auto-generate alt text suggestions if empty (for admin reference)
  if (!this.altText && this.title && this.category) {
    console.warn(`Consider adding alt text for image: ${this.title} (${this.category})`);
  }

  next();
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
