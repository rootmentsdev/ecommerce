import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Browse Products', path: '/products' },
    { label: 'My Orders', path: '/orders' },
    { label: 'Cart', path: '/cart' },
    { label: 'FAQs', path: '/faq' },
    { label: 'Contact Us', path: '/contact' }
  ];

  const policies = [
    { label: 'Rental Terms & Conditions', path: '/rental-terms' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Cancellation&Refund Policy', path: '/refunds' },
    { label: 'Security Deposit Policy', path: '/security-deposit' }
  ];

  return (
    <footer style={{ backgroundColor: '#1a1a1a' }}>
      {/* Main Footer Content */}
      <div style={{ 
        padding: '60px 0 40px', 
        maxWidth: '1440px', 
        margin: '0 auto',
        paddingLeft: '100px',
        paddingRight: '100px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          gap: '60px',
          flexWrap: 'wrap'
        }}>
          {/* Brand Column */}
          <div style={{ flex: '0 0 280px', maxWidth: '300px' }}>
            <h3 style={{ 
              fontFamily: 'Bricolage Grotesque, sans-serif', 
              fontWeight: 400, 
              fontSize: '28px', 
              color: '#fff', 
              marginBottom: '4px',
              letterSpacing: '-0.5px'
            }}>
              dappr
            </h3>
            <p style={{ 
              fontFamily: 'Bricolage Grotesque, sans-serif', 
              fontWeight: 600, 
              fontSize: '14px', 
              color: '#fff', 
              marginBottom: '20px',
              letterSpacing: '2px'
            }}>
              SQUAD
            </p>
            <p style={{ 
              fontFamily: 'Bricolage Grotesque, sans-serif', 
              fontSize: '13px', 
              color: '#888', 
              lineHeight: '1.6', 
              marginBottom: '24px' 
            }}>
              Lorem ipsum dolor sit amet consectetur. Non volutpat nisi pretium blandit in risus sagittis auctor.
            </p>
            
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  textDecoration: 'none'
                }}>
                <span style={{ color: '#fff', fontSize: '16px' }}>📷</span>
              </a>
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  backgroundColor: '#25D366',
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  textDecoration: 'none'
                }}>
                <span style={{ color: '#fff', fontSize: '16px' }}>📱</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  backgroundColor: '#1877F2',
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  textDecoration: 'none'
                }}>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>f</span>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h6 style={{ 
              fontFamily: 'Bricolage Grotesque, sans-serif', 
              fontWeight: 600, 
              fontSize: '14px', 
              color: '#fff', 
              marginBottom: '20px'
            }}>
              Quick Links
            </h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {quickLinks.map((item, i) => (
                <li key={i} style={{ marginBottom: '12px' }}>
                  <Link 
                    to={item.path} 
                    style={{ 
                      fontFamily: 'Bricolage Grotesque, sans-serif', 
                      fontSize: '13px', 
                      color: '#888', 
                      textDecoration: 'none',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies Column */}
          <div>
            <h6 style={{ 
              fontFamily: 'Bricolage Grotesque, sans-serif', 
              fontWeight: 600, 
              fontSize: '14px', 
              color: '#fff', 
              marginBottom: '20px'
            }}>
              Policies
            </h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {policies.map((item, i) => (
                <li key={i} style={{ marginBottom: '12px' }}>
                  <Link 
                    to={item.path} 
                    style={{ 
                      fontFamily: 'Bricolage Grotesque, sans-serif', 
                      fontSize: '13px', 
                      color: '#888', 
                      textDecoration: 'none',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ 
        borderTop: '1px solid #2a2a2a',
        padding: '20px 0', 
        maxWidth: '1440px', 
        margin: '0 auto',
        paddingLeft: '100px',
        paddingRight: '100px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Copyright */}
          <p style={{ 
            fontFamily: 'Bricolage Grotesque, sans-serif', 
            fontSize: '12px', 
            color: '#666', 
            margin: 0 
          }}>
            CompanyName © 2025. All Rights Reserved
          </p>

          {/* Payment Methods */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Visa */}
            <div style={{ 
              backgroundColor: '#fff', 
              borderRadius: '4px', 
              padding: '4px 8px', 
              fontSize: '10px', 
              fontWeight: 700, 
              fontStyle: 'italic',
              color: '#1a1f71',
              minWidth: '36px',
              textAlign: 'center'
            }}>
              VISA
            </div>
            
            {/* Mastercard */}
            <div style={{ 
              backgroundColor: '#fff', 
              borderRadius: '4px', 
              padding: '4px 8px', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '36px'
            }}>
              <span style={{ color: '#eb001b', fontSize: '12px' }}>●</span>
              <span style={{ color: '#f79e1b', fontSize: '12px', marginLeft: '-3px' }}>●</span>
            </div>
            
            {/* PayPal */}
            <div style={{ 
              backgroundColor: '#fff', 
              borderRadius: '4px', 
              padding: '4px 8px', 
              fontSize: '9px', 
              fontWeight: 700, 
              minWidth: '36px',
              textAlign: 'center'
            }}>
              <span style={{ color: '#003087' }}>Pay</span>
              <span style={{ color: '#009cde' }}>Pal</span>
            </div>
            
            {/* Apple Pay */}
            <div style={{ 
              backgroundColor: '#fff', 
              borderRadius: '4px', 
              padding: '4px 8px', 
              fontSize: '9px', 
              fontWeight: 600, 
              color: '#000',
              minWidth: '36px',
              textAlign: 'center'
            }}>
               Pay
            </div>
            
            {/* Google Pay */}
            <div style={{ 
              backgroundColor: '#fff', 
              borderRadius: '4px', 
              padding: '4px 8px', 
              fontSize: '9px', 
              fontWeight: 600, 
              color: '#5f6368',
              minWidth: '36px',
              textAlign: 'center'
            }}>
              <span style={{ color: '#4285f4' }}>G</span> Pay
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Responsive Styles - All Screen Sizes */}
      <style>
        {`
          /* ============================================
             FOOTER RESPONSIVE STYLES
             All screen sizes from 320px to 2560px+
          ============================================ */
          
          /* Extra Large Desktop (1920px+) */
          @media (min-width: 1920px) {
            footer > div:first-child {
              padding: 70px 150px 50px !important;
            }
            footer > div:last-child {
              padding: 24px 150px !important;
            }
          }
          
          /* Large Desktop (1440px - 1919px) */
          @media (min-width: 1440px) and (max-width: 1919px) {
            footer > div:first-child {
              padding: 60px 100px 40px !important;
            }
            footer > div:last-child {
              padding: 20px 100px !important;
            }
          }
          
          /* Medium Desktop (1200px - 1439px) */
          @media (min-width: 1200px) and (max-width: 1439px) {
            footer > div:first-child {
              padding: 55px 80px 38px !important;
            }
            footer > div:first-child > div {
              gap: 50px !important;
            }
            footer > div:last-child {
              padding: 20px 80px !important;
            }
          }
          
          /* Small Desktop / Large Tablet Landscape (1024px - 1199px) */
          @media (min-width: 1024px) and (max-width: 1199px) {
            footer > div:first-child {
              padding: 50px 50px 35px !important;
            }
            footer > div:first-child > div {
              gap: 40px !important;
            }
            footer > div:last-child {
              padding: 20px 50px !important;
            }
          }
          
          /* iPad Pro / Tablet Landscape (992px - 1023px) */
          @media (min-width: 992px) and (max-width: 1023px) {
            footer > div:first-child {
              padding: 45px 40px 32px !important;
            }
            footer > div:first-child > div {
              gap: 35px !important;
            }
            footer > div:first-child > div > div:first-child {
              flex: 0 0 240px !important;
              max-width: 260px !important;
            }
            footer > div:last-child {
              padding: 18px 40px !important;
            }
          }
          
          /* Tablet Portrait (768px - 991px) */
          @media (min-width: 768px) and (max-width: 991px) {
            footer > div:first-child {
              padding: 40px 30px 30px !important;
            }
            footer > div:first-child > div {
              gap: 30px !important;
              flex-wrap: wrap !important;
            }
            footer > div:first-child > div > div:first-child {
              flex: 1 1 100% !important;
              max-width: 100% !important;
              margin-bottom: 15px !important;
            }
            footer > div:first-child > div > div:nth-child(2),
            footer > div:first-child > div > div:nth-child(3) {
              flex: 1 1 45% !important;
            }
            footer > div:last-child {
              padding: 18px 30px !important;
            }
          }
          
          /* Small Tablet (600px - 767px) */
          @media (min-width: 600px) and (max-width: 767px) {
            footer > div:first-child {
              padding: 35px 24px 25px !important;
            }
            footer > div:first-child > div {
              gap: 25px !important;
              flex-wrap: wrap !important;
            }
            footer > div:first-child > div > div:first-child {
              flex: 1 1 100% !important;
              max-width: 100% !important;
            }
            footer > div:first-child > div > div:nth-child(2),
            footer > div:first-child > div > div:nth-child(3) {
              flex: 1 1 45% !important;
              min-width: 140px !important;
            }
            footer > div:last-child {
              padding: 16px 24px !important;
            }
            footer > div:last-child > div {
              flex-direction: column !important;
              text-align: center !important;
              align-items: center !important;
              gap: 14px !important;
            }
            footer > div:last-child > div > p {
              text-align: center !important;
            }
            footer > div:last-child > div > div {
              justify-content: center !important;
            }
          }
          
          /* Large Mobile (480px - 599px) */
          @media (min-width: 480px) and (max-width: 599px) {
            footer > div:first-child {
              padding: 30px 20px 22px !important;
            }
            footer > div:first-child > div {
              flex-direction: column !important;
              gap: 22px !important;
            }
            footer > div:first-child > div > div {
              flex: 1 1 100% !important;
              max-width: 100% !important;
            }
            footer > div:last-child {
              padding: 14px 20px !important;
            }
            footer > div:last-child > div {
              flex-direction: column !important;
              text-align: center !important;
              align-items: center !important;
              gap: 12px !important;
            }
            footer > div:last-child > div > p {
              text-align: center !important;
            }
            footer > div:last-child > div > div {
              justify-content: center !important;
            }
            footer > div:last-child > div > p {
              font-size: 11px !important;
            }
          }
          
          /* Mobile (320px - 479px) */
          @media (min-width: 320px) and (max-width: 479px) {
            footer > div:first-child {
              padding: 25px 16px 18px !important;
            }
            footer > div:first-child > div {
              flex-direction: column !important;
              gap: 20px !important;
            }
            footer > div:first-child > div > div {
              flex: 1 1 100% !important;
              max-width: 100% !important;
            }
            footer > div:first-child > div > div h3 {
              font-size: 24px !important;
            }
            footer > div:first-child > div > div h6 {
              font-size: 13px !important;
            }
            footer > div:first-child > div > div p,
            footer > div:first-child > div > div a {
              font-size: 12px !important;
            }
            footer > div:last-child {
              padding: 12px 16px !important;
            }
            footer > div:last-child > div {
              flex-direction: column !important;
              text-align: center !important;
              align-items: center !important;
              gap: 10px !important;
            }
            footer > div:last-child > div > p {
              text-align: center !important;
            }
            footer > div:last-child > div > div {
              justify-content: center !important;
              flex-wrap: wrap !important;
              gap: 6px !important;
            }
            footer > div:last-child > div > p {
              font-size: 10px !important;
            }
          }
          
          /* Extra Small Mobile (<320px) */
          @media (max-width: 319px) {
            footer > div:first-child {
              padding: 20px 12px 15px !important;
            }
            footer > div:first-child > div {
              flex-direction: column !important;
              gap: 16px !important;
            }
            footer > div:first-child > div > div h3 {
              font-size: 22px !important;
            }
            footer > div:first-child > div > div h6 {
              font-size: 12px !important;
            }
            footer > div:first-child > div > div p,
            footer > div:first-child > div > div a {
              font-size: 11px !important;
            }
            footer > div:last-child {
              padding: 10px 12px !important;
            }
            footer > div:last-child > div > div {
              gap: 4px !important;
            }
            footer > div:last-child > div > div > div {
              padding: 3px 6px !important;
              min-width: 30px !important;
              font-size: 8px !important;
            }
            footer > div:last-child > div > p {
              font-size: 9px !important;
            }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
