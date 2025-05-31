import React from 'react';
import Icon from '../../../components/AppIcon';

const ActionArea = ({ 
  currentStep, 
  totalSteps, 
  canProceed, 
  onNext, 
  onPrevious, 
  onSkip 
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-30">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={onPrevious}
            disabled={isFirstStep}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200
              ${isFirstStep
                ? 'text-text-tertiary cursor-not-allowed' :'text-text-secondary hover:text-text-primary hover:bg-surface-700'
              }
            `}
          >
            <Icon name="ArrowLeft" size={16} />
            <span>Previous</span>
          </button>

          {/* Step Indicator */}
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-sm text-text-secondary">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <div className="flex space-x-1">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div
                  key={index}
                  className={`
                    w-2 h-2 rounded-full transition-colors duration-200
                    ${index === currentStep
                      ? 'bg-primary'
                      : index < currentStep
                      ? 'bg-success' :'bg-surface-700'
                    }
                  `}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Skip Button */}
            {!isLastStep && (
              <button
                onClick={onSkip}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                Skip Step
              </button>
            )}

            {/* Next/Complete Button */}
            <button
              onClick={onNext}
              disabled={!canProceed}
              className={`
                flex items-center space-x-2 px-6 py-2 rounded-md font-medium transition-all duration-200
                ${canProceed
                  ? 'bg-primary text-white hover:bg-primary-700' :'bg-surface-700 text-text-tertiary cursor-not-allowed'
                }
              `}
            >
              <span>{isLastStep ? 'Complete Setup' : 'Next'}</span>
              <Icon name={isLastStep ? 'Check' : 'ArrowRight'} size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Step Indicator */}
        <div className="sm:hidden mt-3 flex justify-center">
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full transition-colors duration-200
                  ${index === currentStep
                    ? 'bg-primary'
                    : index < currentStep
                    ? 'bg-success' :'bg-surface-700'
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionArea;