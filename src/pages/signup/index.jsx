import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Github, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { signUpWithEmail, signInWithProvider, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/projects');
    }
  }, [user, navigate]);

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    try {
      const { error } = await signUpWithEmail(email, password, name);
      if (error) {
        setError(error.message);
      } else {
        setMessage('Sign up successful! Redirecting...');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async (provider) => {
    setLoading(true);
    setError('');
    
    try {
      const { error } = await signInWithProvider(provider.toLowerCase());
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cloud-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Signup Card */}
        <div className="bg-white border border-sky-gray rounded-lg p-8 shadow-mist">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-muted-indigo rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-white"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-charcoal-black">Create Account</h1>
            <p className="text-slate-gray mt-2">
              Sign up for your AI Cost Optimizer account
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-soft-rose border border-red-300 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          {message && (
            <div className="mb-4 p-3 bg-calm-green border border-green-300 rounded-lg">
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}

          {/* Social Signup Buttons */}
          <div className="flex gap-3 mb-6">
            <Button 
              variant="outline" 
              className="flex-1 bg-white border-sky-gray hover:bg-fog-gray text-charcoal-black"
              onClick={() => handleSocialSignup('Google')}
              disabled={loading}
            >
              <Mail className="mr-2 text-[#EA4335]" size={16} aria-hidden="true" />
              Google
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 bg-white border-sky-gray hover:bg-fog-gray text-charcoal-black"
              onClick={() => handleSocialSignup('Github')}
              disabled={loading}
            >
              <Github className="mr-2 text-charcoal-black" size={16} aria-hidden="true" />
              GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sky-gray"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-gray">Or sign up with email</span>
            </div>
          </div>

          {/* Email Signup Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-charcoal-black mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 bg-cloud-white border border-sky-gray rounded-lg text-charcoal-black placeholder-slate-gray focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo transition-colors duration-200"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal-black mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-cloud-white border border-sky-gray rounded-lg text-charcoal-black placeholder-slate-gray focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo transition-colors duration-200"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal-black mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 bg-cloud-white border border-sky-gray rounded-lg text-charcoal-black placeholder-slate-gray focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo transition-colors duration-200 pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-gray hover:text-charcoal-black transition-colors duration-200"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal-black mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-3 py-2 bg-cloud-white border border-sky-gray rounded-lg text-charcoal-black placeholder-slate-gray focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo transition-colors duration-200 pr-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-muted-indigo hover:bg-muted-indigo/90 text-white" 
              disabled={loading || !email || !password || !confirmPassword || !name}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-slate-gray">
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

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-gray text-sm">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-muted-indigo hover:text-muted-indigo/80 transition-colors duration-200">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-muted-indigo hover:text-muted-indigo/80 transition-colors duration-200">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup; 