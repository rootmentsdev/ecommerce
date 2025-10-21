import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Facebook, Instagram, Twitter, Linkedin, Envelope, Phone, GeoAlt } from 'react-bootstrap-icons';

const FooterClean = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-5 mt-auto">
      <Container>
        <Row className="g-4">
          {/* Company Info */}
          <Col md={4}>
            <h5 className="fw-bold mb-3">dappr SQUAD</h5>
            <p className="text-white-50 small">
              Premium men's fashion for every celebration. Buy, Rent, or Book in Bulk.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-white"><Facebook size={20} /></a>
              <a href="#" className="text-white"><Instagram size={20} /></a>
              <a href="#" className="text-white"><Twitter size={20} /></a>
              <a href="#" className="text-white"><Linkedin size={20} /></a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={2}>
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="/about" className="text-white-50 text-decoration-none">About Us</a></li>
              <li className="mb-2"><a href="/products" className="text-white-50 text-decoration-none">Products</a></li>
              <li className="mb-2"><a href="/rent-now" className="text-white-50 text-decoration-none">Rent</a></li>
              <li className="mb-2"><a href="/buy-now" className="text-white-50 text-decoration-none">Buy</a></li>
            </ul>
          </Col>

          {/* Services */}
          <Col md={2}>
            <h6 className="fw-bold mb-3">Services</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="/buy-products" className="text-white-50 text-decoration-none">Buy Products</a></li>
              <li className="mb-2"><a href="/rent-products" className="text-white-50 text-decoration-none">Rent Products</a></li>
              <li className="mb-2"><a href="/enquire" className="text-white-50 text-decoration-none">Bulk Orders</a></li>
              <li className="mb-2"><a href="/favorites" className="text-white-50 text-decoration-none">Favorites</a></li>
            </ul>
          </Col>

          {/* Contact */}
          <Col md={4}>
            <h6 className="fw-bold mb-3">Contact Us</h6>
            <ul className="list-unstyled small">
              <li className="mb-2 text-white-50">
                <Envelope size={16} className="me-2" />
                info@dapprsquad.com
              </li>
              <li className="mb-2 text-white-50">
                <Phone size={16} className="me-2" />
                +91 1234567890
              </li>
              <li className="mb-2 text-white-50">
                <GeoAlt size={16} className="me-2" />
                Kerala, India
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="border-secondary my-4" />

        {/* Bottom Row */}
        <Row>
          <Col className="text-center text-white-50 small">
            <p className="mb-0">&copy; {currentYear} dappr SQUAD. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterClean;

