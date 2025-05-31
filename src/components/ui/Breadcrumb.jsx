import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();

  const breadcrumbMap = {
    '/dashboard': [
      { label: 'Dashboard', path: '/dashboard' }
    ],
    '/onboarding-wizard': [
      { label: 'Setup', path: '/onboarding-wizard' },
      { label: 'Onboarding Wizard', path: '/onboarding-wizard' }
    ],
    '/data-upload': [
      { label: 'Data Management', path: null },
      { label: 'Data Upload', path: '/data-upload' }
    ],
    '/process-analysis': [
      { label: 'Analysis', path: null },
      { label: 'Process Analysis', path: '/process-analysis' }
    ],
    '/roi-calculator': [
      { label: 'Analysis', path: null },
      { label: 'ROI Calculator', path: '/roi-calculator' }
    ],
    '/scenario-library': [
      { label: 'Scenarios', path: null },
      { label: 'Scenario Library', path: '/scenario-library' }
    ]
  };

  const currentBreadcrumbs = breadcrumbMap[location.pathname] || [
    { label: 'Dashboard', path: '/dashboard' }
  ];

  const handleBreadcrumbClick = (path) => {
    if (path) {
      console.log('Navigating to:', path);
    }
  };

  if (currentBreadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
      <Icon name="Home" size={16} className="text-text-tertiary" />
      
      {currentBreadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="text-text-tertiary" />
          )}
          
          {crumb.path && index < currentBreadcrumbs.length - 1 ? (
            <button
              onClick={() => handleBreadcrumbClick(crumb.path)}
              className="text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium"
            >
              {crumb.label}
            </button>
          ) : (
            <span className={`font-medium ${
              index === currentBreadcrumbs.length - 1 
                ? 'text-text-primary' :'text-text-secondary'
            }`}>
              {crumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;