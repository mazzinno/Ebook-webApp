import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// this checks if the user is an admin
const AdminRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;