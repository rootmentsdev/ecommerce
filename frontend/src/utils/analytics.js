/**
 * Analytics Utility
 * Handles Google Analytics, Facebook Pixel, and other tracking
 */

class Analytics {
  static isInitialized = false;

  /**
   * Initialize Google Analytics
   * @param {string} measurementId - GA4 Measurement ID (G-XXXXXXXXXX)
   */
  static initGoogleAnalytics(measurementId = 'G-XXXXXXXXXX') {
    if (typeof window === 'undefined' || this.isInitialized) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, {
      page_path: window.location.pathname,
      send_page_view: true
    });

    this.isInitialized = true;
    console.log('✅ Google Analytics initialized');
  }

  /**
   * Track page view
   * @param {string} path - Page path
   * @param {string} title - Page title
   */
  static trackPageView(path, title) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
        page_location: window.location.href
      });
    }
  }

  /**
   * Track custom event
   * @param {string} eventName - Event name
   * @param {object} params - Event parameters
   */
  static trackEvent(eventName, params = {}) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params);
    }
  }

  /**
   * Track product view
   * @param {object} product - Product object
   */
  static trackProductView(product) {
    this.trackEvent('view_item', {
      currency: 'INR',
      value: product.price || product.rentalPrice,
      items: [{
        item_id: product.id || product._id,
        item_name: product.name || product.title,
        item_category: product.category,
        price: product.price || product.rentalPrice
      }]
    });
  }

  /**
   * Track add to favorites
   * @param {object} product - Product object
   */
  static trackAddToFavorites(product) {
    this.trackEvent('add_to_wishlist', {
      currency: 'INR',
      value: product.price || product.rentalPrice,
      items: [{
        item_id: product.id || product._id,
        item_name: product.name || product.title,
        item_category: product.category,
        price: product.price || product.rentalPrice
      }]
    });
  }

  /**
   * Track search
   * @param {string} searchTerm - Search query
   */
  static trackSearch(searchTerm) {
    this.trackEvent('search', {
      search_term: searchTerm
    });
  }

  /**
   * Track category view
   * @param {string} category - Category name
   */
  static trackCategoryView(category) {
    this.trackEvent('view_item_list', {
      item_list_name: category
    });
  }

  /**
   * Track button click
   * @param {string} buttonName - Button name/label
   * @param {string} location - Where button was clicked
   */
  static trackButtonClick(buttonName, location = '') {
    this.trackEvent('button_click', {
      button_name: buttonName,
      click_location: location
    });
  }

  /**
   * Track form submission
   * @param {string} formName - Form name
   * @param {boolean} success - Submission success status
   */
  static trackFormSubmission(formName, success = true) {
    this.trackEvent('form_submission', {
      form_name: formName,
      success: success
    });
  }

  /**
   * Track newsletter subscription
   * @param {string} email - User email
   */
  static trackNewsletterSubscription(email) {
    this.trackEvent('newsletter_signup', {
      method: 'website'
    });
  }

  /**
   * Track social media click
   * @param {string} platform - Social platform name
   */
  static trackSocialClick(platform) {
    this.trackEvent('social_click', {
      platform: platform
    });
  }

  /**
   * Track enquiry submission
   * @param {string} enquiryType - Type of enquiry
   */
  static trackEnquiry(enquiryType) {
    this.trackEvent('generate_lead', {
      value: 0,
      currency: 'INR',
      lead_type: enquiryType
    });
  }

  /**
   * Track user engagement
   * @param {string} engagementType - Type of engagement
   * @param {number} value - Engagement value/duration
   */
  static trackEngagement(engagementType, value = 0) {
    this.trackEvent('user_engagement', {
      engagement_type: engagementType,
      value: value
    });
  }

  /**
   * Initialize Facebook Pixel (optional)
   * @param {string} pixelId - Facebook Pixel ID
   */
  static initFacebookPixel(pixelId = 'YOUR_PIXEL_ID') {
    if (typeof window === 'undefined') return;

    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');

    console.log('✅ Facebook Pixel initialized');
  }

  /**
   * Set user properties
   * @param {object} properties - User properties
   */
  static setUserProperties(properties) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('set', 'user_properties', properties);
    }
  }

  /**
   * Track conversion
   * @param {string} conversionLabel - Conversion label
   * @param {number} value - Conversion value
   */
  static trackConversion(conversionLabel, value = 0) {
    this.trackEvent('conversion', {
      send_to: conversionLabel,
      value: value,
      currency: 'INR'
    });
  }
}

// Auto-initialize on import (you can customize the ID)
if (typeof window !== 'undefined') {
  // Replace with your actual Google Analytics ID
  // Analytics.initGoogleAnalytics('G-XXXXXXXXXX');
}

export default Analytics;

