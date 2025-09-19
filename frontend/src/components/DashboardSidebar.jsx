import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  House,
  Calendar,
  People,
  CreditCard,
  ArrowLeft,
  BarChart,
  Gear,
  PersonCircle,
  BoxArrowRight
} from 'react-bootstrap-icons';
import Logo from '../assets/Logo.png';

const DashboardSidebar = ({ onLogout, userInfo = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: House, path: '/admin/dashboard' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/admin/bookings' },
    { id: 'customers', label: 'Customers', icon: People, path: '/admin/customers' },
    { id: 'transaction', label: 'Transaction', icon: CreditCard, path: '/admin/transactions' },
    { id: 'returns', label: 'Returns', icon: ArrowLeft, path: '/admin/returns' },
    { id: 'analytics', label: 'Analytics', icon: BarChart, path: '/admin/analytics' },
  ];

  const productItems = [
    { id: 'inventory', label: 'Inventory', path: '/admin/inventory' },
    { id: 'add-item', label: 'Add Item', path: '/admin/image-management', isActive: true },
    { id: 'product-reviews', label: 'Product Reviews', path: '/admin/reviews' },
  ];

  const adminItems = [
    { id: 'admin-role', label: 'Admin role', path: '/admin/roles' },
    { id: 'settings', label: 'Settings', path: '/admin/settings' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const MenuItem = ({ item, isSubItem = false, isActive = false }) => {
    const Icon = item.icon;
    const active = isActive || isActiveRoute(item.path);
    
    return (
      <div
        className={`menu-item ${active ? 'active' : ''} ${isSubItem ? 'sub-item' : ''}`}
        onClick={() => handleNavigation(item.path)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: isSubItem ? '8px 16px 8px 40px' : '12px 16px',
          cursor: 'pointer',
          borderRadius: '8px',
          margin: '2px 8px',
          fontSize: '14px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: active ? '500' : '400',
          color: active ? '#2563eb' : '#64748b',
          backgroundColor: active ? '#eff6ff' : 'transparent',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.target.style.backgroundColor = '#f8fafc';
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.target.style.backgroundColor = 'transparent';
          }
        }}
      >
        {Icon && (
          <Icon
            size={18}
            style={{
              marginRight: '12px',
              color: active ? '#2563eb' : '#64748b',
            }}
          />
        )}
        <span>{item.label}</span>
      </div>
    );
  };

  return (
    <div
      style={{
        width: '250px',
        height: '100vh',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          padding: '20px 16px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img
          src={Logo}
          alt="LOGO"
          style={{
            height: '32px',
            width: 'auto',
            objectFit: 'contain',
          }}
        />
        <span
          style={{
            marginLeft: '12px',
            fontSize: '18px',
            fontWeight: '600',
            fontFamily: 'Century Gothic, sans-serif',
            color: '#1e293b',
          }}
        >
          LOGO
        </span>
      </div>

      {/* Navigation Menu */}
      <div style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
        {/* Main Menu Section */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              padding: '0 16px 8px 16px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#94a3b8',
              fontFamily: 'Poppins, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Main menu
          </div>
          {menuItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>

        {/* Product Section */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              padding: '0 16px 8px 16px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#94a3b8',
              fontFamily: 'Poppins, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Product
          </div>
          {productItems.map((item) => (
            <MenuItem 
              key={item.id} 
              item={item} 
              isSubItem={true} 
              isActive={item.isActive}
            />
          ))}
        </div>

        {/* Admin Section */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              padding: '0 16px 8px 16px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#94a3b8',
              fontFamily: 'Poppins, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Admin
          </div>
          {adminItems.map((item) => (
            <MenuItem key={item.id} item={item} isSubItem={true} />
          ))}
        </div>
      </div>

      {/* User Profile Section */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
            }}
          >
            <PersonCircle size={20} color="#64748b" />
          </div>
          <div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#1e293b',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              {userInfo.name || 'Desaport'}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#64748b',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              {userInfo.role || 'Marketing@desaport...'}
            </div>
          </div>
        </div>
        <div
          style={{
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease',
          }}
          onClick={onLogout}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          <BoxArrowRight size={16} color="#64748b" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
