/**
 * SEO Service
 * Utilities for SEO optimization and analysis
 */
class SEOService {
  /**
   * Analyze image SEO score
   * @param {Object} imageData - Image data object
   * @returns {Object} SEO analysis results
   */
  static analyzeImageSEO(imageData) {
    const analysis = {
      score: 0,
      maxScore: 100,
      recommendations: [],
      strengths: [],
      issues: []
    };

    // Alt text analysis (25 points)
    if (imageData.altText) {
      if (imageData.altText.length >= 10 && imageData.altText.length <= 125) {
        analysis.score += 25;
        analysis.strengths.push('Alt text length is optimal (10-125 characters)');
      } else if (imageData.altText.length > 0 && imageData.altText.length < 10) {
        analysis.score += 10;
        analysis.issues.push('Alt text is too short (less than 10 characters)');
        analysis.recommendations.push('Expand alt text to at least 10 characters for better SEO');
      } else if (imageData.altText.length > 125) {
        analysis.score += 15;
        analysis.issues.push('Alt text is too long (over 125 characters)');
        analysis.recommendations.push('Shorten alt text to under 125 characters');
      }
    } else {
      analysis.issues.push('Missing alt text');
      analysis.recommendations.push('Add descriptive alt text for accessibility and SEO');
    }

    // Title analysis (20 points)
    if (imageData.title) {
      if (imageData.title.length >= 10 && imageData.title.length <= 60) {
        analysis.score += 20;
        analysis.strengths.push('Title length is optimal (10-60 characters)');
      } else if (imageData.title.length > 0 && imageData.title.length < 10) {
        analysis.score += 10;
        analysis.issues.push('Title is too short');
        analysis.recommendations.push('Expand title to at least 10 characters');
      } else if (imageData.title.length > 60) {
        analysis.score += 15;
        analysis.issues.push('Title is too long');
        analysis.recommendations.push('Shorten title to under 60 characters');
      }
    } else {
      analysis.issues.push('Missing title');
      analysis.recommendations.push('Add a descriptive title');
    }

    // SEO title analysis (15 points)
    if (imageData.seoTitle) {
      if (imageData.seoTitle.length >= 10 && imageData.seoTitle.length <= 60) {
        analysis.score += 15;
        analysis.strengths.push('SEO title is well-optimized');
      } else {
        analysis.score += 8;
        analysis.recommendations.push('Optimize SEO title length (10-60 characters)');
      }
    } else {
      analysis.recommendations.push('Add SEO title for better search visibility');
    }

    // SEO description analysis (15 points)
    if (imageData.seoDescription) {
      if (imageData.seoDescription.length >= 120 && imageData.seoDescription.length <= 160) {
        analysis.score += 15;
        analysis.strengths.push('SEO description is perfectly sized');
      } else if (imageData.seoDescription.length >= 50) {
        analysis.score += 10;
        analysis.recommendations.push('Optimize SEO description to 120-160 characters');
      } else {
        analysis.score += 5;
        analysis.issues.push('SEO description is too short');
      }
    } else {
      analysis.recommendations.push('Add SEO description (120-160 characters)');
    }

    // Focus keyword analysis (10 points)
    if (imageData.focusKeyword) {
      analysis.score += 5;
      const keyword = imageData.focusKeyword.toLowerCase();
      const titleMatch = imageData.title?.toLowerCase().includes(keyword);
      const altMatch = imageData.altText?.toLowerCase().includes(keyword);
      
      if (titleMatch || altMatch) {
        analysis.score += 5;
        analysis.strengths.push('Focus keyword appears in title or alt text');
      } else {
        analysis.recommendations.push('Include focus keyword in title or alt text');
      }
    } else {
      analysis.recommendations.push('Add focus keyword for targeted SEO');
    }

    // Format analysis (10 points)
    const format = imageData.metadata?.format || 'unknown';
    if (format === 'webp') {
      analysis.score += 10;
      analysis.strengths.push('Using WebP format for optimal performance');
    } else if (['jpg', 'jpeg', 'png'].includes(format)) {
      analysis.score += 5;
      analysis.recommendations.push('Convert to WebP format for better performance');
    } else {
      analysis.recommendations.push('Use WebP format for optimal SEO and performance');
    }

    // Optimization analysis (5 points)
    if (imageData.metadata?.isOptimized) {
      analysis.score += 5;
      analysis.strengths.push('Image is optimized for web');
    } else {
      analysis.recommendations.push('Optimize image for faster loading');
    }

    // File size analysis
    if (imageData.metadata?.fileSize) {
      const sizeInKB = imageData.metadata.fileSize / 1024;
      if (sizeInKB < 100) {
        analysis.strengths.push('Excellent file size (under 100KB)');
      } else if (sizeInKB < 500) {
        analysis.strengths.push('Good file size (under 500KB)');
      } else {
        analysis.issues.push('Large file size may affect page speed');
        analysis.recommendations.push('Consider further compression');
      }
    }

    // Dimension analysis
    if (imageData.metadata?.dimensions) {
      const { width, height } = imageData.metadata.dimensions;
      if (width >= 800 && height >= 600) {
        analysis.strengths.push('Good image dimensions for web display');
      } else {
        analysis.recommendations.push('Consider higher resolution (min 800x600px)');
      }
    }

    return analysis;
  }

  /**
   * Generate SEO-friendly alt text
   * @param {string} title - Image title
   * @param {string} category - Image category
   * @param {string} focusKeyword - Focus keyword
   * @returns {string} Generated alt text
   */
  static generateAltText(title, category, focusKeyword) {
    const parts = [];
    
    if (focusKeyword) {
      parts.push(focusKeyword);
    }
    
    if (title && !parts.includes(title.toLowerCase())) {
      parts.push(title);
    }
    
    if (category && category !== 'product') {
      parts.push(category);
    }
    
    parts.push('image');
    
    return parts.join(' - ').substring(0, 125);
  }

  /**
   * Generate SEO-friendly filename
   * @param {string} title - Image title
   * @param {string} focusKeyword - Focus keyword
   * @returns {string} SEO-friendly filename
   */
  static generateSEOFilename(title, focusKeyword) {
    const text = focusKeyword || title || 'image';
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50) + '.webp';
  }

  /**
   * Validate SEO fields
   * @param {Object} data - Form data to validate
   * @returns {Object} Validation results
   */
  static validateSEOFields(data) {
    const errors = {};

    // Alt text validation
    if (!data.altText || data.altText.length < 10) {
      errors.altText = 'Alt text must be at least 10 characters for good SEO';
    } else if (data.altText.length > 125) {
      errors.altText = 'Alt text should be under 125 characters';
    }

    // SEO title validation
    if (data.seoTitle && data.seoTitle.length > 60) {
      errors.seoTitle = 'SEO title should be under 60 characters';
    }

    // SEO description validation
    if (data.seoDescription) {
      if (data.seoDescription.length > 160) {
        errors.seoDescription = 'SEO description should be under 160 characters';
      } else if (data.seoDescription.length < 120) {
        errors.seoDescription = 'SEO description should be at least 120 characters for best results';
      }
    }

    // Focus keyword validation
    if (data.focusKeyword && data.focusKeyword.length > 50) {
      errors.focusKeyword = 'Focus keyword should be under 50 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Get SEO recommendations based on image data
   * @param {Object} imageData - Image data
   * @returns {Array} Array of recommendation objects
   */
  static getSEORecommendations(imageData) {
    const recommendations = [];

    // Critical issues (high priority)
    if (!imageData.altText) {
      recommendations.push({
        type: 'critical',
        title: 'Missing Alt Text',
        description: 'Alt text is required for accessibility and SEO',
        action: 'Add descriptive alt text'
      });
    }

    if (imageData.metadata?.format !== 'webp') {
      recommendations.push({
        type: 'high',
        title: 'Format Optimization',
        description: 'WebP format provides better compression and SEO benefits',
        action: 'Convert to WebP format'
      });
    }

    // Medium priority
    if (!imageData.seoTitle) {
      recommendations.push({
        type: 'medium',
        title: 'SEO Title Missing',
        description: 'SEO title helps with search engine visibility',
        action: 'Add SEO-optimized title'
      });
    }

    if (!imageData.focusKeyword) {
      recommendations.push({
        type: 'medium',
        title: 'Focus Keyword',
        description: 'Target specific search terms with a focus keyword',
        action: 'Add relevant focus keyword'
      });
    }

    // Low priority
    if (!imageData.seoDescription) {
      recommendations.push({
        type: 'low',
        title: 'SEO Description',
        description: 'Meta description can improve click-through rates',
        action: 'Add 120-160 character description'
      });
    }

    return recommendations;
  }

  /**
   * Calculate page speed impact
   * @param {Object} imageData - Image data
   * @returns {Object} Performance analysis
   */
  static analyzePerformanceImpact(imageData) {
    const analysis = {
      score: 'good',
      issues: [],
      recommendations: []
    };

    const fileSize = imageData.metadata?.fileSize || 0;
    const format = imageData.metadata?.format;

    // File size impact
    if (fileSize > 1000000) { // 1MB
      analysis.score = 'poor';
      analysis.issues.push('Large file size (>1MB) will significantly slow page loading');
      analysis.recommendations.push('Compress image or reduce dimensions');
    } else if (fileSize > 500000) { // 500KB
      analysis.score = 'fair';
      analysis.issues.push('File size could be optimized for better performance');
      analysis.recommendations.push('Consider further compression');
    }

    // Format impact
    if (format !== 'webp') {
      analysis.recommendations.push('Use WebP format for up to 30% smaller file sizes');
    }

    // Dimension impact
    const width = imageData.metadata?.dimensions?.width;
    if (width > 1920) {
      analysis.recommendations.push('Consider reducing width to 1920px max for web display');
    }

    return analysis;
  }
}

export default SEOService;
