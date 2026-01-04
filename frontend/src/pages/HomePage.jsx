import { useState } from 'react';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import HomePageContent from '../components/HomePageContent';

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
        <HomePageContent />
      </main>
    </div>
  );
};

export default HomePage;
