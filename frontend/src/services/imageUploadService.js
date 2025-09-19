import API_CONFIG from '../config/api';

/**
 * Image Upload Service
 * Handles file uploads with progress tracking and SEO optimization
 */
class ImageUploadService {
  /**
   * Upload image file with form data
   * @param {File} file - Image file to upload
   * @param {Object} formData - Form data for the image
   * @param {Function} onProgress - Progress callback function
   * @returns {Promise} Upload response
   */
  static async uploadImage(file, formData, onProgress = null) {
    try {
      // Create FormData object
      const uploadData = new FormData();
      
      // Append the image file
      uploadData.append('image', file);
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          uploadData.append(key, formData[key]);
        }
      });

      // Get admin token
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Admin authentication required');
      }

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        // Track upload progress
        if (onProgress) {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100;
              onProgress(percentComplete);
            }
          });
        }

        // Handle response
        xhr.onload = function() {
          if (xhr.status === 201) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              reject(new Error('Invalid response format'));
            }
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              reject(new Error(error.message || `Upload failed with status ${xhr.status}`));
            } catch (parseError) {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        };

        // Handle errors
        xhr.onerror = function() {
          reject(new Error('Network error during upload'));
        };

        xhr.ontimeout = function() {
          reject(new Error('Upload timeout'));
        };

        // Set up request
        xhr.open('POST', `${API_CONFIG.BASE_URL}/images/upload`, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.timeout = 300000; // 5 minutes timeout

        // Send request
        xhr.send(uploadData);
      });

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  /**
   * Validate image file before upload
   * @param {File} file - File to validate
   * @returns {Object} Validation result
   */
  static validateImageFile(file) {
    const result = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Check if file exists
    if (!file) {
      result.isValid = false;
      result.errors.push('No file selected');
      return result;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      result.isValid = false;
      result.errors.push('Invalid file type. Please select a JPEG, PNG, WebP, or GIF image.');
      return result;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      result.isValid = false;
      result.errors.push('File size too large. Maximum size is 10MB.');
      return result;
    }

    // SEO warnings
    if (file.size > 500000) { // 500KB
      result.warnings.push('Large file size may affect page loading speed. Consider compressing the image.');
    }

    if (file.type !== 'image/webp') {
      result.warnings.push('WebP format provides better compression and SEO benefits.');
    }

    return result;
  }

  /**
   * Generate SEO-friendly filename
   * @param {string} originalName - Original filename
   * @param {string} title - Image title
   * @returns {string} SEO-friendly filename
   */
  static generateSEOFilename(originalName, title = '') {
    let seoName = title || originalName;
    
    // Create SEO-friendly name
    seoName = seoName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .substring(0, 50); // Limit length

    return seoName;
  }

  /**
   * Get image preview URL from file
   * @param {File} file - Image file
   * @returns {Promise<string>} Preview URL
   */
  static getImagePreview(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = function(event) {
        resolve(event.target.result);
      };
      
      reader.onerror = function() {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get image metadata
   * @param {File} file - Image file
   * @returns {Promise<Object>} Image metadata
   */
  static getImageMetadata(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = function() {
        const metadata = {
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: (img.naturalWidth / img.naturalHeight).toFixed(2),
          size: file.size,
          type: file.type,
          name: file.name,
          isLandscape: img.naturalWidth > img.naturalHeight,
          isPortrait: img.naturalHeight > img.naturalWidth,
          isSquare: Math.abs(img.naturalWidth - img.naturalHeight) < 10
        };
        
        URL.revokeObjectURL(url);
        resolve(metadata);
      };
      
      img.onerror = function() {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image metadata'));
      };
      
      img.src = url;
    });
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted size
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Generate SEO recommendations for image
   * @param {Object} metadata - Image metadata
   * @param {Object} formData - Form data
   * @returns {Array} SEO recommendations
   */
  static generateSEORecommendations(metadata, formData = {}) {
    const recommendations = [];

    // File size recommendations
    if (metadata.size > 1000000) { // 1MB
      recommendations.push({
        type: 'warning',
        message: 'Image file size is large (>1MB). Consider compressing for better page load speed.',
        priority: 'high'
      });
    } else if (metadata.size > 500000) { // 500KB
      recommendations.push({
        type: 'info',
        message: 'Image file size is moderate (>500KB). Consider optimization for better performance.',
        priority: 'medium'
      });
    }

    // Format recommendations
    if (metadata.type !== 'image/webp') {
      recommendations.push({
        type: 'info',
        message: 'WebP format provides better compression and SEO benefits than ' + metadata.type.split('/')[1].toUpperCase(),
        priority: 'medium'
      });
    }

    // Dimension recommendations
    if (metadata.width > 2560 || metadata.height > 1440) {
      recommendations.push({
        type: 'warning',
        message: 'Image dimensions are very large. Consider resizing for web use.',
        priority: 'high'
      });
    }

    // Alt text recommendations
    if (!formData.altText || formData.altText.length < 10) {
      recommendations.push({
        type: 'error',
        message: 'Alt text is missing or too short. Add descriptive alt text (10+ characters) for accessibility and SEO.',
        priority: 'high'
      });
    }

    // Title recommendations
    if (!formData.title || formData.title.length < 5) {
      recommendations.push({
        type: 'warning',
        message: 'Image title is missing or too short. Add a descriptive title for better SEO.',
        priority: 'medium'
      });
    }

    return recommendations;
  }
}

export default ImageUploadService;
