import API_CONFIG from '../config/api';

/**
 * Image Service
 * Handles all image-related API calls for the admin panel
 */
class ImageService {
  /**
   * Get all images with optional filtering and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response with images and pagination info
   */
  static async getAllImages(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString 
        ? `${API_CONFIG.BASE_URL}/images?${queryString}`
        : `${API_CONFIG.BASE_URL}/images`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch images');
      }

      return data;
    } catch (error) {
      console.error('Get all images error:', error);
      throw new Error(error.message || 'Failed to fetch images');
    }
  }

  /**
   * Get single image by ID
   * @param {string} imageId - Image ID
   * @returns {Promise<Object>} API response with image data
   */
  static async getImageById(imageId) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/images/${imageId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch image');
      }

      return data;
    } catch (error) {
      console.error('Get image by ID error:', error);
      throw new Error(error.message || 'Failed to fetch image');
    }
  }

  /**
   * Create new image
   * @param {Object} imageData - Image data
   * @returns {Promise<Object>} API response with created image
   */
  static async createImage(imageData) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(imageData)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Create image validation errors:', data);
        console.error('Validation error details:', data.errors);
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map(err => `${err.field || err.param}: ${err.message || err.msg}`);
          throw new Error(`Validation failed: ${errorMessages.join(', ')}`);
        }
        throw new Error(data.message || 'Failed to create image');
      }

      return data;
    } catch (error) {
      console.error('Create image error:', error);
      throw new Error(error.message || 'Failed to create image');
    }
  }

  /**
   * Update existing image
   * @param {string} imageId - Image ID
   * @param {Object} imageData - Updated image data
   * @returns {Promise<Object>} API response with updated image
   */
  static async updateImage(imageId, imageData) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/images/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(imageData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update image');
      }

      return data;
    } catch (error) {
      console.error('Update image error:', error);
      throw new Error(error.message || 'Failed to update image');
    }
  }

  /**
   * Delete image
   * @param {string} imageId - Image ID
   * @returns {Promise<Object>} API response
   */
  static async deleteImage(imageId) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete image');
      }

      return data;
    } catch (error) {
      console.error('Delete image error:', error);
      throw new Error(error.message || 'Failed to delete image');
    }
  }

  /**
   * Toggle image active status
   * @param {string} imageId - Image ID
   * @returns {Promise<Object>} API response with updated image
   */
  static async toggleImageStatus(imageId) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/images/${imageId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle image status');
      }

      return data;
    } catch (error) {
      console.error('Toggle image status error:', error);
      throw new Error(error.message || 'Failed to toggle image status');
    }
  }

  /**
   * Get image categories with counts
   * @returns {Promise<Object>} API response with categories
   */
  static async getImageCategories() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/images/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch categories');
      }

      return data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw new Error(error.message || 'Failed to fetch categories');
    }
  }

  /**
   * Upload image file (placeholder for future implementation)
   * @param {File} file - Image file
   * @returns {Promise<string>} Image URL
   */
  static async uploadImageFile(file) {
    try {
      // This is a placeholder - in a real implementation, you would:
      // 1. Upload to a cloud service (AWS S3, Cloudinary, etc.)
      // 2. Or handle file upload to your server
      // 3. Return the public URL of the uploaded image
      
      // For now, we'll simulate an upload and return a placeholder URL
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUrl = `https://via.placeholder.com/800x600?text=${encodeURIComponent(file.name)}`;
          resolve(mockUrl);
        }, 1000);
      });
    } catch (error) {
      console.error('Upload image file error:', error);
      throw new Error('Failed to upload image file');
    }
  }
}

export default ImageService;
