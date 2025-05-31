import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import ProgressSidebar from './components/ProgressSidebar';
import ChatInterface from './components/ChatInterface';
import ActionArea from './components/ActionArea';

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [isProgressSidebarOpen, setIsProgressSidebarOpen] = useState(true);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to AI Cost Advisor',
      type: 'welcome',
      question: `Welcome to AI Cost Advisor! I'm here to help you set up your personalized cost optimization dashboard.

This quick setup will take about 5-10 minutes and will help us understand your current processes and AI usage patterns.

Ready to get started?`,
      options: [
        { value: 'yes', label: "Let\'s begin!" },
        { value: 'skip', label: 'Skip to dashboard' }
      ],
      required: false
    },
    {
      id: 'organization',title: 'Organization Details',type: 'select',question: 'First, tell us about your organization size. This helps us provide relevant benchmarks and recommendations.',
      options: [
        { value: 'startup', label: 'Startup (1-50 employees)' },
        { value: 'small', label: 'Small Business (51-200 employees)' },
        { value: 'medium', label: 'Medium Enterprise (201-1000 employees)' },
        { value: 'large', label: 'Large Enterprise (1000+ employees)' }
      ],
      required: true
    },
    {
      id: 'current-processes',title: 'Current Processes',type: 'multiselect',question: 'Which business processes are you currently evaluating for AI automation? Select all that apply.',
      options: [
        { value: 'customer-support', label: 'Customer Support & Chat' },
        { value: 'content-creation', label: 'Content Creation & Marketing' },
        { value: 'data-analysis', label: 'Data Analysis & Reporting' },
        { value: 'document-processing', label: 'Document Processing' },
        { value: 'code-generation', label: 'Code Generation & Review' },
        { value: 'translation', label: 'Translation & Localization' },
        { value: 'quality-assurance', label: 'Quality Assurance & Testing' },
        { value: 'other', label: 'Other processes' }
      ],
      required: true
    },
    {
      id: 'ai-experience',title: 'AI Experience',type: 'select',question: 'What best describes your current AI usage level?',
      options: [
        { value: 'none', label: 'No current AI usage - exploring options' },
        { value: 'pilot', label: 'Running pilot projects or small experiments' },
        { value: 'limited', label: 'Limited production use in specific areas' },
        { value: 'moderate', label: 'Moderate usage across multiple departments' },
        { value: 'extensive', label: 'Extensive AI integration across organization' }
      ],
      required: true
    },
    {
      id: 'budget-range',title: 'Budget Planning',type: 'select',question: 'What\'s your estimated monthly budget range for AI services?',
      options: [
        { value: 'under-1k', label: 'Under $1,000' },
        { value: '1k-5k', label: '$1,000 - $5,000' },
        { value: '5k-25k', label: '$5,000 - $25,000' },
        { value: '25k-100k', label: '$25,000 - $100,000' },
        { value: 'over-100k', label: 'Over $100,000' },
        { value: 'not-sure', label: 'Not sure yet' }
      ],
      required: true
    },
    {
      id: 'priorities',
      title: 'Optimization Priorities',
      type: 'ranking',
      question: 'Rank these optimization priorities from most important (1) to least important (4):',
      options: [
        { value: 'cost-reduction', label: 'Cost Reduction' },
        { value: 'performance', label: 'Performance & Speed' },
        { value: 'accuracy', label: 'Accuracy & Quality' },
        { value: 'scalability', label: 'Scalability & Reliability' }
      ],
      required: true
    },
    {
      id: 'completion',
      title: 'Setup Complete',
      type: 'completion',
      question: `Perfect! We've gathered all the information needed to personalize your AI Cost Advisor experience.

Based on your responses, we'll set up:
• Customized cost benchmarks for your organization size
• Relevant process automation recommendations
• Budget-aligned provider comparisons
• Priority-focused optimization suggestions

Your personalized dashboard is ready!`,
      options: [
        { value: 'dashboard', label: 'Go to Dashboard' },
        { value: 'review', label: 'Review My Responses' }
      ],
      required: false
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep === steps.length - 1) {
      navigate('/dashboard');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleResponse = (stepId, value) => {
    setResponses(prev => ({
      ...prev,
      [stepId]: value
    }));
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleSkipToEnd = () => {
    navigate('/dashboard');
  };

  const progressPercentage = Math.round(((currentStep + 1) / steps.length) * 100);
  const currentStepData = steps[currentStep];
  const canProceed = !currentStepData.required || responses[currentStepData.id];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Progress */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsProgressSidebarOpen(!isProgressSidebarOpen)}
              className="lg:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200"
              aria-label="Toggle progress sidebar"
            >
              <Icon name="Menu" size={20} />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-text-primary">AI Cost Advisor</h1>
                <p className="text-xs text-text-secondary">Setup Wizard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <span className="text-sm text-text-secondary">Progress:</span>
              <div className="w-32 h-2 bg-surface-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-smooth"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-text-primary">{progressPercentage}%</span>
            </div>
            
            <button
              onClick={handleSkipToEnd}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Skip Setup
            </button>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden px-6 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-secondary">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-xs font-medium text-text-primary">{progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-surface-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-smooth"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </header>

      <div className="flex pt-16 min-h-screen">
        {/* Progress Sidebar */}
        <ProgressSidebar
          steps={steps}
          currentStep={currentStep}
          responses={responses}
          isOpen={isProgressSidebarOpen}
          onStepClick={handleStepClick}
          onClose={() => setIsProgressSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          isProgressSidebarOpen ? 'lg:ml-80' : 'ml-0'
        }`}>
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="max-w-2xl mx-auto">
              {/* Chat Interface */}
              <ChatInterface
                step={currentStepData}
                response={responses[currentStepData.id]}
                onResponse={(value) => handleResponse(currentStepData.id, value)}
              />

              {/* Action Area */}
              <ActionArea
                currentStep={currentStep}
                totalSteps={steps.length}
                canProceed={canProceed}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSkip={handleSkip}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OnboardingWizard;