// Constants file for better maintainability
export const APP_CONFIG = {
  FONTS: {
    PRIMARY: "'Poppins', sans-serif", // For headings
    SECONDARY: "'Poppins', sans-serif"       // For body text
  },
  COLORS: {
    PRIMARY: '#000000',
    SECONDARY: '#333333',
    MUTED: '#666666',
    LIGHT: '#f8f9fa',
    WHITE: '#ffffff'
  },
  SPACING: {
    SMALL: '8px',
    MEDIUM: '16px',
    LARGE: '24px',
    XLARGE: '32px'
  },
  BREAKPOINTS: {
    MOBILE: '576px',
    TABLET: '768px',
    DESKTOP: '992px'
  }
};

export const PRODUCT_TYPES = {
  NEW_ARRIVALS: 'newArrivals',
  CATEGORIES: 'categories',
  OCCASIONS: 'occasions'
};

export const CARD_SIZES = {
  PRODUCT: {
    WIDTH: '180px',
    HEIGHT: '320px',
    IMAGE_HEIGHT: '240px',
    TEXT_HEIGHT: '80px'
  },
  CATEGORY: {
    ASPECT_RATIO: '1'
  },
  FEATURE: {
    HEIGHT: '120px',
    BORDER_RADIUS: '12px 12px 0px 0px'
  }
};
