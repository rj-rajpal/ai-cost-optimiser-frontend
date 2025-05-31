import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ChatInterface = ({ step, response, onResponse }) => {
  const [isTyping, setIsTyping] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [rankings, setRankings] = useState({});
  const [otherInputs, setOtherInputs] = useState({});
  const [showOtherInput, setShowOtherInput] = useState(false);

  useEffect(() => {
    setIsTyping(true);
    setShowOptions(false);
    setShowOtherInput(false);
    
    const typingTimer = setTimeout(() => {
      setIsTyping(false);
      setTimeout(() => setShowOptions(true), 300);
    }, 1500);

    return () => clearTimeout(typingTimer);
  }, [step.id]);

  // Check if "Other" is selected and show input
  useEffect(() => {
    if (step.type === 'select' && response === 'other') {
      setShowOtherInput(true);
    } else if (step.type === 'multiselect' && Array.isArray(response) && response.includes('other')) {
      setShowOtherInput(true);
    } else if (step.type === 'ranking' && response && response['other']) {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
    }
  }, [response, step.type]);

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

  const handleOtherInputChange = (value) => {
    setOtherInputs(prev => ({
      ...prev,
      [step.id]: value
    }));
  };

  const handleSaveOtherInput = () => {
    const otherValue = otherInputs[step.id];
    if (!otherValue || !otherValue.trim()) return;

    if (step.type === 'select') {
      onResponse(`other: ${otherValue.trim()}`);
    } else if (step.type === 'multiselect') {
      const currentValues = (response || []).filter(v => v !== 'other' && !v.startsWith('other:'));
      onResponse([...currentValues, `other: ${otherValue.trim()}`]);
    } else if (step.type === 'ranking') {
      const currentRankings = { ...rankings };
      delete currentRankings['other'];
      currentRankings[`other: ${otherValue.trim()}`] = rankings['other'] || 1;
      setRankings(currentRankings);
      onResponse(currentRankings);
    }

    setOtherInputs(prev => ({ ...prev, [step.id]: '' }));
    setShowOtherInput(false);
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
            ${response === option.value || (typeof response === 'string' && response.startsWith('other:') && option.value === 'other')
              ? 'border-primary bg-primary-50 text-primary-600' 
              : 'border-border bg-surface hover:border-primary-300 text-text-primary hover:bg-surface-700'
            }
          `}
        >
          <div className="flex items-center space-x-3">
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${response === option.value || (typeof response === 'string' && response.startsWith('other:') && option.value === 'other')
                ? 'border-primary bg-primary' 
                : 'border-border'
              }
            `}>
              {(response === option.value || (typeof response === 'string' && response.startsWith('other:') && option.value === 'other')) && (
                <Icon name="Check" size={12} className="text-white" />
              )}
            </div>
            <span className="font-medium">{option.label}</span>
          </div>
        </button>
      ))}

      {/* Other Input Field */}
      {showOtherInput && (
        <div className="mt-6 p-4 bg-surface-700 rounded-lg border-2 border-primary">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Please specify:
              </label>
              <textarea
                value={otherInputs[step.id] || ''}
                onChange={(e) => handleOtherInputChange(e.target.value)}
                placeholder="Enter your custom response..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 resize-none"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveOtherInput}
                disabled={!otherInputs[step.id]?.trim()}
                className={`
                  px-4 py-2 rounded-md font-medium transition-all duration-200
                  ${otherInputs[step.id]?.trim()
                    ? 'bg-primary text-white hover:bg-primary-700' 
                    : 'bg-surface-600 text-text-tertiary cursor-not-allowed'
                  }
                `}
              >
                Save & Continue
              </button>
              <button
                onClick={() => {
                  setShowOtherInput(false);
                  if (response === 'other') {
                    onResponse(null);
                  }
                }}
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show saved other response */}
      {typeof response === 'string' && response.startsWith('other:') && !showOtherInput && (
        <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <p className="text-sm text-primary-700">
            <span className="font-medium">Your response:</span> {response.replace('other: ', '')}
          </p>
        </div>
      )}
    </div>
  );

  const renderMultiSelectStep = () => {
    const selectedValues = response || [];
    
    return (
      <div className="space-y-4">
        {step.options.map((option) => {
          const isSelected = selectedValues.includes(option.value) || 
                           (option.value === 'other' && selectedValues.some(v => v.startsWith('other:')));
          
          return (
            <button
              key={option.value}
              onClick={() => handleMultiSelect(option.value)}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all duration-200
                ${isSelected
                  ? 'border-primary bg-primary-50 text-primary-600' 
                  : 'border-border bg-surface hover:border-primary-300 text-text-primary hover:bg-surface-700'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center
                  ${isSelected
                    ? 'border-primary bg-primary' 
                    : 'border-border'
                  }
                `}>
                  {isSelected && (
                    <Icon name="Check" size={12} className="text-white" />
                  )}
                </div>
                <span className="font-medium">{option.label}</span>
              </div>
            </button>
          );
        })}

        {/* Other Input Field */}
        {showOtherInput && (
          <div className="mt-6 p-4 bg-surface-700 rounded-lg border-2 border-primary">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Please specify additional processes:
                </label>
                <textarea
                  value={otherInputs[step.id] || ''}
                  onChange={(e) => handleOtherInputChange(e.target.value)}
                  placeholder="Enter your custom response..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSaveOtherInput}
                  disabled={!otherInputs[step.id]?.trim()}
                  className={`
                    px-4 py-2 rounded-md font-medium transition-all duration-200
                    ${otherInputs[step.id]?.trim()
                      ? 'bg-primary text-white hover:bg-primary-700' 
                      : 'bg-surface-600 text-text-tertiary cursor-not-allowed'
                    }
                  `}
                >
                  Save & Continue
                </button>
                <button
                  onClick={() => {
                    setShowOtherInput(false);
                    const currentValues = (selectedValues || []).filter(v => v !== 'other');
                    onResponse(currentValues);
                  }}
                  className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {selectedValues.length > 0 && (
          <div className="mt-4 p-3 bg-surface-700 rounded-lg">
            <p className="text-sm text-text-secondary mb-2">Selected ({selectedValues.length}):</p>
            <div className="flex flex-wrap gap-2">
              {selectedValues.map((value) => {
                let displayLabel = value;
                if (value.startsWith('other:')) {
                  displayLabel = value.replace('other: ', '');
                } else {
                  const option = step.options.find(opt => opt.value === value);
                  displayLabel = option?.label || value;
                }
                
                return (
                  <span
                    key={value}
                    className="px-3 py-1 bg-primary text-white text-sm rounded-full"
                  >
                    {displayLabel}
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
                {[1, 2, 3, 4, 5].map(rank => (
                  <option key={rank} value={rank}>{rank}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {/* Other Input Field for Rankings */}
        {showOtherInput && (
          <div className="mt-6 p-4 bg-surface-700 rounded-lg border-2 border-primary">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Please specify additional priority:
                </label>
                <textarea
                  value={otherInputs[step.id] || ''}
                  onChange={(e) => handleOtherInputChange(e.target.value)}
                  placeholder="Enter your custom priority..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 resize-none"
                  rows={2}
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSaveOtherInput}
                  disabled={!otherInputs[step.id]?.trim()}
                  className={`
                    px-4 py-2 rounded-md font-medium transition-all duration-200
                    ${otherInputs[step.id]?.trim()
                      ? 'bg-primary text-white hover:bg-primary-700' 
                      : 'bg-surface-600 text-text-tertiary cursor-not-allowed'
                    }
                  `}
                >
                  Save & Continue
                </button>
                <button
                  onClick={() => {
                    setShowOtherInput(false);
                    const newRankings = { ...rankings };
                    delete newRankings['other'];
                    setRankings(newRankings);
                    onResponse(newRankings);
                  }}
                  className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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