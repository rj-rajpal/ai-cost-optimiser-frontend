import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Icon from '../components/AppIcon';
import SideNavBar from '../components/SideNavBar';

const ProjectLayout = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [project, setProject] = useState(null);

  useEffect(() => {
    // Simulate fetching project data
    const projectData = {
      'rua-almadinah': {
        id: 'rua-almadinah',
        title: 'RUA AL MADINAH',
        phase: 'CMP',
        progress: 75
      },
      'rua-al-haram': {
        id: 'rua-al-haram',
        title: 'RUA AL HARAM',
        phase: 'DEV',
        progress: 45
      },
      'trojena': {
        id: 'trojena',
        title: 'TROJENA',
        phase: 'DES',
        progress: 30
      }
    };

    const selectedProject = projectData[projectId] || {
      id: projectId,
      title: projectId?.toUpperCase().replace('-', ' ') || 'PROJECT',
      phase: 'CMP',
      progress: 75
    };
    
    setProject(selectedProject);
  }, [projectId]);

  // Tab configuration matching sidebar navigation (removed Projects)
  const tabs = [
    { name: 'Dashboard', path: 'dashboard' },
    { name: 'Data Upload', path: 'data-upload' },
    { name: 'Analysis', path: 'analysis' },
    { name: 'ROI Calculator', path: 'roi-calculator' },
    { name: 'Scenarios', path: 'scenarios' }
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

  const handleTabClick = (tabPath) => {
    navigate(`/project/${projectId}/${tabPath}`);
  };

  // Get current active tab from URL
  const getCurrentTab = () => {
    const pathParts = location.pathname.split('/');
    const tabPath = pathParts[3]; // /project/:projectId/:tabPath
    
    // If trying to access old projects route, redirect to dashboard
    if (tabPath === 'projects') {
      navigate(`/project/${projectId}/dashboard`, { replace: true });
      return tabs[0]; // return dashboard tab
    }
    
    // Find the current tab or default to dashboard (first tab)
    return tabs.find(tab => tab.path === tabPath) || tabs[0];
  };

  const activeTab = getCurrentTab();

  if (!project) {
    return (
      <div className="min-h-screen bg-cloud-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-muted-indigo rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Building" size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-soft-navy mb-2">Loading project...</h3>
          <p className="text-slate-gray">Please wait while we load your project details.</p>
        </div>
      </div>
    );
  }

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

      {/* Project Title */}
      <div className="bg-white border-b border-sky-gray px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-mist-teal/20 to-muted-indigo/20 rounded-lg flex items-center justify-center border border-sky-gray">
            <Icon name="Building" size={24} className="text-soft-navy" />
          </div>
          <h1 className="text-3xl font-bold text-soft-navy">{project.title}</h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-sky-gray px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.path}
              onClick={() => handleTabClick(tab.path)}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                activeTab.path === tab.path
                  ? 'border-muted-indigo text-muted-indigo'
                  : 'border-transparent text-slate-gray hover:text-charcoal-black hover:border-sky-gray'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ProjectLayout; 