import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * Comprehensive SEO Head Component
 * Handles all meta tags, Open Graph, Twitter Cards, and Schema markup
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

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Dappr Squad" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Article specific tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags.length > 0 && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@dapprsquad" />
      <meta name="twitter:creator" content="@dapprsquad" />
      
      {/* Mobile/App Meta Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Dappr Squad" />
      <meta name="application-name" content="Dappr Squad" />
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* SEO and Crawler Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="rating" content="general" />
      <meta name="referrer" content="no-referrer-when-downgrade" />
      
      {/* Geographic Tags */}
      <meta name="geo.region" content="IN-KL" />
      <meta name="geo.placename" content="Kerala" />
      <meta name="geo.position" content="9.9312;76.2673" />
      <meta name="ICBM" content="9.9312, 76.2673" />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content="en" />
      <meta name="language" content="English" />
      
      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {/* Structured Data - Breadcrumbs */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      
      {/* Custom Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
    </Helmet>
  );
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
