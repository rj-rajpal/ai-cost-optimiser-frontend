import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('processing');
        console.log('Processing OAuth callback...');
        
        // Use getSessionFromUrl to extract session from OAuth callback URL
        const { data, error } = await supabase.auth.getSessionFromUrl();
        
        if (error) {
          console.error('OAuth callback error:', error);
          setStatus('error');
          
          // Redirect to login with error after delay
          setTimeout(() => {
            navigate('/login?error=oauth_failed', { replace: true });
          }, 2000);
          return;
        }

        if (data?.session?.user) {
          console.log('Authentication successful:', data.session.user.email);
          console.log('Session data:', data.session);
          setStatus('success');
          
          // Success - redirect to projects page cleanly
          setTimeout(() => {
            navigate('/projects', { replace: true });
          }, 1500);
        } else {
          console.log('No session found in URL');
          setStatus('error');
          
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
        }
      } catch (error) {
        console.error('Callback processing error:', error);
        setStatus('error');
        
        setTimeout(() => {
          navigate('/login?error=callback_failed', { replace: true });
        }, 2000);
      }
    };

    // Only process if we're actually on the callback URL with hash parameters
    if (window.location.hash) {
      console.log('Hash detected:', window.location.hash);
      handleAuthCallback();
    } else {
      console.log('No hash parameters found, redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing authentication...
            </h2>
            <p className="text-gray-600">
              Please wait while we finish setting up your account.
            </p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="rounded-full h-16 w-16 bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication successful!
            </h2>
            <p className="text-gray-600">
              Redirecting you to your dashboard...
            </p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="rounded-full h-16 w-16 bg-red-100 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication failed
            </h2>
            <p className="text-gray-600">
              Redirecting you back to login...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback; 