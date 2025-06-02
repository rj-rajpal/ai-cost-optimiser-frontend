import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useDashboard } from '../../contexts/DashboardContext';
import Icon from '../../components/AppIcon';
import SideNavBar from '../../components/SideNavBar';
import { chatService, projectService } from '../../services';
import { 
  MESSAGES,
  HEADER,
  BUTTONS,
  UI,
  LAYOUT,
  TEXT,
  CHAT,
  FORMS,
  ARIA_LABELS,
  BUTTON_TEXT,
  API_ENDPOINTS 
} from '../../constants';
import { mockStructuredData } from '../../lib/testData';

// Helper function to convert frontend messages to API format
const toApiMessages = (messages) =>
  messages.map(msg => ({
    role: msg.type === 'user' ? 'user' : 'assistant',
    content: msg.text
  }));

// Helper function to format structured data for display
const formatStructuredResponse = (structuredData) => {
  if (!structuredData) return null;

  let formattedResponse = '';

  // Add final recommendation first if available
  if (structuredData.final_recommendation) {
    formattedResponse += `${structuredData.final_recommendation}\n\n`;
  }

  // Add cost analysis if available
  if (structuredData.cost_table && structuredData.cost_table.length > 0) {
    formattedResponse += '📊 **Cost Analysis:**\n';
    structuredData.cost_table.forEach(model => {
      formattedResponse += `• ${model.model_name}: ${chatService.formatCost(model.monthly_cost)}/month (${model.p90_latency_ms}ms latency)\n`;
    });
    formattedResponse += '\n';
  }

  // Add ROI analysis if available
  if (structuredData.roi_analysis) {
    const roi = structuredData.roi_analysis;
    formattedResponse += '💰 **ROI Analysis:**\n';
    if (roi.savings_per_month > 0) {
      formattedResponse += `• Monthly Savings: ${chatService.formatCost(roi.savings_per_month)}\n`;
      formattedResponse += `• ROI: ${roi.roi_percent.toFixed(1)}%\n`;
      formattedResponse += `• Payback Period: ${roi.payback_weeks} weeks\n`;
    } else {
      formattedResponse += `• Recommended Model: ${roi.best_model}\n`;
    }
    formattedResponse += '\n';
  }

  // Add workload parameters if available
  if (structuredData.workload_params) {
    const params = structuredData.workload_params;
    formattedResponse += '⚙️ **Workload Parameters:**\n';
    formattedResponse += `• Daily API Calls: ${params.calls_per_day?.toLocaleString() || 'N/A'}\n`;
    formattedResponse += `• Input Tokens: ${params.avg_input_tokens || 'N/A'}\n`;
    formattedResponse += `• Output Tokens: ${params.avg_output_tokens || 'N/A'}\n`;
    formattedResponse += `• Latency SLA: ${params.latency_sla_ms || 'N/A'}ms\n`;
    formattedResponse += `• Region: ${params.region || 'N/A'}\n`;
  }

  return formattedResponse.trim();
};

// Helper function to extract project name from chat
const extractProjectName = (chatHistory, structuredData) => {
  // Try to get task name from solution architect
  if (structuredData?.solution_architect?.opt_task) {
    return structuredData.solution_architect.opt_task;
  }
  
  // Fallback to extracting from the last user message
  const lastUserMessage = chatHistory
    .filter(msg => msg.type === 'user')
    .pop();
  
  if (lastUserMessage) {
    // Simple extraction logic - take first few words
    const words = lastUserMessage.text.split(' ').slice(0, 4);
    return words.join(' ').replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'AI Cost Optimization';
  }
  
  return 'AI Cost Optimization Project';
};

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { processStructuredData } = useDashboard();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [lastStructuredData, setLastStructuredData] = useState(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Memoize user greeting
  const userGreeting = useMemo(() => {
    const name = user?.user_metadata?.full_name || 
                 user?.user_metadata?.name || 
                 user?.email?.split('@')[0] || 
                 'there';
    return `Hi, ${name}`;
  }, [user]);

  // Memoize user avatar
  const userAvatar = useMemo(() => 
    user?.email?.charAt(0).toUpperCase() || 'U', 
    [user?.email]
  );

  // Initialize chat with system message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ type: 'bot', text: MESSAGES.CHAT_INITIAL }]);
    }
  }, [messages.length]);

  // Handlers
  const handleSignOut = useCallback(async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Sign out error:', error);
        // Still navigate to login even if there's an error to clear local state
      }
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
      // Navigate to login to clear local state
      navigate('/login');
    }
  }, [signOut, navigate]);

  const handleSignOutClick = useCallback(async (e) => {
    e.stopPropagation(); // Prevent menu from closing
    setIsUserMenuOpen(false); // Close menu manually
    await handleSignOut();
  }, [handleSignOut]);

  const handleSidebarProjectsClick = useCallback(() => {
    setIsSidebarOpen(false);
    navigate('/projects');
  }, [navigate]);

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const handleUserMenuToggle = useCallback(() => {
    setIsUserMenuOpen(prev => !prev);
  }, []);

  const handleUserMenuClose = useCallback(() => {
    setIsUserMenuOpen(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleSend = useCallback(async (e) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    if (!hasStarted) setHasStarted(true);

    const userMessage = { type: 'user', text: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Convert to API message format for chat service
      const messageHistory = toApiMessages(newMessages.slice(0, -1)); // Exclude the current message
      
      // Call the interactive chat API using our service
      const response = await chatService.sendInteractiveMessage(input, messageHistory);
      
      let botReply;
      let structuredData = null;

      // Check if we have structured data or simple answer
      if (response && response.structured_data) {
        // We have structured data - show dashboard generation message
        structuredData = response.structured_data;
        setLastStructuredData(structuredData);
        
        // Process structured data using dashboard context
        processStructuredData(structuredData);
        
        // Show the dashboard generation message immediately
        botReply = "Please wait while we generate the Dashboard for you";
        
        setMessages(prevMessages => [
          ...prevMessages, 
          { 
            type: 'bot', 
            text: botReply,
            structuredData: structuredData,
            isDashboardGenerating: true
          }
        ]);
        
        // Process and save as project after displaying the message
        setTimeout(() => {
          handleCreateProject(structuredData, newMessages);
        }, 2000);
        
      } else if (response && response.structured_data === null && response.simple_answer) {
        // Structured data is null but we have a simple answer - workflow not processable
        botReply = "Sorry, we are not able to process your workflow right now. Please try this in some time.";
        
        setMessages(prevMessages => [
          ...prevMessages, 
          { 
            type: 'bot', 
            text: botReply
          }
        ]);
      } else if (response && response.simple_answer) {
        // We have a simple answer - use it directly
        botReply = response.simple_answer;
        
        setMessages(prevMessages => [
          ...prevMessages, 
          { 
            type: 'bot', 
            text: botReply
          }
        ]);
      } else {
        // Fallback for unexpected response format
        botReply = response?.final_recommendation || MESSAGES.CHAT_NO_RECOMMENDATION;
        
        setMessages(prevMessages => [
          ...prevMessages, 
          { 
            type: 'bot', 
            text: botReply
          }
        ]);
      }
      
    } catch (error) {
      console.error('Chat API error:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { type: 'bot', text: MESSAGES.CHAT_ERROR }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, hasStarted, messages, processStructuredData]);

  // Handle project creation from structured data
  const handleCreateProject = useCallback(async (structuredData, chatHistory) => {
    if (isCreatingProject) return;
    
    setIsCreatingProject(true);
    
    try {
      // Extract project name from chat history and structured data
      const projectName = extractProjectName(chatHistory, structuredData);
      
      // Process structured data into project format
      const projectData = projectService.processStructuredDataToProject(
        structuredData, 
        projectName, 
        chatHistory
      );
      
      // Save the project
      const saveSuccess = projectService.saveProject(projectData);
      
      if (saveSuccess) {
        // Process structured data for dashboard context with project ID
        processStructuredData(structuredData, projectData.id);
        
        // Show success message
        setMessages(prevMessages => [
          ...prevMessages,
          { 
            type: 'bot', 
            text: `🎉 **Dashboard Generated Successfully!**\n\nYour AI cost optimization analysis is ready! Project "${projectData.title}" has been created. Redirecting you to the dashboard in 2 seconds...`,
            isSystemMessage: true
          }
        ]);
        
        // Navigate to the specific project dashboard after delay
        setTimeout(() => {
          navigate(`/project/${projectData.id}/ai-workflow`);
        }, 2000);
      } else {
        throw new Error('Failed to save project');
      }
      
    } catch (error) {
      console.error('Error generating dashboard:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          type: 'bot', 
          text: '❌ **Error Generating Dashboard**\n\nThere was an issue processing your optimization data. Please try again.',
          isSystemMessage: true
        }
      ]);
    } finally {
      setIsCreatingProject(false);
    }
  }, [isCreatingProject, navigate, processStructuredData]);

  // Development test function
  const handleTestStructuredData = useCallback(() => {
    const structuredData = mockStructuredData.structured_data;
    
    // Create test chat history
    const testChatHistory = [
      { type: 'user', text: '[TEST] Generate dashboard with sample data' }
    ];
    
    // Extract project name
    const projectName = extractProjectName(testChatHistory, structuredData);
    
    // Process structured data into project format
    const projectData = projectService.processStructuredDataToProject(
      structuredData, 
      projectName, 
      testChatHistory
    );
    
    // Save the project
    const saveSuccess = projectService.saveProject(projectData);
    
    if (saveSuccess) {
      // Process structured data using dashboard context with project ID
      processStructuredData(structuredData, projectData.id);
      
      // Show the dashboard generation message
      const botReply = "Please wait while we generate the Dashboard for you";
      
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          type: 'user', 
          text: '[TEST] Generate dashboard with sample data'
        },
        { 
          type: 'bot', 
          text: botReply,
          structuredData: structuredData,
          isDashboardGenerating: true
        }
      ]);
      
      // Navigate to project dashboard after delay
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { 
            type: 'bot', 
            text: `🎉 **Dashboard Generated Successfully!**\n\nYour AI cost optimization analysis is ready! Project "${projectData.title}" has been created. Redirecting you to the dashboard in 2 seconds...`,
            isSystemMessage: true
          }
        ]);
        
        setTimeout(() => {
          navigate(`/project/${projectData.id}/dashboard`);
        }, 2000);
      }, 2000);
    } else {
      console.error('Failed to save test project');
    }
  }, [processStructuredData, navigate]);

  // Test function for successful structured data response
  const handleTestSuccessFlow = useCallback(() => {
    const testMessage = "We process 500 support emails daily, need AI to tag priority and draft replies";
    
    setMessages(prevMessages => [
      ...prevMessages,
      { type: 'user', text: testMessage }
    ]);
    
    setIsLoading(true);
    
    // Simulate API response with structured data after 1 second
    setTimeout(() => {
      const structuredData = mockStructuredData.structured_data;
      
      // Create a temporary project to get ID for testing
      const testChatHistory = [{ type: 'user', text: testMessage }];
      const projectName = extractProjectName(testChatHistory, structuredData);
      const projectData = projectService.processStructuredDataToProject(
        structuredData, 
        projectName, 
        testChatHistory
      );
      
      // Process structured data using dashboard context with project ID
      processStructuredData(structuredData, projectData.id);
      
      // Show the dashboard generation message
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          type: 'bot', 
          text: "Please wait while we generate the Dashboard for you",
          structuredData: structuredData,
          isDashboardGenerating: true
        }
      ]);
      
      setIsLoading(false);
      
      // Process and save as project after delay
      setTimeout(() => {
        handleCreateProject(structuredData, [
          ...messages,
          { type: 'user', text: testMessage }
        ]);
      }, 2000);
    }, 1000);
  }, [processStructuredData, messages]);

  // Test function for null structured data response
  const handleTestErrorFlow = useCallback(() => {
    const testMessage = "We process 500 support emails daily, need AI to tag priority and draft replies";
    
    setMessages(prevMessages => [
      ...prevMessages,
      { type: 'user', text: testMessage }
    ]);
    
    setIsLoading(true);
    
    // Simulate API response with null structured data after 1 second
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          type: 'bot', 
          text: "Sorry, we are not able to process your workflow right now. Please try this in some time."
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, []);

  // Message components with dark mode support
  const MessageBubble = useCallback(({ message, index }) => (
    <div key={index} className={message.type === 'user' ? CHAT.USER_MESSAGE : CHAT.BOT_MESSAGE}>
      <div className={`${message.type === 'user' ? CHAT.USER_BUBBLE : CHAT.BOT_BUBBLE} ${
        isDarkMode 
          ? message.type === 'user' 
            ? 'bg-muted-indigo text-black' 
            : 'bg-gray-900 border-gray-700 text-white'
          : ''
      }`}>
        <ReactMarkdown 
          components={{
            // Custom styling for markdown elements with dark mode support
            p: ({ children }) => <p className={`mb-2 last:mb-0 ${isDarkMode && message.type === 'bot' ? 'text-black' : ''}`}>{children}</p>,
            strong: ({ children }) => <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>{children}</strong>,
            em: ({ children }) => <em className={`italic ${isDarkMode && message.type === 'bot' ? 'text-white' : ''}`}>{children}</em>,
            ul: ({ children }) => <ul className={`list-disc list-inside mb-2 space-y-1 ${isDarkMode && message.type === 'bot' ? 'text-white' : ''}`}>{children}</ul>,
            ol: ({ children }) => <ol className={`list-decimal list-inside mb-2 space-y-1 ${isDarkMode && message.type === 'bot' ? 'text-white' : ''}`}>{children}</ol>,
            li: ({ children }) => <li className={`text-sm ${isDarkMode && message.type === 'bot' ? 'text-white' : ''}`}>{children}</li>,
            h1: ({ children }) => <h1 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>{children}</h1>,
            h2: ({ children }) => <h2 className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>{children}</h2>,
            h3: ({ children }) => <h3 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>{children}</h3>,
            code: ({ inline, children }) => 
              inline ? (
                <code className={`px-1 py-0.5 rounded text-xs font-mono ${
                  isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-fog-gray'
                }`}>{children}</code>
              ) : (
                <pre className={`p-2 rounded text-xs font-mono overflow-x-auto mb-2 ${
                  isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-fog-gray'
                }`}>
                  <code>{children}</code>
                </pre>
              ),
            blockquote: ({ children }) => (
              <blockquote className={`border-l-2 border-muted-indigo pl-3 italic mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-slate-gray'
              }`}>
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-indigo hover:text-muted-indigo/80 underline"
              >
                {children}
              </a>
            )
          }}
        >
          {message.text}
        </ReactMarkdown>
      </div>
    </div>
  ), [isDarkMode]);

  const LoadingIndicator = useCallback(() => (
    <div className={CHAT.BOT_MESSAGE}>
      <div className={`${CHAT.LOADING_MESSAGE} ${
        isDarkMode ? 'bg-gray-900 border-gray-700' : ''
      }`}>
        <div className={CHAT.LOADING_DOTS}>
          <div className={CHAT.LOADING_DOT}></div>
          <div className={`${CHAT.LOADING_DOT}`} style={{ animationDelay: '0.1s' }}></div>
          <div className={`${CHAT.LOADING_DOT}`} style={{ animationDelay: '0.2s' }}></div>
        </div>
        <span className={`${CHAT.LOADING_TEXT} ${isDarkMode ? 'text-gray-300' : ''}`}>{MESSAGES.CHAT_LOADING}</span>
      </div>
    </div>
  ), [isDarkMode]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? 'bg-black' : 'bg-cloud-white'
    }`}>
      {/* SideNavBar Component */}
      <SideNavBar 
        isOpen={isSidebarOpen} 
        onClose={handleSidebarClose}
        showProjectsNav={true}
        onProjectsClick={handleSidebarProjectsClick}
      />
            
      {/* Header */}
      <header className={`backdrop-blur-sm border-b sticky top-0 z-30 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-black/90 border-gray-800 shadow-2xl' 
          : 'bg-white/90 border-sky-gray shadow-mist'
      }`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSidebarToggle}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  isDarkMode 
                    ? 'text-white hover:bg-gray-900' 
                    : 'text-soft-navy hover:bg-fog-gray'
                }`}
                aria-label={ARIA_LABELS.OPEN_SIDEBAR}
              >
                <Icon name="Menu" size={24} />
              </button>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-muted-indigo rounded-lg flex items-center justify-center border ${
                  isDarkMode ? 'border-gray-700' : 'border-sky-gray'
                }`}>
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>AI Cost Optimizer</h1>
              </div>
            </div>

            {/* Right Side - Dark Mode Toggle + User Menu */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 transition-colors duration-200 rounded-lg ${
                  isDarkMode 
                    ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-900' 
                    : 'text-slate-gray hover:text-charcoal-black hover:bg-fog-gray'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <Icon name={isDarkMode ? 'Sun' : 'Moon'} size={20} />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={handleUserMenuToggle}
                  className={`flex items-center space-x-3 p-2 rounded-md transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-white hover:bg-gray-900' 
                      : 'text-soft-navy hover:bg-fog-gray'
                  }`}
                  aria-label={ARIA_LABELS.USER_MENU}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-muted-indigo to-mist-teal flex items-center justify-center">
                    <span className="text-white font-medium text-sm">{userAvatar}</span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{userGreeting}</span>
                  <Icon name="ChevronDown" size={16} />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={handleUserMenuClose}></div>
                    <div className={`absolute right-0 mt-2 w-48 border rounded-lg shadow-lg py-2 z-20 transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-black border-gray-800' 
                        : 'bg-white border-sky-gray'
                    }`}>
                      <button
                        onClick={handleSignOutClick}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                          isDarkMode 
                            ? 'text-white hover:bg-gray-900' 
                            : 'text-soft-navy hover:bg-fog-gray'
                        }`}
                      >
                        {BUTTON_TEXT.SIGN_OUT}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Flex container to fill remaining space */}
      <main className="flex-1 flex flex-col">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className={`${TEXT.TITLE_LARGE} ${isDarkMode ? 'text-white' : ''}`}>{userGreeting}</h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>Let's optimize your AI costs. Tell me about your current processes and challenges.</p>
            </div>
          </div>
        </div>
                
        {/* Chat area - grows to fill available space */}
        <div className="flex-1 flex flex-col items-center justify-end px-4 pb-32">
          <div className="w-full max-w-2xl mx-auto">
            <div className="w-full">
              {/* Render chat messages */}
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} index={index} />
              ))}
              
              {/* Loading indicator */}
              {isLoading && <LoadingIndicator />}
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Chat Input Bar at Bottom */}
      <div className={`fixed bottom-0 left-0 right-0 pt-4 pb-6 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-t from-black via-black to-transparent' 
          : 'bg-gradient-to-t from-cloud-white via-cloud-white to-transparent'
      }`}>
        <form onSubmit={handleSend} className="flex justify-center px-4">
          <div className={`border rounded-2xl shadow-lg flex items-center w-full max-w-2xl px-4 py-3 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-black border-gray-800' 
              : 'bg-white border-sky-gray'
          }`}>
            <input
              type="text"
              className={`flex-1 bg-transparent outline-none text-base px-2 transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-white placeholder-gray-500' 
                  : 'text-charcoal-black placeholder-slate-gray'
              }`}
              placeholder="Ask anything about optimizing your AI costs..."
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="ml-2 p-2 rounded-full bg-muted-indigo hover:bg-muted-indigo/90 transition-colors disabled:opacity-50"
              disabled={isLoading || !input.trim()}
              aria-label={ARIA_LABELS.SEND_MESSAGE}
            >
              <Icon name="Send" size={20} className="text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingWizard;