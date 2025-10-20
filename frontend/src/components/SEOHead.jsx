import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Comprehensive SEO Head Component (React 19 Compatible)
 * Handles all meta tags, Open Graph, Twitter Cards, and Schema markup
 * Works without react-helmet-async
 */
const SEOHead = ({
  title = 'Dappr Squad - Premium Men\'s Suits & Fashion in Kerala',
  description = 'Shop or rent premium men\'s suits in Kerala. Perfect for weddings, parties & corporate events. Free delivery across Kerala.',
  keywords = 'mens suits kerala, buy suits kochi, wedding suits kerala, formal wear kerala, suit rental kerala, mens fashion kochi',
  image = '/assets/HomePage.png',
  url = '',
  type = 'website',
  author = 'Dappr Squad',
  publishedTime = '',
  modifiedTime = '',
  section = '',
  tags = [],
  structuredData = null,
  breadcrumbs = []
}) => {
  const siteUrl = 'https://ecommerce-pi-six-17.vercel.app';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (selector, content, isProperty = false) => {
      if (!content) return;
      
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${selector}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, selector);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Helper function to update link tags
    const updateLinkTag = (rel, href) => {
      if (!href) return;
      
      let link = document.querySelector(`link[rel="${rel}"]`);
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      
      link.setAttribute('href', href);
    };

    // Primary Meta Tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    // Canonical URL
    updateLinkTag('canonical', fullUrl);

    // Open Graph / Facebook
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', fullImageUrl, true);
    updateMetaTag('og:image:alt', title, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:site_name', 'Dappr Squad', true);
    updateMetaTag('og:locale', 'en_IN', true);

    // Article specific tags
    if (type === 'article') {
      if (publishedTime) updateMetaTag('article:published_time', publishedTime, true);
      if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime, true);
      if (section) updateMetaTag('article:section', section, true);
      tags.forEach(tag => {
        updateMetaTag('article:tag', tag, true);
      });
    }

    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:url', fullUrl);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', fullImageUrl);
    updateMetaTag('twitter:image:alt', title);
    updateMetaTag('twitter:site', '@dapprsquad');
    updateMetaTag('twitter:creator', '@dapprsquad');

    // Mobile/App Meta Tags
    updateMetaTag('mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
    updateMetaTag('apple-mobile-web-app-title', 'Dappr Squad');
    updateMetaTag('application-name', 'Dappr Squad');
    updateMetaTag('theme-color', '#000000');
    updateMetaTag('msapplication-TileColor', '#000000');

    // SEO and Crawler Tags
    updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMetaTag('googlebot', 'index, follow');
    updateMetaTag('bingbot', 'index, follow');
    updateMetaTag('rating', 'general');
    updateMetaTag('referrer', 'no-referrer-when-downgrade');

    // Geographic Tags
    updateMetaTag('geo.region', 'IN-KL');
    updateMetaTag('geo.placename', 'Kerala');
    updateMetaTag('geo.position', '9.9312;76.2673');
    updateMetaTag('ICBM', '9.9312, 76.2673');

    // Language and Locale
    updateMetaTag('language', 'English');

    // Preconnect for performance
    const preconnectUrls = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    preconnectUrls.forEach(url => {
      if (!document.querySelector(`link[rel="preconnect"][href="${url}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        if (url.includes('gstatic')) {
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
      }
    });

    // DNS prefetch
    preconnectUrls.forEach(url => {
      if (!document.querySelector(`link[rel="dns-prefetch"][href="${url}"]`)) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = url;
        document.head.appendChild(link);
      }
    });

  }, [title, description, keywords, image, fullUrl, fullImageUrl, type, author, publishedTime, modifiedTime, section, tags]);

  // Add structured data
  useEffect(() => {
    const scriptId = 'seo-structured-data';
    let script = document.getElementById(scriptId);

    // Generate breadcrumb structured data
    const breadcrumbSchema = breadcrumbs.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': `${siteUrl}${item.url}`
      }))
    } : null;

    // Organization schema
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Dappr Squad',
      'url': siteUrl,
      'logo': `${siteUrl}/assets/Logo.png`,
      'description': 'Premium men\'s fashion and suit rental in Kerala. Buy or rent designer suits, kurtas, bandhgalas and formal wear for weddings and special occasions.',
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'IN',
        'addressRegion': 'Kerala',
        'addressLocality': 'Kochi'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '9.9312',
        'longitude': '76.2673'
      },
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'customer service',
        'availableLanguage': ['English', 'Malayalam', 'Hindi']
      },
      'priceRange': '₹₹-₹₹₹',
      'paymentAccepted': ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking'],
      'areaServed': {
        '@type': 'State',
        'name': 'Kerala'
      }
    };

    // Combine all schemas
    const allSchemas = [organizationSchema];
    if (breadcrumbSchema) allSchemas.push(breadcrumbSchema);
    if (structuredData) allSchemas.push(structuredData);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(allSchemas);

    return () => {
      // Cleanup is optional as we're just updating content
    };
  }, [breadcrumbs, structuredData, siteUrl]);

  return null; // This component doesn't render anything
};

SEOHead.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  author: PropTypes.string,
  publishedTime: PropTypes.string,
  modifiedTime: PropTypes.string,
  section: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  structuredData: PropTypes.object,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }))
};

export default SEOHead;
