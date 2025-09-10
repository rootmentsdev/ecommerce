import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCheck = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      // User is logged in, redirect to home
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  return children;
};

export default AuthCheck;
