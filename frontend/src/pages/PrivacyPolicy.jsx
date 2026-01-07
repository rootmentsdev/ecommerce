import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  const [showSideMenu, setShowSideMenu] = useState(false);

  const handleShowSideMenu = () => setShowSideMenu(true);
  const handleCloseSideMenu = () => setShowSideMenu(false);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Custom Header */}
      <Header onMenuClick={handleShowSideMenu} />
      
      {/* Side Menu */}
      <SideMenu show={showSideMenu} handleClose={handleCloseSideMenu} />
      
      {/* Main Content */}
      <main className="flex-grow-1">
        <Container className="py-5" style={{ maxWidth: '900px' }}>
          <Row className="justify-content-center">
            <Col xs={12}>
              {/* Title */}
              <div className="text-center mb-5">
                <h1 className="display-5 fw-bold mb-3">Privacy Policy & Terms</h1>
                <h2 className="h3 fw-bold mb-4">DAPPR SQUAD</h2>
              </div>

              {/* Privacy Policy Section */}
              <div className="mb-5">
                <h2 className="h3 fw-bold mb-4 pb-3 border-bottom">PRIVACY POLICY</h2>
                <p className="text-muted mb-4">
                  <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="mb-4">
                  Dappr Squad (operated by Rootments Enterprises) values your privacy and is committed to protecting your personal information.
                </p>

                <div className="mb-4">
                  <h3 className="h5 fw-semibold mb-3">1. Information We Collect</h3>
                  <p className="mb-3">We may collect the following information when you visit our website or interact with us:</p>
                  <ul className="list-unstyled ms-4">
                    <li className="mb-2">• Name, phone number, email address</li>
                    <li className="mb-2">• Event or function details (for enquiries/bookings)</li>
                    <li className="mb-2">• Billing and transaction details (via secure payment gateways)</li>
                    <li className="mb-2">• Website usage data (cookies, IP address, browser type)</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="h5 fw-semibold mb-3">2. How We Use Your Information</h3>
                  <p className="mb-3">Your information is used to:</p>
                  <ul className="list-unstyled ms-4">
                    <li className="mb-2">• Process enquiries, bookings, rentals, and purchases</li>
                    <li className="mb-2">• Communicate updates, confirmations, and service-related information</li>
                    <li className="mb-2">• Improve our products, services, and website experience</li>
                    <li className="mb-2">• Comply with legal and regulatory requirements</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="h5 fw-semibold mb-3">3. Data Protection & Security</h3>
                  <p className="mb-3">
                    We implement appropriate technical and organizational measures to safeguard your data.
                  </p>
                  <p className="mb-3">
                    Payment information is processed only through secure, PCI-compliant third-party gateways. We do not store card or UPI credentials.
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="h5 fw-semibold mb-3">4. Sharing of Information</h3>
                  <p className="mb-3">We do not sell or rent your personal data. Information may be shared only with:</p>
                  <ul className="list-unstyled ms-4">
                    <li className="mb-2">• Authorized internal teams</li>
                    <li className="mb-2">• Trusted service providers (payment, logistics, IT)</li>
                    <li className="mb-2">• Legal authorities if required by law</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="h5 fw-semibold mb-3">5. Cookies</h3>
                  <p className="mb-3">
                    Our website may use cookies to enhance browsing experience and analyze traffic. You may disable cookies via your browser settings.
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="h5 fw-semibold mb-3">6. Your Rights</h3>
                  <p className="mb-3">
                    You may request access, correction, or deletion of your personal data by contacting us at:
                  </p>
                  <p className="mb-3">
                    📧 <a href="mailto:info@dapprsquad.com" className="text-decoration-none">info@dapprsquad.com</a>
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="h5 fw-semibold mb-3">7. Policy Updates</h3>
                  <p className="mb-3">
                    This policy may be updated periodically. Continued use of the website implies acceptance of the revised policy.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <hr className="my-5" />

          
            </Col>
          </Row>
        </Container>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

