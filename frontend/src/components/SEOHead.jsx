import React, { useEffect } from 'react';
import SEOService from '../services/seoService';

/**
 * SEO Head Component - Handles dynamic SEO optimization
 * @param {Object} props - SEO configuration
 */
const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  structuredData,
  breadcrumbs,
  faqs,
  reviews,
  products
}) => {
  useEffect(() => {
    // Set page title
    if (title) {
      SEOService.setPageTitle(title);
    }

    // Set page description
    if (description) {
      SEOService.setPageDescription(description);
    }

    // Set page keywords
    if (keywords) {
      SEOService.setPageKeywords(keywords);
    }

    // Set canonical URL
    if (url) {
      SEOService.setCanonicalUrl(url);
    }

    // Set page image
    if (image) {
      SEOService.setPageImage(image.src, image.alt);
    }

    // Set Open Graph type
    SEOService.updateMetaTag('og:type', type);

    // Generate structured data
    if (structuredData) {
      SEOService.addStructuredData(structuredData);
    }

    if (breadcrumbs && breadcrumbs.length > 0) {
      SEOService.addBreadcrumbSchema(breadcrumbs);
    }

    if (faqs && faqs.length > 0) {
      SEOService.generateFAQStructuredData(faqs);
    }

    if (reviews && reviews.length > 0) {
      SEOService.generateReviewStructuredData(reviews);
    }

    if (products && products.length > 0) {
      SEOService.generateProductStructuredData(products);
    }

    // Add performance optimizations
    SEOService.addPerformanceMetaTags();
    SEOService.addCriticalResourceHints();

  }, [title, description, keywords, image, url, type, structuredData, breadcrumbs, faqs, reviews, products]);

  return null; // This component doesn't render anything
};

export default SEOHead;
