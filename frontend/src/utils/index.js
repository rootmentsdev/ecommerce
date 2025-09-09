// Utility functions for clean code
export const createStyleObject = (styles) => ({ ...styles });

export const combineStyles = (...styleObjects) => 
  Object.assign({}, ...styleObjects);

export const generateResponsiveStyles = (mobileStyles, desktopStyles) => ({
  ...mobileStyles,
  '@media (min-width: 768px)': desktopStyles
});

export const truncateText = (text, maxLength = 50) => 
  text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

export const formatPrice = (price) => {
  if (typeof price === 'number') {
    return `₹${price.toLocaleString('en-IN')}`;
  }
  return price;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
