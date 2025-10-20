/**
 * Newsletter Service - Handles newsletter subscription and management
 */

import API_CONFIG from '../config/api.js';

class NewsletterService {
  /**
   * Subscribe to newsletter
   * @param {string} email - Email address
   * @param {Object} preferences - User preferences (optional)
   * @param {string} source - Source of subscription (optional)
   * @returns {Promise<Object>} - Response data
   */
  static async subscribe(email, preferences = {}, source = 'homepage') {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          preferences,
          source
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe to newsletter');
      }

      return data;
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      throw new Error(error.message || 'Failed to subscribe to newsletter');
    }
  }

  /**
   * Unsubscribe from newsletter
   * @param {string} email - Email address
   * @returns {Promise<Object>} - Response data
   */
  static async unsubscribe(email) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to unsubscribe from newsletter');
      }

      return data;
    } catch (error) {
      console.error('Newsletter unsubscription error:', error);
      throw new Error(error.message || 'Failed to unsubscribe from newsletter');
    }
  }

  /**
   * Get newsletter statistics (Admin only)
   * @returns {Promise<Object>} - Statistics data
   */
  static async getStats() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/newsletter/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch newsletter statistics');
      }

      return data;
    } catch (error) {
      console.error('Get newsletter stats error:', error);
      throw new Error(error.message || 'Failed to fetch newsletter statistics');
    }
  }

  /**
   * Get all subscribers (Admin only)
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Subscribers data
   */
  static async getAllSubscribers(options = {}) {
    try {
      const { page = 1, limit = 50, status = 'active' } = options;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}/newsletter/subscribers?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch subscribers');
      }

      return data;
    } catch (error) {
      console.error('Get subscribers error:', error);
      throw new Error(error.message || 'Failed to fetch subscribers');
    }
  }

  /**
   * Update subscriber preferences (Admin only)
   * @param {string} email - Subscriber email
   * @param {Object} preferences - New preferences
   * @returns {Promise<Object>} - Response data
   */
  static async updateSubscriberPreferences(email, preferences) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/newsletter/subscribers/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(preferences)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update subscriber preferences');
      }

      return data;
    } catch (error) {
      console.error('Update subscriber preferences error:', error);
      throw new Error(error.message || 'Failed to update subscriber preferences');
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Format email for display
   * @param {string} email - Email to format
   * @returns {string} - Formatted email
   */
  static formatEmail(email) {
    return email.toLowerCase().trim();
  }
}

export default NewsletterService;
