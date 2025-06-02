import React, { useState, useRef, useEffect } from 'react';
import { openaiService } from '../services';
import { useDarkMode } from '../contexts/DarkModeContext';
import Icon from './AppIcon';

/**
 * OpenAI Chat Example Component
 * Demonstrates how to use the OpenAI service for chat interactions
 */
const OpenAIChatExample = () => {
  const { isDarkMode } = useDarkMode();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [costEstimate, setCostEstimate] = useState(null);
  const messagesEndRef = useRef(null);

  // Available models for selection
  const availableModels = [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', cost: 'Low' },
    { id: 'gpt-4', name: 'GPT-4', cost: 'High' },
    { id: 'gpt-4o', name: 'GPT-4o', cost: 'Medium' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', cost: 'Very Low' }
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update cost estimate when input or model changes
  useEffect(() => {
    if (input.trim()) {
      const testMessages = [...messages, { role: 'user', content: input }];
      const estimate = openaiService.estimateCost(testMessages, selectedModel);
      setCostEstimate(estimate);
    } else {
      setCostEstimate(null);
    }
  }, [input, selectedModel, messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || streaming) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const result = await openaiService.continueConversation(
        messages,
        input,
        { model: selectedModel }
      );

      setMessages(result.updatedHistory);
      
      // Show usage information
      if (result.usage) {
        console.log('Token usage:', result.usage);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message}`,
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleStreamSend = async () => {
    if (!input.trim() || loading || streaming) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setStreaming(true);

    // Add placeholder for assistant message
    const assistantMessageIndex = newMessages.length;
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }]);

    try {
      await openaiService.streamChatCompletion(
        newMessages,
        (chunk) => {
          setMessages(prev => {
            const updated = [...prev];
            updated[assistantMessageIndex] = {
              role: 'assistant',
              content: updated[assistantMessageIndex].content + chunk,
              streaming: true
            };
            return updated;
          });
        },
        { model: selectedModel }
      );

      // Mark streaming as complete
      setMessages(prev => {
        const updated = [...prev];
        updated[assistantMessageIndex] = {
          ...updated[assistantMessageIndex],
          streaming: false
        };
        return updated;
      });
    } catch (error) {
      console.error('Streaming error:', error);
      setMessages(prev => {
        const updated = [...prev];
        updated[assistantMessageIndex] = {
          role: 'assistant',
          content: `Error: ${error.message}`,
          isError: true,
          streaming: false
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setCostEstimate(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">OpenAI Chat Example</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Demonstration of the OpenAI service integration with chat functionality
        </p>
      </div>

      {/* Model Selection and Controls */}
      <div className="mb-4 p-4 border rounded-lg dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Model:</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            >
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.cost} cost)
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={clearChat}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Clear Chat
          </button>
        </div>

        {/* Cost Estimate */}
        {costEstimate && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Estimated cost: ${costEstimate.estimatedInputCost.toFixed(6)} 
            ({costEstimate.inputTokens} tokens)
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="border rounded-lg h-96 overflow-y-auto mb-4 p-4 dark:border-gray-700">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
            <Icon name="MessageCircle" className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Start a conversation with OpenAI</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.isError
                    ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {message.content}
                  {message.streaming && (
                    <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1">|</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="flex-1 px-4 py-2 border rounded-lg resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          rows="2"
          disabled={loading || streaming}
        />
        
        <div className="flex flex-col gap-2">
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading || streaming}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Icon name="Loader2" className="w-5 h-5 animate-spin" />
            ) : (
              <Icon name="Send" className="w-5 h-5" />
            )}
          </button>
          
          <button
            onClick={handleStreamSend}
            disabled={!input.trim() || loading || streaming}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Stream response"
          >
            {streaming ? (
              <Icon name="Loader2" className="w-5 h-5 animate-spin" />
            ) : (
              <Icon name="Zap" className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>
          <strong>Instructions:</strong> Type a message and click Send for normal chat, 
          or click the lightning bolt for streaming responses. 
          Switch models to see different pricing and capabilities.
        </p>
      </div>
    </div>
  );
};

export default OpenAIChatExample; 