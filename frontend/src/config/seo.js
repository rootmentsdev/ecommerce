/**
 * SEO Configuration for dappr SQUAD
 * Centralized SEO settings and content
 */

export const SEO_CONFIG = {
  // Site Information
  site: {
    name: 'dappr SQUAD',
    url: 'https://dapprsquad.com',
    logo: '/assets/Logo.png',
    description: 'Premium men\'s fashion for every celebration. Buy, Rent, or Book in Bulk. Perfect outfits for weddings, parties, squads, and more.',
    keywords: 'mens fashion, suit rental, wedding suits, party wear, men\'s clothing, formal wear, tuxedo rental, designer suits',
    author: 'dappr SQUAD',
    language: 'en',
    locale: 'en_IN'
  },

  // Page-specific SEO configurations
  pages: {
    home: {
      title: 'Premium Men\'s Fashion & Suit Rental | dappr SQUAD',
      description: 'Discover premium men\'s fashion for every celebration. Buy, rent, or book in bulk. Perfect outfits for weddings, parties, and special occasions.',
      keywords: 'mens fashion, suit rental, wedding suits, formal wear, designer clothing, kerala fashion',
      image: {
        src: '/assets/HomePage.png',
        alt: 'dappr SQUAD - Premium Men\'s Fashion'
      }
    },

    products: {
      title: 'Men\'s Fashion Collection | Premium Suits & Clothing',
      description: 'Browse our premium collection of men\'s fashion including suits, kurtas, bandhgalas, and formal wear for all occasions.',
      keywords: 'mens suits, formal wear, designer clothing, premium fashion, wedding suits',
      image: {
        src: '/assets/Product1.png',
        alt: 'Premium Men\'s Fashion Collection'
      }
    },

    category: {
      title: '{{category}} Collection | Premium Men\'s Fashion',
      description: 'Explore our premium {{category}} collection. High-quality men\'s fashion for every occasion.',
      keywords: '{{category}}, mens fashion, premium clothing, formal wear',
      image: {
        src: '/assets/Product2.png',
        alt: '{{category}} Collection - Premium Men\'s Fashion'
      }
    },

    productDetail: {
      title: '{{productName}} | Premium Men\'s Fashion',
      description: '{{productName}} - Premium men\'s fashion from dappr SQUAD. Perfect for special occasions and celebrations.',
      keywords: '{{productName}}, {{category}}, mens fashion, premium clothing',
      image: {
        src: '{{productImage}}',
        alt: '{{productName}} - Premium Men\'s Fashion'
      }
    },

    favorites: {
      title: 'My Favorites | dappr SQUAD',
      description: 'View your favorite men\'s fashion items. Save and organize your preferred outfits for easy access.',
      keywords: 'favorites, wishlist, mens fashion, saved items',
      image: {
        src: '/assets/HomePage.png',
        alt: 'My Favorites - dappr SQUAD'
      }
    },

    about: {
      title: 'About Us | dappr SQUAD - Premium Men\'s Fashion',
      description: 'Learn about dappr SQUAD\'s mission to provide premium men\'s fashion for every celebration and special occasion.',
      keywords: 'about us, mens fashion company, premium clothing, kerala fashion',
      image: {
        src: '/assets/Aboutus1.png',
        alt: 'About dappr SQUAD - Premium Men\'s Fashion'
      }
    },

    buyNow: {
      title: 'Buy Now | Premium Men\'s Fashion Collection',
      description: 'Purchase premium men\'s fashion items. High-quality suits, kurtas, and formal wear for every occasion.',
      keywords: 'buy mens fashion, purchase suits, formal wear shopping',
      image: {
        src: '/assets/Product3.png',
        alt: 'Buy Premium Men\'s Fashion'
      }
    },

    rentNow: {
      title: 'Rent Now | Premium Men\'s Fashion Rental',
      description: 'Rent premium men\'s fashion for special occasions. Affordable rental options for weddings, parties, and events.',
      keywords: 'rent mens fashion, suit rental, formal wear rental, wedding suit rental',
      image: {
        src: '/assets/Product4.png',
        alt: 'Rent Premium Men\'s Fashion'
      }
    }
  },

  // Structured Data Templates
  structuredData: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'dappr SQUAD',
      url: 'https://dapprsquad.com',
      logo: 'https://dapprsquad.com/assets/Logo.png',
      description: 'Premium men\'s fashion for every celebration. Buy, Rent, or Book in Bulk.',
      foundingDate: '2024',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: 'English'
      },
      sameAs: [
        'https://www.facebook.com/dapprsquad',
        'https://www.instagram.com/dapprsquad',
        'https://www.twitter.com/dapprsquad'
      ]
    },

    localBusiness: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'dappr SQUAD',
      description: 'Premium men\'s fashion for every celebration. Buy, Rent, or Book in Bulk.',
      url: 'https://dapprsquad.com',
      telephone: '+91-XXXXXXXXXX',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
        addressRegion: 'Kerala',
        addressLocality: 'Kochi'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '9.9312',
        longitude: '76.2673'
      },
      openingHours: 'Mo-Su 09:00-21:00',
      priceRange: '₹₹',
      paymentAccepted: 'Cash, Credit Card, UPI, Net Banking',
      currenciesAccepted: 'INR'
    },

    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'dappr SQUAD',
      url: 'https://dapprsquad.com',
      description: 'Premium men\'s fashion for every celebration. Buy, Rent, or Book in Bulk.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://dapprsquad.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    }
  },

  // FAQ Data
  faqs: [
    {
      question: "What types of men's fashion do you offer?",
      answer: "We offer premium men's fashion including suits, kurtas, bandhgalas, formal wear, and traditional clothing for all occasions."
    },
    {
      question: "Do you offer rental services?",
      answer: "Yes, we provide both rental and purchase options for all our premium men's fashion items."
    },
    {
      question: "What is your delivery area?",
      answer: "We deliver across all Kerala with free shipping above ₹10,000."
    },
    {
      question: "How can I book in bulk?",
      answer: "Contact us directly to discuss bulk booking options for events, weddings, and special occasions."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Cash, Credit Cards, UPI, Net Banking, and other digital payment methods."
    },
    {
      question: "Do you provide size adjustments?",
      answer: "Yes, we provide professional tailoring and size adjustments for all our rental and purchase items."
    }
  ],

  // Performance Optimization
  performance: {
    preconnect: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ],
    dnsPrefetch: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]
  },

  // Social Media
  social: {
    facebook: 'https://www.facebook.com/dapprsquad',
    instagram: 'https://www.instagram.com/dapprsquad',
    twitter: 'https://www.twitter.com/dapprsquad',
    linkedin: 'https://www.linkedin.com/company/dapprsquad'
  }
};

export default SEO_CONFIG;
