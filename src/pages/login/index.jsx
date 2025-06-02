import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkModeContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

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