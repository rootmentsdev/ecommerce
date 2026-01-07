import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import Footer from '../components/Footer';

const RentalTerms = () => {
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
                <h1 className="display-5 fw-bold mb-3">Rental Terms & Conditions</h1>
                <h2 className="h3 fw-bold mb-4">DAPPR SQUAD</h2>
              </div>

              {/* Terms & Conditions Section */}
              <div className="mb-5">
                <h2 className="h3 fw-bold mb-4 pb-3 border-bottom">TERMS & CONDITIONS</h2>
                <p className="text-muted mb-4">
                  <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="mb-4">
                  By accessing or using the Dappr Squad website, you agree to the following terms:
                </p>

                <div className="mb-4">
                  <h3 className="h5 fw-semibold mb-3">1. Services</h3>
                  <p className="mb-3">
                    We provide rental and retail services for premium apparel, accessories, and related products. Availability may vary by location.
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="h5 fw-semibold mb-3">2. Bookings & Payments</h3>
                  <ul className="list-unstyled ms-4">
                    <li className="mb-2">• Booking confirmations are subject to advance payment.</li>
                    <li className="mb-2">• Booking amounts are non-refundable, unless explicitly stated otherwise.</li>
                    <li className="mb-2">• Prices displayed are inclusive/exclusive of taxes as mentioned.</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="h5 fw-semibold mb-3">3. Rentals</h3>
                  <ul className="list-unstyled ms-4">
                    <li className="mb-2">• Rented products must be used strictly as instructed.</li>
                    <li className="mb-2">• Washing, ironing, alteration, or modification is strictly prohibited.</li>
                    <li className="mb-2">• Late returns, loss, or damage will attract additional charges, up to full product value.</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="h5 fw-semibold mb-3">4. Trials & Delivery</h3>
                  <ul className="list-unstyled ms-4">
                    <li className="mb-2">• Final trial and confirmation at delivery are mandatory.</li>
                    <li className="mb-2">• No claims regarding fitting or alterations will be accepted after delivery.</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="h5 fw-semibold mb-3">5. Website Usage</h3>
                  <p className="mb-3">
                    Content, images, and branding are the intellectual property of Rootments Enterprises.
                  </p>
                  <p className="mb-3">
                    Unauthorized copying, reproduction, or misuse is prohibited.
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="h5 fw-semibold mb-3">6. Limitation of Liability</h3>
                  <p className="mb-3">
                    The company shall not be liable for indirect or incidental damages arising from website use or service delays beyond reasonable control.
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="h5 fw-semibold mb-3">7. Governing Law</h3>
                  <p className="mb-3">
                    These terms are governed by the laws of India, and disputes shall be subject to the jurisdiction of courts in Kerala.
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="h5 fw-semibold mb-3">8. Contact</h3>
                  <p className="mb-2">
                    📧 <a href="mailto:info@dapprsquad.com" className="text-decoration-none">info@dapprsquad.com</a>
                  </p>
                  <p className="mb-2">
                    📞 <a href="tel:+919876543210" className="text-decoration-none">+91 98765 43210</a>
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RentalTerms;

