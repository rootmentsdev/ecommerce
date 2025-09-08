import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';

const HomePage = () => {
  const [showSideMenu, setShowSideMenu] = useState(false);

  const handleShowSideMenu = () => setShowSideMenu(true);
  const handleCloseSideMenu = () => setShowSideMenu(false);

  return (
    <div>
      {/* Custom Header */}
      <Header onMenuClick={handleShowSideMenu} />
      
      {/* Side Menu */}
      <SideMenu show={showSideMenu} handleClose={handleCloseSideMenu} />
      
      {/* Main Content */}
      <main className="container-fluid py-4">
        <div className="d-flex justify-content-end mb-3">
          <Link to="/login" className="btn btn-outline-primary">
            Login
          </Link>
        </div>
        <h1>Home Page</h1>
        <p>Welcome to our ECommerce site! Use the menu button to access navigation.</p>
        {/* Your content will go here */}
      </main>
    </div>
  );
};

export default HomePage;
