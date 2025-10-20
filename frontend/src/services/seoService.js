/**
 * SEO Service - Comprehensive SEO optimization for e-commerce site
 * Implements modern SEO algorithms and best practices
 */

class SEOService {
  // SEO Configuration
  static SITE_CONFIG = {
    title: 'Dappr Squad - Premium Men\'s Suits Kerala',
    description: 'Premium men\'s fashion for every celebration in Kerala. Buy, Rent, or Book in Bulk. Perfect outfits for weddings, parties, squads, and more.',
    keywords: 'mens fashion kerala, suit rental kochi, wedding suits kerala, party wear kerala, men\'s clothing kerala, formal wear kochi, tuxedo rental kerala, designer suits kerala',
    url: 'https://ecommerce-pi-six-17.vercel.app',
    logo: '/assets/Logo.png',
    socialImage: '/assets/HomePage.png'
  };

  /**
   * Set page title with SEO optimization
   * @param {string} title - Page title (should be 50-60 chars, already includes brand)
   * @param {string} category - Product category (optional)
   */
  static setPageTitle(title, category = '') {
    // Title should already include "| Dappr Squad" and be optimized to 50-60 chars
    const optimizedTitle = title;
    
    // Ensure title doesn't exceed 60 characters for SEO best practice
    const finalTitle = optimizedTitle.length > 60 
      ? optimizedTitle.substring(0, 60) 
      : optimizedTitle;
    
    document.title = finalTitle;
    
    // Update meta title
    this.updateMetaTag('title', finalTitle);
    this.updateMetaTag('og:title', finalTitle);
    this.updateMetaTag('twitter:title', finalTitle);
  }

  /**
   * Set page description with SEO optimization
   * @param {string} description - Page description
   * @param {string} category - Product category (optional)
   */
  static setPageDescription(description, category = '') {
    const baseDescription = this.SITE_CONFIG.description;
    const optimizedDescription = category 
      ? `${description} - ${baseDescription}`
      : `${baseDescription} - ${description}`;
    
    // Limit description to 160 characters for SEO
    const finalDescription = optimizedDescription.length > 160 
      ? optimizedDescription.substring(0, 157) + '...'
      : optimizedDescription;
    
    this.updateMetaTag('description', finalDescription);
    this.updateMetaTag('og:description', finalDescription);
    this.updateMetaTag('twitter:description', finalDescription);
  }

  /**
   * Set page keywords
   * @param {string} keywords - Additional keywords
   */
  static setPageKeywords(keywords) {
    const baseKeywords = this.SITE_CONFIG.keywords;
    const finalKeywords = keywords 
      ? `${baseKeywords}, ${keywords}`
      : baseKeywords;
    
    this.updateMetaTag('keywords', finalKeywords);
  }

  /**
   * Set canonical URL
   * @param {string} path - Page path
   */
  static setCanonicalUrl(path) {
    const canonicalUrl = `${this.SITE_CONFIG.url}${path}`;
    
    // Remove existing canonical
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }
    
    // Add new canonical
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = canonicalUrl;
    document.head.appendChild(canonical);
    
    // Update Open Graph URL
    this.updateMetaTag('og:url', canonicalUrl);
  }

  /**
   * Set page image for social sharing
   * @param {string} imageUrl - Image URL
   * @param {string} alt - Image alt text
   */
  static setPageImage(imageUrl, alt = '') {
    const fullImageUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${this.SITE_CONFIG.url}${imageUrl}`;
    
    this.updateMetaTag('og:image', fullImageUrl);
    this.updateMetaTag('twitter:image', fullImageUrl);
    this.updateMetaTag('og:image:alt', alt);
  }

  /**
   * Generate structured data for products
   * @param {Array} products - Array of product objects
   */
  static generateProductStructuredData(products) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Men's Fashion Products",
      "description": "Premium men's fashion and suit rental collection",
      "itemListElement": products.map((product, index) => ({
        "@type": "Product",
        "position": index + 1,
        "name": product.name || product.title,
        "description": product.description || `${product.name || product.title} - Premium men's fashion`,
        "image": product.image || product.imageUrl,
        "offers": {
          "@type": "Offer",
          "price": product.price || product.rentalPrice,
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "url": `${this.SITE_CONFIG.url}/product/${product.id || product._id}`
        },
        "brand": {
          "@type": "Brand",
          "name": "dappr SQUAD"
        },
        "category": product.category || "Fashion"
      }))
    };

    this.addStructuredData(structuredData);
  }

  /**
   * Generate structured data for organization
   */
  static generateOrganizationStructuredData() {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Dappr Squad",
      "alternateName": "Dappr Squad Kerala",
      "url": this.SITE_CONFIG.url,
      "logo": `${this.SITE_CONFIG.url}${this.SITE_CONFIG.logo}`,
      "description": this.SITE_CONFIG.description,
      "foundingDate": "2024",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": "Kerala",
        "addressLocality": "Kochi"
      },
      "areaServed": {
        "@type": "State",
        "name": "Kerala"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["English", "Malayalam", "Hindi"]
      },
      "priceRange": "₹₹-₹₹₹",
      "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking"]
    };

    this.addStructuredData(structuredData);
  }

  /**
   * Generate breadcrumb structured data
   * @param {Array} breadcrumbs - Array of breadcrumb objects
   */
  static generateBreadcrumbStructuredData(breadcrumbs) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": breadcrumb.name,
        "item": `${this.SITE_CONFIG.url}${breadcrumb.url}`
      }))
    };

    this.addStructuredData(structuredData);
  }

  /**
   * Add structured data to page
   * @param {Object} data - Structured data object
   */
  static addStructuredData(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /**
   * Update meta tag
   * @param {string} name - Meta tag name
   * @param {string} content - Meta tag content
   */
  static updateMetaTag(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`) || 
               document.querySelector(`meta[property="${name}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  }

  /**
   * Initialize SEO for homepage
   */
  static initializeHomepageSEO() {
    this.setPageTitle('Men\'s Suits Kerala - Buy & Rent | Dappr Squad');
    this.setPageDescription('Shop or rent premium men\'s suits in Kerala at Dappr Squad. Wedding suits, formal wear & designer outfits with free delivery across Kochi, Thrissur & Kerala.');
    this.setPageKeywords('mens suits kerala, buy suits kochi, wedding suits kerala, formal wear kerala, designer suits kochi, mens fashion kerala, suit rental kerala, premium suits kochi, bandhgala kerala, kurta sets kerala');
    this.setCanonicalUrl('/');
    this.setPageImage('/assets/HomePage.png', 'Men\'s Suits Kerala - Dappr Squad');
    
    // Add additional meta tags for better SEO
    this.updateMetaTag('author', 'Dappr Squad');
    this.updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    this.updateMetaTag('googlebot', 'index, follow');
    this.updateMetaTag('bingbot', 'index, follow');
    
    // Add language and locale
    this.updateMetaTag('language', 'en');
    this.updateMetaTag('geo.region', 'IN-KL');
    this.updateMetaTag('geo.placename', 'Kerala');
    this.updateMetaTag('geo.position', '9.9312;76.2673');
    this.updateMetaTag('ICBM', '9.9312, 76.2673');
    
    // Add business hours and contact info
    this.updateMetaTag('business:contact_data:street_address', 'Kochi, Kerala');
    this.updateMetaTag('business:contact_data:locality', 'Kochi');
    this.updateMetaTag('business:contact_data:region', 'Kerala');
    this.updateMetaTag('business:contact_data:postal_code', '682001');
    this.updateMetaTag('business:contact_data:country_name', 'India');
    
    this.generateOrganizationStructuredData();
  }

  /**
   * Initialize SEO for product page
   * @param {Object} product - Product object
   */
  static initializeProductSEO(product) {
    const productName = product.name || product.title || 'Premium Suit';
    const category = product.category || 'Suit';
    // Optimize title to 50-60 chars: "{Product} - {Category} | Dappr Squad"
    const title = `${productName} - ${category} | Dappr Squad`.substring(0, 60);
    const description = `Buy ${productName} in Kerala. Premium ${category} from Dappr Squad with free delivery. Perfect for weddings and special occasions. Shop now!`;
    
    this.setPageTitle(title);
    this.setPageDescription(description);
    this.setPageKeywords(`${productName}, ${category}, mens suits kerala, buy suits kochi, formal wear kerala`);
    this.setCanonicalUrl(`/product/${product.id || product._id}`);
    this.setPageImage(product.image || product.imageUrl, productName);
  }

  /**
   * Initialize SEO for category page
   * @param {string} category - Category name
   */
  static initializeCategorySEO(category) {
    // Optimize title to 50-60 chars
    const title = `${category} Suits Kerala - Men's | Dappr Squad`.substring(0, 60);
    const description = `Shop ${category.toLowerCase()} suits for men in Kerala at Dappr Squad. Premium quality with free delivery. Perfect for weddings and special occasions.`;
    
    this.setPageTitle(title);
    this.setPageDescription(description);
    this.setPageKeywords(`${category}, mens suits kerala, ${category.toLowerCase()} suits kochi, formal wear kerala, wedding suits kerala`);
    this.setCanonicalUrl(`/category/${category.toLowerCase()}`);
    this.setPageImage('/assets/CategoryPage.png', `${category} Suits Kerala`);
  }

  /**
   * Initialize SEO for rent page
   */
  static initializeRentPageSEO() {
    this.setPageTitle('Rent Men\'s Suits Kerala - Affordable | Dappr Squad');
    this.setPageDescription('Rent premium men\'s suits in Kerala at Dappr Squad. Affordable formal wear for weddings, parties, and special occasions. Free delivery across Kerala.');
    this.setPageKeywords('rent suits kerala, suit rental kochi, wedding suit rental kerala, formal wear rental kerala, mens suit rental india');
    this.setCanonicalUrl('/rent-now');
    this.setPageImage('/assets/Rent.png', 'Rent Men\'s Suits Kerala');
  }

  /**
   * Initialize SEO for buy page
   */
  static initializeBuyPageSEO() {
    this.setPageTitle('Buy Men\'s Suits Kerala - Designer | Dappr Squad');
    this.setPageDescription('Buy premium men\'s suits online in Kerala at Dappr Squad. Designer formal wear with free delivery. Perfect for weddings and special occasions.');
    this.setPageKeywords('buy suits kerala, mens suits online kochi, wedding suits kerala, designer suits kerala, formal wear online india');
    this.setCanonicalUrl('/buy-now');
    this.setPageImage('/assets/Product1.png', 'Buy Men\'s Suits Kerala');
  }

  /**
   * Initialize SEO for about page
   */
  static initializeAboutPageSEO() {
    this.setPageTitle('About Dappr Squad - Premium Men\'s Fashion Kerala');
    this.setPageDescription('Learn about Dappr Squad, Kerala\'s premier men\'s fashion brand. Premium suits, formal wear, and wedding attire with exceptional service.');
    this.setPageKeywords('about dappr squad, mens fashion brand kerala, premium suits kochi, wedding attire kerala, formal wear brand india');
    this.setCanonicalUrl('/about');
    this.setPageImage('/assets/Aboutus1.png', 'About Dappr Squad Kerala');
  }

  /**
   * Optimize images for SEO
   * @param {string} src - Image source
   * @param {string} alt - Alt text
   * @param {string} title - Image title
   */
  static optimizeImage(src, alt, title = '') {
    return {
      src,
      alt: alt || 'dappr SQUAD - Premium Men\'s Fashion',
      title: title || alt,
      loading: 'lazy',
      decoding: 'async'
    };
  }

  /**
   * Generate sitemap data
   * @param {Array} routes - Array of route objects
   */
  static generateSitemapData(routes) {
    const sitemapData = routes.map(route => ({
      url: `${this.SITE_CONFIG.url}${route.path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: route.changefreq || 'weekly',
      priority: route.priority || '0.8'
    }));

    return sitemapData;
  }

  /**
   * Add performance optimization meta tags
   */
  static addPerformanceMetaTags() {
    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Add viewport meta tag for mobile optimization
    this.updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    
    // Add theme color for mobile browsers
    this.updateMetaTag('theme-color', '#000000');
    
    // Add apple mobile web app meta tags
    this.updateMetaTag('apple-mobile-web-app-capable', 'yes');
    this.updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
    this.updateMetaTag('apple-mobile-web-app-title', 'dappr SQUAD');
  }

  /**
   * Generate FAQ structured data
   * @param {Array} faqs - Array of FAQ objects
   */
  static generateFAQStructuredData(faqs) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    this.addStructuredData(structuredData);
  }

  /**
   * Generate Local Business structured data
   */
  static generateLocalBusinessStructuredData() {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Dappr Squad",
      "alternateName": "Dappr Squad Men's Fashion Kerala",
      "description": this.SITE_CONFIG.description,
      "url": this.SITE_CONFIG.url,
      "image": `${this.SITE_CONFIG.url}${this.SITE_CONFIG.logo}`,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": "Kerala",
        "addressLocality": "Kochi"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "9.9312",
        "longitude": "76.2673"
      },
      "openingHours": "Mo-Su 09:00-21:00",
      "priceRange": "₹₹-₹₹₹",
      "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking"],
      "currenciesAccepted": "INR",
      "areaServed": [
        {
          "@type": "City",
          "name": "Kochi"
        },
        {
          "@type": "City",
          "name": "Thrissur"
        },
        {
          "@type": "City",
          "name": "Kozhikode"
        },
        {
          "@type": "City",
          "name": "Thiruvananthapuram"
        },
        {
          "@type": "City",
          "name": "Kannur"
        }
      ]
    };

    this.addStructuredData(structuredData);
  }

  /**
   * Add schema markup for breadcrumbs
   * @param {Array} breadcrumbs - Breadcrumb items
   */
  static addBreadcrumbSchema(breadcrumbs) {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `${this.SITE_CONFIG.url}${item.url}`
      }))
    };

    this.addStructuredData(breadcrumbSchema);
  }

  /**
   * Optimize page loading with critical resource hints
   */
  static addCriticalResourceHints() {
    // DNS prefetch for external resources
    const dnsPrefetchDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }

  /**
   * Generate review structured data
   * @param {Array} reviews - Array of review objects
   */
  static generateReviewStructuredData(reviews) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "dappr SQUAD",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.4",
        "reviewCount": reviews.length,
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": reviews.map(review => ({
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": "5",
          "worstRating": "1"
        },
        "author": {
          "@type": "Person",
          "name": review.name
        },
        "reviewBody": review.text,
        "datePublished": review.date || new Date().toISOString().split('T')[0]
      }))
    };

    this.addStructuredData(structuredData);
  }

  /**
   * Initialize comprehensive SEO
   * @param {Object} options - SEO options
   */
  static initializeSEO(options = {}) {
    const {
      title,
      description,
      keywords,
      category,
      image,
      breadcrumbs,
      products,
      type = 'website'
    } = options;

    // Set basic meta tags
    if (title) this.setPageTitle(title, category);
    if (description) this.setPageDescription(description, category);
    if (keywords) this.setPageKeywords(keywords);
    if (image) this.setPageImage(image);

    // Add performance optimizations
    this.addPerformanceMetaTags();

    // Generate structured data
    if (products && products.length > 0) {
      this.generateProductStructuredData(products);
    }

    if (breadcrumbs && breadcrumbs.length > 0) {
      this.generateBreadcrumbStructuredData(breadcrumbs);
    }

    // Set Open Graph type
    this.updateMetaTag('og:type', type);
    this.updateMetaTag('twitter:card', 'summary_large_image');
  }
}

export default SEOService;
