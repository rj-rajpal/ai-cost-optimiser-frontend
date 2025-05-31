import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Github, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { signInWithEmail, signInWithProvider, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/projects');
    }
  }, [user, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setError(error.message);
      } else {
        setMessage('Sign in successful! Redirecting...');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
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
        {/* Back to Projects Link */}
        <Link 
          to="/projects" 
          className="inline-flex items-center text-slate-gray hover:text-charcoal-black mb-8 transition-colors duration-200"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Projects
        </Link>

        {/* Login Card */}
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
            <h1 className="text-2xl font-bold text-charcoal-black">Welcome Back</h1>
            <p className="text-slate-gray mt-2">
              Sign in to your AI Cost Optimizer account
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

          {/* Social Login Buttons */}
          <div className="flex gap-3 mb-6">
            <Button 
              variant="outline" 
              className="flex-1 border-sky-gray hover:bg-fog-gray text-charcoal-black"
              onClick={() => handleSocialLogin('Google')}
              disabled={loading}
            >
              <Mail className="mr-2 text-[#EA4335]" size={16} aria-hidden="true" />
              Google
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 border-sky-gray hover:bg-fog-gray text-charcoal-black"
              onClick={() => handleSocialLogin('Github')}
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
              <span className="bg-white px-4 text-slate-gray">Or continue with email</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-muted-indigo focus:ring-muted-indigo border-sky-gray rounded"
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-gray">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="text-muted-indigo hover:text-muted-indigo/80 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-muted-indigo hover:bg-muted-indigo/90 text-white" 
              disabled={loading || !email || !password}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-slate-gray">
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

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-gray text-sm">
            By signing in, you agree to our{' '}
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

export default Login; 