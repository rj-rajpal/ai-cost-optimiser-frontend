import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, loading } = useAuth();

  const notifications = [
    {
      id: 1,
      title: 'Data Upload Complete',
      message: 'Your cost analysis data has been successfully processed.',
      time: '2 minutes ago',
      type: 'success',
      unread: true
    },
    {
      id: 2,
      title: 'ROI Calculation Updated',
      message: 'New provider pricing data available for comparison.',
      time: '1 hour ago',
      type: 'info',
      unread: true
    },
    {
      id: 3,
      title: 'Scenario Saved',
      message: 'Your optimization scenario has been saved to library.',
      time: '3 hours ago',
      type: 'success',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "BarChart3" },
    { path: "/onboarding-wizard", label: "Onboarding", icon: "Zap" },
    { path: "/data-upload", label: "Data Upload", icon: "Upload" },
    { path: "/process-analysis", label: "Analysis", icon: "Search" },
    { path: "/roi-calculator", label: "ROI Calculator", icon: "Calculator" },
    { path: "/scenario-library", label: "Scenarios", icon: "BookOpen" },
  ];

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsUserMenuOpen(false);
  };

  const handleUserMenuClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsNotificationOpen(false);
  };

  const handleNotificationItemClick = (notificationId) => {
    console.log('Notification clicked:', notificationId);
  };

  const handleUserMenuItemClick = (action) => {
    console.log('User menu action:', action);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-header bg-surface border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - Logo */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-white"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-text-primary font-heading">
                AI Cost Optimizer
              </h1>
              <p className="text-xs text-text-secondary">
                Enterprise Analytics Platform
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Navigation Links */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-700"
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Section - Notifications and User Menu */}
        <div className="flex items-center space-x-2">
          {/* Show login button if not authenticated */}
          {!user && !loading && (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200"
            >
              Sign In
            </Link>
          )}

          {/* Show user menu if authenticated */}
          {user && (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={handleNotificationClick}
                  className="relative p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200 min-w-touch min-h-touch flex items-center justify-center"
                  aria-label="Notifications"
                >
                  <Icon name="Bell" size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-lg shadow-elevation z-dropdown animate-scale-in">
                    <div className="p-4 border-b border-border">
                      <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
                      <p className="text-xs text-text-secondary mt-1">
                        {unreadCount} unread notifications
                      </p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationItemClick(notification.id)}
                          className="w-full p-4 text-left hover:bg-surface-700 transition-colors duration-200 border-b border-border last:border-b-0"
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              notification.type === 'success' ? 'bg-success' :
                              notification.type === 'info' ? 'bg-primary' : 'bg-warning'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-text-primary truncate">
                                  {notification.title}
                                </p>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                                )}
                              </div>
                              <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-text-tertiary mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="p-3 border-t border-border">
                      <button className="w-full text-center text-sm text-primary hover:text-primary-600 transition-colors duration-200">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={handleUserMenuClick}
                  className="flex items-center space-x-2 p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200 min-w-touch min-h-touch"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <Icon name="ChevronDown" size={16} className="hidden sm:block" />
                </button>

                {/* User Menu Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-lg shadow-elevation z-dropdown animate-scale-in">
                    <div className="p-4 border-b border-border">
                      <p className="text-sm font-medium text-text-primary">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      <p className="text-xs text-text-secondary">{user.email}</p>
                      <p className="text-xs text-text-tertiary mt-1">User</p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => handleUserMenuItemClick('profile')}
                        className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200 flex items-center space-x-3"
                      >
                        <Icon name="User" size={16} />
                        <span>Profile Settings</span>
                      </button>
                      <button
                        onClick={() => handleUserMenuItemClick('preferences')}
                        className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200 flex items-center space-x-3"
                      >
                        <Icon name="Settings" size={16} />
                        <span>Preferences</span>
                      </button>
                      <button
                        onClick={() => handleUserMenuItemClick('organization')}
                        className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200 flex items-center space-x-3"
                      >
                        <Icon name="Building" size={16} />
                        <span>Organization</span>
                      </button>
                      <button
                        onClick={() => handleUserMenuItemClick('billing')}
                        className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200 flex items-center space-x-3"
                      >
                        <Icon name="CreditCard" size={16} />
                        <span>Billing</span>
                      </button>
                    </div>
                    <div className="py-2 border-t border-border">
                      <button
                        onClick={() => handleUserMenuItemClick('help')}
                        className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200 flex items-center space-x-3"
                      >
                        <Icon name="HelpCircle" size={16} />
                        <span>Help & Support</span>
                      </button>
                      <button
                        onClick={async () => {
                          await signOut();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-error hover:text-error-600 hover:bg-surface-700 transition-colors duration-200 flex items-center space-x-3"
                      >
                        <Icon name="LogOut" size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;