import API_CONFIG from '../config/api';

// Cache to prevent excessive API calls
const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Frontend Image Service
 * Handles image fetching for public frontend pages (no admin auth required)
 */
class FrontendImageService {
  /**
   * Get active images by category for frontend display
   * @param {string} category - Image category ('hero', 'product', 'banner', 'gallery', etc.)
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Array of active images
   */
  static async getImagesByCategory(category, options = {}) {
    const cacheKey = `category_${category}_${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const params = new URLSearchParams({
        category,
        isActive: 'true',
        sortBy: 'displayOrder',
        sortOrder: 'asc',
        limit: options.limit || '50',
        ...options
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}/images/public?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.warn('Failed to fetch images:', data.message);
        return [];
      }

      const images = data.data?.images || [];
      
      // Cache the result
      cache.set(cacheKey, {
        data: images,
        timestamp: Date.now()
      });

      return images;
    } catch (error) {
      console.error('Frontend image service error:', error);
      return [];
    }
  }

  /**
   * Get all active images for frontend
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of active images
   */
  static async getAllActiveImages(options = {}) {
    const cacheKey = `all_active_${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const params = new URLSearchParams({
        isActive: 'true',
        sortBy: 'displayOrder',
        sortOrder: 'asc',
        limit: options.limit || '100',
        ...options
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}/images/public?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.warn('Failed to fetch images:', data.message);
        return [];
      }

      const images = data.data?.images || [];
      
      // Cache the result
      cache.set(cacheKey, {
        data: images,
        timestamp: Date.now()
      });

      return images;
    } catch (error) {
      console.error('Frontend image service error:', error);
      return [];
    }
  }

  /**
   * Get hero images for homepage
   * @returns {Promise<Array>} Array of hero images
   */
  static async getHeroImages() {
    return this.getImagesByCategory('hero', { limit: '10' });
  }

  /**
   * Get product images
   * @returns {Promise<Array>} Array of product images
   */
  static async getProductImages() {
    return this.getImagesByCategory('product', { limit: '50' });
  }

  /**
   * Get banner images
   * @returns {Promise<Array>} Array of banner images
   */
  static async getBannerImages() {
    return this.getImagesByCategory('banner', { limit: '20' });
  }

  /**
   * Get gallery images
   * @returns {Promise<Array>} Array of gallery images
   */
  static async getGalleryImages() {
    return this.getImagesByCategory('gallery', { limit: '100' });
  }

  /**
   * Get images by tags
   * @param {Array<string>} tags - Array of tags to search for
   * @returns {Promise<Array>} Array of matching images
   */
  static async getImagesByTags(tags) {
    try {
      const params = new URLSearchParams({
        isActive: 'true',
        tags: tags.join(','),
        sortBy: 'displayOrder',
        sortOrder: 'asc',
        limit: '50'
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}/images/public?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.warn('Failed to fetch images by tags:', data.message);
        return [];
      }

      return data.data?.images || [];
    } catch (error) {
      console.error('Frontend image service error:', error);
      return [];
    }
  }

  /**
   * Search images by keyword
   * @param {string} keyword - Search keyword
   * @returns {Promise<Array>} Array of matching images
   */
  static async searchImages(keyword) {
    try {
      const params = new URLSearchParams({
        isActive: 'true',
        search: keyword,
        sortBy: 'displayOrder',
        sortOrder: 'asc',
        limit: '50'
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}/images/public?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.warn('Failed to search images:', data.message);
        return [];
      }

      return data.data?.images || [];
    } catch (error) {
      console.error('Frontend image service error:', error);
      return [];
    }
  }
}

export default FrontendImageService;
