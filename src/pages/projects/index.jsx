import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkModeContext';
import Icon from '../../components/AppIcon';
import SideNavBar from '../../components/SideNavBar';
import { ProjectGradientCard } from '../../components/ProjectGradientCard';
import { getDynamicStyles } from '../../utils/darkModeStyles';
import { ShapeBackground } from '../../components/ui/shape-background';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userProjects, setUserProjects] = useState([]);

  // Get dynamic styles based on dark mode
  const styles = getDynamicStyles(isDarkMode);

  useEffect(() => {
    const fetchUserProjects = async () => {
      const hasProjects = Math.random() > 0.3; // 70% chance of having projects
      
      // Get locally saved projects from projectService
      let savedProjects = [];
      try {
        const localProjects = localStorage.getItem('ai_cost_projects');
        if (localProjects) {
          const parsedProjects = JSON.parse(localProjects);
          savedProjects = Object.values(parsedProjects).map(project => ({
            id: project.id,
            name: project.title,
            summary: project.final_recommendation?.substring(0, 100) + '...' || 'AI cost optimization analysis'
          }));
        }
      } catch (error) {
        console.error('Error loading saved projects:', error);
      }
      
      if (hasProjects || savedProjects.length > 0) {
        const staticProjects = [
          {
            "id": "customer-support-triage",
            "name": "Customer Support Triage",
            "summary": "Prioritises and drafts replies for incoming support emails to cut resolution time and agent workload."
          },
          {
            "id": "invoice-processing-qa",
            "name": "Invoice Processing & QA",
            "summary": "Extracts line-items, flags anomalies, and reconciles invoices with PO data for faster month-end close."
          },
          {
            "id": "marketing-content-localisation",
            "name": "Marketing Content Localisation",
            "summary": "Auto-translates and tone-matches product copy for global campaigns, keeping brand voice consistent."
          },
          {
            "id": "product-catalog-enrichment",
            "name": "Product Catalog Enrichment",
            "summary": "Generates rich titles, attributes, and SEO-friendly descriptions to boost search and conversions."
          }
        ];
        
        // Combine saved projects with static ones (saved projects first)
        setUserProjects([...savedProjects, ...staticProjects]);
      }
    };

    fetchUserProjects();
  }, []);

  const handleSignOutClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsUserMenuOpen(false);
    
    try {
      const result = await signOut();
      
      if (result?.error) {
        console.error('Sign out error:', result.error);
      }
      
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
      navigate('/login');
    }
  };

  const handleCreateProject = () => {
    navigate('/onboarding-wizard');
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleProjectDelete = (projectId) => {
    setUserProjects(userProjects.filter(p => p.id !== projectId));
  };

  const filteredProjects = userProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black relative">
              {/* Shape Background */}
        <ShapeBackground />
      
      {/* SideNavBar Component */}
      <SideNavBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Header */}
      <header className="bg-black shadow-sm border-b relative z-10">
        <div className={styles.HEADER.MAIN}>
          <div className={styles.HEADER.CONTENT}>
            <div className={styles.HEADER.INNER}>
              {/* Left Side */}
              <div className={styles.HEADER.LEFT_SECTION}>
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className={styles.BUTTONS.MENU}
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

              {/* Right Side - User Menu */}
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
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={styles.BUTTONS.USER}
                  >
                    <div className={styles.UI.AVATAR}>
                      <span className="text-white font-medium text-sm">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <Icon name="ChevronDown" size={16} className={isDarkMode ? 'text-gray-300' : 'text-slate-gray'} />
                  </button>

                  {isUserMenuOpen && (
                    <div className={styles.UI.DROPDOWN}>
                      <button className={styles.UI.DROPDOWN_ITEM}>
                        Profile Settings
                      </button>
                      <button className={styles.UI.DROPDOWN_ITEM}>
                        Account Settings
                      </button>
                      <hr className={`my-1 ${isDarkMode ? 'border-gray-800' : 'border-sky-gray'}`} />
                      <button 
                        onClick={handleSignOutClick}
                        className={styles.UI.SIGN_OUT_ITEM}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto transition-colors duration-300 ${
        isDarkMode ? 'text-white' : ''
      }`}>
        {/* Page Header */}
        <div className="mb-8">
          {/* Breadcrumb Navigation */}
          <nav className={styles.NAV_STYLES.BREADCRUMB}>
            <Link to="/" className={styles.BUTTONS.BREADCRUMB}>
              Home
            </Link>
            <Icon name="ChevronRight" size={16} className={isDarkMode ? 'text-gray-600' : 'text-slate-gray'} />
            <span className={styles.TEXT.BREADCRUMB}>Projects</span>
          </nav>

          {/* Title Section */}
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={styles.NAV_STYLES.TITLE_ICON}>
                <Icon name="FolderOpen" size={24} className="text-muted-indigo" />
              </div>
              <div>
                <h1 className={styles.TEXT.TITLE_SECTION}>PROJECTS</h1>
                <p className={styles.TEXT.SUBTITLE}>
                  Manage and optimize your AI cost projects
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Icon name="Search" size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`} />
              <input
                type="text"
                placeholder="Search projects..."
                className={`w-80 pl-10 pr-4 py-2 ${styles.FORMS.INPUT.replace('w-full', '')}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Project Card */}
          <div
            onClick={handleCreateProject}
            className="group cursor-pointer z-20"
          >
            <div 
              className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-mist ${
                isDarkMode 
                  ? 'bg-black border-gray-800 hover:border-muted-indigo hover:bg-gray-950' 
                  : 'bg-white/80 border-sky-gray hover:border-muted-indigo hover:bg-white'
              }`}
              style={{ height: "280px" }}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-muted-indigo/20 group-hover:bg-muted-indigo/30' 
                  : 'bg-muted-indigo/10 group-hover:bg-muted-indigo/20'
              }`}>
                <Icon name="Plus" size={32} className="text-muted-indigo" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
                Create new
              </h3>
              <p className={`text-center px-4 ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
                Start a new AI optimization project
              </p>
            </div>
          </div>

          {/* Project Cards */}
          {filteredProjects.map((project) => (
            <ProjectGradientCard 
              key={project.id} 
              project={project} 
              onProjectClick={handleProjectClick}
              onProjectDelete={handleProjectDelete} 
            />
          ))}
        </div>

        {/* Filtered State */}
        {filteredProjects.length === 0 && userProjects.length > 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                isDarkMode ? 'bg-gray-900' : 'bg-fog-gray'
              }`}>
                <Icon name="Search" size={48} className={isDarkMode ? 'text-gray-400' : 'text-slate-gray'} />
              </div>
              <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
                No projects found
              </h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
                We couldn't find any projects matching "{searchQuery}".
                Try adjusting your search terms.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center px-6 py-3 bg-muted-indigo hover:bg-muted-indigo/90 text-white font-medium rounded-lg transition-colors duration-200 shadow-mist"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectsPage; 