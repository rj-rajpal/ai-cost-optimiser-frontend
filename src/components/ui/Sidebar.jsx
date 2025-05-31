import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState({
    'data-management': false,
    'analysis': true,
    'scenarios': false
  });

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'BarChart3',
      description: 'Analytics overview and key insights'
    },
    {
      id: 'data-management',
      label: 'Data Management',
      icon: 'Database',
      description: 'Upload and manage analysis data',
      isGroup: true,
      children: [
        {
          id: 'data-upload',
          label: 'Data Upload',
          path: '/data-upload',
          icon: 'Upload',
          description: 'Import cost and usage data'
        }
      ]
    },
    {
      id: 'analysis',
      label: 'Analysis',
      icon: 'TrendingUp',
      description: 'Core analytical functions',
      isGroup: true,
      children: [
        {
          id: 'process-analysis',
          label: 'Process Analysis',
          path: '/process-analysis',
          icon: 'GitBranch',
          description: 'Evaluate current processes'
        },
        {
          id: 'roi-calculator',
          label: 'ROI Calculator',
          path: '/roi-calculator',
          icon: 'Calculator',
          description: 'Compare provider costs and ROI'
        }
      ]
    },
    {
      id: 'scenarios',
      label: 'Scenarios',
      icon: 'Layers',
      description: 'Manage modeling scenarios',
      isGroup: true,
      children: [
        {
          id: 'scenario-library',
          label: 'Scenario Library',
          path: '/scenario-library',
          icon: 'BookOpen',
          description: 'Saved scenarios and templates'
        }
      ]
    }
  ];

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleNavigation = (path) => {
    console.log('Navigating to:', path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const isGroupActive = (children) => {
    return children?.some(child => isActiveRoute(child.path));
  };

  const renderNavItem = (item, isChild = false) => {
    if (item.isGroup) {
      const isExpanded = expandedGroups[item.id];
      const isActive = isGroupActive(item.children);

      return (
        <div key={item.id} className="space-y-1">
          <button
            onClick={() => toggleGroup(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 group ${
              isActive 
                ? 'bg-primary-600 text-white' :'text-text-secondary hover:text-text-primary hover:bg-surface-700'
            }`}
            title={item.description}
          >
            <div className="flex items-center space-x-3">
              <Icon 
                name={item.icon} 
                size={18} 
                className={isActive ? 'text-white' : 'text-text-tertiary group-hover:text-text-secondary'}
              />
              <span>{item.label}</span>
            </div>
            <Icon 
              name="ChevronRight" 
              size={16} 
              className={`transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''
              } ${isActive ? 'text-white' : 'text-text-tertiary'}`}
            />
          </button>
          
          {isExpanded && (
            <div className="ml-6 space-y-1 animate-fade-in">
              {item.children?.map(child => renderNavItem(child, true))}
            </div>
          )}
        </div>
      );
    }

    const isActive = isActiveRoute(item.path);

    return (
      <button
        key={item.id}
        onClick={() => handleNavigation(item.path)}
        className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 group ${
          isActive 
            ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-surface-700'
        } ${isChild ? 'pl-6' : ''}`}
        title={item.description}
      >
        <Icon 
          name={item.icon} 
          size={18} 
          className={isActive ? 'text-white' : 'text-text-tertiary group-hover:text-text-secondary'}
        />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-sidebar lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 bottom-0 w-64 bg-surface border-r border-border z-sidebar
        transform transition-transform duration-300 ease-smooth
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Navigation Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                Navigation
              </h2>
              <button
                onClick={onClose}
                className="lg:hidden p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200"
                aria-label="Close sidebar"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map(item => renderNavItem(item))}
          </nav>

          {/* Quick Actions */}
          <div className="p-4 border-t border-border">
            <div className="space-y-2">
              <button
                onClick={() => handleNavigation('/onboarding-wizard')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-700 rounded-md transition-colors duration-200 group"
                title="Setup wizard for new users"
              >
                <Icon name="Zap" size={18} className="text-text-tertiary group-hover:text-text-secondary" />
                <span>Setup Wizard</span>
              </button>
              
              <button
                onClick={() => console.log('Export data')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-700 rounded-md transition-colors duration-200 group"
                title="Export analysis results"
              >
                <Icon name="Download" size={18} className="text-text-tertiary group-hover:text-text-secondary" />
                <span>Export Data</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-text-tertiary">
              <p>AI Cost Optimizer v2.1.0</p>
              <p className="mt-1">© 2024 Enterprise Analytics</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;