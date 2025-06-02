import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('OAuth callback error:', error);
          navigate('/login?error=oauth_failed');
          return;
        }

        if (data.session) {
          // Clean up the URL
          const cleanUrl = window.location.origin + '/projects';
          window.history.replaceState({}, document.title, cleanUrl);
          
          // Navigate to projects page
          navigate('/projects');
        } else {
          // No session found, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error handling OAuth callback:', error);
        navigate('/login?error=callback_failed');
      }
    };

    // Only run if we have OAuth callback parameters
    if (window.location.hash.includes('access_token') || window.location.hash.includes('refresh_token')) {
      handleOAuthCallback();
    }
  }, [navigate]);

  // Show loading while processing
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-muted-indigo mx-auto mb-4"></div>
        <p className="text-slate-gray">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallback; 