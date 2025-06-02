import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkModeContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signUp(formData.email, formData.password, {
        full_name: formData.fullName
      });
      
      if (result?.error) {
        setError(result.error.message || 'Failed to create account');
      } else {
        navigate('/projects');
      }
    } catch (error) {
      console.error('Signup error:', error);
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

        {/* Signup Card */}
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
              Create your account
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>
              Start optimizing your AI costs today
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
            {/* Full Name Field */}
            <div>
              <label 
                htmlFor="fullName" 
                className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-charcoal-black'}`}
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo ${
                  isDarkMode 
                    ? 'bg-black border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-white border-sky-gray text-charcoal-black placeholder-slate-gray'
                }`}
                placeholder="Enter your full name"
                required
              />
            </div>

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
                  placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div>
              <label 
                htmlFor="confirmPassword" 
                className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-charcoal-black'}`}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo ${
                    isDarkMode 
                      ? 'bg-black border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-white border-sky-gray text-charcoal-black placeholder-slate-gray'
                  }`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-slate-gray hover:text-charcoal-black'
                  }`}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-muted-indigo hover:bg-muted-indigo/90 text-white py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {/* Terms */}
          <p className={`mt-6 text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-muted-indigo hover:text-muted-indigo/80 transition-colors duration-200">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-muted-indigo hover:text-muted-indigo/80 transition-colors duration-200">
              Privacy Policy
            </Link>
          </p>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-muted-indigo hover:text-muted-indigo/80 font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 