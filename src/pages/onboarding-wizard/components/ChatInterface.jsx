import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ChatInterface = ({ step, response, onResponse }) => {
  const [isTyping, setIsTyping] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [rankings, setRankings] = useState({});

  useEffect(() => {
    setIsTyping(true);
    setShowOptions(false);
    
    const typingTimer = setTimeout(() => {
      setIsTyping(false);
      setTimeout(() => setShowOptions(true), 300);
    }, 1500);

    return () => clearTimeout(typingTimer);
  }, [step.id]);

  const handleOptionSelect = (value) => {
    onResponse(value);
  };

  const handleMultiSelect = (value) => {
    const currentValues = response || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onResponse(newValues);
  };

  const handleRankingChange = (optionValue, rank) => {
    const newRankings = { ...rankings, [optionValue]: rank };
    setRankings(newRankings);
    onResponse(newRankings);
  };

  const renderWelcomeStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Sparkles" size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome to AI Cost Advisor</h2>
        <p className="text-text-secondary">Let's personalize your experience</p>
      </div>
    </div>
  );

  const renderSelectStep = () => (
    <div className="space-y-4">
      {step.options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleOptionSelect(option.value)}
          className={`
            w-full p-4 rounded-lg border-2 text-left transition-all duration-200
            ${response === option.value
              ? 'border-primary bg-primary-50 text-primary-600' :'border-border bg-surface hover:border-primary-300 text-text-primary hover:bg-surface-700'
            }
          `}
        >
          <div className="flex items-center space-x-3">
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${response === option.value
                ? 'border-primary bg-primary' :'border-border'
              }
            `}>
              {response === option.value && (
                <Icon name="Check" size={12} className="text-white" />
              )}
            </div>
            <span className="font-medium">{option.label}</span>
          </div>
        </button>
      ))}
    </div>
  );

  const renderMultiSelectStep = () => {
    const selectedValues = response || [];
    
    return (
      <div className="space-y-4">
        {step.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleMultiSelect(option.value)}
            className={`
              w-full p-4 rounded-lg border-2 text-left transition-all duration-200
              ${selectedValues.includes(option.value)
                ? 'border-primary bg-primary-50 text-primary-600' :'border-border bg-surface hover:border-primary-300 text-text-primary hover:bg-surface-700'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center
                ${selectedValues.includes(option.value)
                  ? 'border-primary bg-primary' :'border-border'
                }
              `}>
                {selectedValues.includes(option.value) && (
                  <Icon name="Check" size={12} className="text-white" />
                )}
              </div>
              <span className="font-medium">{option.label}</span>
            </div>
          </button>
        ))}
        
        {selectedValues.length > 0 && (
          <div className="mt-4 p-3 bg-surface-700 rounded-lg">
            <p className="text-sm text-text-secondary mb-2">Selected ({selectedValues.length}):</p>
            <div className="flex flex-wrap gap-2">
              {selectedValues.map((value) => {
                const option = step.options.find(opt => opt.value === value);
                return (
                  <span
                    key={value}
                    className="px-3 py-1 bg-primary text-white text-sm rounded-full"
                  >
                    {option?.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRankingStep = () => {
    const currentRankings = response || {};
    
    return (
      <div className="space-y-4">
        <div className="bg-surface-700 p-4 rounded-lg mb-6">
          <p className="text-sm text-text-secondary">
            Drag to reorder or use the dropdown to assign rankings (1 = highest priority)
          </p>
        </div>
        
        {step.options.map((option) => (
          <div
            key={option.value}
            className="p-4 bg-surface border border-border rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="GripVertical" size={20} className="text-text-tertiary" />
                <span className="font-medium text-text-primary">{option.label}</span>
              </div>
              
              <select
                value={currentRankings[option.value] || ''}
                onChange={(e) => handleRankingChange(option.value, parseInt(e.target.value))}
                className="bg-surface-700 border border-border text-text-primary text-sm rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Rank</option>
                {[1, 2, 3, 4].map(rank => (
                  <option key={rank} value={rank}>{rank}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCompletionStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto">
        <Icon name="CheckCircle" size={32} className="text-white" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Setup Complete!</h2>
        <p className="text-text-secondary">Your personalized dashboard is ready</p>
      </div>
      
      <div className="bg-surface-700 p-6 rounded-lg text-left">
        <h3 className="font-semibold text-text-primary mb-3">What's Next:</h3>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-center space-x-2">
            <Icon name="BarChart3" size={16} className="text-primary" />
            <span>View your personalized cost analytics dashboard</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="Upload" size={16} className="text-primary" />
            <span>Upload your data for detailed analysis</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="Calculator" size={16} className="text-primary" />
            <span>Compare AI providers and calculate ROI</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="Target" size={16} className="text-primary" />
            <span>Explore optimization scenarios</span>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* AI Assistant Message */}
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="Bot" size={20} className="text-white" />
        </div>
        
        <div className="flex-1">
          <div className="bg-surface border border-border rounded-lg p-6 relative">
            <div className="absolute -left-2 top-4 w-4 h-4 bg-surface border-l border-t border-border transform rotate-45"></div>
            
            {isTyping ? (
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-text-tertiary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-text-tertiary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-text-tertiary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-sm text-text-tertiary">AI Assistant is typing...</span>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-text-primary">
                <p className="whitespace-pre-line">{step.question}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Response Options */}
      {showOptions && !isTyping && (
        <div className="ml-14 animate-fade-in">
          {step.type === 'welcome' && renderWelcomeStep()}
          {step.type === 'select' && renderSelectStep()}
          {step.type === 'multiselect' && renderMultiSelectStep()}
          {step.type === 'ranking' && renderRankingStep()}
          {step.type === 'completion' && renderCompletionStep()}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;