import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Icon from '../components/AppIcon';
import SideNavBar from '../components/SideNavBar';

const MainLayout = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    { path: "/projects", label: "Projects", icon: "Grid3X3" },
    { path: "/dashboard", label: "Dashboard", icon: "BarChart3" },
    { path: "/data-upload", label: "Data Upload", icon: "Upload" },
    { path: "/process-analysis", label: "Analysis", icon: "Search" },
    { path: "/roi-calculator", label: "ROI Calculator", icon: "Calculator" },
    { path: "/scenario-library", label: "Scenarios", icon: "BookOpen" },
  ];

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
      navigate('/login');
    }
  };

  const handleSignOutClick = async (e) => {
    e.stopPropagation(); // Prevent menu from closing
    setIsUserMenuOpen(false); // Close menu manually
    await handleSignOut();
  };

  return (
    <div className="min-h-screen bg-cloud-white">
      {/* SideNavBar Component */}
      <SideNavBar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-sky-gray sticky top-0 z-30 shadow-mist">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md text-soft-navy hover:bg-fog-gray transition-colors duration-200"
              >
                <Icon name="Menu" size={24} />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted-indigo rounded-lg flex items-center justify-center border border-sky-gray">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-semibold text-soft-navy">AI Cost Optimizer</h1>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-muted-indigo bg-muted-indigo/10'
                      : 'text-slate-gray hover:text-soft-navy hover:bg-fog-gray'
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-fog-gray transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-muted-indigo to-mist-teal flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <Icon name="ChevronDown" size={16} className="text-slate-gray" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-mist border border-sky-gray py-1 z-50">
                  <button className="w-full px-4 py-2 text-left text-charcoal-black hover:bg-fog-gray transition-colors duration-200">
                    Profile Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-charcoal-black hover:bg-fog-gray transition-colors duration-200">
                    Account Settings
                  </button>
                  <hr className="my-1 border-sky-gray" />
                  <button 
                    onClick={handleSignOutClick}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-soft-rose transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout; 