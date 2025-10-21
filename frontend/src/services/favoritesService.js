/**
 * Centralized Favorites Service
 * Handles favorites functionality across all components
 */

class FavoritesService {
  // Static products localStorage key
  static STATIC_FAVORITES_KEY = 'favorites';
  // Admin images localStorage key
  static ADMIN_FAVORITES_KEY = 'adminImageFavorites';

  /**
   * Add item to favorites
   * @param {Object} item - Item to add (can be static product or admin image)
   */
  static addToFavorites(item) {
    if (item.id) {
      // Static product
      const favorites = JSON.parse(localStorage.getItem(this.STATIC_FAVORITES_KEY) || '[]');
      if (!favorites.includes(item.id)) {
        favorites.push(item.id);
        localStorage.setItem(this.STATIC_FAVORITES_KEY, JSON.stringify(favorites));
        console.log('✅ Added static product to favorites:', item.id);
        this.dispatchFavoritesUpdated();
      }
    } else if (item._id) {
      // Admin image
      const favorites = JSON.parse(localStorage.getItem(this.ADMIN_FAVORITES_KEY) || '[]');
      if (!favorites.includes(item._id)) {
        favorites.push(item._id);
        localStorage.setItem(this.ADMIN_FAVORITES_KEY, JSON.stringify(favorites));
        console.log('✅ Added admin image to favorites:', item._id);
        this.dispatchFavoritesUpdated();
      }
    }
  }

  /**
   * Remove item from favorites
   * @param {Object} item - Item to remove (can be static product or admin image)
   */
  static removeFromFavorites(item) {
    if (item.id) {
      // Static product
      const favorites = JSON.parse(localStorage.getItem(this.STATIC_FAVORITES_KEY) || '[]');
      const updatedFavorites = favorites.filter(id => id !== item.id);
      localStorage.setItem(this.STATIC_FAVORITES_KEY, JSON.stringify(updatedFavorites));
      console.log('❌ Removed static product from favorites:', item.id);
      this.dispatchFavoritesUpdated();
    } else if (item._id) {
      // Admin image
      const favorites = JSON.parse(localStorage.getItem(this.ADMIN_FAVORITES_KEY) || '[]');
      const updatedFavorites = favorites.filter(id => id !== item._id);
      localStorage.setItem(this.ADMIN_FAVORITES_KEY, JSON.stringify(updatedFavorites));
      console.log('❌ Removed admin image from favorites:', item._id);
      this.dispatchFavoritesUpdated();
    }
  }

  /**
   * Check if item is favorited
   * @param {Object} item - Item to check (can be static product or admin image)
   * @returns {boolean} - True if item is favorited
   */
  static isFavorited(item) {
    if (item.id) {
      // Static product
      const favorites = JSON.parse(localStorage.getItem(this.STATIC_FAVORITES_KEY) || '[]');
      return favorites.includes(item.id);
    } else if (item._id) {
      // Admin image
      const favorites = JSON.parse(localStorage.getItem(this.ADMIN_FAVORITES_KEY) || '[]');
      return favorites.includes(item._id);
    }
    return false;
  }

  /**
   * Toggle item favorite status
   * @param {Object} item - Item to toggle (can be static product or admin image)
   * @returns {boolean} - New favorite status
   */
  static toggleFavorite(item) {
    if (this.isFavorited(item)) {
      this.removeFromFavorites(item);
      return false;
    } else {
      this.addToFavorites(item);
      return true;
    }
  }

  /**
   * Get all favorited static product IDs
   * @returns {Array} - Array of static product IDs
   */
  static getStaticFavorites() {
    return JSON.parse(localStorage.getItem(this.STATIC_FAVORITES_KEY) || '[]');
  }

  /**
   * Get all favorited admin image IDs
   * @returns {Array} - Array of admin image IDs
   */
  static getAdminFavorites() {
    return JSON.parse(localStorage.getItem(this.ADMIN_FAVORITES_KEY) || '[]');
  }

  /**
   * Clear all favorites
   */
  static clearAllFavorites() {
    localStorage.removeItem(this.STATIC_FAVORITES_KEY);
    localStorage.removeItem(this.ADMIN_FAVORITES_KEY);
    console.log('🗑️ Cleared all favorites');
  }

  /**
   * Get total favorites count
   * @returns {number} - Total number of favorited items
   */
  static getTotalFavoritesCount() {
    const staticFavorites = this.getStaticFavorites();
    const adminFavorites = this.getAdminFavorites();
    const total = staticFavorites.length + adminFavorites.length;
    console.log('💖 Favorites count:', {
      static: staticFavorites.length,
      admin: adminFavorites.length,
      total: total,
      staticIds: staticFavorites,
      adminIds: adminFavorites
    });
    return total;
  }

  /**
   * Dispatch custom event when favorites are updated
   */
  static dispatchFavoritesUpdated() {
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  }
}

export default FavoritesService;
