import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import Icon from './AppIcon';
import { 
  CHAT_HISTORY, 
  SIDEBAR, 
  NAVIGATION, 
  ARIA_LABELS,
  BUTTON_TEXT 
} from '../constants';

const SideNavBar = ({ isOpen, onClose, showProjectsNav = false, onProjectsClick }) => {
  const { user } = useAuth();
  const { isDarkMode } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're in the onboarding wizard
  const isInOnboardingWizard = location.pathname.includes('/onboarding-wizard');
  
  // Memoize user avatar to prevent unnecessary re-renders
  const userAvatar = useMemo(() => 
    user?.email?.charAt(0).toUpperCase() || 'U', 
    [user?.email]
  );

  // Memoize sidebar transform class
  const sidebarTransform = useMemo(() => 
    isOpen ? SIDEBAR.TRANSFORM_OPEN : SIDEBAR.TRANSFORM_CLOSED, 
    [isOpen]
  );

  // Handle back to projects click
  const handleBackToProjects = () => {
    navigate('/projects');
    onClose(); // Close sidebar after navigation
  };

  // Handle new chat click
  const handleNewChat = () => {
    navigate('/onboarding-wizard');
    onClose(); // Close sidebar after navigation
  };

  const ProjectsNavButton = () => (
    <div className="mb-6">
      <button onClick={onProjectsClick} className={`${SIDEBAR.PROJECTS_NAV} ${
        isDarkMode ? 'bg-gray-900/50 hover:bg-gray-800' : ''
      }`}>
        <Icon name="ArrowLeft" size={16} className="text-white/70 flex-shrink-0" />
        <span className="text-sm text-white font-medium group-hover:text-white">
          {NAVIGATION.BACK_TO_PROJECTS}
        </span>
      </button>
    </div>
  );

  const ChatHistoryItem = ({ chat }) => (
    <button key={chat.id} className={`${SIDEBAR.CHAT_ITEM} ${
      isDarkMode ? 'hover:bg-gray-900/50' : ''
    }`}>
      <div className="flex items-start space-x-3">
        <Icon name="MessageSquare" size={16} className="text-white/50 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm text-white/90 truncate group-hover:text-white">
            {chat.title}
          </div>
          <div className="text-xs text-white/50 mt-1">
            {chat.date}
          </div>
        </div>
      </div>
    </button>
  );

  const UserProfile = () => (
    <div className={`${SIDEBAR.PROFILE_BUTTON} ${
      isDarkMode ? 'hover:bg-gray-900/50' : ''
    }`}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-muted-indigo to-mist-teal flex items-center justify-center flex-shrink-0">
        <span className="text-white font-medium text-sm">{userAvatar}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white/90 font-medium">{NAVIGATION.USER_PROFILE}</div>
        <div className="text-xs text-white/50 mt-1">{NAVIGATION.UPGRADE_TO_PRO}</div>
      </div>
      <Icon name="ChevronRight" size={16} className="text-white/50" />
    </div>
  );

  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && <div className={SIDEBAR.OVERLAY} onClick={onClose} />}

      {/* Sidebar */}
      <div className={`${SIDEBAR.MAIN} ${sidebarTransform} ${
        isDarkMode ? 'bg-black/95 border-gray-800' : ''
      }`}>
        <div className={SIDEBAR.CONTAINER}>
          {/* Header */}
          <div className={SIDEBAR.HEADER}>
            <button 
              onClick={onClose} 
              className={`${SIDEBAR.CLOSE} ${
                isDarkMode ? 'text-white/70 hover:text-white hover:bg-gray-900/50' : ''
              }`}
              aria-label={ARIA_LABELS.CLOSE_SIDEBAR}
            >
              <Icon name="X" size={20} />
            </button>
            
            {/* Conditional button based on current route */}
            {isInOnboardingWizard ? (
              <button 
                onClick={handleBackToProjects}
                className={`${SIDEBAR.NEW_CHAT} ${
                  isDarkMode ? 'bg-gray-900/50 hover:bg-gray-800 text-white' : ''
                }`}
                aria-label="Back to Projects"
              >
                <Icon name="ArrowLeft" size={16} />
                <span>Back to Projects</span>
              </button>
            ) : (
              <button 
                onClick={handleNewChat}
                className={`${SIDEBAR.NEW_CHAT} ${
                  isDarkMode ? 'bg-gray-900/50 hover:bg-gray-800 text-white' : ''
                }`}
                aria-label={BUTTON_TEXT.START_NEW_CHAT}
              >
                <Icon name="Edit3" size={16} />
                <span>{NAVIGATION.NEW_CHAT}</span>
              </button>
            )}
          </div>

          {/* Chat History */}
          <div className={SIDEBAR.CONTENT}>
            {/* Only show ProjectsNavButton if not in OnboardingWizard and showProjectsNav is true */}
            {showProjectsNav && !isInOnboardingWizard && <ProjectsNavButton />}

            <section className="mb-4">
              <h3 className="text-sm font-medium text-white/70 mb-3">Recent Chats</h3>
              <nav className="space-y-1" role="navigation" aria-label={ARIA_LABELS.CHAT_HISTORY}>
                {CHAT_HISTORY.map((chat) => (
                  <ChatHistoryItem key={chat.id} chat={chat} />
                ))}
              </nav>
            </section>
          </div>

          {/* User Profile & Upgrade */}
          <footer className={SIDEBAR.FOOTER}>
            <UserProfile />
          </footer>
        </div>
      </div>
    </>
  );
};

export default SideNavBar; 