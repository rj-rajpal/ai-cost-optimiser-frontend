import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useDashboard } from '../../contexts/DashboardContext';
import Icon from '../../components/AppIcon';
import SideNavBar from '../../components/SideNavBar';
import { chatService, projectService, openaiService } from '../../services';
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
import { SplashCursor } from '../../components/ui/splash-cursor';

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

// Helper function to extract project name from chat using OpenAI
const extractProjectName = async (chatHistory, structuredData) => {
  try {
    // Get context from structured data and chat history
    const taskDescription = structuredData?.solution_architect?.opt_task || '';
    const lastUserMessage = chatHistory
      .filter(msg => msg.type === 'user')
      .pop()?.text || '';
    
    // Create context for OpenAI
    const context = `
    Task: ${taskDescription}
    User Query: ${lastUserMessage}
    Workload: ${structuredData?.workload_params ? 
      `${structuredData.workload_params.calls_per_day} calls/day, ${structuredData.workload_params.region} region` : 
      'Not specified'}
    `;

    const systemPrompt = `You are an expert at creating concise, professional project names for AI cost optimization projects. 
    Based on the provided context, generate a project name that is EXACTLY 3 words, descriptive, and professional.
    
    Rules:
    - Must be exactly 3 words
    - Use title case (e.g., "Email Processing Optimizer")
    - Be descriptive of the AI optimization task
    - Avoid generic words like "Project", "System", "Application"
    - Focus on the business function and optimization aspect
    
    Return ONLY the 3-word project name, nothing else.`;

    const userMessage = `Generate a 3-word project name for this AI cost optimization context: ${context}`;

    const projectName = await openaiService.sendWithSystemPrompt(
      systemPrompt,
      userMessage,
      { 
        model: 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 10
      }
    );

    // Clean and validate the response
    const cleanedName = projectName.trim().replace(/['"]/g, '');
    const words = cleanedName.split(' ').filter(word => word.length > 0);
    
    // If we got exactly 3 words, use it; otherwise use fallback
    if (words.length === 3) {
      return words.join(' ');
    }
    
    // Fallback logic if OpenAI doesn't return exactly 3 words
    console.warn('OpenAI did not return exactly 3 words, using fallback');
    return generateFallbackProjectName(chatHistory, structuredData);
    
  } catch (error) {
    console.error('Error generating project name with OpenAI:', error);
    return generateFallbackProjectName(chatHistory, structuredData);
  }
};

// Helper function to generate project description using OpenAI
const generateProjectDescription = async (projectName, chatHistory, structuredData) => {
  try {
    // Get context from structured data and chat history
    const taskDescription = structuredData?.solution_architect?.opt_task || '';
    const lastUserMessage = chatHistory
      .filter(msg => msg.type === 'user')
      .pop()?.text || '';
    
    const workloadInfo = structuredData?.workload_params ? 
      `${structuredData.workload_params.calls_per_day} API calls per day in ${structuredData.workload_params.region}` : 
      'Workload parameters not specified';
    
    const roiInfo = structuredData?.roi_analysis?.savings_per_month ? 
      `Potential monthly savings: $${structuredData.roi_analysis.savings_per_month}` :
      'ROI analysis available';

    const systemPrompt = `You are an expert at creating concise, professional project descriptions for AI cost optimization projects.
    Based on the provided context, generate a short description that is 1-2 sentences long, professional, and clearly explains what this optimization project accomplishes.
    
    Rules:
    - Keep it to 1-2 sentences maximum
    - Be specific about the business function being optimized
    - Mention the optimization benefit (cost reduction, efficiency, etc.)
    - Use professional business language
    - Don't include technical jargon
    
    Return ONLY the description, nothing else.`;

    const userMessage = `Generate a short description for the project "${projectName}" based on this context:
    
    Project Name: ${projectName}
    Task: ${taskDescription}
    User Query: ${lastUserMessage}
    Workload: ${workloadInfo}
    Expected Benefit: ${roiInfo}`;

    const description = await openaiService.sendWithSystemPrompt(
      systemPrompt,
      userMessage,
      { 
        model: 'gpt-3.5-turbo',
        temperature: 0.4,
        max_tokens: 100
      }
    );

    return description.trim();
    
  } catch (error) {
    console.error('Error generating project description with OpenAI:', error);
    return generateFallbackDescription(projectName, structuredData);
  }
};

// Helper function to generate project summary using OpenAI
const generateProjectSummary = async (projectName, projectDescription, chatHistory, structuredData) => {
  try {
    // Get comprehensive context from structured data and chat history
    const taskDescription = structuredData?.solution_architect?.opt_task || '';
    const lastUserMessage = chatHistory
      .filter(msg => msg.type === 'user')
      .pop()?.text || '';
    
    const workloadInfo = structuredData?.workload_params ? 
      `${structuredData.workload_params.calls_per_day} API calls per day, ${structuredData.workload_params.avg_input_tokens} avg input tokens, ${structuredData.workload_params.avg_output_tokens} avg output tokens, ${structuredData.workload_params.latency_sla_ms}ms latency SLA in ${structuredData.workload_params.region}` : 
      'Workload parameters not specified';
    
    const costAnalysis = structuredData?.cost_table?.slice(0, 3).map(model => 
      `${model.model_name}: $${model.monthly_cost}/month (${model.p90_latency_ms}ms latency)`
    ).join(', ') || 'Cost analysis not available';
    
    const roiInfo = structuredData?.roi_analysis ? 
      `Current model: ${structuredData.roi_analysis.current_model || 'Not specified'}, Recommended: ${structuredData.roi_analysis.best_model || 'TBD'}, Monthly savings: $${structuredData.roi_analysis.savings_per_month || 0}, ROI: ${structuredData.roi_analysis.roi_percent || 0}%` :
      'ROI analysis not available';

    const finalRecommendation = structuredData?.final_recommendation || 'No specific recommendation provided';

    const systemPrompt = `You are an expert at creating comprehensive project summaries for AI cost optimization initiatives.
    Based on the provided context, generate a detailed summary that is 3-4 sentences long, professional, and covers the key aspects of the optimization project.
    
    Rules:
    - Keep it to 3-4 sentences maximum
    - Include the business context and current challenge
    - Mention the recommended solution and expected benefits
    - Include specific metrics when available (costs, savings, performance)
    - Use professional business language
    - Be specific and actionable
    
    Return ONLY the summary, nothing else.`;

    const userMessage = `Generate a comprehensive summary for the AI cost optimization project with the following details:
    
    Project Name: ${projectName}
    Project Description: ${projectDescription}
    
    Context:
    - Task: ${taskDescription}
    - User Challenge: ${lastUserMessage}
    - Workload Details: ${workloadInfo}
    - Cost Analysis: ${costAnalysis}
    - ROI Analysis: ${roiInfo}
    - Final Recommendation: ${finalRecommendation}`;

    const summary = await openaiService.sendWithSystemPrompt(
      systemPrompt,
      userMessage,
      { 
        model: 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 200
      }
    );

    return summary.trim();
    
  } catch (error) {
    console.error('Error generating project summary with OpenAI:', error);
    return generateFallbackSummary(projectName, projectDescription, structuredData);
  }
};

// Fallback function for project name generation
const generateFallbackProjectName = (chatHistory, structuredData) => {
  // Try to get task name from solution architect
  if (structuredData?.solution_architect?.opt_task) {
    const words = structuredData.solution_architect.opt_task
      .split(' ')
      .slice(0, 3)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    
    if (words.length >= 3) {
      return words.slice(0, 3).join(' ');
    }
  }
  
  // Fallback to extracting from the last user message
  const lastUserMessage = chatHistory
    .filter(msg => msg.type === 'user')
    .pop();
  
  if (lastUserMessage) {
    // Simple extraction logic - take first three meaningful words
    const words = lastUserMessage.text
      .split(' ')
      .filter(word => word.length > 2) // Filter out small words
      .slice(0, 3)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
    
    if (words.length >= 3) {
      return words.slice(0, 3).join(' ');
    }
  }
  
  return 'AI Cost Optimizer';
};

// Fallback function for project description
const generateFallbackDescription = (projectName, structuredData) => {
  const taskDescription = structuredData?.solution_architect?.opt_task || 'AI cost optimization';
  const savings = structuredData?.roi_analysis?.savings_per_month;
  
  if (savings && savings > 0) {
    return `${taskDescription} project focused on reducing AI infrastructure costs with potential monthly savings of $${savings}.`;
  }
  
  return `${taskDescription} project designed to optimize AI infrastructure costs and improve operational efficiency.`;
};

// Fallback function for project summary
const generateFallbackSummary = (projectName, projectDescription, structuredData) => {
  const taskDescription = structuredData?.solution_architect?.opt_task || 'AI cost optimization';
  const currentModel = structuredData?.roi_analysis?.current_model || 'existing AI models';
  const recommendedModel = structuredData?.roi_analysis?.best_model || 'optimized AI models';
  const savings = structuredData?.roi_analysis?.savings_per_month || 0;
  const workload = structuredData?.workload_params?.calls_per_day || 'various';

  if (savings > 0) {
    return `${projectName} addresses ${taskDescription} challenges by migrating from ${currentModel} to ${recommendedModel}. The project handles ${workload} daily API calls and is projected to achieve $${savings} in monthly cost savings. This optimization initiative will improve operational efficiency while maintaining service quality and performance standards.`;
  }
  
  return `${projectName} focuses on ${taskDescription} by implementing optimized AI models and infrastructure. The project aims to improve cost efficiency for ${workload} daily operations while maintaining performance standards. This initiative will establish a foundation for scalable and cost-effective AI operations.`;
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
        botReply = response.simple_answer;
        
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
      const projectName = await extractProjectName(chatHistory, structuredData);
      
      // Generate project description
      const projectDescription = await generateProjectDescription(projectName, chatHistory, structuredData);
      
      // Generate project summary
      const projectSummary = await generateProjectSummary(projectName, projectDescription, chatHistory, structuredData);
      
      // Process structured data into project format
      const projectData = projectService.processStructuredDataToProject(
        structuredData, 
        projectName, 
        chatHistory,
        projectDescription,
        projectSummary
      );
      
      // Save the project
      const saveSuccess = projectService.saveProject(projectData);
      
      if (saveSuccess) {
        // Process structured data for dashboard context with project ID
        processStructuredData(structuredData, projectData.id);
        
        // Show success message with project name and description
        setMessages(prevMessages => [
          ...prevMessages,
          { 
            type: 'bot', 
            text: `🎉 **Dashboard Generated Successfully!**\n\n**Project:** ${projectData.title}\n**Description:** ${projectData.description}\n**Summary:** ${projectData.summary}\n\nYour AI cost optimization analysis is ready! Redirecting you to the dashboard in 2 seconds...`,
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
  const handleTestStructuredData = useCallback(async () => {
    const structuredData = mockStructuredData.structured_data;
    
    // Create test chat history
    const testChatHistory = [
      { type: 'user', text: '[TEST] Generate dashboard with sample data' }
    ];
    
    try {
      // Extract project name
      const projectName = await extractProjectName(testChatHistory, structuredData);
      
      // Generate project description
      const projectDescription = await generateProjectDescription(projectName, testChatHistory, structuredData);
      
      // Generate project summary
      const projectSummary = await generateProjectSummary(projectName, projectDescription, testChatHistory, structuredData);
      
      // Process structured data into project format
      const projectData = projectService.processStructuredDataToProject(
        structuredData, 
        projectName, 
        testChatHistory,
        projectDescription,
        projectSummary
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
              text: `🎉 **Dashboard Generated Successfully!**\n\n**Project:** ${projectData.title}\n**Description:** ${projectData.description}\n**Summary:** ${projectData.summary}\n\nYour AI cost optimization analysis is ready! Redirecting you to the dashboard in 2 seconds...`,
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
    } catch (error) {
      console.error('Error in test function:', error);
    }
  }, [processStructuredData, navigate]);

  // Test function for successful structured data response
  const handleTestSuccessFlow = useCallback(async () => {
    const testMessage = "We process 500 support emails daily, need AI to tag priority and draft replies";
    
    setMessages(prevMessages => [
      ...prevMessages,
      { type: 'user', text: testMessage }
    ]);
    
    setIsLoading(true);
    
    // Simulate API response with structured data after 1 second
    setTimeout(async () => {
      const structuredData = mockStructuredData.structured_data;
      
      try {
        // Create a temporary project to get ID for testing
        const testChatHistory = [{ type: 'user', text: testMessage }];
        const projectName = await extractProjectName(testChatHistory, structuredData);
        const projectDescription = await generateProjectDescription(projectName, testChatHistory, structuredData);
        const projectSummary = await generateProjectSummary(projectName, projectDescription, testChatHistory, structuredData);
        const projectData = projectService.processStructuredDataToProject(
          structuredData, 
          projectName, 
          testChatHistory,
          projectDescription,
          projectSummary
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
      } catch (error) {
        console.error('Error in test success flow:', error);
        setIsLoading(false);
      }
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
            ? 'bg-muted-indigo text-white' 
            : 'bg-gray-900 border-gray-700'
          : ''
      }`}>
        <ReactMarkdown 
          components={{
            // Custom styling for markdown elements with dark mode support
            p: ({ children }) => (
              <p className={`mb-3 leading-relaxed ${
                isDarkMode 
                  ? 'text-gray-100' 
                  : message.type === 'bot' 
                    ? 'text-gray-700' 
                    : 'text-gray-800'
              }`}>
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong className={`font-semibold ${
                isDarkMode 
                  ? 'text-white' 
                  : 'text-soft-navy'
              }`}>
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className={`italic ${
                isDarkMode 
                  ? 'text-gray-200' 
                  : 'text-gray-600'
              }`}>
                {children}
              </em>
            ),
            ul: ({ children }) => (
              <ul className={`list-disc list-inside mb-4 space-y-2 ml-4 ${
                isDarkMode 
                  ? 'text-gray-100' 
                  : 'text-gray-700'
              }`}>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className={`list-decimal list-inside mb-4 space-y-2 ml-4 ${
                isDarkMode 
                  ? 'text-gray-100' 
                  : 'text-gray-700'
              }`}>
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className={`leading-relaxed ${
                isDarkMode 
                  ? 'text-gray-100' 
                  : 'text-gray-700'
              }`}>
                {children}
              </li>
            ),
            h1: ({ children }) => (
              <h1 className={`text-xl font-bold mb-4 mt-6 ${
                isDarkMode 
                  ? 'text-white' 
                  : 'text-soft-navy'
              }`}>
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className={`text-lg font-semibold mb-3 mt-5 ${
                isDarkMode 
                  ? 'text-white' 
                  : 'text-soft-navy'
              }`}>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className={`text-base font-semibold mb-2 mt-4 ${
                isDarkMode 
                  ? 'text-white' 
                  : 'text-soft-navy'
              }`}>
                {children}
              </h3>
            ),
            code: ({ inline, children }) => 
              inline ? (
                <code className={`px-2 py-1 rounded text-sm font-mono ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-200' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {children}
                </code>
              ) : (
                <pre className={`p-3 rounded-lg text-sm font-mono overflow-x-auto mb-4 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-200' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <code>{children}</code>
                </pre>
              ),
            blockquote: ({ children }) => (
              <blockquote className={`border-l-4 border-muted-indigo pl-4 italic mb-4 ${
                isDarkMode 
                  ? 'text-gray-300' 
                  : 'text-slate-gray'
              }`}>
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`underline font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-muted-indigo hover:text-muted-indigo/80'
                }`}
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
      {/* Splash Cursor Background */}
      <div className="fixed inset-0 z-0">
        <SplashCursor />
      </div>
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