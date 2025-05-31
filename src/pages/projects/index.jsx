import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [activeProjectMenu, setActiveProjectMenu] = useState(null);

  useEffect(() => {
    const fetchUserProjects = async () => {
      const hasProjects = Math.random() > 0.3; // 70% chance of having projects
      
      if (hasProjects) {
        setUserProjects([
          {
            id: 'rua-almadinah',
            title: 'Rua Almadinah',
            description: 'This project focuses on modern urban planning and the execution of diverse infrastructure solutions.',
          },
          {
            id: 'rua-al-haram',
            title: 'Rua Al Haram',
            description: 'This project focuses on modern urban planning and the execution of diverse infrastructure solutions.',
          },
          {
            id: 'trojena',
            title: 'Trojena',
            description: 'This project focuses on modern urban planning and the execution of diverse infrastructure solutions.',
          },
          {
            id: 'urban-development',
            title: 'Urban Development',
            description: 'Modern metropolitan planning with sustainable infrastructure and smart city integration.',
          },
          {
            id: 'residential-complex',
            title: 'Residential Complex',
            description: 'Contemporary residential development featuring eco-friendly design and community spaces.',
          },
          {
            id: 'desert-sanctuary',
            title: 'Desert Sanctuary',
            description: 'Unique desert landscape project combining modern architecture with natural preservation.',
          }
        ]);
      }
    };

    fetchUserProjects();
  }, []);

  const navigationItems = [
    { path: "/projects", label: "Projects", icon: "Grid3X3" },
    { path: "/dashboard", label: "Dashboard", icon: "BarChart3" },
    { path: "/data-upload", label: "Data Upload", icon: "Upload" },
    { path: "/process-analysis", label: "Analysis", icon: "Search" },
    { path: "/roi-calculator", label: "ROI Calculator", icon: "Calculator" },
    { path: "/scenario-library", label: "Scenarios", icon: "BookOpen" },
  ];

  const chatHistory = [
    { id: 1, title: "AI Cost Optimizer Theme", date: "today" },
    { id: 2, title: "Project Architecture Setup", date: "today" },
    { id: 3, title: "Dashboard Analytics Implementation", date: "yesterday" },
    { id: 4, title: "ROI Calculator Logic", date: "yesterday" },
    { id: 5, title: "Data Upload Validation", date: "2 days ago" },
    { id: 6, title: "User Authentication Flow", date: "2 days ago" },
    { id: 7, title: "Process Analysis Features", date: "3 days ago" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleCreateProject = () => {
    navigate('/onboarding-wizard');
  };

  const handleDeleteProject = (projectId) => {
    setUserProjects(prev => prev.filter(project => project.id !== projectId));
    setActiveProjectMenu(null);
  };

  const filteredProjects = userProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const renderChatHistorySection = (title, dateFilter) => (
    <>
      <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3 mt-6">
        {title}
      </h3>
      {chatHistory
        .filter(chat => chat.date === dateFilter)
        .map((chat) => (
          <button
            key={chat.id}
            className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 mb-1"
          >
            <div className="text-sm text-white/90 truncate">{chat.title}</div>
          </button>
        ))}
    </>
  );

  return (
    <div className="min-h-screen bg-cloud-white">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-soft-navy text-white z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/10">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="mb-4 p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
            >
              <Icon name="X" size={20} />
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-white/20 hover:bg-white/10 transition-colors duration-200">
              <Icon name="Edit3" size={16} />
              <span>New chat</span>
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 mb-4">
              <Icon name="Search" size={16} />
              <span>Search chats</span>
            </button>

            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 mb-4">
              <Icon name="BookOpen" size={16} />
              <span>Library</span>
            </button>

            {/* Navigation Items */}
            <div className="mb-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 mb-1 ${
                    location.pathname === item.path
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Chat History */}
            <div className="mb-6">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Today</h3>
              {chatHistory
                .filter(chat => chat.date === 'today')
                .map((chat) => (
                  <button
                    key={chat.id}
                    className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 mb-1"
                  >
                    <div className="text-sm text-white/90 truncate">{chat.title}</div>
                  </button>
                ))}
              
              {renderChatHistorySection("Yesterday", "yesterday")}
              {renderChatHistorySection("Previous 7 days", "2 days ago")}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200">
              <div className="w-6 h-6 bg-gradient-to-r from-muted-indigo to-mist-teal rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm text-white/90">Upgrade plan</div>
                <div className="text-xs text-white/50">More access to the best models</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-sky-gray sticky top-0 z-30 shadow-mist">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side */}
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

            {/* Right Side */}
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

              {/* User Dropdown */}
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
                    onClick={handleSignOut}
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

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Page Title with Search */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-soft-navy mb-2">Projects</h1>
            <p className="text-slate-gray">Manage and track your AI optimization projects</p>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 px-4 py-2 bg-white border border-sky-gray rounded-lg text-charcoal-black placeholder-slate-gray focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo transition-all duration-200"
            />
            <Icon name="Search" size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-gray" />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Project Card */}
          <div 
            onClick={handleCreateProject}
            className="group cursor-pointer"
          >
            <div className="aspect-[4/3] bg-white/80 border-2 border-dashed border-sky-gray rounded-xl flex flex-col items-center justify-center hover:border-muted-indigo hover:bg-white transition-all duration-300 shadow-mist">
              <div className="w-16 h-16 bg-muted-indigo/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-muted-indigo/20 transition-colors duration-300">
                <Icon name="Plus" size={32} className="text-muted-indigo" />
              </div>
              <h3 className="text-xl font-semibold text-soft-navy mb-2">Create new</h3>
              <p className="text-slate-gray text-center px-4">Start a new AI optimization project</p>
            </div>
          </div>

          {/* Project Cards */}
          {filteredProjects.map((project) => (
            <div key={project.id} className="cursor-pointer">
              <div className="aspect-[4/3] bg-white backdrop-blur-sm rounded-xl overflow-hidden border border-sky-gray shadow-mist transition-all duration-300 flex flex-col justify-between p-6 relative">
                {/* Three Dots Menu */}
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProjectMenu(activeProjectMenu === project.id ? null : project.id);
                    }}
                    className="text-slate-gray hover:text-soft-navy transition-colors duration-200 p-1"
                  >
                    <Icon name="MoreHorizontal" size={20} />
                  </button>
                  
                  {/* Delete Dropdown */}
                  {activeProjectMenu === project.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-mist border border-sky-gray py-1 z-50">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                        className="w-full px-3 py-2 text-left text-red-600 hover:bg-soft-rose transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Icon name="Trash2" size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-soft-navy transition-colors duration-200">
                      {project.title}
                    </h3>
                  </div>
                  
                  <p className="text-slate-gray text-center">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {userProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-fog-gray rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="FolderPlus" size={48} className="text-slate-gray" />
              </div>
              <h3 className="text-2xl font-semibold text-soft-navy mb-4">No projects yet</h3>
              <p className="text-slate-gray mb-6">
                Get started by creating your first AI optimization project. 
                Our wizard will guide you through the setup process.
              </p>
              <button
                onClick={handleCreateProject}
                className="inline-flex items-center px-6 py-3 bg-muted-indigo hover:bg-muted-indigo/90 text-white font-medium rounded-lg transition-colors duration-200 shadow-mist"
              >
                <Icon name="Plus" size={20} className="mr-2" />
                Create Your First Project
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Click Outside Handler */}
      {(isUserMenuOpen || activeProjectMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsUserMenuOpen(false);
            setActiveProjectMenu(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectsPage; 