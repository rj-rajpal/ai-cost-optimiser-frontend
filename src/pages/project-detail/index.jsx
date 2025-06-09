import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkModeContext';
import Icon from '../../components/AppIcon';
import SideNavBar from '../../components/SideNavBar';
import { getDynamicStyles } from '../../utils/darkModeStyles';
import { 
  PROJECT_DATA, 
  PROJECT_TABS,
  getAllProjects,
  LOADING,
  ARIA_LABELS,
  BUTTON_TEXT,
  NAVIGATION,
  MESSAGES 
} from '../../constants';
import { ShapeBackground } from '../../components/ui/shape-background';

// Utility functions
const toPascalCase = (str) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');
};

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState({});

  // Get dynamic styles based on dark mode
  const styles = getDynamicStyles(isDarkMode);

  // Load all projects (static + local) on component mount
  useEffect(() => {
    const projects = getAllProjects();
    setAllProjects(projects);
  }, []);

  // Memoize project data to prevent unnecessary re-fetching
  const projectData = useMemo(() => {
    // First try to get from loaded projects
    let foundProject = allProjects[projectId];
    
    // If not found, create a fallback project
    if (!foundProject) {
      foundProject = {
        id: projectId,
        title: projectId?.replace('-', ' ') || 'PROJECT',
        phase: 'CMP',
        progress: 75
      };
    }
    
    return foundProject;
  }, [projectId, allProjects]);

  useEffect(() => {
    setProject(projectData);
  }, [projectData]);

  // Memoize user avatar
  const userAvatar = useMemo(() => 
    user?.email?.charAt(0).toUpperCase() || 'U', 
    [user?.email]
  );

  // Get current active tab from URL
  const activeTab = useMemo(() => {
    const pathParts = location.pathname.split('/');
    const tabPath = pathParts[3];
    
    // If trying to access old projects route, redirect to dashboard
    if (tabPath === 'projects') {
      navigate(`/project/${projectId}/dashboard`, { replace: true });
      return PROJECT_TABS[0];
    }
    
    return PROJECT_TABS.find(tab => tab.path === tabPath) || PROJECT_TABS[0];
  }, [location.pathname, navigate, projectId]);

  // Handlers
  const handleSignOut = useCallback(async () => {
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
  }, [signOut, navigate]);

  const handleSignOutClick = useCallback(async (e) => {
    e.stopPropagation(); // Prevent menu from closing
    setIsUserMenuOpen(false); // Close menu manually
    await handleSignOut();
  }, [handleSignOut]);

  const handleTabClick = useCallback((tabPath) => {
    navigate(`/project/${projectId}/${tabPath}`);
  }, [navigate, projectId]);

  const handleProjectsBreadcrumb = useCallback(() => {
    navigate('/projects');
  }, [navigate]);

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const handleUserMenuToggle = useCallback(() => {
    setIsUserMenuOpen(prev => !prev);
  }, []);

  const handleUserMenuClose = useCallback(() => {
    setIsUserMenuOpen(false);
  }, []);

  // Loading state
  if (!project) {
    return (
      <div className={`${LOADING.CONTAINER} ${isDarkMode ? 'bg-black text-white' : ''}`}>
        <div className={LOADING.CONTENT}>
          <div className={LOADING.ICON}>
            <Icon name="Building" size={24} className="text-white" />
          </div>
          <h3 className={`${LOADING.TITLE} ${isDarkMode ? 'text-white' : ''}`}>{MESSAGES.LOADING_PROJECT}</h3>
          <p className={`${LOADING.TEXT} ${isDarkMode ? 'text-gray-300' : ''}`}>{MESSAGES.LOADING_PROJECT_DESCRIPTION}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
              {/* Shape Background */}
        <ShapeBackground />
      
      <div className="relative z-10">
        {/* SideNavBar Component */}
        <SideNavBar isOpen={isSidebarOpen} onClose={handleSidebarClose} />

        {/* Header */}
        <header className={styles.HEADER.MAIN}>
          <div className={styles.HEADER.CONTENT}>
            <div className={styles.HEADER.INNER}>
              <div className={styles.HEADER.LEFT_SECTION}>
                <button
                  onClick={handleSidebarToggle}
                  className={styles.BUTTONS.MENU}
                  aria-label={ARIA_LABELS.OPEN_SIDEBAR}
                >
                  <Icon name="Menu" size={24} />
                </button>
                <div className={styles.HEADER.LOGO_SECTION}>
                  <div className={styles.HEADER.LOGO}>
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                  <h1 className={styles.HEADER.TITLE}>AI Cost Optimizer</h1>
                </div>
              </div>

              {/* Right Side - Dark Mode Toggle + User Menu */}
              <div className="flex items-center space-x-4">
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
                  <Icon name={isDarkMode ? 'Sun' : 'Moon'} size={20} />
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={handleUserMenuToggle}
                    className={styles.BUTTONS.USER}
                    aria-label={ARIA_LABELS.USER_MENU}
                  >
                    <div className={styles.UI.AVATAR}>
                      <span className="text-white font-medium text-sm">{userAvatar}</span>
                    </div>
                    <Icon name="ChevronDown" size={16} className={isDarkMode ? 'text-gray-300' : 'text-slate-gray'} />
                  </button>

                  {isUserMenuOpen && (
                    <div className={styles.UI.DROPDOWN}>
                      <button className={styles.UI.DROPDOWN_ITEM}>{BUTTON_TEXT.PROFILE_SETTINGS}</button>
                      <button className={styles.UI.DROPDOWN_ITEM}>{BUTTON_TEXT.ACCOUNT_SETTINGS}</button>
                      <hr className={`my-1 ${isDarkMode ? 'border-gray-800' : 'border-sky-gray'}`} />
                      <button onClick={handleSignOutClick} className={styles.UI.SIGN_OUT_ITEM}>
                        {BUTTON_TEXT.SIGN_OUT}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Project Title with Breadcrumb */}
        <div className={styles.CARDS.TITLE_SECTION}>
          {/* Breadcrumb */}
          <nav className={styles.NAV_STYLES.BREADCRUMB} aria-label={ARIA_LABELS.BREADCRUMB}>
            <button onClick={handleProjectsBreadcrumb} className={styles.BUTTONS.BREADCRUMB}>
              {NAVIGATION.PROJECTS}
            </button>
            <Icon name="ChevronRight" size={16} className={isDarkMode ? 'text-gray-600' : 'text-slate-gray/50'} />
            <span className={styles.TEXT.BREADCRUMB}>
              {toPascalCase(activeTab.name)}
            </span>
          </nav>
          
          {/* Project Title */}
          <div className={styles.NAV_STYLES.TITLE_CONTAINER}>
            <div className={styles.NAV_STYLES.TITLE_ICON}>
              <Icon name="Zap" size={24} className={isDarkMode ? 'text-muted-indigo' : 'text-soft-navy'} />
            </div>
            <h1 className={styles.TEXT.TITLE_SECTION}>{project.title}</h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.CARDS.TABS_SECTION}>
          <nav className={styles.NAV_STYLES.TABS_CONTAINER} role="tablist">
            {PROJECT_TABS.map((tab) => (
              <button
                key={tab.path}
                onClick={() => handleTabClick(tab.path)}
                className={`${styles.BUTTONS.TAB} ${
                  activeTab.path === tab.path 
                    ? styles.BUTTONS.TAB_ACTIVE
                    : styles.BUTTONS.TAB_INACTIVE
                }`}
                role="tab"
                aria-selected={activeTab.path === tab.path}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto ${isDarkMode ? 'text-white' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail; 