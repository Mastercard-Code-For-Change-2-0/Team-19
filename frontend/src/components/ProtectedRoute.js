import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ role }) => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!token || !userStr) {
    // No token or user data, redirect to login
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (user.role !== role) {
      // User trying to access wrong dashboard, redirect to their correct dashboard
      return <Navigate to={`/${user.role}/dashboard`} replace />;
    }
    return <Outlet />;
  } catch (error) {
    // Invalid user data in localStorage, clear and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
