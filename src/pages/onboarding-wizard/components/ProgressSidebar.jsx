import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressSidebar = ({ 
  steps, 
  currentStep, 
  responses, 
  isOpen, 
  onStepClick, 
  onClose 
}) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const isStepAccessible = (stepIndex) => {
    return stepIndex <= currentStep;
  };

  const getCompletedStepsCount = () => {
    return steps.filter((step, index) => 
      index < currentStep && responses[step.id]
    ).length;
  };

  const getEstimatedTimeRemaining = () => {
    const remainingSteps = steps.length - currentStep - 1;
    const avgTimePerStep = 1.5; // minutes
    return Math.max(remainingSteps * avgTimePerStep, 0);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 bottom-0 w-80 bg-surface border-r border-border z-40
        transform transition-transform duration-300 ease-smooth
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Setup Progress</h2>
              <button
                onClick={onClose}
                className="lg:hidden p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200"
                aria-label="Close sidebar"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Completed</span>
                <span className="text-text-primary font-medium">
                  {getCompletedStepsCount()} of {steps.length}
                </span>
              </div>
              
              <div className="w-full h-2 bg-surface-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-smooth"
                  style={{ width: `${(getCompletedStepsCount() / steps.length) * 100}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs text-text-tertiary">
                <span>Est. time remaining</span>
                <span>{Math.ceil(getEstimatedTimeRemaining())} min</span>
              </div>
            </div>
          </div>

          {/* Steps List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {steps.map((step, index) => {
                const status = getStepStatus(index);
                const isAccessible = isStepAccessible(index);
                const hasResponse = responses[step.id];

                return (
                  <button
                    key={step.id}
                    onClick={() => isAccessible && onStepClick(index)}
                    disabled={!isAccessible}
                    className={`
                      w-full p-3 rounded-lg text-left transition-all duration-200
                      ${status === 'current' ?'bg-primary-600 text-white' 
                        : status === 'completed' ?'bg-surface-700 text-text-primary hover:bg-surface-600' :'bg-surface-800 text-text-tertiary'
                      }
                      ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'}
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Step Icon */}
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                        ${status === 'completed' 
                          ? 'bg-success text-white' 
                          : status === 'current' ?'bg-white text-primary-600' :'bg-surface-600 text-text-tertiary'
                        }
                      `}>
                        {status === 'completed' ? (
                          <Icon name="Check" size={16} />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`
                          text-sm font-medium truncate
                          ${status === 'current' ? 'text-white' : ''}
                        `}>
                          {step.title}
                        </h3>
                        
                        <div className="flex items-center space-x-2 mt-1">
                          {status === 'completed' && hasResponse && (
                            <div className="flex items-center space-x-1">
                              <Icon name="CheckCircle" size={12} className="text-success" />
                              <span className="text-xs text-success">Complete</span>
                            </div>
                          )}
                          
                          {status === 'current' && (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              <span className="text-xs text-white opacity-80">In Progress</span>
                            </div>
                          )}
                          
                          {status === 'upcoming' && (
                            <span className="text-xs text-text-tertiary">Upcoming</span>
                          )}
                        </div>
                      </div>

                      {/* Navigation Arrow */}
                      {isAccessible && status !== 'current' && (
                        <Icon 
                          name="ChevronRight" 
                          size={16} 
                          className={status === 'completed' ? 'text-text-secondary' : 'text-text-tertiary'}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-text-tertiary space-y-1">
              <p>💡 You can skip any step and return later</p>
              <p>🔄 Your progress is automatically saved</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ProgressSidebar;