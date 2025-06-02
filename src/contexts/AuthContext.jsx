import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { cleanOAuthUrl, hasOAuthParams, navigateToProjectsClean } from '../utils/authHelpers';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle OAuth callback immediately on mount
    const handleOAuthCallback = async () => {
      // Check if we have OAuth callback parameters in the URL
      if (hasOAuthParams()) {
        try {
          console.log('Detected OAuth callback, processing...');
          
          // Process the OAuth callback
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('OAuth callback error:', error);
            cleanOAuthUrl(); // Clean URL even on error
            return;
          }

          if (data.session) {
            console.log('OAuth success, user authenticated:', data.session.user.email);
            setUser(data.session.user);
            
            // Clean up the URL immediately
            cleanOAuthUrl();
            
            // Navigate to projects if not already there
            if (window.location.pathname !== '/projects') {
              setTimeout(() => {
                navigateToProjectsClean();
              }, 100);
            }
          } else {
            console.log('No session found, cleaning URL');
            cleanOAuthUrl();
          }
        } catch (error) {
          console.error('Error processing OAuth callback:', error);
          cleanOAuthUrl(); // Clean URL on error
        }
      }
    };

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Handle OAuth callback first, then get session
    handleOAuthCallback().then(() => {
      getInitialSession();
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        setUser(session?.user ?? null);
        setLoading(false);

        // Additional cleanup for any remaining OAuth parameters
        if (event === 'SIGNED_IN' && session) {
          if (hasOAuthParams()) {
            cleanOAuthUrl();
          }
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signInWithEmail = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error };
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (data?.user) {
        // Create a profile record in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: name,
              email: email,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return { data, error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { data: null, error };
    }
  };

  // Sign in with OAuth provider
  const signInWithProvider = async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/projects`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      return { data, error };
    } catch (error) {
      console.error('Error signing in with provider:', error);
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { data, error };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    loading,
    signIn: signInWithEmail,
    signUp: signUpWithEmail,
    signInWithEmail,
    signUpWithEmail,
    signInWithProvider,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 