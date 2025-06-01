import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import ProgressSidebar from './components/ProgressSidebar';
import { api } from '../../lib/api';

const SUGGESTIONS = [
  { label: 'Search', icon: 'Globe' },
  { label: 'Reason', icon: 'Lightbulb' },
  { label: 'Deep research', icon: 'Radar' },
  { label: 'Create image', icon: 'Image' },
];

// Helper to convert frontend messages to API format
const toApiMessages = (msgs) =>
  msgs.map(msg => ({
    role: msg.type === 'user' ? 'user' : 'assistant',
    content: msg.text
  }));

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]); // For chat history
  const [hasStarted, setHasStarted] = useState(false); // Track if chat has started

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to AI Cost Optimizer',
      description: 'Let\'s set up your account and get started with optimizing your AI costs.',
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted-indigo/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Zap" size={32} className="text-muted-indigo" />
            </div>
            <h2 className="text-2xl font-bold text-soft-navy mb-2">Welcome to AI Cost Optimizer</h2>
            <p className="text-slate-gray">Let's set up your account and get started with optimizing your AI costs.</p>
          </div>
        </div>
      )
    },
    {
      id: 'company-info',
      title: 'Company Information',
      description: 'Tell us about your company and AI usage.',
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-soft-navy mb-2">Company Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-white border border-sky-gray rounded-lg text-charcoal-black placeholder-slate-gray focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo transition-all duration-200"
                placeholder="Enter your company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-soft-navy mb-2">Industry</label>
              <select className="w-full px-4 py-2 bg-white border border-sky-gray rounded-lg text-charcoal-black focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo transition-all duration-200">
                <option value="">Select your industry</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="retail">Retail</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ai-usage',
      title: 'AI Usage',
      description: 'How are you currently using AI in your business?',
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-soft-navy mb-2">Monthly AI Spend</label>
              <input
                type="number"
                className="w-full px-4 py-2 bg-white border border-sky-gray rounded-lg text-charcoal-black placeholder-slate-gray focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo transition-all duration-200"
                placeholder="Enter your monthly AI spend"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-soft-navy mb-2">Primary AI Provider</label>
              <select className="w-full px-4 py-2 bg-white border border-sky-gray rounded-lg text-charcoal-black focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo transition-all duration-200">
                <option value="">Select your primary provider</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      title: 'Optimization Goals',
      description: 'What are your main goals for AI cost optimization?',
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-soft-navy mb-2">Target Cost Reduction</label>
              <input
                type="number"
                className="w-full px-4 py-2 bg-white border border-sky-gray rounded-lg text-charcoal-black placeholder-slate-gray focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo transition-all duration-200"
                placeholder="Enter target percentage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-soft-navy mb-2">Timeline</label>
              <select className="w-full px-4 py-2 bg-white border border-sky-gray rounded-lg text-charcoal-black focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo transition-all duration-200">
                <option value="">Select timeline</option>
                <option value="1m">1 Month</option>
                <option value="3m">3 Months</option>
                <option value="6m">6 Months</option>
                <option value="1y">1 Year</option>
              </select>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
      if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      if (user) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Onboarding completed with responses:', responses);
      }
      navigate('/projects');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      navigate('/projects');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navigationItems = [
    { path: "/projects", label: "Projects", icon: "Grid3X3" },
    { path: "/dashboard", label: "Dashboard", icon: "BarChart3" },
    { path: "/data-upload", label: "Data Upload", icon: "Upload" },
    { path: "/process-analysis", label: "Analysis", icon: "Search" },
    { path: "/roi-calculator", label: "ROI Calculator", icon: "Calculator" },
    { path: "/scenario-library", label: "Scenarios", icon: "BookOpen" },
  ];

  // On mount, drop a system message if chat is empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ type: 'bot', text: `Describe your project in detail and I'll help you optimize it.` }]);
    }
  }, []);

  // Handle input submit
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!hasStarted) setHasStarted(true);
    const newMessages = [...messages, { type: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    try {
      const response = await api.post('/v1/chat/interactive', {
        messages: toApiMessages(newMessages)
      });
      const botReply =
        response?.structured_data?.final_recommendation ||
        'Sorry, I could not generate a recommendation.';
      setMessages(msgs => [...msgs, { type: 'bot', text: botReply }]);
    } catch (err) {
      setMessages(msgs => [
        ...msgs,
        { type: 'bot', text: 'There was an error contacting the optimizer backend.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cloud-white flex flex-col">
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
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Navigation Items */}
            <div className="mb-6">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 mb-1 ${
                    location.pathname === item.path
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              <div className="w-6 h-6 bg-gradient-to-r from-muted-indigo to-mist-teal rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm text-white/90">Sign Out</div>
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
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-soft-navy mb-2">{`Hi, ${user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'there'}`}</h1>
    
                </div>
                
          {/* Chat area (for loading indicator and messages) */}
          <div className="flex-1 flex flex-col items-center justify-end w-full max-w-2xl mx-auto pb-32">
            <div className="w-full px-4">
              {/* Render chat messages */}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                  <div className={`rounded-2xl px-4 py-2 shadow-sm ${msg.type === 'user' ? 'bg-muted-indigo text-white' : 'bg-white text-charcoal-black border border-sky-gray'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start mb-2">
                  <div className="bg-white border border-sky-gray px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-gray rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-gray rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-gray rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                    <span className="text-slate-gray text-xs">Generating...</span>
                </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Chat Input Bar at Bottom */}
      <form onSubmit={handleSend} className="fixed bottom-0 left-0 w-full flex justify-center z-50 bg-transparent">
        <div className="bg-white border border-sky-gray rounded-2xl shadow-lg flex items-center w-full max-w-2xl px-4 py-3 mb-6 mx-4">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-charcoal-black placeholder-slate-gray text-base px-2"
            placeholder="Ask anything"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="ml-2 p-2 rounded-full bg-muted-indigo hover:bg-muted-indigo/90 transition-colors disabled:opacity-50" disabled={isLoading || !input.trim()}>
            <Icon name="Send" size={20} className="text-white" />
          </button>
        </div>
      </form>

      {/* Click Outside Handler */}
      {(isUserMenuOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default OnboardingWizard;