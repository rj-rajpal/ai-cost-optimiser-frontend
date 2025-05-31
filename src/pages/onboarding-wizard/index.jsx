import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const chatEndRef = useRef(null);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome',
      type: 'welcome',
      message: `Hi there! 👋 I'm Alex, your AI Cost Optimization Assistant. I'm here to help you set up your personalized cost optimization dashboard.

This will only take about 5-10 minutes, and I'll guide you through understanding your current processes and AI usage patterns.

Ready to get started?`,
      options: [
        { value: 'yes', label: "Let's begin! 🚀", emoji: '🚀' },
        { value: 'skip', label: 'Skip to dashboard', emoji: '⏭️' }
      ],
      required: false
    },
    {
      id: 'organization',
      title: 'Organization Size',
      type: 'select',
      message: `Great! Let's start with your organization. 

What best describes your company size? This helps me provide relevant benchmarks and recommendations tailored to your scale.`,
      options: [
        { value: 'startup', label: 'Startup (1-50 employees)', emoji: '🌱' },
        { value: 'small', label: 'Small Business (51-200 employees)', emoji: '🏢' },
        { value: 'medium', label: 'Medium Enterprise (201-1000 employees)', emoji: '🏬' },
        { value: 'large', label: 'Large Enterprise (1000+ employees)', emoji: '🏭' },
        { value: 'other', label: 'Other', emoji: '📝' }
      ],
      required: true
    },
    {
      id: 'current-processes',
      title: 'Current Processes',
      type: 'multiselect',
      message: `Perfect! Now I'd like to understand which business processes you're currently evaluating for AI automation.

Select all that apply to your current focus areas:`,
      options: [
        { value: 'customer-support', label: 'Customer Support & Chat', emoji: '💬' },
        { value: 'content-creation', label: 'Content Creation & Marketing', emoji: '✍️' },
        { value: 'data-analysis', label: 'Data Analysis & Reporting', emoji: '📊' },
        { value: 'document-processing', label: 'Document Processing', emoji: '📄' },
        { value: 'code-generation', label: 'Code Generation & Review', emoji: '💻' },
        { value: 'translation', label: 'Translation & Localization', emoji: '🌍' },
        { value: 'quality-assurance', label: 'Quality Assurance & Testing', emoji: '🔍' },
        { value: 'other', label: 'Other', emoji: '📝' }
      ],
      required: true
    },
    {
      id: 'ai-experience',
      title: 'AI Experience Level',
      type: 'select',
      message: `Thanks! That gives me a good picture of your focus areas.

Now, what best describes your current AI usage level? This helps me understand where you're starting from.`,
      options: [
        { value: 'none', label: 'No current AI usage - exploring options', emoji: '🔍' },
        { value: 'pilot', label: 'Running pilot projects or small experiments', emoji: '🧪' },
        { value: 'limited', label: 'Limited production use in specific areas', emoji: '🎯' },
        { value: 'moderate', label: 'Moderate usage across multiple departments', emoji: '🔄' },
        { value: 'extensive', label: 'Extensive AI integration across organization', emoji: '⚡' },
        { value: 'other', label: 'Other', emoji: '📝' }
      ],
      required: true
    },
    {
      id: 'budget-range',
      title: 'Budget Planning',
      type: 'select',
      message: `Excellent! Understanding your experience level helps me tailor my recommendations.

What's your estimated monthly budget range for AI services? Don't worry, this stays confidential and helps me show relevant options.`,
      options: [
        { value: 'under-1k', label: 'Under $1,000', emoji: '💵' },
        { value: '1k-5k', label: '$1,000 - $5,000', emoji: '💰' },
        { value: '5k-25k', label: '$5,000 - $25,000', emoji: '💳' },
        { value: '25k-100k', label: '$25,000 - $100,000', emoji: '🏦' },
        { value: 'over-100k', label: 'Over $100,000', emoji: '💎' },
        { value: 'not-sure', label: 'Not sure yet', emoji: '🤔' },
        { value: 'other', label: 'Other', emoji: '📝' }
      ],
      required: true
    },
    {
      id: 'priorities',
      title: 'Optimization Priorities',
      type: 'ranking',
      message: `Perfect! Now for the final question - this is important for personalizing your dashboard.

Please rank these optimization priorities from most important (1) to least important. What matters most to your organization?`,
      options: [
        { value: 'cost-reduction', label: 'Cost Reduction', emoji: '💰' },
        { value: 'performance', label: 'Performance & Speed', emoji: '⚡' },
        { value: 'accuracy', label: 'Accuracy & Quality', emoji: '🎯' },
        { value: 'scalability', label: 'Scalability & Reliability', emoji: '📈' },
        { value: 'other', label: 'Other', emoji: '📝' }
      ],
      required: true
    },
    {
      id: 'completion',
      title: 'Setup Complete',
      type: 'completion',
      message: `🎉 Fantastic! I've got everything I need to personalize your AI Cost Advisor experience.

Based on your responses, I'm setting up:
• Customized cost benchmarks for your organization size
• Relevant process automation recommendations  
• Budget-aligned provider comparisons
• Priority-focused optimization suggestions

Your personalized dashboard is ready! Let's check it out! 🚀`,
      options: [
        { value: 'dashboard', label: 'Go to Dashboard 🎯', emoji: '🎯' },
        { value: 'review', label: 'Review My Responses 📋', emoji: '📋' }
      ],
      required: false
    }
  ];

  // Scroll to bottom when chat updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  // Initialize first message
  useEffect(() => {
    if (chatHistory.length === 0) {
      setTimeout(() => {
        addBotMessage(steps[0]);
      }, 1000);
    }
  }, []);

  const addBotMessage = (step) => {
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        message: step.message,
        step: step,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500 + step.message.length * 20); // Dynamic delay based on message length
  };

  const addUserMessage = (response, step) => {
    let displayText = '';
    
    if (step.type === 'select') {
      const option = step.options.find(opt => opt.value === response || response.startsWith(opt.value));
      displayText = option ? `${option.emoji} ${option.label}` : response;
    } else if (step.type === 'multiselect') {
      const selectedOptions = response.map(value => {
        const option = step.options.find(opt => opt.value === value || value.startsWith(opt.value));
        return option ? `${option.emoji} ${option.label}` : value;
      });
      displayText = selectedOptions.join(', ');
    } else if (step.type === 'ranking') {
      const rankedItems = Object.entries(response)
        .sort(([,a], [,b]) => a - b)
        .map(([value, rank]) => {
          const option = step.options.find(opt => opt.value === value || value.startsWith(opt.value));
          return `${rank}. ${option ? `${option.emoji} ${option.label}` : value}`;
        });
      displayText = rankedItems.join('\n');
    } else {
      displayText = response;
    }

    setChatHistory(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      message: displayText,
      timestamp: new Date()
    }]);
  };

  const handleResponse = (stepId, value) => {
    const step = steps[currentStep];
    setResponses(prev => ({ ...prev, [stepId]: value }));
    
    // Add user message
    addUserMessage(value, step);
    
    // Move to next step after a delay
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setTimeout(() => addBotMessage(steps[nextStep]), 1000);
      } else {
        handleComplete();
      }
    }, 500);
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      if (user) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Onboarding completed with responses:', responses);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      navigate('/dashboard');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkipToEnd = () => {
    navigate('/dashboard');
  };

  const currentStepData = steps[currentStep];
  const progressPercentage = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Icon name="Bot" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Online</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{progressPercentage}%</span>
              </div>
              
              <button
                onClick={handleSkipToEnd}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Skip Setup
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {chatHistory.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user' ? 'ml-2' : 'mr-2'}`}>
                  {message.type === 'bot' ? (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Icon name="Bot" size={16} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} className="text-white" />
                    </div>
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`px-4 py-2 rounded-2xl shadow-sm ${
                  message.type === 'bot' 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                }`}>
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.message}</p>
                  <span className={`text-xs mt-1 block ${
                    message.type === 'bot' ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md xl:max-w-lg flex items-end space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                  <Icon name="Bot" size={16} className="text-white" />
                </div>
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-2xl shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Response Area */}
        {currentStepData && chatHistory.length > currentStep && !isTyping && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <div className="max-w-2xl mx-auto">
              {currentStepData.type === 'select' && (
                <div className="space-y-2">
                  {currentStepData.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleResponse(currentStepData.id, option.value)}
                      className="w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 group"
                    >
                      <span className="text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {option.emoji} {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {currentStepData.type === 'multiselect' && (
                <div className="space-y-2">
                  {currentStepData.options.map((option) => {
                    const currentValues = responses[currentStepData.id] || [];
                    const isSelected = currentValues.includes(option.value);
                    
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          const newValues = isSelected
                            ? currentValues.filter(v => v !== option.value)
                            : [...currentValues, option.value];
                          setResponses(prev => ({ ...prev, [currentStepData.id]: newValues }));
                        }}
                        className={`w-full p-3 text-left rounded-lg border transition-all duration-200 ${
                          isSelected
                            ? 'border-blue-300 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-500'
                          }`}>
                            {isSelected && <Icon name="Check" size={12} className="text-white" />}
                          </div>
                          <span className="text-gray-900 dark:text-white">
                            {option.emoji} {option.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  
                  {responses[currentStepData.id]?.length > 0 && (
                    <button
                      onClick={() => handleResponse(currentStepData.id, responses[currentStepData.id])}
                      className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium"
                    >
                      Continue ({responses[currentStepData.id].length} selected)
                    </button>
                  )}
                </div>
              )}

              {currentStepData.type === 'completion' && (
                <div className="space-y-2">
                  {currentStepData.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (option.value === 'dashboard') {
                          handleComplete();
                        } else {
                          handleResponse(currentStepData.id, option.value);
                        }
                      }}
                      disabled={isCompleting}
                      className="w-full p-4 text-left rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="font-medium">
                        {isCompleting && option.value === 'dashboard' ? '🔄 Setting up...' : `${option.emoji} ${option.label}`}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;