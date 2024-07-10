import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setSessionExpired(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ sessionExpired }} />;
  }

  return children;
};

export default ProtectedRoute;
