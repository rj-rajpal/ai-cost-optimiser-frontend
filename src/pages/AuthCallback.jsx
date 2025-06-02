import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { SplashCursor } from '../components/ui/splash-cursor';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Exchange the code for a session (PKCE flow)
        await supabase.auth.exchangeCodeForSession();
        
        // Navigate to projects page after successful authentication
        navigate('/projects', { replace: true });
      } catch (error) {
        console.error('Error during OAuth callback:', error);
        navigate('/login?error=callback_failed', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  // Show loading spinner while processing
  return (
    <div className="min-h-screen bg-cloud-white flex items-center justify-center relative">
      {/* Splash Cursor Background */}
      <div className="fixed inset-0 z-0">
        <SplashCursor />
      </div>
      
      <div className="text-center relative z-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-muted-indigo mx-auto mb-4"></div>
        <p className="text-slate-gray">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback; 