import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, House } from 'react-bootstrap-icons';

/**
 * Breadcrumb Component
 * Displays navigation path for better UX and SEO
 * Automatically generates breadcrumb schema markup
 */
const Breadcrumb = ({ items = [], className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-generate breadcrumbs from URL if items not provided
  const getBreadcrumbItems = () => {
    if (items.length > 0) return items;

    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/' }];

    paths.forEach((path, index) => {
      const url = '/' + paths.slice(0, index + 1).join('/');
      const label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({ label, path: url });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = getBreadcrumbItems();

  // Generate JSON-LD Schema for breadcrumbs
  const generateBreadcrumbSchema = () => {
    const itemListElement = breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${window.location.origin}${item.path}`
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement
    };
  };

  if (breadcrumbItems.length <= 1) return null;

  return (
    <>
      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(generateBreadcrumbSchema())}
      </script>

      {/* Breadcrumb UI */}
      <nav 
        aria-label="breadcrumb" 
        className={`breadcrumb-nav ${className}`}
        style={{ padding: '1rem 0' }}
      >
        <ol 
          className="breadcrumb mb-0" 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.5rem',
            padding: 0,
            margin: 0,
            listStyle: 'none',
            fontSize: '0.9rem',
            backgroundColor: 'transparent'
          }}
        >
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const isHome = index === 0;

            return (
              <li 
                key={index}
                className="breadcrumb-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {index > 0 && (
                  <ChevronRight 
                    size={14} 
                    style={{ color: '#999', flexShrink: 0 }} 
                  />
                )}
                
                {isLast ? (
                  <span
                    style={{
                      color: '#333',
                      fontWeight: '500',
                      cursor: 'default',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                    aria-current="page"
                  >
                    {isHome ? <House size={16} /> : item.label}
                  </span>
                ) : (
                  <span
                    onClick={() => navigate(item.path)}
                    style={{
                      color: '#666',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      fontFamily: 'Poppins, sans-serif',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#000'}
                    onMouseLeave={(e) => e.target.style.color = '#666'}
                  >
                    {isHome ? <House size={16} /> : item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <style>
        {`
          .breadcrumb-nav {
            font-family: 'Poppins', sans-serif;
          }

          .breadcrumb-item span {
            white-space: nowrap;
          }

          @media (max-width: 576px) {
            .breadcrumb-nav {
              font-size: 0.85rem;
            }
          }
        `}
      </style>
    </>
  );
};

export default Breadcrumb;

