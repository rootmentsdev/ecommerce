import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { List, Search, Bag, ArrowClockwise, Lock } from 'react-bootstrap-icons';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import Footer from '../components/Footer';
import Aboutus1 from '../assets/Aboutus1.png';
import Aboutus2 from '../assets/Aboutus2.png';
import Aboutus3 from '../assets/Aboutus3.png';
import Aboutus4 from '../assets/Aboutus4.png';

const AboutUs = () => {
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
        <div className="about-us-page">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
          
          .about-us-page {
            background-color: white;
            min-height: 100vh;
            font-family: 'Inter', sans-serif;
            color: #000;
            padding: 0;
            margin: 0;
          }

          .about-title {
            font-family: 'Century Gothic', sans-serif;
            font-weight: 700;
            font-size: 22px;
            line-height: 120%;
            letter-spacing: 0%;
            text-align: center;
            margin: 32px 0 24px 0;
            color: #000;
          }

          .how-it-works {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            margin-bottom: 40px;
            gap: 20px;
          }

          .step {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            text-align: center;
          }

          .step-icon {
            width: 40px;
            height: 40px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000;
            font-size: 20px;
          }

          .step-text {
            font-family: 'Inter', sans-serif;
            font-weight: 400;
            font-size: 12px;
            line-height: 1.2;
            color: #666;
            text-align: center;
          }

          .step-text-line {
            display: block;
            margin-bottom: 2px;
          }

          .image-container {
            position: relative;
            margin: 0 20px 24px 20px;
          }

          .about-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 12px;
          }

          .image-overlay {
            display: none;
          }

          .content-section {
            padding: 0 20px;
            margin-bottom: 40px;
          }

          .section-title {
            font-family: 'Century Gothic', sans-serif;
            font-weight: 700;
            font-size: 22px;
            line-height: 120%;
            letter-spacing: 0%;
            text-align: center;
            color: #000;
            margin-bottom: 20px;
          }

          .description-text {
            font-family: 'Inter', sans-serif;
            font-weight: 400;
            font-size: 14px;
            line-height: 100%;
            letter-spacing: 0%;
            text-align: justify;
            color: #000;
            margin-bottom: 20px;
          }

          .service-box {
            background-color: white;
            border: 1px solid #e9ecef;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .service-content {
            flex: 1;
          }

          .service-title {
            font-family: 'Century Gothic', sans-serif;
            font-weight: 700;
            font-size: 16px;
            color: #333;
            margin-bottom: 4px;
          }

          .service-description {
            font-family: 'Inter', sans-serif;
            font-weight: 400;
            font-size: 14px;
            line-height: 100%;
            letter-spacing: 0%;
            color: #666;
          }

          .service-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            flex-shrink: 0;
          }

          .bullet-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .bullet-list li {
            position: relative;
            padding-left: 20px;
            margin-bottom: 12px;
            font-family: 'Inter', sans-serif;
            font-weight: 400;
            font-size: 14px;
            line-height: 100%;
            letter-spacing: 0%;
            text-align: justify;
            color: #000;
          }

          .bullet-list li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #000;
            font-weight: bold;
            font-size: 18px;
          }

          .cta-buttons {
            display: flex;
            gap: 12px;
            margin-top: 24px;
          }

          .cta-button {
            flex: 1;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .cta-button-outline {
            background-color: white;
            color: #000;
            border: 2px solid #000;
          }

          .cta-button-filled {
            background-color: #000;
            color: white;
            border: none;
          }

          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          @media (max-width: 480px) {
            .about-title {
              font-size: 28px;
            }
            
            .how-it-works {
              gap: 12px;
              padding: 0 16px;
            }
            
            .step-icon {
              width: 32px;
              height: 32px;
              font-size: 16px;
            }
            
            .step-text {
              font-size: 10px;
            }
            
            .about-image {
              height: 180px;
            }
            
            .section-title {
              font-size: 20px;
            }
            
            .description-text {
              font-size: 15px;
            }
            
            .service-box {
              padding: 12px;
            }
            
            .service-title {
              font-size: 15px;
            }
            
            .service-description {
              font-size: 13px;
            }
          }
        `}
      </style>

      {/* About Us Title */}
      <h1 className="about-title">About Us</h1>

      {/* How it Works Section */}
      <div className="how-it-works">
        <div className="step">
          <div className="step-icon">🎯</div>
          <div className="step-text">
            <span className="step-text-line">Browse&</span>
            <span className="step-text-line">Select</span>
          </div>
        </div>
        <div className="step">
          <div className="step-icon">🔒</div>
          <div className="step-text">
            <span className="step-text-line">Choose</span>
            <span className="step-text-line">Rentals</span>
          </div>
        </div>
        <div className="step">
          <div className="step-icon">🚚</div>
          <div className="step-text">
            <span className="step-text-line">Book With</span>
            <span className="step-text-line">Deposit</span>
          </div>
        </div>
        <div className="step">
          <div className="step-icon">🔄</div>
          <div className="step-text">
            <span className="step-text-line">Return&</span>
            <span className="step-text-line">Refund</span>
          </div>
        </div>
      </div>

      {/* Who we are Section */}
      <div className="image-container">
        <img src={Aboutus1} alt="Who we are" className="about-image" />
        <div className="image-overlay">Who we are.</div>
      </div>
      <div className="content-section">
        <p className="description-text">
          At Dapper Squad, we believe style is better when shared. We are a premium men's fashion platform that helps individuals and squads look their best at weddings, parties, and celebrations. Whether you want to buy, rent, or book for your entire squad, we make fashion simple, stylish, and coordinated.
        </p>
      </div>

      {/* Our Services Section */}
      <div className="content-section">
        <h2 className="section-title">Our Services</h2>
        
        <div className="service-box">
          <div className="service-content">
            <div className="service-title">Buy & Rent Option</div>
            <div className="service-description">Own it forever or wear it for the moment.</div>
          </div>
          <div className="service-icon">👕</div>
        </div>

        <div className="service-box">
          <div className="service-content">
            <div className="service-title">Theme Setting</div>
            <div className="service-description">Coordinated looks for your big day.</div>
          </div>
          <div className="service-icon">🎨</div>
        </div>

        <div className="service-box">
          <div className="service-content">
            <div className="service-title">Dress Code Consultation</div>
            <div className="service-description">Professional styling advice.</div>
          </div>
          <div className="service-icon">✂️</div>
        </div>

        <div className="service-box">
          <div className="service-content">
            <div className="service-title">Size Customization</div>
            <div className="service-description">Outfits tailored just for you.</div>
          </div>
          <div className="service-icon">📏</div>
        </div>

        <div className="service-box">
          <div className="service-content">
            <div className="service-title">Product Customization</div>
            <div className="service-description">Personalized looks for unique events.</div>
          </div>
          <div className="service-icon">⚙️</div>
        </div>
      </div>

      {/* What we do Section */}
      <div className="image-container">
        <img src={Aboutus2} alt="What we do" className="about-image" />
        <div className="image-overlay">What we do.</div>
      </div>
      <div className="content-section">
        <ul className="bullet-list">
          <li>Stylish men's wear for buy & rent.</li>
          <li>Bulk booking solutions for groups, friends, and teams with a minimum of 4 pieces.</li>
          <li>Dress code consultations to help you plan your event looks.</li>
          <li>Customization services to ensure the perfect fit and personalized style.</li>
        </ul>
      </div>

      {/* How We Do It Section */}
      <div className="image-container">
        <img src={Aboutus3} alt="How We Do It" className="about-image" />
        <div className="image-overlay">How We Do It</div>
      </div>
      <div className="content-section">
        <ul className="bullet-list">
          <li>Easy online browsing and booking.</li>
          <li>Buy or rent based on your need.</li>
          <li>Date & location-based availability check.</li>
          <li>Bulk booking for squads with just a few clicks.</li>
          <li>Phone styling and consultation from fashion experts.</li>
          <li>Customization in size and style for a perfect fit.</li>
        </ul>
      </div>

      {/* Why Choose Us Section */}
      <div className="content-section">
        <h2 className="section-title">Why Choose Us</h2>
        <ul className="bullet-list">
          <li>Buy or Rent - Your choice, your budget.</li>
          <li>Perfect for individuals & groups.</li>
          <li>Personalized styling consultations.</li>
          <li>Hassle-free online booking & availability check.</li>
          <li>Premium quality with customization options.</li>
        </ul>
      </div>

      {/* Your Celebration Section */}
      <div className="image-container">
        <img src={Aboutus4} alt="Your Celebration, Your Style The Dapper Way" className="about-image" />
        <div className="image-overlay">Your Celebration, Your Style The Dapper Way.</div>
      </div>
      <div className="content-section">
        <p className="description-text">
          Shop, rent, or book in bulk and make every event unforgettable.
        </p>
        <div className="cta-buttons">
          <button className="cta-button cta-button-outline">RENT NOW</button>
          <button className="cta-button cta-button-filled">Start shopping</button>
        </div>
        </div>
      </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;
