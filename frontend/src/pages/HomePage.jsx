import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/HeaderClean';
import SideMenu from '../components/SideMenuClean';
import Footer from '../components/FooterClean';
import HomePageContentClean from '../components/HomePageContentClean';

const HomePage = () => {
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
        <HomePageContentClean />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
