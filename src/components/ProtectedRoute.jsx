import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cleanOAuthUrl, hasOAuthParams } from '../utils/authHelpers';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Handle OAuth callback cleanup
  useEffect(() => {
    if (user && hasOAuthParams()) {
      console.log('ProtectedRoute: Cleaning OAuth parameters');
      cleanOAuthUrl();
    }
  }, [user]);

  // Additional cleanup on location change
  useEffect(() => {
    if (hasOAuthParams()) {
      console.log('ProtectedRoute: Location changed, cleaning OAuth parameters');
      cleanOAuthUrl();
    }
  }, [location.pathname]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect from /dashboard to /projects
  if (location.pathname === '/dashboard') {
    return <Navigate to="/projects" replace />;
  }

  // Render children if authenticated
  return <Outlet />;
};

export default ProtectedRoute; 