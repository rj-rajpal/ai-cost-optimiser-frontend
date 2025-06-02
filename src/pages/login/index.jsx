import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkModeContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, signInWithProvider } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for OAuth errors in URL parameters
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'oauth_failed') {
      setError('Authentication failed. Please try again.');
    } else if (errorParam === 'callback_failed') {
      setError('Authentication callback failed. Please try again.');
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result?.error) {
        setError(result.error.message || 'Failed to sign in');
      } else {
        navigate('/projects');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider) => {
    setError('');
    try {
      const result = await signInWithProvider(provider);
      if (result?.error) {
        setError(result.error.message || `Failed to sign in with ${provider}`);
      }
      // Note: For OAuth, the redirect is handled by Supabase
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      setError(`An error occurred signing in with ${provider}`);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDarkMode ? 'bg-black' : 'bg-cloud-white'
    }`}>
      <div className="w-full max-w-md">
        {/* Header with Dark Mode Toggle and Back Link */}
        <div className="flex items-center justify-between mb-8">
          {/* Back to Home Link */}
          <Link 
            to="/" 
            className={`inline-flex items-center transition-colors duration-200 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white' 
                : 'text-slate-gray hover:text-charcoal-black'
            }`}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 transition-colors duration-200 rounded-lg ${
              isDarkMode 
                ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-900' 
                : 'text-slate-gray hover:text-charcoal-black hover:bg-fog-gray'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Login Card */}
        <div className={`rounded-lg p-8 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-black border border-gray-800 shadow-2xl' 
            : 'bg-white border border-sky-gray shadow-mist'
        }`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-muted-indigo rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
              Welcome back
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-3 border rounded-lg ${
              isDarkMode 
                ? 'bg-red-900/20 border-red-800 text-red-300' 
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Social Sign In Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialSignIn('google')}
              className={`w-full flex items-center justify-center px-4 py-3 border rounded-lg font-medium transition-colors duration-200 ${
                isDarkMode 
                  ? 'border-gray-700 text-white hover:bg-gray-900' 
                  : 'border-sky-gray text-charcoal-black hover:bg-fog-gray'
              }`}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleSocialSignIn('github')}
              className={`w-full flex items-center justify-center px-4 py-3 border rounded-lg font-medium transition-colors duration-200 ${
                isDarkMode 
                  ? 'border-gray-700 text-white hover:bg-gray-900' 
                  : 'border-sky-gray text-charcoal-black hover:bg-fog-gray'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className={`absolute inset-0 flex items-center ${isDarkMode ? '' : ''}`}>
              <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-sky-gray'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${isDarkMode ? 'bg-black text-gray-400' : 'bg-white text-slate-gray'}`}>
                Or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-charcoal-black'}`}
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo ${
                  isDarkMode 
                    ? 'bg-black border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-white border-sky-gray text-charcoal-black placeholder-slate-gray'
                }`}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-charcoal-black'}`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo ${
                    isDarkMode 
                      ? 'bg-black border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-white border-sky-gray text-charcoal-black placeholder-slate-gray'
                  }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-slate-gray hover:text-charcoal-black'
                  }`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-muted-indigo hover:text-muted-indigo/80 text-sm transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-muted-indigo hover:bg-muted-indigo/90 text-white py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-muted-indigo hover:text-muted-indigo/80 font-medium transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 