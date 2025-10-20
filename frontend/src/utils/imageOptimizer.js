/**
 * Image Optimization Utility
 * Handles image alt text, lazy loading, and optimization for SEO
 */

class ImageOptimizer {
  /**
   * Generate SEO-friendly alt text for product images
   * @param {object} product - Product object
   * @param {string} context - Context where image is used
   * @returns {string} - Optimized alt text
   */
  static generateProductAlt(product, context = '') {
    const productName = product.name || product.title || 'Premium Suit';
    const category = product.category || 'Formal Wear';
    const contextText = context ? ` - ${context}` : '';
    
    return `${productName} - ${category} for Men in Kerala | Dappr Squad${contextText}`;
  }

  /**
   * Generate alt text for category images
   * @param {string} category - Category name
   * @param {string} location - Location (city)
   * @returns {string} - Optimized alt text
   */
  static generateCategoryAlt(category, location = 'Kerala') {
    return `${category} for Men in ${location} - Premium Formal Wear | Dappr Squad`;
  }

  /**
   * Generate alt text for homepage hero images
   * @param {number} index - Image index
   * @returns {string} - Optimized alt text
   */
  static generateHeroAlt(index = 1) {
    const descriptions = [
      'Premium Men\'s Suits in Kerala - Buy or Rent | Dappr Squad',
      'Wedding Suits for Men Kerala - Designer Formal Wear | Dappr Squad',
      'Men\'s Fashion Kerala - Suits, Kurtas & Traditional Wear | Dappr Squad',
      'Corporate Suits Kerala - Professional Formal Wear for Men | Dappr Squad'
    ];
    
    return descriptions[index % descriptions.length];
  }

  /**
   * Generate alt text for about us images
   * @param {string} topic - Image topic
   * @returns {string} - Optimized alt text
   */
  static generateAboutAlt(topic = 'team') {
    const alts = {
      team: 'Dappr Squad Team - Premium Men\'s Fashion Experts in Kerala',
      store: 'Dappr Squad Showroom - Men\'s Suits & Formal Wear in Kerala',
      quality: 'Premium Quality Men\'s Suits - Dappr Squad Kerala',
      service: 'Personalized Fitting Service - Dappr Squad Men\'s Fashion'
    };
    
    return alts[topic] || 'Dappr Squad - Premium Men\'s Fashion in Kerala';
  }

  /**
   * Generate optimized image props
   * @param {string} src - Image source
   * @param {string} alt - Alt text
   * @param {object} options - Additional options
   * @returns {object} - Image props with optimization
   */
  static getOptimizedImageProps(src, alt, options = {}) {
    const {
      width,
      height,
      priority = false,
      className = ''
    } = options;

    return {
      src,
      alt,
      loading: priority ? 'eager' : 'lazy',
      decoding: 'async',
      ...(width && { width }),
      ...(height && { height }),
      className,
      style: {
        objectFit: 'cover',
        ...options.style
      }
    };
  }

  /**
   * Generate descriptive filename from alt text
   * @param {string} altText - Alt text
   * @returns {string} - SEO-friendly filename
   */
  static generateSEOFilename(altText) {
    return altText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100) + '.jpg';
  }

  /**
   * Get image dimensions for responsive loading
   * @param {string} breakpoint - Breakpoint name
   * @returns {object} - Width and height
   */
  static getResponsiveDimensions(breakpoint) {
    const dimensions = {
      mobile: { width: 480, height: 720 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1200, height: 800 },
      large: { width: 1920, height: 1080 }
    };

    return dimensions[breakpoint] || dimensions.desktop;
  }

  /**
   * Generate srcset for responsive images
   * @param {string} baseUrl - Base image URL
   * @returns {string} - Srcset string
   */
  static generateSrcSet(baseUrl) {
    const sizes = [480, 768, 1024, 1200, 1920];
    return sizes
      .map(size => `${baseUrl}?w=${size} ${size}w`)
      .join(', ');
  }

  /**
   * Generate sizes attribute for responsive images
   * @returns {string} - Sizes string
   */
  static generateSizes() {
    return '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1200px';
  }

  /**
   * Validate alt text quality
   * @param {string} altText - Alt text to validate
   * @returns {object} - Validation result
   */
  static validateAltText(altText) {
    const issues = [];
    
    if (!altText || altText.trim() === '') {
      issues.push('Alt text is empty');
    }
    
    if (altText && altText.length < 10) {
      issues.push('Alt text is too short (minimum 10 characters recommended)');
    }
    
    if (altText && altText.length > 125) {
      issues.push('Alt text is too long (maximum 125 characters recommended)');
    }
    
    if (altText && /image|picture|photo/i.test(altText)) {
      issues.push('Avoid using words like "image", "picture", or "photo" in alt text');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      score: Math.max(0, 100 - (issues.length * 25))
    };
  }

  /**
   * Generate location-specific alt text
   * @param {string} baseAlt - Base alt text
   * @param {string} city - City name
   * @returns {string} - Localized alt text
   */
  static localizeAlt(baseAlt, city) {
    if (!city) return baseAlt;
    
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
    return `${baseAlt} in ${cityName}, Kerala`;
  }

  /**
   * Get image loading strategy based on position
   * @param {number} index - Image index/position
   * @param {number} threshold - Above-fold threshold
   * @returns {string} - Loading strategy
   */
  static getLoadingStrategy(index, threshold = 3) {
    return index < threshold ? 'eager' : 'lazy';
  }

  /**
   * Generate WebP source for modern browsers
   * @param {string} imageSrc - Original image source
   * @returns {object} - Picture element sources
   */
  static generateWebPSource(imageSrc) {
    const webpSrc = imageSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return {
      webp: webpSrc,
      fallback: imageSrc
    };
  }

  /**
   * Comprehensive image optimization
   * @param {object} imageData - Image data object
   * @returns {object} - Fully optimized image configuration
   */
  static optimizeImage(imageData) {
    const {
      src,
      product,
      category,
      context,
      type = 'product',
      index = 0
    } = imageData;

    let alt = '';
    
    switch (type) {
      case 'product':
        alt = this.generateProductAlt(product, context);
        break;
      case 'category':
        alt = this.generateCategoryAlt(category);
        break;
      case 'hero':
        alt = this.generateHeroAlt(index);
        break;
      case 'about':
        alt = this.generateAboutAlt(context);
        break;
      default:
        alt = 'Dappr Squad - Premium Men\'s Fashion in Kerala';
    }

    return {
      ...this.getOptimizedImageProps(src, alt, {
        loading: this.getLoadingStrategy(index)
      }),
      srcSet: this.generateSrcSet(src),
      sizes: this.generateSizes(),
      ...this.generateWebPSource(src),
      validation: this.validateAltText(alt)
    };
  }
}

export default ImageOptimizer;

