import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageTransition Component
 * Provides smooth fade-in animation when navigating between pages
 */
const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start fade out animation
    setIsVisible(false);
    
    // After fade out completes, start fade in
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div 
      className={`page-transition ${isVisible ? 'fade-in' : 'fade-out'}`}
      style={{
        transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
