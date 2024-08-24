import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// checks if the user in logged in either as admin or normal user
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;